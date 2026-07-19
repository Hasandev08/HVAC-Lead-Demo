import "server-only";
import { sendFollowUp } from "@/lib/email";
import type { Lead } from "@/lib/leads";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type FollowUpResult = {
  checked: number;
  sent: number;
  skipped: number;
  errors: string[];
};

/** Minutes a lead may sit as "new" before we chase it. */
export function followUpDelayMinutes(): number {
  const raw = Number(process.env.FOLLOW_UP_DELAY_MINUTES || 1440);
  return Number.isFinite(raw) && raw >= 0 ? raw : 1440;
}

/**
 * Chase every lead that's been sitting untouched.
 *
 * Called from two places — the cron endpoint and the dashboard's "Run now"
 * button — so authorization is the caller's job, not this function's. It has no
 * opinion about who invoked it.
 *
 * Idempotent by construction: a lead is only selected while status='new', and
 * the first thing a successful send does is move it off 'new'. Running this
 * twice in a row does nothing the second time, which matters because the demo
 * button and an external cron can easily overlap.
 */
export async function runFollowUps(): Promise<FollowUpResult> {
  const result: FollowUpResult = { checked: 0, sent: 0, skipped: 0, errors: [] };

  const db = supabaseAdmin();
  if (!db) {
    result.errors.push("Supabase not configured");
    return result;
  }

  const cutoff = new Date(Date.now() - followUpDelayMinutes() * 60_000).toISOString();

  const { data, error } = await db
    .from("leads")
    .select("*")
    .eq("status", "new")
    .lt("created_at", cutoff)
    .order("created_at", { ascending: true })
    // A safety valve, not a page size. If something has gone wrong and 500
    // leads are overdue, we would rather send 25 and be asked again than
    // empty the daily SMTP quota in a single run.
    .limit(25);

  if (error) {
    result.errors.push(error.message);
    return result;
  }

  const leads = (data ?? []) as Lead[];
  result.checked = leads.length;

  for (const lead of leads) {
    // No email address means no email follow-up. Leave it 'new' rather than
    // marking it chased — a false "follow-up sent" is worse than an untouched
    // lead, because the owner stops looking at it. Phase 4's SMS covers these.
    if (!lead.email) {
      result.skipped++;
      continue;
    }

    try {
      await sendFollowUp(lead);

      const { error: updateError } = await db
        .from("leads")
        .update({
          status: "follow_up_sent",
          // An automated follow-up IS a response as far as the customer is
          // concerned, so it counts toward time-to-first-response — but only
          // if nothing responded earlier.
          first_response_at: lead.first_response_at ?? new Date().toISOString(),
        })
        .eq("id", lead.id)
        // Guard against a concurrent run that already claimed this lead.
        .eq("status", "new");

      if (updateError) result.errors.push(`${lead.id}: ${updateError.message}`);
      else result.sent++;
    } catch (err) {
      result.errors.push(
        `${lead.id}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return result;
}
