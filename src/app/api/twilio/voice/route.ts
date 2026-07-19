import crypto from "node:crypto";
import { after } from "next/server";
import { company } from "@/config/company";
import { handleMissedCall } from "@/lib/missed-call";

/**
 * Twilio incoming-call webhook.
 *
 * Twilio POSTs here when the demo number rings. We answer with TwiML that tries
 * the owner's phone; if nobody picks up, `DialCallStatus` comes back as
 * something other than "completed" and we treat it as a missed call.
 *
 * Unused while SMS is mocked, but written for real: switching to live Twilio is
 * a credentials change, and this route is ready for it.
 */

/**
 * Validates Twilio's request signature.
 *
 * Without this the endpoint is an open door: anyone who learns the URL could
 * POST fake calls, filling the lead table and triggering real texts to numbers
 * of their choosing — on the owner's bill.
 *
 * The scheme: HMAC-SHA1 over the full URL plus every POST param sorted by key
 * and concatenated, keyed with the auth token.
 */
function isValidTwilioSignature(
  signature: string | null,
  url: string,
  params: Record<string, string>,
  authToken: string,
): boolean {
  if (!signature) return false;

  const payload =
    url +
    Object.keys(params)
      .sort()
      .map((key) => key + params[key])
      .join("");

  const expected = crypto
    .createHmac("sha1", authToken)
    .update(Buffer.from(payload, "utf-8"))
    .digest("base64");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  // Length check first: timingSafeEqual throws on a length mismatch.
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function twiml(xml: string) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${xml}</Response>`, {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(request: Request) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const ownerPhone = process.env.OWNER_PHONE_NUMBER;

  if (!authToken) {
    console.error("[twilio] webhook hit but TWILIO_AUTH_TOKEN is not set.");
    return twiml("<Reject/>");
  }

  const form = await request.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of form.entries()) params[key] = String(value);

  // Trust the forwarded host: behind Vercel's proxy request.url is the internal
  // address, and the signature was computed over the public URL Twilio called.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const url = forwardedHost
    ? `https://${forwardedHost}${new URL(request.url).pathname}`
    : request.url;

  if (
    !isValidTwilioSignature(
      request.headers.get("x-twilio-signature"),
      url,
      params,
      authToken,
    )
  ) {
    console.warn("[twilio] rejected a request with an invalid signature.");
    return new Response("Forbidden", { status: 403 });
  }

  const caller = params.From;
  const dialStatus = params.DialCallStatus;

  // Second leg: Twilio reporting how the forwarded call ended.
  if (dialStatus) {
    if (dialStatus !== "completed" && caller) {
      after(async () => {
        await handleMissedCall(caller);
      });
      return twiml(
        `<Say voice="alice">Sorry we missed you. We're sending you a text message right now.</Say>`,
      );
    }
    return twiml("<Hangup/>");
  }

  // First leg: try the owner. `action` brings Twilio back here with a
  // DialCallStatus once the attempt finishes.
  if (ownerPhone) {
    return twiml(
      `<Dial timeout="15" action="/api/twilio/voice" method="POST">${ownerPhone}</Dial>`,
    );
  }

  // No owner number configured — treat every call as missed rather than
  // dropping it silently.
  if (caller) {
    after(async () => {
      await handleMissedCall(caller);
    });
  }
  return twiml(
    `<Say voice="alice">Thanks for calling ${company.name}. We're sending you a text message right now.</Say>`,
  );
}
