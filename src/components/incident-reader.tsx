"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IncidentGraph } from "@/components/incident-graph";
import {
  type Incident,
  type RunbookStep,
  fmtTimeAgo,
  severityConfig,
  statusConfig,
} from "@/lib/incidents";

export function IncidentReader({ incident }: { incident: Incident }) {
  const [selectedCause, setSelectedCause] = useState<string | undefined>();
  const sev = severityConfig(incident.severity);
  const st = statusConfig(incident.status);

  return (
    <div className="mx-auto max-w-[1440px] px-6 pt-6 pb-24 md:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="label !text-[10px]">All incidents</span>
        </Link>
        <span
          className="inline-flex items-center gap-1.5 mono text-[10.5px] tracking-[0.12em]"
          style={{ color: st.ink }}
        >
          <span
            aria-hidden
            className="h-[7px] w-[7px] rounded-full"
            style={{ background: st.dot }}
          />
          {st.label}
        </span>
      </div>

      {/* Header */}
      <header className="pt-8 pb-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <span
            className="mono text-[11px] font-semibold tracking-[0.12em]"
            style={{ color: sev.ink }}
          >
            {sev.label}
          </span>
          <span className="mono text-[11px] text-ink-3">{incident.id.toUpperCase()}</span>
          <span className="mono text-[11px] text-ink-3">
            fired {fmtTimeAgo(incident.firedAt)}
          </span>
          {incident.resolvedAt && (
            <span className="mono text-[11px] text-[color:var(--ok)]">
              resolved {fmtTimeAgo(incident.resolvedAt)}
            </span>
          )}
        </div>
        <h1 className="display mt-3 text-[40px] leading-[0.98] tracking-[-0.02em] text-ink md:text-[58px]">
          {incident.title}
        </h1>
        <p className="display-italic mt-2 text-[17px] text-ink-2 md:text-[20px]">
          {incident.service} · {incident.assignee.name}, {incident.assignee.role}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
        <div className="min-w-0">
          {/* Graph */}
          <div className="border border-line bg-surface rounded-[4px] overflow-hidden">
            <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
              <span className="label">Incident graph</span>
              <span className="mono text-[10.5px] text-ink-3">
                {incident.graph.nodes.length} nodes · {incident.graph.edges.length} edges
              </span>
            </div>
            <div style={{ height: 520 }}>
              <IncidentGraph
                nodes={incident.graph.nodes}
                edges={incident.graph.edges}
                onSelectCause={setSelectedCause}
                selectedCauseId={selectedCause}
              />
            </div>
          </div>

          {/* Summary */}
          <section className="mt-10">
            <div className="label">Summary</div>
            <p className="display-italic mt-3 text-[19px] leading-[1.55] text-ink max-w-[68ch] md:text-[22px]">
              {incident.summary}
            </p>
          </section>

          {/* Source alerts */}
          <section className="mt-10">
            <div className="flex items-baseline justify-between border-b border-line pb-2">
              <div className="label">Source alerts · {incident.sourceAlerts.length}</div>
              <span className="mono text-[10.5px] text-ink-3">
                {incident.sourceAlerts.reduce((a, x) => a + x.count, 0)} fires
              </span>
            </div>
            <ol className="mt-3 divide-y divide-line border-y border-line">
              {incident.sourceAlerts.map((a) => (
                <li key={a.id} className="grid grid-cols-[36px_1fr_auto] items-start gap-3 py-3">
                  <span className="mono text-[10.5px] text-ink-3 tabular-nums pt-0.5">
                    ×{a.count}
                  </span>
                  <div>
                    <div className="text-[13px] text-ink leading-tight">{a.name}</div>
                    <div className="mono text-[10px] text-ink-3">
                      {a.source} · {fmtTimeAgo(a.firstFiredAt)}
                    </div>
                    {a.note && (
                      <div className="text-[11.5px] text-ink-3 italic mt-0.5">{a.note}</div>
                    )}
                  </div>
                  <span className="mono text-[10px] text-ink-3 uppercase tracking-[0.12em] pt-0.5">
                    {a.source}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Timeline */}
          <section className="mt-10">
            <div className="flex items-baseline justify-between border-b border-line pb-2">
              <div className="label">Timeline</div>
              <span className="mono text-[10.5px] text-ink-3">
                {incident.timeline.length} events
              </span>
            </div>
            <ol className="mt-3 border-l-2 border-line pl-4">
              {incident.timeline.map((e, i) => (
                <li key={i} className="relative pb-4 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[22px] top-[5px] h-[9px] w-[9px] rounded-full border-2 border-surface"
                    style={{
                      background:
                        e.actor === "salvo" ? "var(--accent)" : "var(--ink)",
                    }}
                  />
                  <div className="flex items-baseline gap-2">
                    <span
                      className="mono text-[9.5px] tracking-[0.1em]"
                      style={{
                        color:
                          e.actor === "salvo" ? "var(--accent)" : "var(--ink)",
                      }}
                    >
                      {e.actor === "salvo" ? "SALVO" : e.who?.toUpperCase() ?? "HUMAN"}
                    </span>
                    <span className="mono text-[10px] text-ink-3 tabular-nums">
                      {new Date(e.atIso).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: "UTC",
                      })}{" "}
                      UTC
                    </span>
                  </div>
                  <div className="text-[13px] text-ink leading-tight mt-0.5">{e.label}</div>
                  {e.detail && (
                    <div className="text-[11.5px] text-ink-3 mt-0.5">{e.detail}</div>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Right rail — top cause + runbook */}
        <aside className="min-w-0">
          <div className="lg:sticky lg:top-20 flex flex-col gap-5">
            {incident.topCause && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-accent bg-accent-soft/50 rounded-[4px] p-4"
              >
                <div className="label" style={{ color: "var(--accent)" }}>
                  TOP CAUSE · {incident.topCause.confidence}%
                </div>
                <div className="display mt-2 text-[17px] text-ink leading-tight">
                  {incident.topCause.title}
                </div>
                <p className="mt-2 text-[12.5px] leading-[1.65] text-ink-2">
                  {incident.topCause.rationale}
                </p>
              </motion.div>
            )}

            <div>
              <div className="label">Runbook · {incident.runbook.length}</div>
              <ol className="mt-3 flex flex-col gap-2.5">
                {incident.runbook.map((step, i) => (
                  <RunbookCard key={step.id} step={step} num={i + 1} />
                ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RunbookCard({ step, num }: { step: RunbookStep; num: number }) {
  const [copied, setCopied] = useState(false);
  const accent =
    step.confidence > 80
      ? "var(--accent)"
      : step.confidence > 50
        ? "var(--warn)"
        : "var(--ink-3)";

  return (
    <li className="border border-line bg-surface rounded-[4px] px-3.5 py-3">
      <div className="flex items-baseline gap-2">
        <span className="mono text-[10px] text-ink-3 tabular-nums">0{num}</span>
        <span
          className="mono text-[9.5px] font-semibold tracking-[0.14em]"
          style={{ color: accent }}
        >
          {step.kind.toUpperCase()} · {step.confidence}%
        </span>
      </div>
      <div className="mt-1 text-[13px] text-ink leading-tight">{step.label}</div>
      <p className="mt-1 text-[11.5px] text-ink-3 leading-[1.55]">{step.detail}</p>

      {step.snippet && (
        <div className="relative mt-2">
          <pre className="mono text-[10.5px] text-ink-2 bg-surface-2 px-2.5 py-2 rounded-sm overflow-x-auto pr-10">
            {step.snippet}
          </pre>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(step.snippet ?? "");
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              } catch { /* noop */ }
            }}
            className="absolute top-1.5 right-1.5 inline-flex items-center justify-center h-6 w-6 border border-line bg-surface hover:border-line-2 transition-colors rounded-sm"
            aria-label="Copy snippet"
          >
            {copied ? (
              <Check className="h-3 w-3" strokeWidth={2} style={{ color: "var(--ok)" }} />
            ) : (
              <Copy className="h-3 w-3 text-ink-3" strokeWidth={1.75} />
            )}
          </button>
        </div>
      )}
    </li>
  );
}
