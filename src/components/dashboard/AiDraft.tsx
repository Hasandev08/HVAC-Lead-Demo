"use client";

import { useState } from "react";

/**
 * The AI draft, with a copy button.
 *
 * Collapsed by default: the table's job is to scan many leads at once, and an
 * always-open draft on every row would bury that. One click opens it.
 */
export function AiDraft({ draft }: { draft: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API needs HTTPS or localhost; on failure the text is still
      // on screen and selectable, so this is a non-event.
      setCopied(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:text-primary-dark"
      >
        <SparkIcon />
        Suggested reply
      </button>
    );
  }

  return (
    <div className="mt-1 rounded-lg border border-primary/20 bg-primary/[0.03] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-primary uppercase">
          <SparkIcon />
          Suggested reply
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copy}
            className={`rounded px-2 py-1 text-xs font-semibold transition ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded px-1.5 py-1 text-xs text-slate-400 transition hover:text-slate-600"
            aria-label="Hide draft"
          >
            ✕
          </button>
        </div>
      </div>

      <p className="text-[13px] leading-relaxed text-slate-700">{draft}</p>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M12 2l1.9 5.6L19.5 9.5 13.9 11.4 12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </svg>
  );
}
