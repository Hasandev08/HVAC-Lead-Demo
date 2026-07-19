"use client";

import { useState, useTransition } from "react";
import { simulateMissedCall } from "@/app/dashboard/actions";
import { Spinner } from "@/components/Spinner";
import { company } from "@/config/company";

/**
 * The demo centerpiece. An owner clicks it and watches a missed call turn into
 * a lead with an automatic text-back — no live phone call, no Twilio account,
 * no praying the conference-room wifi holds.
 */
export function SimulateCallButton({ mode }: { mode: "live" | "simulated" }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function run() {
    setMessage(null);
    startTransition(async () => {
      try {
        const r = await simulateMissedCall(phone);
        if (!r.ok) {
          setMessage(r.error);
          return;
        }
        setMessage(
          r.isRepeatCaller
            ? "Same caller within 15 min — merged into the existing lead."
            : `Lead created and caller texted back (${r.textBack}).`,
        );
        setPhone("");
      } catch {
        setMessage("Something went wrong.");
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Simulate missed call
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !pending && run()}
        placeholder={company.phone.display}
        autoFocus
        className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
      />
      <button
        type="button"
        onClick={run}
        disabled={pending || !phone}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-bold text-white transition hover:bg-accent-dark disabled:opacity-60"
      >
        {pending && <Spinner className="h-3.5 w-3.5" />}
        {pending ? "Calling…" : "Ring it"}
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setMessage(null);
        }}
        className="px-2 py-2 text-sm text-slate-400 hover:text-slate-600"
      >
        Cancel
      </button>

      {message ? (
        <p className="text-xs font-medium text-slate-600">{message}</p>
      ) : (
        <p className="text-xs text-slate-400">
          {mode === "simulated"
            ? "SMS is simulated — messages are logged, not delivered."
            : "Live Twilio — a real text will be sent."}
        </p>
      )}
    </div>
  );
}
