"use client";

import { useEffect } from "react";
import { company } from "@/config/company";

/**
 * Error boundary for the dashboard.
 *
 * Separate from the site's because the audience is different: the owner is
 * signed in and needs to know whether his leads are safe. The reassurance that
 * nothing was lost is the most useful thing this page can say — his first
 * thought on seeing an error will be "did I just lose my leads?"
 */
export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard error]", error.digest ?? "", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <span className="font-bold tracking-tight text-brand">
            {company.logo.primary}
            <span className="text-accent"> {company.logo.secondary}</span>
          </span>
          <span className="hidden text-sm text-slate-400 sm:inline">/ Dashboard</span>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="M12 8v5M12 16.5v.5" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </span>

        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
          Couldn&apos;t load your leads
        </h1>
        <p className="mt-3 leading-relaxed text-slate-600">
          Something went wrong fetching your dashboard.{" "}
          <strong className="text-slate-900">Your leads are safe</strong> — this is a
          display problem, not lost data.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark"
          >
            Try again
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
              deliberate: a plain <a> forces a full document load, which resets
              any client state that caused the error. Link would keep the broken
              app instance alive. The retry button covers the soft path. */}
          <a
            href="/"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to the website
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 font-mono text-xs text-slate-400">
            Reference: {error.digest}
          </p>
        )}
      </main>
    </div>
  );
}
