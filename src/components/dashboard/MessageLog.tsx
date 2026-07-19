"use client";

import { useState } from "react";

export type LoggedMessage = {
  id: string;
  channel: "email" | "sms";
  kind: string;
  recipient: string;
  body: string;
  status: "sent" | "simulated" | "failed";
  created_at: string;
};

const KIND_LABELS: Record<string, string> = {
  lead_confirmation: "Customer confirmation",
  owner_alert: "Owner alert",
  missed_call_textback: "Missed-call text-back",
  follow_up: "Follow-up",
};

/**
 * Everything the system has sent on the owner's behalf.
 *
 * This is the proof panel. An owner's reasonable first question is "so what did
 * it actually say to my customer?" — this answers it, in their words, without
 * anyone having to take it on faith.
 *
 * Simulated messages are labelled as such rather than dressed up as delivered.
 * A demo that quietly claims to have texted someone is a demo that turns into
 * an awkward conversation later.
 */
export function MessageLog({
  messages,
  mode,
}: {
  messages: LoggedMessage[];
  mode: "live" | "simulated";
}) {
  const [open, setOpen] = useState(false);

  if (messages.length === 0) return null;

  const shown = open ? messages : messages.slice(0, 5);

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Message log</h2>
          <p className="text-xs text-slate-500">
            Every email and text sent automatically on your behalf.
          </p>
        </div>
        {mode === "simulated" && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
            SMS simulated
          </span>
        )}
      </header>

      <ul className="divide-y divide-slate-100">
        {shown.map((m) => (
          <li key={m.id} className="flex gap-3 px-4 py-3">
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                m.channel === "sms"
                  ? "bg-purple-50 text-purple-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {m.channel === "sms" ? "SMS" : "@"}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-sm font-semibold text-slate-800">
                  {KIND_LABELS[m.kind] ?? m.kind}
                </span>
                <span className="truncate text-xs text-slate-500">{m.recipient}</span>
                <StatusPill status={m.status} />
                <span className="ml-auto text-xs whitespace-nowrap text-slate-400">
                  {timeAgo(m.created_at)}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                {m.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {messages.length > 5 && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full border-t border-slate-100 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-slate-50"
        >
          {open ? "Show less" : `Show all ${messages.length} messages`}
        </button>
      )}
    </section>
  );
}

function StatusPill({ status }: { status: LoggedMessage["status"] }) {
  const styles = {
    sent: "bg-emerald-50 text-emerald-700",
    simulated: "bg-amber-50 text-amber-700",
    failed: "bg-red-50 text-red-700",
  } as const;

  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${styles[status]}`}>
      {status}
    </span>
  );
}

function timeAgo(iso: string): string {
  const mins = (Date.now() - new Date(iso).getTime()) / 60000;
  if (mins < 1) return "just now";
  if (mins < 60) return `${Math.floor(mins)}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}
