"use client";

import { useState, useTransition } from "react";
import { runFollowUpsNow } from "@/app/dashboard/actions";

/**
 * Triggers the follow-up sweep on demand.
 *
 * In a pitch this is the moment that sells the product: an owner clicks it and
 * watches a stale lead get chased automatically. So the result is reported
 * specifically ("Chased 2 leads") rather than a vague "done".
 */
export function FollowUpButton({ delayMinutes }: { delayMinutes: number }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function run() {
    setMessage(null);
    startTransition(async () => {
      try {
        const r = await runFollowUpsNow();
        if (r.errors.length) setMessage(`Error: ${r.errors[0]}`);
        else if (r.sent > 0)
          setMessage(`Chased ${r.sent} lead${r.sent === 1 ? "" : "s"}.`);
        else if (r.skipped > 0)
          setMessage(`${r.skipped} overdue, but no email address on file.`);
        else setMessage("Nothing overdue — every lead has been handled.");
      } catch {
        setMessage("Something went wrong.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
      >
        {pending ? "Running…" : "Run follow-up now"}
      </button>

      <p className="text-xs text-slate-500">
        {message ?? `Leads untouched for ${formatDelay(delayMinutes)} get chased automatically.`}
      </p>
    </div>
  );
}

function formatDelay(minutes: number): string {
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}
