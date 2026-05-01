"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  type Incident,
  type Severity,
  fmtTimeAgo,
  severityConfig,
  statusConfig,
} from "@/lib/incidents";

type Filter = "all" | Severity | "resolved" | "live";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "P0", label: "P0" },
  { id: "P1", label: "P1" },
  { id: "live", label: "LIVE" },
  { id: "resolved", label: "RESOLVED" },
];

export function IncidentsIndex({ incidents }: { incidents: Incident[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return incidents.filter((i) => {
      if (filter !== "all") {
        if (filter === "resolved" && i.status !== "resolved") return false;
        if (filter === "live" && i.status === "resolved") return false;
        if (["P0", "P1", "P2", "P3"].includes(filter) && i.severity !== filter) return false;
      }
      if (q) {
        const h = `${i.title} ${i.service} ${i.assignee.name} ${i.id}`.toLowerCase();
        if (!h.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [incidents, filter, q]);

  const stats = useMemo(() => {
    const live = incidents.filter((i) => i.status !== "resolved").length;
    const p0 = incidents.filter((i) => i.severity === "P0").length;
    const resolved = incidents.filter((i) => i.status === "resolved").length;
    return { live, p0, resolved };
  }, [incidents]);

  return (
    <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-24 md:px-8">
      <div className="flex items-baseline justify-between border-b border-ink pb-3">
        <span className="label">INCIDENT CONSOLE · V0.9</span>
        <span className="mono text-[10.5px] text-ink-3 tabular-nums">
          {todayLong()} · watching
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1.6fr_1fr] md:items-end">
        <div>
          <h1 className="display text-[48px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[68px]">
            Incidents<span className="display-italic">,</span>{" "}
            <span className="display-italic">graphed.</span>
          </h1>
          <p className="mt-3 max-w-[56ch] text-[14.5px] leading-[1.7] text-ink-2">
            Every incident clusters its alerts, surfaces its top candidate
            cause, and drafts a runbook. Click one to open the graph.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <DeckStat label="Live" value={`${stats.live}`} color="var(--crit)" />
          <DeckStat label="P0" value={`${stats.p0}`} color="var(--warn)" />
          <DeckStat label="Resolved · 7d" value={`${stats.resolved}`} color="var(--ok)" />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4 border-y border-line py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={[
                  "label !text-[10px] !tracking-[0.16em] px-3 py-1.5 transition-colors shrink-0",
                  active ? "text-ink" : "text-ink-3 hover:text-ink-2",
                ].join(" ")}
                style={
                  active
                    ? { boxShadow: "inset 0 -2px 0 0 var(--accent)" }
                    : undefined
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 border border-line bg-surface px-3 py-1.5 rounded-[4px]">
          <Search className="h-3.5 w-3.5 text-ink-3" strokeWidth={1.75} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search service, assignee, ID"
            className="min-w-[240px] bg-transparent text-[13px] text-ink placeholder:text-ink-3 outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onReset={() => { setFilter("all"); setQ(""); }} />
      ) : (
        <ol className="mt-8 flex flex-col gap-3">
          {filtered.map((i, idx) => (
            <IncidentRow key={i.id} incident={i} index={idx + 1} />
          ))}
        </ol>
      )}

      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-2">
        <span className="mono text-[10.5px] text-ink-3 tracking-[0.12em]">
          SALVO v0.9 · {filtered.length} OF {incidents.length} SHOWN
        </span>
      </div>
    </div>
  );
}

function IncidentRow({ incident, index }: { incident: Incident; index: number }) {
  const sev = severityConfig(incident.severity);
  const st = statusConfig(incident.status);
  const topCause = incident.topCause;

  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
    >
      <Link
        href={`/app/${incident.slug}/`}
        className="group block border border-line bg-surface hover:border-line-2 transition-colors rounded-[4px]"
      >
        <div className="grid grid-cols-1 md:grid-cols-[52px_1fr_320px]">
          <div className="hidden md:flex flex-col items-center justify-center border-r border-line bg-surface-2/40 py-5">
            <span
              className="mono text-[10px] font-semibold tracking-[0.14em]"
              style={{ color: sev.ink }}
            >
              {sev.label}
            </span>
            <div className="mt-1 h-[1px] w-4 bg-line" />
            <span className="mono text-[9.5px] text-ink-3 tabular-nums mt-2">
              #{incident.id.replace("inc-", "")}
            </span>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="display text-[19px] leading-tight text-ink">
                {incident.title}
              </span>
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden
                  className="h-[6px] w-[6px] rounded-full"
                  style={{ background: st.dot }}
                />
                <span
                  className="mono text-[9.5px] tracking-[0.14em]"
                  style={{ color: st.ink }}
                >
                  {st.label}
                </span>
              </span>
            </div>
            <div className="mt-1 text-[12.5px] text-ink-3">
              <span className="mono text-ink-2">{incident.service}</span> ·{" "}
              {incident.sourceAlerts.reduce((a, x) => a + x.count, 0)} alerts clustered ·{" "}
              assigned {incident.assignee.name} ·{" "}
              {fmtTimeAgo(incident.firedAt)}
            </div>

            {topCause && (
              <div className="mt-2.5 inline-flex items-baseline gap-2 text-[12px]">
                <span
                  className="mono text-[10px] tracking-[0.1em]"
                  style={{ color: "var(--accent)" }}
                >
                  TOP CAUSE · {topCause.confidence}%
                </span>
                <span className="text-ink-2">{topCause.title}</span>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center gap-3 border-l border-line px-5 py-4 bg-surface-2/30">
            <img
              src={incident.assignee.avatar}
              alt={incident.assignee.name}
              className="h-8 w-8 rounded-full border border-line object-cover filter grayscale-[0.1]"
              loading="lazy"
            />
            <div className="min-w-0">
              <div className="mono text-[10.5px] uppercase tracking-[0.08em] text-ink truncate">
                {incident.assignee.name}
              </div>
              <div className="text-[11.5px] text-ink-3 truncate">
                {incident.assignee.role}
              </div>
            </div>
            <span className="flex-1" />
            <span aria-hidden className="text-ink-3">→</span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

function DeckStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span aria-hidden className="h-[6px] w-[6px] rounded-full" style={{ background: color }} />
        <span className="label !text-[10px]">{label}</span>
      </div>
      <div className="mt-1 display text-[28px] leading-none tabular-nums text-ink">{value}</div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-16 border border-dashed border-line-2 px-8 py-14 text-center rounded-[4px]">
      <div className="display-italic text-[20px] text-ink-3">No incidents match.</div>
      <button
        onClick={onReset}
        className="mt-3 text-[12px] text-[color:var(--accent)] hover:underline"
      >
        Reset filters
      </button>
    </div>
  );
}

function todayLong() {
  return new Date()
    .toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    .toUpperCase();
}
