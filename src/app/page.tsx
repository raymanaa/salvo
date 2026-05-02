import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";
import { INCIDENTS } from "@/lib/incidents";

export default function Landing() {
  const live = INCIDENTS[0];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      <section className="flex-1">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 pt-24 pb-20 md:pt-32">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-16">
            <div>
              <div className="label">On-call incident copilot</div>
              <h1 className="display mt-5 text-[64px] leading-[0.96] tracking-[-0.02em] md:text-[88px]">
                Forty alerts.{" "}
                <span className="display-italic" style={{ color: "var(--accent)" }}>
                  One incident.
                </span>
              </h1>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.6] text-ink-2">
                Salvo clusters your alerts, proposes the root cause, and drafts the runbook.
              </p>
              <div className="mt-8">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] rounded-[4px] hover:bg-ink-2 transition-colors"
                >
                  Open console
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            {/* Single incident summary — lifted from /app's top-cause pattern */}
            <div className="border border-line bg-surface rounded-[4px] p-5">
              <div className="flex items-baseline justify-between">
                <span
                  className="mono text-[10px] font-semibold tracking-[0.14em]"
                  style={{ color: "var(--crit)" }}
                >
                  P0 · INC-2341
                </span>
                <span className="mono text-[10px] text-ink-3">2m 44s ago</span>
              </div>
              <div className="display mt-2 text-[20px] leading-tight text-ink">
                {live.title}
              </div>
              <div className="mono mt-1 text-[11px] text-ink-3">
                42 alerts clustered · {live.service}
              </div>
              <div className="rule my-4" />
              <div className="mono text-[10px] tracking-[0.14em]" style={{ color: "var(--accent)" }}>
                TOP CAUSE · {live.topCause?.confidence}%
              </div>
              <div className="mt-1 text-[13px] text-ink leading-tight">
                {live.topCause?.title}
              </div>
              <div className="mt-3 mono text-[10.5px] text-ink-3">
                runbook · 4 steps · rollback queued
              </div>
            </div>
          </div>
        </div>

        <div className="border-y border-line">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Step n="01" verb="Cluster" detail="40 alerts → 1 incident" />
            <Step n="02" verb="Propose" detail="Top cause with rationale" />
            <Step n="03" verb="Draft" detail="Runbook, copy to clipboard" />
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Step({ n, verb, detail }: { n: string; verb: string; detail: string }) {
  return (
    <div>
      <div className="mono text-[10.5px] text-ink-3 tracking-[0.16em]">{n}</div>
      <div className="display mt-1 text-[24px] leading-none text-ink">{verb}.</div>
      <div className="mt-1 text-[13px] text-ink-2">{detail}</div>
    </div>
  );
}
