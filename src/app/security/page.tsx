import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

export const metadata = { title: "Security · Salvo" };

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />
      <section className="mx-auto w-full max-w-[960px] px-6 pt-16 pb-10 md:px-10">
        <div className="flex items-baseline justify-between border-b border-ink pb-3">
          <span className="label">SECURITY · ALPHA DISCLOSURE</span>
          <span className="mono text-[10.5px] text-ink-3">APRIL MMXXVI</span>
        </div>
        <h1 className="display mt-10 text-[48px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[64px]">
          Honest about <span className="display-italic">alpha.</span>
        </h1>
        <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.75] text-ink-2">
          Salvo is a portfolio pilot. The posture below is what we actually
          have today. Regulated teams should wait for v2.
        </p>
      </section>
      <section className="mx-auto w-full max-w-[960px] px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <Section title="Access to your systems">
            <ul className="space-y-2 text-[13px] leading-[1.7] text-ink-2">
              <li>— Read-only connection to your alerting platform.</li>
              <li>— No write permissions to your infra. The agent cannot run commands.</li>
              <li>— No SSH key handling. No kubeconfig ingestion.</li>
              <li>— All mitigation snippets are presented to a human for execution.</li>
            </ul>
          </Section>
          <Section title="Alert data">
            <ul className="space-y-2 text-[13px] leading-[1.7] text-ink-2">
              <li>— Alert metadata is retained for the duration of the incident plus 90 days.</li>
              <li>— Your alerts are never used to train a shared model.</li>
              <li>— No cross-tenant correlation; each team&apos;s graph is isolated.</li>
            </ul>
          </Section>
          <Section title="What we don't have">
            <ul className="space-y-2 text-[13px] leading-[1.7] text-ink-2">
              <li>— SOC 2 attestation.</li>
              <li>— Regional data-residency options.</li>
              <li>— Air-gapped / VPC deployment.</li>
            </ul>
          </Section>
          <Section title="Human-in-the-loop">
            <ul className="space-y-2 text-[13px] leading-[1.7] text-ink-2">
              <li>— Every runbook step shows a confidence score.</li>
              <li>— Auto-resolve is disabled. Closing an incident is a human action.</li>
              <li>— Every salvo timeline event is labeled SALVO vs HUMAN.</li>
            </ul>
          </Section>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-5 text-[12px] text-ink-3">
          <span className="mono tracking-[0.14em]">SECURITY CONTACT · security@salvo.alpha</span>
          <span className="mono">last updated · 2026-04-21</span>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="display text-[22px] leading-[1.2] tracking-[-0.01em] text-ink md:text-[26px]">
        {title}<span className="display-italic">.</span>
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
