"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { IncidentGraph } from "@/components/incident-graph";
import {
  type Incident,
  fmtTimeAgo,
  severityConfig,
  statusConfig,
} from "@/lib/incidents";

/**
 * IncidentPanel — the real product component (landing rule 2).
 * Tabs across sample incidents, renders the React Flow graph for the
 * active one + a mini runbook preview. Same component the /app
 * incident-reader reuses inline.
 */
export function IncidentPanel({
  incidents,
  initialId,
}: {
  incidents: Incident[];
  initialId?: string;
}) {
  const [activeId, setActiveId] = useState<string>(
    initialId ?? incidents[0].id,
  );
  const [selectedCause, setSelectedCause] = useState<string | undefined>(
    undefined,
  );
  const active =
    incidents.find((i) => i.id === activeId) ?? incidents[0];
  const sev = severityConfig(active.severity);
  const st = statusConfig(active.status);

  return (
    <div className="border border-line bg-surface rounded-[4px] overflow-hidden">
      {/* Tabs */}
      <div className="flex items-stretch border-b border-line overflow-x-auto">
        {incidents.map((inc) => {
          const isActive = inc.id === activeId;
          const iSev = severityConfig(inc.severity);
          const iSt = statusConfig(inc.status);
          return (
            <button
              key={inc.id}
              onClick={() => {
                setActiveId(inc.id);
                setSelectedCause(undefined);
              }}
              className={[
                "shrink-0 min-w-[240px] text-left px-5 py-3.5 transition-colors border-r border-line last:border-r-0",
                isActive ? "bg-surface-2" : "bg-surface hover:bg-surface-2/60",
              ].join(" ")}
              style={
                isActive
                  ? { boxShadow: "inset 0 -2px 0 0 var(--accent)" }
                  : undefined
              }
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="mono text-[9.5px] font-semibold tracking-[0.12em]"
                  style={{ color: iSev.ink }}
                >
                  {iSev.label}
                </span>
                <span className="mono text-[10px] text-ink-3">
                  {inc.id.toUpperCase()}
                </span>
                <span className="flex-1" />
                <span
                  className="inline-flex items-center gap-1 mono text-[9.5px] tracking-[0.1em]"
                  style={{ color: iSt.ink }}
                >
                  <span
                    aria-hidden
                    className="h-[5px] w-[5px] rounded-full"
                    style={{ background: iSt.dot }}
                  />
                  {iSt.label}
                </span>
              </div>
              <div className="mt-1 text-[13px] text-ink leading-tight truncate">
                {inc.title}
              </div>
              <div className="mt-0.5 mono text-[10px] text-ink-3">
                {inc.service} · {fmtTimeAgo(inc.firedAt)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Header strip */}
      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 bg-surface-2/60">
          <div className="flex items-center gap-4">
            <img
              src={active.assignee.avatar}
              alt={active.assignee.name}
              className="h-9 w-9 rounded-full border border-line object-cover filter grayscale-[0.1]"
              loading="lazy"
            />
            <div>
              <div className="mono text-[10.5px] uppercase tracking-[0.08em] text-ink">
                {active.assignee.name}
              </div>
              <div className="text-[11.5px] text-ink-3">
                {active.assignee.role} · {active.service}
              </div>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span
              className="label !text-[9.5px]"
              style={{ color: sev.ink }}
            >
              {sev.label}
            </span>
            <span
              className="inline-flex items-center gap-1 mono text-[10px] tracking-[0.1em]"
              style={{ color: st.ink }}
            >
              <span
                aria-hidden
                className="h-[6px] w-[6px] rounded-full"
                style={{ background: st.dot }}
              />
              {st.label}
            </span>
            <span className="mono text-[10.5px] text-ink-3 tabular-nums">
              {fmtTimeAgo(active.firedAt)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px]">
          {/* Graph */}
          <div className="relative border-b md:border-b-0 md:border-r border-line" style={{ height: 440 }}>
            <IncidentGraph
              nodes={active.graph.nodes}
              edges={active.graph.edges}
              onSelectCause={(id) => setSelectedCause(id)}
              selectedCauseId={selectedCause}
            />
          </div>

          {/* Top cause + runbook preview */}
          <aside className="p-5 md:p-6 max-h-[440px] overflow-y-auto">
            {active.topCause && (
              <div className="border border-accent/40 bg-accent-soft/50 rounded-[4px] p-4">
                <div className="flex items-baseline justify-between">
                  <span className="label" style={{ color: "var(--accent)" }}>
                    TOP CAUSE · {active.topCause.confidence}%
                  </span>
                </div>
                <div className="display mt-2 text-[15px] text-ink leading-tight">
                  {active.topCause.title}
                </div>
                <p className="mt-1.5 text-[12px] text-ink-2 leading-[1.6]">
                  {active.topCause.rationale}
                </p>
              </div>
            )}

            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <span className="label">Runbook · {active.runbook.length}</span>
                <Link
                  href={`/app/${active.slug}/`}
                  className="mono text-[10px] text-ink-3 hover:text-[color:var(--accent)] transition-colors"
                >
                  open in app ↗
                </Link>
              </div>
              <ol className="mt-2.5 space-y-2">
                {active.runbook.slice(0, 3).map((s, i) => (
                  <li key={s.id} className="border border-line bg-surface rounded-[3px] px-3 py-2">
                    <div className="flex items-baseline gap-2">
                      <span className="mono text-[10px] text-ink-3 tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="text-[12.5px] text-ink leading-tight">
                        {s.label}
                      </span>
                      <span
                        className="mono text-[9.5px] tabular-nums"
                        style={{ color: s.confidence > 80 ? "var(--accent)" : "var(--ink-3)" }}
                      >
                        · {s.confidence}%
                      </span>
                    </div>
                    {s.snippet && (
                      <pre className="mt-1.5 mono text-[10.5px] text-ink-2 bg-surface-2 px-2 py-1.5 rounded-sm overflow-x-auto">
                        {s.snippet}
                      </pre>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
