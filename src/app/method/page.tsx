import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

export const metadata = {
  title: "Method · Salvo",
  description: "How Salvo turns alerts into an incident graph.",
};

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />
      <section className="mx-auto w-full max-w-[960px] px-6 pt-16 pb-10 md:px-10">
        <div className="flex items-baseline justify-between border-b border-ink pb-3">
          <span className="label">THE METHOD · SALVO v0.9</span>
          <span className="mono text-[10.5px] text-ink-3">APRIL MMXXVI</span>
        </div>
        <h1 className="display mt-10 text-[48px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[72px]">
          How it <span className="display-italic">correlates.</span>
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.75] text-ink-2">
          Six stages from alert firehose to drafted runbook. Every stage is
          inspectable; no stage hides behind an LLM call.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[960px] px-6 md:px-10 pb-16">
        <ol className="divide-y divide-line border-y border-line">
          <Stage num="01" label="Stream" title="Subscribe to alerts" body="Salvo connects to Prometheus, Datadog, Grafana, or a plain webhook. No agent to install; no sidecar to inject." />
          <Stage num="02" label="Cluster" title="Collapse correlated alerts" body="Temporal + service + label correlation; 42 alerts from one P0 event become one incident, not forty PagerDuty pages." />
          <Stage num="03" label="Graph" title="Build the incident graph" body="Alerts emit from services. Services depend on services. The graph is derived from your service mesh and deploy pipeline — not guessed." />
          <Stage num="04" label="Hypothesize" title="Score candidate causes" body="Deploys, schema migrations, traffic changes, upstream partial outages — each is a candidate with an evidence path and a confidence score. Salvo never picks one silently." />
          <Stage num="05" label="Draft" title="Write a runbook" body="For the top candidate, Salvo drafts an ordered runbook. Every step has a confidence score. Every mitigation is copy-to-clipboard; the agent never executes." />
          <Stage num="06" label="Sign" title="Timeline + postmortem stub" body="The incident closes with a signed timeline (who-did-what, salvo-vs-human) and a pre-populated postmortem doc. You write the narrative; Salvo owns the scaffolding." />
        </ol>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-6">
          <div>
            <div className="label">What we won&apos;t do</div>
            <ul className="mt-3 space-y-1.5 text-[13px] text-ink-2 max-w-[50ch]">
              <li>— Auto-mitigate. The agent never runs kubectl.</li>
              <li>— Auto-resolve. An incident closes when a human closes it.</li>
              <li>— Ship a cause without an evidence path.</li>
              <li>— Require a data-platform team to install us.</li>
            </ul>
          </div>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 bg-ink text-paper px-5 py-2.5 text-[13px] font-medium rounded-[4px] hover:bg-ink-2 transition-colors"
          >
            Open console
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

function Stage({ num, label, title, body }: { num: string; label: string; title: string; body: string }) {
  return (
    <li className="grid grid-cols-1 gap-4 py-6 md:grid-cols-[64px_160px_1fr] md:gap-10 md:py-8">
      <div className="mono text-[11px] tabular-nums text-ink-3 tracking-[0.14em] pt-1">{num}</div>
      <div><div className="label">{label}</div></div>
      <div>
        <h3 className="display text-[22px] leading-[1.2] tracking-[-0.01em] text-ink md:text-[26px]">
          {title}<span className="display-italic">.</span>
        </h3>
        <p className="mt-2 max-w-[58ch] text-[13.5px] leading-[1.75] text-ink-2">{body}</p>
      </div>
    </li>
  );
}
