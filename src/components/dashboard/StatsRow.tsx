import { formatDuration } from "@/lib/leads";
import type { Stats } from "@/lib/stats";

export function StatsRow({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total leads",
      value: String(stats.total),
      sub: stats.newCount > 0 ? `${stats.newCount} still new` : "all handled",
      tone: "default" as const,
    },
    {
      label: "This week",
      value: String(stats.thisWeek),
      sub: "last 7 days",
      tone: "default" as const,
    },
    {
      label: "Avg response time",
      value:
        stats.avgResponseMinutes === null
          ? "—"
          : formatDuration(stats.avgResponseMinutes),
      sub: stats.avgResponseMinutes === null ? "nothing answered yet" : "to first reply",
      // The number the whole pitch rests on, so it gets the accent treatment.
      tone: "accent" as const,
    },
    {
      label: "Missed calls recovered",
      value: String(stats.missedCallsRecovered),
      sub: "would have been lost",
      tone: "success" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-5 ${
            card.tone === "accent"
              ? "border-accent/20 bg-accent/5"
              : card.tone === "success"
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {card.label}
          </p>
          <p
            className={`mt-2 text-3xl font-extrabold tracking-tight ${
              card.tone === "accent"
                ? "text-accent"
                : card.tone === "success"
                  ? "text-emerald-700"
                  : "text-slate-900"
            }`}
          >
            {card.value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
