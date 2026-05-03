import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

export const metadata = {
  title: "Changelog · Salvo",
  description: "What has shipped. In order.",
};

const ENTRIES = [
  {
    date: "2026-04-23",
    tag: "v0.9.1",
    title: "Landing page — conversion pass",
    body:
      "Expanded the landing beyond the minimal MVP into a full conversion page. Same restraint; more surface.",
  },
  {
    date: "2026-04-21",
    tag: "v0.9.0",
    title: "Public beta — incident graph + runbook drafting",
    body:
      "React Flow incident graph with 4 node types, confidence-scored runbook with copy-to-clipboard, 3 seeded incidents. Light-theme ops console.",
  },
  {
    date: "2026-04-19",
    tag: "internal",
    title: "M0 design direction locked",
    body:
      "Ops-console-light palette, Instrument Sans + Bricolage Grotesque + JetBrains Mono. Signal blue accent, crimson for P0.",
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />
      <section className="flex-1">
        <div className="mx-auto max-w-[860px] px-6 md:px-10 pt-20 pb-16 md:pt-28">
          <div className="label">Changelog</div>
          <h1 className="display mt-4 text-[48px] leading-[1.05] tracking-[-0.016em] text-ink md:text-[68px]">
            What has shipped.{" "}
            <span className="display-italic" style={{ color: "var(--accent)" }}>
              In order.
            </span>
          </h1>
          <ol className="mt-12 divide-y divide-line border-y border-line">
            {ENTRIES.map((e) => (
              <li
                key={e.date}
                className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-10 py-7"
              >
                <div>
                  <div className="mono text-[12px] tabular-nums text-ink-2">{e.date}</div>
                  <div className="mono text-[10.5px] text-ink-3 tracking-[0.14em] mt-1">
                    {e.tag}
                  </div>
                </div>
                <div>
                  <div className="display text-[20px] text-ink leading-tight">{e.title}</div>
                  <p className="mt-2 text-[14px] leading-[1.65] text-ink-2 max-w-[60ch]">
                    {e.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Link
              href="/"
              className="mono text-[12px] text-ink-3 hover:text-ink transition-colors"
            >
              ← back to the console
            </Link>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
