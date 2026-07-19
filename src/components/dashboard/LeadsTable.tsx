"use client";

import Link from "next/link";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/app/dashboard/actions";
import { Spinner } from "@/components/Spinner";
import { AiDraft } from "./AiDraft";
import { serviceName } from "@/config/company";
import {
  formatDuration,
  formatUsPhone,
  responseMinutes,
  STATUS_LABELS,
  toE164,
  type Lead,
  type LeadStatus,
} from "@/lib/leads";

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-accent/10 text-accent ring-accent/20",
  contacted: "bg-blue-50 text-blue-700 ring-blue-200",
  follow_up_sent: "bg-amber-50 text-amber-700 ring-amber-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) return <EmptyState />;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {["Lead", "Service", "Source", "Response", "Received", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <Row key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: the table becomes cards. An owner checks this on a phone. */}
      <div className="divide-y divide-slate-100 md:hidden">
        {leads.map((lead) => (
          <Card key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

function useStatus(lead: Lead) {
  const [pending, startTransition] = useTransition();
  // Optimistic: the select shows the new value immediately rather than waiting
  // for the round-trip. Reverts if the server rejects it.
  const [optimistic, setOptimistic] = useState<LeadStatus | null>(null);
  const status = optimistic ?? lead.status;

  function change(next: LeadStatus) {
    setOptimistic(next);
    startTransition(async () => {
      try {
        await updateLeadStatus(lead.id, next);
      } catch {
        setOptimistic(null);
      }
    });
  }

  return { status, pending, change };
}

function StatusSelect({ lead }: { lead: Lead }) {
  const { status, pending, change } = useStatus(lead);

  return (
    <span className="relative inline-flex items-center">
      <select
        value={status}
        disabled={pending}
        onChange={(e) => change(e.target.value as LeadStatus)}
        className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition disabled:opacity-60 ${STATUS_STYLES[status]}`}
      >
        {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      {/* Sits outside the select rather than replacing its label, so the row
          doesn't reflow mid-save. Fading the control alone read as "disabled",
          not "saving". */}
      {pending && <Spinner className="ml-1.5 h-3 w-3 text-slate-400" />}
    </span>
  );
}


function Row({ lead }: { lead: Lead }) {
  const mins = responseMinutes(lead);

  return (
    <tr className="transition hover:bg-slate-50/60">
      <td className="px-4 py-3">
        <p className="font-semibold text-slate-900">{lead.name}</p>
        <a
          href={`tel:${toE164(lead.phone) ?? lead.phone}`}
          className="text-sm text-primary hover:underline"
        >
          {formatUsPhone(lead.phone)}
        </a>
        {lead.email && (
          <p className="truncate text-xs text-slate-500" title={lead.email}>
            {lead.email}
          </p>
        )}
      </td>
      <td className="max-w-xs px-4 py-3">
        <p className="text-sm text-slate-700">
          {lead.service ? serviceName(lead.service) : "—"}
        </p>
        {lead.urgency === "asap" && (
          <span className="text-xs font-semibold text-red-600">Emergency</span>
        )}
        {lead.ai_draft && (
          <div className="mt-1.5">
            <AiDraft draft={lead.ai_draft} />
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <SourceBadge source={lead.source} />
      </td>
      <td className="px-4 py-3">
        {mins === null ? (
          <span className="text-sm text-slate-400">—</span>
        ) : (
          <span className="text-sm font-semibold text-emerald-700">
            {formatDuration(mins)}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-500">
        {timeAgo(lead.created_at)}
      </td>
      <td className="px-4 py-3">
        <StatusSelect lead={lead} />
      </td>
    </tr>
  );
}

function Card({ lead }: { lead: Lead }) {
  const mins = responseMinutes(lead);

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{lead.name}</p>
          <a
            href={`tel:${toE164(lead.phone) ?? lead.phone}`}
            className="text-sm text-primary"
          >
            {formatUsPhone(lead.phone)}
          </a>
        </div>
        <StatusSelect lead={lead} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
        <span className="font-medium text-slate-700">
          {lead.service ? serviceName(lead.service) : "—"}
        </span>
        <SourceBadge source={lead.source} />
        {lead.urgency === "asap" && (
          <span className="font-semibold text-red-600">Emergency</span>
        )}
        <span>{timeAgo(lead.created_at)}</span>
        {mins !== null && (
          <span className="font-semibold text-emerald-700">
            answered in {formatDuration(mins)}
          </span>
        )}
      </div>

      {lead.message && (
        <p className="mt-2.5 line-clamp-2 text-sm text-slate-600">{lead.message}</p>
      )}

      {lead.ai_draft && (
        <div className="mt-2.5">
          <AiDraft draft={lead.ai_draft} />
        </div>
      )}
    </div>
  );
}

function SourceBadge({ source }: { source: Lead["source"] }) {
  const missed = source === "missed_call";
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
        missed ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {missed ? "Missed call" : "Web form"}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <p className="text-lg font-semibold text-slate-900">No leads yet</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Every form submission and missed call will land here automatically —
        answered before you even see it.
      </p>
      <Link
        href="/#contact"
        className="mt-5 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark"
      >
        Submit a test lead
      </Link>
    </div>
  );
}

function timeAgo(iso: string): string {
  const mins = (Date.now() - new Date(iso).getTime()) / 60000;
  if (mins < 1) return "just now";
  if (mins < 60) return `${Math.floor(mins)}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  const days = Math.floor(mins / 1440);
  return days === 1 ? "yesterday" : `${days}d ago`;
}
