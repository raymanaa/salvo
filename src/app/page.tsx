import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";
import { INCIDENTS, fmtTimeAgo, severityConfig } from "@/lib/incidents";

export default function Landing() {
  const live = INCIDENTS[0];
  const recent = INCIDENTS.slice(1, 3);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section>
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
      </section>

      {/* ── NUMBERS ──────────────────────────────────────────────────────── */}
      <section className="border-y border-line">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat n="42 → 1"     label="Alerts collapsed per incident" />
          <Stat n="3m 10s"     label="Median to top-cause proposal" />
          <Stat n="0"          label="Commands the agent runs itself" />
          <Stat n="92%"        label="Top-cause hit rate on replay" />
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
      <Section label="The 3 AM problem">
        <p className="display-italic text-[30px] leading-[1.25] text-ink max-w-[34ch] md:text-[42px]">
          A page at 3 AM is not a problem statement. It is a symptom of a system telling you forty things at once.
        </p>
        <p className="mt-6 max-w-[60ch] text-[15px] leading-[1.7] text-ink-2">
          Most of those forty are downstream of the one that matters. On-call spends the first ten minutes de-duping Slack channels, pulling up dashboards, and asking the same question: <em>which deploy broke this?</em> Salvo answers it first, in writing, with evidence.
        </p>
      </Section>

      {/* ── WORKFLOW ─────────────────────────────────────────────────────── */}
      <Section label="The workflow">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <Move n="01" verb="Ingest" detail="Prometheus, Datadog, Grafana, or plain webhook. No agent to install; no sidecar to inject." />
          <Move n="02" verb="Cluster" detail="Temporal + service + label correlation. 42 alerts → 1 incident, not 42 PagerDuty pages." />
          <Move n="03" verb="Hypothesize" detail="Every candidate cause has an evidence path on the graph. Salvo never picks silently." />
          <Move n="04" verb="Draft" detail="A runbook, confidence-scored. Every mitigation step is copy-to-clipboard; the agent never executes." />
          <Move n="05" verb="Sign" detail="Signed timeline + postmortem stub. You write the narrative; Salvo owns the scaffolding." />
        </ol>
      </Section>

      {/* ── SIGNATURE MOVES ──────────────────────────────────────────────── */}
      <Section label="Three things only Salvo does">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            title="Graph-first, not alert-first."
            body="A cause without an evidence path is not a cause. The traversal is shown to you so you can disagree in public."
          />
          <Feature
            title="Confidence on every step."
            body="Top-cause and runbook both carry a score. Salvo flags the ones it would pause before running."
          />
          <Feature
            title="Copy, do not execute."
            body="The agent drafts kubectl. You paste it. A human is always in the loop."
          />
        </div>
      </Section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────────── */}
      <Section label="Made for">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px] leading-[1.65] text-ink-2">
          <Persona title="The rotating on-call">
            One of eight in the rotation. First ten minutes set the tone. Salvo makes the first ten minutes a read, not a triage.
          </Persona>
          <Persona title="The SRE lead">
            Reads postmortems on Monday. Wants the scaffolding standard and the narrative human.
          </Persona>
          <Persona title="The founder-engineer">
            No dedicated on-call yet. Every page goes to the same phone. Salvo is the first responder that keeps that phone usable.
          </Persona>
        </ul>
      </Section>

      {/* ── RECENT ───────────────────────────────────────────────────────── */}
      <Section label="Recent incidents" right={<Link href="/app" className="mono text-[11px] text-ink-3 hover:text-ink transition-colors">all →</Link>}>
        <ul className="border-y border-line divide-y divide-line">
          {[live, ...recent].map((inc) => {
            const sev = severityConfig(inc.severity);
            return (
              <li key={inc.id}>
                <Link href={`/app/${inc.slug}/`} className="group grid grid-cols-[auto_1fr_auto] gap-5 py-4 items-baseline hover:bg-paper-2/40 transition-colors px-1">
                  <span className="mono text-[10.5px] font-semibold tracking-[0.14em]" style={{ color: sev.ink }}>
                    {sev.label}
                  </span>
                  <div>
                    <div className="text-[14px] text-ink leading-tight">{inc.title}</div>
                    <div className="mono text-[10px] text-ink-3 mt-0.5">{inc.service} · {fmtTimeAgo(inc.firedAt)}</div>
                  </div>
                  <span className="mono text-[10.5px] text-ink-3 group-hover:text-ink">open →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ── VOICE ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-16">
        <blockquote className="border-l-2 border-ink pl-6 max-w-[60ch]">
          <p className="display-italic text-[28px] leading-[1.3] text-ink md:text-[34px]">
            &ldquo;The first ten minutes used to be: open six tabs, join three channels, ask who deployed. Now it is: read one page.&rdquo;
          </p>
          <footer className="mt-4 smallcaps mono text-[11px] text-ink-3 tracking-[0.14em]">
            — Maya A. · SRE lead · &lt;internal replay · not a customer&gt;
          </footer>
        </blockquote>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section label="Questions">
        <dl className="divide-y divide-line border-y border-line">
          <Faq q="Does Salvo auto-resolve incidents?">
            No. The agent never closes an incident and never runs kubectl. It drafts a runbook; a human runs each step.
          </Faq>
          <Faq q="Which alert sources are supported?">
            Prometheus, Datadog, Grafana, and plain HTTP webhooks at v0.9. PagerDuty and Opsgenie integrations are tracked in /changelog.
          </Faq>
          <Faq q="How does the graph get built?">
            From your service-mesh + deploy-pipeline metadata. Salvo does not guess — services must already publish dependency edges somewhere.
          </Faq>
          <Faq q="What happens on a low-confidence top cause?">
            Salvo still proposes a runbook but marks the step confidence below 60% in warn-amber. The operator is expected to pause before running.
          </Faq>
          <Faq q="Is it safe for production?">
            Salvo is in alpha. See /security for the honest list of what is and is not hardened.
          </Faq>
        </dl>
      </Section>

      {/* ── SECOND CTA ───────────────────────────────────────────────────── */}
      <section className="border-t-2 border-ink">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 text-center">
          <div className="label">Start</div>
          <h2 className="display mt-3 text-[40px] leading-[1.05] tracking-[-0.016em] text-ink md:text-[54px]">
            Read the next incident{" "}
            <span className="display-italic" style={{ color: "var(--accent)" }}>
              before standup.
            </span>
          </h2>
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
      </section>

      <MarketingFooter />
    </div>
  );
}

function Section({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16">
        <div className="flex items-baseline justify-between border-b border-line pb-3 mb-8">
          <span className="label">{label}</span>
          {right}
        </div>
        {children}
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="display text-[28px] leading-none tabular-nums text-ink md:text-[32px]">
        {n}
      </div>
      <div className="mt-2 text-[11.5px] leading-[1.45] text-ink-3 max-w-[28ch]">
        {label}
      </div>
    </div>
  );
}

function Move({ n, verb, detail }: { n: string; verb: string; detail: string }) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-4 items-baseline">
      <span className="mono text-[11px] text-ink-3 tabular-nums tracking-[0.16em]">{n}</span>
      <div>
        <div className="display text-[22px] leading-none text-ink">{verb}.</div>
        <div className="mt-1 text-[13.5px] leading-[1.6] text-ink-2 max-w-[40ch]">{detail}</div>
      </div>
    </li>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="display text-[20px] leading-[1.2] text-ink">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-2 max-w-[36ch]">{body}</p>
    </div>
  );
}

function Persona({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="border-t-2 border-ink pt-3">
      <div className="display text-[18px] leading-tight text-ink">{title}</div>
      <p className="mt-2 max-w-[36ch]">{children}</p>
    </li>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 md:gap-10 py-5">
      <dt className="display text-[17px] text-ink leading-tight">{q}</dt>
      <dd className="text-[14px] leading-[1.7] text-ink-2 max-w-[62ch]">{children}</dd>
    </div>
  );
}
