import { after } from "next/server";
import { sendLeadConfirmation, sendOwnerAlert } from "@/lib/email";
import { validateLead, type Lead } from "@/lib/leads";
import { clientIp, rateLimit, sweepExpired } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * The lead intake endpoint — the single most important route in the app.
 *
 * Order of operations matters here:
 *   1. Validate.
 *   2. Save the lead. If this fails, we fail loudly; a lost lead is the one
 *      outcome the entire product exists to prevent.
 *   3. Respond immediately.
 *   4. Send the emails in `after()`, once the response is already on its way.
 *
 * Step 4 is why the form feels instant. SMTP handshakes take a second or two,
 * and a customer with a dead AC should not watch a spinner for that.
 */
export async function POST(request: Request) {
  // This endpoint is public, unauthenticated, writes to the database, and sends
  // email. Throttle it before doing any of that work.
  sweepExpired();
  const { allowed, retryAfter } = rateLimit(clientIp(request));
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please call us instead." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validateLead(body);
  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }

  const input = result.value;
  const db = supabaseAdmin();

  // No database configured — keep the site demoable rather than showing an
  // error to whoever is watching. Loud in the server log, silent to the user.
  if (!db) {
    console.warn(
      "[leads] Supabase is not configured. Lead received but NOT saved:",
      input,
    );
    return Response.json({ ok: true, demoMode: true });
  }

  const { data, error } = await db
    .from("leads")
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      service: input.service,
      urgency: input.urgency,
      message: input.message || null,
      source: "form",
      status: "new",
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[leads] failed to save lead:", error?.message, input);
    return Response.json({ error: "Could not save your request." }, { status: 500 });
  }

  const lead = data as Lead;

  // Everything below runs after the customer already has their confirmation.
  // Each send swallows its own errors and logs to the messages table, so a dead
  // SMTP server can't turn a saved lead into a failed one.
  after(async () => {
    await Promise.all([sendLeadConfirmation(lead), sendOwnerAlert(lead)]);
  });

  return Response.json({ ok: true, id: lead.id });
}
