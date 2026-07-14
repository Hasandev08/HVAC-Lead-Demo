import { supabaseAdmin } from "@/lib/supabase-admin";

export type Channel = "email" | "sms";
export type MessageKind =
  | "lead_confirmation"
  | "owner_alert"
  | "missed_call_textback"
  | "follow_up";

/** 'simulated' = no credentials configured. Honest, not a fake success. */
export type MessageStatus = "sent" | "simulated" | "failed";

export type MessageLog = {
  leadId: string | null;
  channel: Channel;
  kind: MessageKind;
  recipient: string;
  body: string;
  status: MessageStatus;
  error?: string;
};

/**
 * Records every message we send, attempt, or simulate.
 *
 * This is what the dashboard's message log renders — it's the demo's proof that
 * the system actually responded. Logging must never throw: a failed log should
 * not take down a lead submission.
 */
export async function logMessage(entry: MessageLog): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;

  const { error } = await db.from("messages").insert({
    lead_id: entry.leadId,
    channel: entry.channel,
    kind: entry.kind,
    recipient: entry.recipient,
    body: entry.body,
    status: entry.status,
    error: entry.error ?? null,
  });

  if (error) {
    console.error("[messages] failed to log message:", error.message);
  }
}
