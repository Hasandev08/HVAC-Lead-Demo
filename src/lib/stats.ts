import { responseMinutes, type Lead } from "@/lib/leads";

export type Stats = {
  total: number;
  thisWeek: number;
  /** Mean minutes to first response. Null when nothing has been answered yet. */
  avgResponseMinutes: number | null;
  missedCallsRecovered: number;
  newCount: number;
};

/**
 * The numbers across the top of the dashboard.
 *
 * These are the pitch: an owner who sees "average response: 40 seconds" next to
 * "12 leads this week" understands the product without being told. So they're
 * computed honestly — an unanswered lead is excluded from the average rather
 * than counted as zero, which would flatter the number into meaninglessness.
 */
export function computeStats(leads: Lead[]): Stats {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const answered = leads
    .map(responseMinutes)
    .filter((m): m is number => m !== null);

  return {
    total: leads.length,
    thisWeek: leads.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length,
    avgResponseMinutes: answered.length
      ? answered.reduce((sum, m) => sum + m, 0) / answered.length
      : null,
    // A missed call that became a lead is a job that would otherwise have been
    // lost in silence. It's the single most persuasive number on the page.
    missedCallsRecovered: leads.filter((l) => l.source === "missed_call").length,
    newCount: leads.filter((l) => l.status === "new").length,
  };
}
