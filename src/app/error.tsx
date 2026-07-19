"use client";

import { useEffect } from "react";
import { company } from "@/config/company";

/**
 * Error boundary for the public site.
 *
 * The important decision here: this page still shows the phone number,
 * prominently. If the site breaks for a homeowner whose AC just died, the
 * business should not lose that lead to a stack trace — a broken page that
 * still says "call us" converts; a generic error screen doesn't.
 *
 * Next 16 note: the retry prop is `unstable_retry`, not `reset` as in earlier
 * versions. `reset` still exists but only re-renders without re-fetching.
 */
export default function SiteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // The digest is what correlates this to the server log — a real deployment
    // would forward it to Sentry or similar.
    console.error("[site error]", error.digest ?? "", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand px-4 py-12">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-md text-center">
        <p className="text-2xl font-bold tracking-tight text-white">
          {company.logo.primary}
          <span className="text-accent"> {company.logo.secondary}</span>
        </p>

        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
          Something went wrong on our end.
        </h1>
        <p className="mt-3 leading-relaxed text-slate-300">
          Sorry about that. If you need help right now, call us — we answer 24/7
          and someone will pick up.
        </p>

        <a
          href={`tel:${company.phone.href}`}
          className="mt-8 inline-block rounded-xl bg-accent px-7 py-4 text-lg font-bold text-white shadow-xl shadow-accent/30 transition hover:bg-accent-dark"
        >
          Call {company.phone.display}
        </a>

        <div className="mt-6 flex items-center justify-center gap-5 text-sm">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="font-semibold text-white underline-offset-4 hover:underline"
          >
            Try again
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
              deliberate: a plain <a> forces a full document load, which resets
              any client state that caused the error. Link would keep the broken
              app instance alive. The retry button covers the soft path. */}
          <a
            href="/"
            className="text-slate-400 underline-offset-4 hover:text-white hover:underline"
          >
            Back to the website
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 font-mono text-xs text-slate-600">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
