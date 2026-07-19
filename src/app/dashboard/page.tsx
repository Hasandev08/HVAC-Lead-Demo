import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/login/actions";
import { FollowUpButton } from "@/components/dashboard/FollowUpButton";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { MessageLog, type LoggedMessage } from "@/components/dashboard/MessageLog";
import { SimulateCallButton } from "@/components/dashboard/SimulateCallButton";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { company } from "@/config/company";
import { followUpDelayMinutes } from "@/lib/follow-up";
import type { Lead } from "@/lib/leads";
import { smsMode } from "@/lib/sms";
import { computeStats } from "@/lib/stats";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireOwner } from "@/lib/supabase-server";

export const metadata = { title: `Dashboard — ${company.name}` };

// Leads change constantly; a cached dashboard would show stale numbers.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // The real authorization check. proxy.ts already bounced logged-out visitors,
  // but that's an optimistic edge check — this is the one that counts.
  const auth = await requireOwner();

  if (!auth.ok) {
    if (auth.reason === "no-config") return <NotConfigured />;
    redirect("/login");
  }

  const db = supabaseAdmin();

  // One round trip instead of two sequential ones.
  const [leadsResult, messagesResult] = await Promise.all([
    db!.from("leads").select("*").order("created_at", { ascending: false }),
    db!
      .from("messages")
      .select("id,channel,kind,recipient,body,status,created_at")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const leads = (leadsResult.data ?? []) as Lead[];
  const messages = (messagesResult.data ?? []) as LoggedMessage[];
  const stats = computeStats(leads);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold tracking-tight text-brand">
              {company.logo.primary}
              <span className="text-accent"> {company.logo.secondary}</span>
            </Link>
            <span className="hidden text-sm text-slate-400 sm:inline">/ Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:inline">{auth.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Your leads
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Every form submission and missed call, answered automatically.
          </p>
        </div>

        <StatsRow stats={stats} />

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <FollowUpButton delayMinutes={followUpDelayMinutes()} />
          <SimulateCallButton mode={smsMode()} />
        </div>

        <div className="mt-6">
          <LeadsTable leads={leads} />
        </div>

        <div className="mt-8">
          <MessageLog messages={messages} mode={smsMode()} />
        </div>
      </main>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">Supabase isn&apos;t configured</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Add your Supabase keys to <code className="text-xs">.env.local</code> and restart
          the dev server. See <code className="text-xs">SETUP.md</code>.
        </p>
      </div>
    </div>
  );
}
