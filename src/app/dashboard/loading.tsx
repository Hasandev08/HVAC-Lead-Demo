import { company } from "@/config/company";

/**
 * Shown instantly while the dashboard's server component queries the database.
 *
 * Deliberately a skeleton of the real layout rather than a centered spinner:
 * the shapes and spacing match the loaded page exactly, so content fills in
 * where the placeholders already are instead of the page jumping. On a cold
 * serverless start this is the difference between "it's working" and "is it
 * broken?" — which matters most in front of a client.
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header renders for real — it needs no data, so there's no reason to
          fake it. Keeps the page feeling anchored while the rest loads. */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-tight text-brand">
              {company.logo.primary}
              <span className="text-accent"> {company.logo.secondary}</span>
            </span>
            <span className="hidden text-sm text-slate-400 sm:inline">/ Dashboard</span>
          </div>
          <Bar className="h-8 w-24" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Your leads
          </h1>
          <p className="mt-1 text-sm text-slate-500">Loading your leads…</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
              <Bar className="h-3 w-24" />
              <Bar className="mt-3 h-8 w-16" />
              <Bar className="mt-2 h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Bar className="h-9 w-40 rounded-lg" />
          <Bar className="h-9 w-44 rounded-lg" />
        </div>

        {/* Leads table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <Bar className="h-3 w-32" />
          </div>
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <div className="flex-1 space-y-2">
                  <Bar className="h-4 w-40" />
                  <Bar className="h-3 w-28" />
                </div>
                <Bar className="hidden h-3 w-28 sm:block" />
                <Bar className="hidden h-5 w-20 rounded-full md:block" />
                <Bar className="h-6 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * One placeholder block. `animate-pulse` on a slate fill reads as "loading"
 * without inventing a new visual language — it's the same palette the real
 * dashboard uses.
 */
function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}
