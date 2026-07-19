import "server-only";
import { toE164 } from "@/lib/leads";
import { logMessage, type MessageKind } from "@/lib/messages";

/**
 * One SMS interface, two drivers.
 *
 *   - twilio : real sends, used when the Twilio env vars are present
 *   - mock   : logs the message and reports 'simulated'
 *
 * The driver is chosen by configuration alone, so going live is a credentials
 * change and not a code change. Both drivers write identical rows to the
 * `messages` table, which is what lets the dashboard render a simulated send
 * exactly like a real one.
 *
 * Why mock is the default: Twilio trial accounts cannot send custom message
 * bodies and cannot register for A2P 10DLC, so there is no free path to live
 * SMS. Paying ~$15/month to demo a product nobody has bought yet is the wrong
 * trade. See SETUP-TWILIO.md.
 *
 * Note this is deliberately NOT built on the `twilio` npm package — the REST
 * call is one fetch, and signature validation is one HMAC. Keeping the
 * dependency out means a project that mocks SMS by default doesn't carry an
 * SDK it never loads.
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID || undefined;
const authToken = process.env.TWILIO_AUTH_TOKEN || undefined;
const fromNumber = process.env.TWILIO_PHONE_NUMBER || undefined;

export const ownerPhone = process.env.OWNER_PHONE_NUMBER || undefined;

export function isTwilioConfigured(): boolean {
  return Boolean(accountSid && authToken && fromNumber);
}

/** Which driver is live — surfaced in the dashboard so the demo stays honest. */
export function smsMode(): "live" | "simulated" {
  return isTwilioConfigured() ? "live" : "simulated";
}

export type SendSmsArgs = {
  to: string;
  body: string;
  leadId: string | null;
  kind: MessageKind;
};

export type SendSmsResult = {
  status: "sent" | "simulated" | "failed";
  error?: string;
};

export async function sendSms({
  to,
  body,
  leadId,
  kind,
}: SendSmsArgs): Promise<SendSmsResult> {
  const recipient = toE164(to) ?? to;

  if (!isTwilioConfigured()) {
    console.log(`[sms:simulated] -> ${recipient}: ${body}`);
    await logMessage({
      leadId,
      channel: "sms",
      kind,
      recipient,
      body,
      status: "simulated",
    });
    return { status: "simulated" };
  }

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: recipient, From: fromNumber!, Body: body }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      // Twilio 21608 = trial account, unverified recipient. Common enough
      // during setup that it gets its own message instead of a raw dump.
      const reason = detail.includes("21608")
        ? "Twilio trial: recipient number is not verified"
        : `Twilio ${res.status}: ${detail.slice(0, 200)}`;

      console.error(`[sms:failed] -> ${recipient}: ${reason}`);
      await logMessage({
        leadId,
        channel: "sms",
        kind,
        recipient,
        body,
        status: "failed",
        error: reason,
      });
      // Deliberately not thrown. A failed text must never take down a lead
      // submission or a webhook — the lead matters more than the notification.
      return { status: "failed", error: reason };
    }

    await logMessage({
      leadId,
      channel: "sms",
      kind,
      recipient,
      body,
      status: "sent",
    });
    return { status: "sent" };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`[sms:failed] -> ${recipient}: ${reason}`);
    await logMessage({
      leadId,
      channel: "sms",
      kind,
      recipient,
      body,
      status: "failed",
      error: reason,
    });
    return { status: "failed", error: reason };
  }
}
