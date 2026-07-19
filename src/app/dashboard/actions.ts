"use server";

import { revalidatePath } from "next/cache";
import { runFollowUps } from "@/lib/follow-up";
import type { LeadStatus } from "@/lib/leads";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireOwner } from "@/lib/supabase-server";

const VALID: LeadStatus[] = ["new", "contacted", "follow_up_sent", "closed"];

/**
 * Update a lead's status from the dashboard.
 *
 * Server Actions are reachable by direct POST, not just through our UI, so this
 * re-checks authorization itself. It does NOT inherit trust from the fact that
 * the dashboard page already ran requireOwner().
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const auth = await requireOwner();
  if (!auth.ok) throw new Error("Not authorized");

  if (!VALID.includes(status)) throw new Error("Invalid status");

  const db = supabaseAdmin();
  if (!db) throw new Error("Database not configured");

  // Moving off "new" is the owner responding. Stamp the first response only
  // once — this is what time-to-first-response is measured from, so a later
  // status change must not overwrite it and flatter the number.
  const { data: current } = await db
    .from("leads")
    .select("first_response_at")
    .eq("id", leadId)
    .single();

  const patch: Record<string, unknown> = { status };
  if (status !== "new" && !current?.first_response_at) {
    patch.first_response_at = new Date().toISOString();
  }

  const { error } = await db.from("leads").update(patch).eq("id", leadId);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

/**
 * The "Run follow-up now" button.
 *
 * Same work as the cron endpoint, different authorization: a signed-in owner
 * rather than CRON_SECRET. Deliberately NOT a fetch to /api/cron/follow-up —
 * that would mean shipping the cron secret somewhere the browser could reach.
 *
 * It exists because Vercel's free plan runs cron once a day, so the 2-minute
 * demo delay can't fire on its own. It's also the better demo: click, and the
 * owner watches the follow-up go out.
 */
export async function runFollowUpsNow() {
  const auth = await requireOwner();
  if (!auth.ok) throw new Error("Not authorized");

  const result = await runFollowUps();
  revalidatePath("/dashboard");
  return result;
}
