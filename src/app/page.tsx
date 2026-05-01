import Link from "next/link";
import { HeroIncidentGraph } from "@/components/hero-incident-graph";
import { IncidentPanel } from "@/components/incident-panel";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";
import { INCIDENTS } from "@/lib/incidents";

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      {/* ────────── HERO ────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-6 pt-14 pb-10 md:px-8 md:pt-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.15fr_1fr] md:items-start md:gap-14">
            <div>
              <div className="label mb-4">ON-CALL INCIDENT COPILOT · V0.9</div>
              <h1 className="display text-[58px] leading-[0.95] tracking-[-0.022em] text-ink md:text-[96px]">
                Forty alerts.
                <br />
                <span className="display-italic text-ink-2">One incident.</span>
                <br />
                <span className="display">One rollback.</span>
              </h1>

              <p className="mt-6 max-w-[56ch] text-[15.5px] leading-[1.7] text-ink-2">
                Salvo watches your alert firehose, clusters correlated fires
                into a single incident, and proposes the top-three candidate
                root causes — with the runbook already drafted. Built for
                on-call engineers who&apos;d prefer to close the incident
                before standup.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] font-medium rounded-[4px] hover:bg-ink-2 transition-colors"
                >
                  <span>Open console</span>
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/app/inc-2341"
                  className="inline-flex items-center gap-2 border border-line bg-surface px-5 py-3 text-[14px] text-ink-2 rounded-[4px] hover:border-line-2 hover:text-ink transition-colors"
                >
                  Replay last P0
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-3 text-[11.5px] text-ink-3">
                <Stat value="42" unit="alerts → 1 incident" label="Correlation, not redundancy" />
                <Stat value="3m 10s" unit="to top cause" label="Faster than the second page" />
                <Stat value="100%" unit="actionable" label="Every tag links to a snippet" />
              </div>
            </div>

            {/* Right column: live incident summary card */}
            <aside className="relative">
              <LivePage />
            </aside>
          </div>

          {/* ─── THE ANIMATED HERO DIAGRAM ─── */}
          <div className="mt-16 md:mt-20">
            <HeroIncidentGraph />
          </div>
        </div>
      </section>

      {/* ────────── METHOD LEDE ────────── */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-8 pt-24 pb-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <div className="label">The method</div>
            <h2 className="display mt-3 text-[36px] leading-[1.05] tracking-[-0.018em] text-ink md:text-[52px]">
              Graph-first,{" "}
              <span className="display-italic">not alert-first.</span>
            </h2>
          </div>
          <div className="text-[14.5px] leading-[1.75] text-ink-2 max-w-[60ch] md:text-[15.5px]">
            Every incident is a graph. Alerts emit from services;
            services depend on other services; candidate causes explain
            the incident with varying confidence. Salvo draws the graph
            before it drafts the runbook — so the runbook isn&apos;t a
            guess, it&apos;s a traversal. Every edge is evidence. Every
            candidate has a score and a rationale.
          </div>
        </div>
      </section>

      {/* ────────── INLINE PRODUCT COMPONENT ────────── */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-8 pt-14 pb-10">
        <div className="mb-5 flex items-baseline justify-between">
          <div className="label">SPECIMEN · INCIDENT PANEL</div>
          <div className="label !tracking-[0.14em]">
            RENDERED FROM <span className="mono text-ink-2">/app</span> · NOT A SCREENSHOT
          </div>
        </div>
        <IncidentPanel incidents={INCIDENTS} />
        <p className="mt-5 text-[12.5px] leading-[1.65] text-ink-3 max-w-[60ch]">
          Same component rendered inside{" "}
          <span className="mono text-ink-2">/app/[incident]</span>. Tabs
          between three recent incidents; click a candidate cause node in
          the graph to highlight its evidence edge.
        </p>
      </section>

      {/* ────────── VALUES ────────── */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-8 pt-20 pb-4">
        <div className="max-w-[900px]">
          <div className="label">Not another &lsquo;AI-powered&rsquo; dashboard.</div>
          <h2 className="display mt-3 text-[36px] leading-[1.08] tracking-[-0.018em] text-ink md:text-[48px]">
            You keep the <span className="display-italic">last word.</span>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[14.5px] leading-[1.75] text-ink-2">
            Salvo never silently resolves an incident. Every proposed cause
            shows its rationale. Every runbook step shows confidence. Every
            snippet is copy-to-clipboard — you run it, not the agent.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Pillar
              num="01"
              title="Graph before verdict."
              body="A candidate cause without an evidence path is not a candidate. Salvo shows the traversal, not just the conclusion."
            />
            <Pillar
              num="02"
              title="Confidence, not certainty."
              body="Every cause and runbook step shows a confidence score. Salvo flags the ones it would pause before running."
            />
            <Pillar
              num="03"
              title="Copy, don't execute."
              body="The agent never runs kubectl. It drafts the command; you run it. A human is always in the loop."
            />
          </div>
        </div>
      </section>

      {/* ────────── CLOSING ────────── */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-8 pt-24 pb-4">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="label">First responder</div>
          <h2 className="display mt-4 text-[42px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[64px]">
            The first ten minutes{" "}
            <span className="display-italic">decide the next six hours.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-[1.7] text-ink-2">
            Open the console. Watch Salvo correlate. Keep the last word.
          </p>
          <div className="mt-8 inline-flex items-center gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 text-[14px] font-medium rounded-[4px] hover:bg-ink-2 transition-colors"
            >
              <span>Open console</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Stat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="min-w-0">
      <div className="display text-[30px] leading-none tabular-nums text-ink">
        {value}
        <span className="mono text-[11px] text-ink-3 ml-1 font-normal tabular-nums">
          {unit}
        </span>
      </div>
      <div className="mt-1 text-[11.5px] text-ink-3 max-w-[24ch]">{label}</div>
    </div>
  );
}

function Pillar({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div>
      <div className="mono text-[10.5px] text-ink-3 tabular-nums tracking-[0.16em]">{num}</div>
      <h3 className="display mt-2 text-[20px] leading-[1.2] tracking-[-0.008em] text-ink md:text-[22px]">
        {title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-2 max-w-[36ch]">{body}</p>
    </div>
  );
}

function LivePage() {
  return (
    <div className="border border-line bg-surface rounded-[4px] overflow-hidden shadow-[0_1px_0_rgba(15,17,21,0.04)]">
      <div className="flex items-baseline justify-between border-b border-line px-4 py-2.5 bg-surface-2/60">
        <span className="label">Live page</span>
        <span className="mono text-[10px] text-ink-3">apr 21 · 03:44 UTC</span>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span
            className="mono text-[9.5px] font-semibold tracking-[0.14em]"
            style={{ color: "var(--crit)" }}
          >
            P0
          </span>
          <span className="mono text-[9.5px] text-ink-3">INC-2341</span>
          <span className="flex-1" />
          <span className="inline-flex items-center gap-1">
            <span className="h-[6px] w-[6px] rounded-full" style={{ background: "var(--accent)" }} />
            <span className="mono text-[10px] text-[color:var(--accent)]">MITIGATING</span>
          </span>
        </div>
        <div className="mt-2 display text-[18px] text-ink leading-tight">
          Checkout 500s spiked — checkout-api
        </div>
        <div className="mt-0.5 mono text-[10.5px] text-ink-3">
          42 alerts clustered · 2m 44s ago
        </div>
      </div>
      <div className="border-t border-line">
        <AlertRow label="checkout-api 5xx > 2%" source="datadog · 18" tone="crit" />
        <AlertRow label="checkout-api p99 > 4s" source="prometheus · 9" tone="warn" />
        <AlertRow label="postgres replication lag" source="prometheus · 7" tone="warn" />
      </div>
      <div className="border-t border-line px-4 py-3 bg-surface-2/50">
        <div className="flex items-baseline justify-between">
          <span className="label" style={{ color: "var(--accent)" }}>
            TOP CAUSE · 92%
          </span>
          <span className="mono text-[10px] text-ink-3">rationale ↗</span>
        </div>
        <div className="mt-1 text-[13px] text-ink leading-tight">
          checkout-api@v412 deploy
        </div>
        <div className="mt-0.5 mono text-[10px] text-ink-3">
          3m 10s before first alert · Stripe retry regression
        </div>
      </div>
      <div className="border-t-2 border-ink px-4 py-2.5 flex items-center justify-between">
        <span className="mono text-[10px] text-ink-3 tracking-[0.12em]">
          RUNBOOK · 4 STEPS · 92%
        </span>
        <span className="inline-flex items-center gap-1 mono text-[10.5px] text-ink">
          rollback queued <span aria-hidden>→</span>
        </span>
      </div>
    </div>
  );
}

function AlertRow({
  label,
  source,
  tone,
}: {
  label: string;
  source: string;
  tone: "crit" | "warn";
}) {
  const color = tone === "crit" ? "var(--crit)" : "var(--warn)";
  return (
    <div className="flex items-baseline gap-3 border-t border-line first:border-t-0 px-4 py-2">
      <span
        aria-hidden
        className="h-[7px] w-[7px] rounded-full shrink-0 mt-[6px]"
        style={{ background: color, boxShadow: `0 0 0 3px ${color}22` }}
      />
      <span className="text-[12px] text-ink leading-tight flex-1 truncate">
        {label}
      </span>
      <span className="mono text-[10px] text-ink-3 tabular-nums">{source}</span>
    </div>
  );
}
