import "server-only";
import { company, serviceName } from "@/config/company";
import { sendOwnerAlert } from "@/lib/email";
import { formatUsPhone, normalizeUsPhone, type Lead } from "@/lib/leads";
import { ownerPhone, sendSms } from "@/lib/sms";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Turning an unanswered call into a lead — the feature the whole pitch rests on.
 *
 * An HVAC owner on a roof at 2pm misses the call, and the caller books whoever
 * answers next. This gets a text back to them within seconds, so the company is
 * still in the running.
 */

export function textBackMessage(): string {
  return `Sorry we missed you! This is ${company.name} — reply here and we'll get your AC looked at today. Or call us back at ${company.phone.display}.`;
}

export function ownerNotice(callerPhone: string): string {
  return `Missed call from ${formatUsPhone(callerPhone)}. We've already texted them back automatically.`;
}

export function leadConfirmationSms(lead: Lead): string {
  const firstName = lead.name.split(" ")[0];
  const service = lead.service ? serviceName(lead.service).toLowerCase() : "your request";
  return `Hi ${firstName}, this is ${company.name}. Got your request about ${service} — we'll be in touch shortly to confirm a time. Questions? Call ${company.phone.display}.`;
}

export type MissedCallResult = {
  leadId: string;
  isRepeatCaller: boolean;
  textBack: "sent" | "simulated" | "failed";
};

/**
 * Records a missed call as a lead and texts the caller back.
 *
 * Shared by the Twilio webhook and the dashboard's "Simulate missed call"
 * button, so the demo exercises the identical code path that production would.
 * A simulated demo that runs different code proves nothing.
 */
export async function handleMissedCall(
  rawCallerPhone: string,
): Promise<MissedCallResult | null> {
  const db = supabaseAdmin();
  if (!db) return null;

  const phone = normalizeUsPhone(rawCallerPhone);
  if (!phone) {
    console.warn(`[missed-call] unusable caller number: ${rawCallerPhone}`);
    return null;
  }

  // Someone calling three times in a row is one lead, not three. Without this
  // the dashboard fills with duplicates during a demo, which reads as a bug.
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60_000).toISOString();
  const { data: recent } = await db
    .from("leads")
    .select("*")
    .eq("phone", phone)
    .eq("source", "missed_call")
    .gt("created_at", fifteenMinutesAgo)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let lead = recent as Lead | null;
  const isRepeatCaller = Boolean(lead);

  if (!lead) {
    const { data, error } = await db
      .from("leads")
      .insert({
        // We only know their number — the name is filled in when they reply.
        name: `Caller ${formatUsPhone(phone)}`,
        phone,
        source: "missed_call",
        status: "new",
        urgency: "asap",
        message: "Missed call — auto text-back sent.",
      })
      .select()
      .single();

    if (error || !data) {
      console.error("[missed-call] failed to save lead:", error?.message);
      return null;
    }
    lead = data as Lead;
  }

  // Text the caller back. This is the whole point, so it happens first.
  const textBack = await sendSms({
    to: phone,
    body: textBackMessage(),
    leadId: lead.id,
    kind: "missed_call_textback",
  });

  // Tell the owner. Only on the first call of a burst — nobody wants three
  // identical alerts because someone redialed.
  if (!isRepeatCaller) {
    if (ownerPhone) {
      await sendSms({
        to: ownerPhone,
        body: ownerNotice(phone),
        leadId: lead.id,
        kind: "owner_alert",
      });
    }
    // Email too: the owner may not have their phone handy, and a missed call
    // is exactly the moment a notification must not be missed.
    await sendOwnerAlert(lead);
  }

  return { leadId: lead.id, isRepeatCaller, textBack: textBack.status };
}
