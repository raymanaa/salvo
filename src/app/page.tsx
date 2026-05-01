import Link from "next/link";
import { HeroIncidentGraph } from "@/components/hero-incident-graph";
import { IncidentPanel } from "@/components/incident-panel";
import { MarketingFooter } from "@/components/marketing-footer";
import { INCIDENTS, fmtTimeAgo, severityConfig } from "@/lib/incidents";

/**
 * Salvo landing — ops-console-first grammar.
 *
 * NOT a marketing page with a hero. The screen *is* an incident room:
 * top status strip → a grid of live panels (active incidents, services,
 * service-level metrics) → a single long essay block under the fold
 * instead of a pillar grid. Marketing nav is collapsed into a bar; the
 * CTAs live inside the console chrome where they belong.
 */
export default function Landing() {
  const live = INCIDENTS[0];
  const resolved = INCIDENTS.slice(1);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      {/* ───── OPS STATUS BAR (replaces the marketing nav as the top chrome) ───── */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-2 md:px-6 text-[11.5px]">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/" className="flex items-baseline gap-1.5">
              <span className="display text-[16px] text-ink leading-none">Salvo</span>
              <span className="mono text-[9.5px] text-ink-3 tracking-[0.14em]">v0.9</span>
            </Link>
            <span aria-hidden className="h-4 w-px bg-line" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                aria-hidden
                className="relative inline-flex h-[7px] w-[7px] rounded-full alert-pulse"
                style={{ background: "var(--crit)" }}
              />
              <span className="mono text-[10.5px] tracking-[0.1em] truncate" style={{ color: "var(--crit)" }}>
                INC-2341 · P0 · CHECKOUT-API · MITIGATING
              </span>
              <span className="mono text-[10.5px] text-ink-3 shrink-0">
                — {fmtTimeAgo(live.firedAt)}
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link href="/method" className="text-ink-3 hover:text-ink transition-colors">Method</Link>
            <Link href="/security" className="text-ink-3 hover:text-ink transition-colors">Security</Link>
            <a
              href="https://github.com/raymanaa/salvo"
              target="_blank"
              rel="noopener"
              className="mono text-[10.5px] text-ink-3 hover:text-ink transition-colors"
            >
              gh:salvo
            </a>
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 bg-ink text-paper px-3 py-1 rounded-[3px] hover:bg-ink-2 transition-colors"
            >
              Open console
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ───── THE CONSOLE (full-bleed grid; the landing *is* the product) ───── */}
      <section className="relative">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 py-5 md:py-6">
          {/* Shift-handover line */}
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-3">
            <div>
              <span className="mono text-[9.5px] tracking-[0.14em] text-ink-3">
                {todayLongUTC()} · SHIFT HANDOVER · ON-CALL MAYA ALVES
              </span>
              <h1 className="display mt-1 text-[42px] leading-[0.98] tracking-[-0.016em] text-ink md:text-[58px]">
                The first ten minutes{" "}
                <span className="display-italic" style={{ color: "var(--accent)" }}>
                  decide the next six hours.
                </span>
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <Counter label="live" value="1" tone="crit" />
              <Counter label="resolved · 24h" value="7" tone="ok" />
            </div>
          </div>

          {/* Live incident board — 3-pane grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr_300px] md:gap-5">
            {/* LEFT: feed of active + recent incidents */}
            <aside className="order-2 md:order-1">
              <PanelHeader label="Feed · active & recent" />
              <ol className="border border-line bg-surface rounded-[3px] divide-y divide-line">
                <FeedItem incident={live} active />
                {resolved.map((r) => (
                  <FeedItem key={r.id} incident={r} />
                ))}
              </ol>

              <div className="mt-5">
                <PanelHeader label="Services · 12 watched" />
                <div className="border border-line bg-surface rounded-[3px] p-3 space-y-1.5">
                  {SERVICE_LIST.map((s) => (
                    <ServiceRow key={s.name} {...s} />
                  ))}
                </div>
              </div>
            </aside>

            {/* CENTER: the live incident graph (the whole board, not a "specimen") */}
            <div className="order-1 md:order-2 min-w-0">
              <PanelHeader label={`Incident graph · ${live.id.toUpperCase()}`} right={
                <span className="mono text-[10px] text-ink-3">
                  42 alerts · 3 services · 3 candidates
                </span>
              } />
              <div className="relative">
                <HeroIncidentGraph />
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricTile label="MTTR · 30d" value="14m" unit="mean" tone="accent" />
                <MetricTile label="First-responder accuracy" value="92%" unit="top-cause match" tone="accent" />
                <MetricTile label="Alerts → incidents" value="68×" unit="collapse ratio" tone="ink" />
              </div>
            </div>

            {/* RIGHT: proposed runbook + philosophy card */}
            <aside className="order-3 min-w-0">
              <PanelHeader label={`Runbook · top cause ${live.topCause?.confidence ?? 0}%`} />
              <div className="border border-line bg-surface rounded-[3px] p-4">
                <div
                  className="mono text-[9.5px] tracking-[0.14em]"
                  style={{ color: "var(--accent)" }}
                >
                  TOP CAUSE · {live.topCause?.confidence}%
                </div>
                <div className="display mt-1.5 text-[16px] leading-tight text-ink">
                  {live.topCause?.title}
                </div>
                <p className="mt-2 text-[11.5px] leading-[1.6] text-ink-2">
                  {live.topCause?.rationale}
                </p>

                <ol className="mt-4 border-t border-line pt-3 flex flex-col gap-2.5">
                  {live.runbook.slice(0, 3).map((s, i) => (
                    <li key={s.id}>
                      <div className="flex items-baseline gap-2">
                        <span className="mono text-[10px] text-ink-3 tabular-nums">0{i + 1}</span>
                        <span className="text-[12px] text-ink leading-tight">{s.label}</span>
                        <span
                          className="ml-auto mono text-[9.5px] tabular-nums"
                          style={{ color: s.confidence > 80 ? "var(--accent)" : "var(--warn)" }}
                        >
                          {s.confidence}%
                        </span>
                      </div>
                      {s.snippet && (
                        <pre className="mt-1 mono text-[10px] bg-surface-2 text-ink-2 px-2 py-1 rounded-sm overflow-x-auto">
{s.snippet}
                        </pre>
                      )}
                    </li>
                  ))}
                </ol>

                <Link
                  href={`/app/${live.slug}/`}
                  className="mt-4 inline-flex items-center gap-1 text-[11px] text-ink-3 hover:text-[color:var(--accent)] transition-colors"
                >
                  full runbook →
                </Link>
              </div>

              <div className="mt-5 border border-dashed border-line-2 bg-surface rounded-[3px] p-4">
                <div className="label">Console ethics</div>
                <p className="mt-2 display-italic text-[15px] leading-[1.5] text-ink">
                  The agent drafts. You execute.{" "}
                  <span className="text-ink-3">
                    Salvo never runs kubectl, never auto-resolves, never silently hides an alert.
                  </span>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ───── BELOW-THE-FOLD: a single essay block, no pillars, no testimonial ───── */}
      <section className="border-t border-line bg-surface-2/40">
        <div className="mx-auto max-w-[1100px] px-4 md:px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-10">
            <aside className="mono text-[10px] tracking-[0.14em] text-ink-3 space-y-4">
              <div>
                <div className="text-ink-2">§ I</div>
                <div>A note about alerts</div>
              </div>
              <div>
                <div className="text-ink-2">§ II</div>
                <div>How the graph is built</div>
              </div>
              <div>
                <div className="text-ink-2">§ III</div>
                <div>What the agent will not do</div>
              </div>
            </aside>

            <article className="max-w-[66ch] text-[15px] leading-[1.8] text-ink-2 space-y-6">
              <p>
                <strong className="text-ink">A note about alerts.</strong> A page at 3am is not a problem statement; it is
                a symptom of a system in the middle of telling you forty things
                at once. Most of those things are downstream of the one that
                matters. Salvo&apos;s job is to hand you the one that matters,
                on the first page, with a reason you can read in ninety
                seconds.
              </p>
              <p>
                <strong className="text-ink">How the graph is built.</strong> Every alert emits from a service;
                services depend on services; deploys and schema changes
                produce candidate causes. Salvo walks forward from alerts
                and backward from deploys and meets in the middle. The
                winner is not a verdict; it is a traversal, and the
                traversal itself is shown to you so you can disagree in
                public.
              </p>
              <p>
                <strong className="text-ink">What the agent will not do.</strong> It will not auto-resolve. It will
                not auto-mitigate. It will not run kubectl. It will not
                hide an alert to reduce noise. The phrase &ldquo;human in
                the loop&rdquo; is a commitment, not a marketing line — when
                you disable a confirmation prompt in any ops tool, the
                next incident proves why the prompt was there.
              </p>
              <p className="text-[14px] text-ink-3 italic">
                — Salvo is a portfolio pilot by Rayen Manaa. Not for production without an evaluation first. See /security for the honest list.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* A quieter "more incidents" exploration band — the inline specimen */}
      <section className="mx-auto max-w-[1440px] px-4 md:px-6 py-14 border-t border-line">
        <div className="mb-4 flex items-baseline justify-between">
          <PanelHeader label="Recent incidents · switch to explore" />
          <span className="mono text-[10px] text-ink-3">click a tab to load its graph</span>
        </div>
        <IncidentPanel incidents={INCIDENTS} />
      </section>

      <MarketingFooter />
    </div>
  );
}

function PanelHeader({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-2">
      <span className="label">{label}</span>
      {right}
    </div>
  );
}

function Counter({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "crit" | "ok";
}) {
  const color = tone === "crit" ? "var(--crit)" : "var(--ok)";
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="mono text-[22px] tabular-nums leading-none"
        style={{ color }}
      >
        {value}
      </span>
      <span className="mono text-[10px] text-ink-3 tracking-[0.12em] uppercase">
        {label}
      </span>
    </div>
  );
}

function FeedItem({
  incident,
  active,
}: {
  incident: (typeof INCIDENTS)[number];
  active?: boolean;
}) {
  const sev = severityConfig(incident.severity);
  return (
    <li>
      <Link
        href={`/app/${incident.slug}/`}
        className={[
          "block px-3 py-2.5 transition-colors hover:bg-paper-2/40",
          active ? "bg-accent-soft/40" : "",
        ].join(" ")}
      >
        <div className="flex items-baseline gap-2">
          <span
            className="mono text-[9.5px] font-semibold tracking-[0.14em]"
            style={{ color: sev.ink }}
          >
            {sev.label}
          </span>
          <span className="mono text-[9.5px] text-ink-3">{incident.id.toUpperCase()}</span>
          <span className="mono text-[9.5px] text-ink-3 ml-auto">
            {fmtTimeAgo(incident.firedAt)}
          </span>
        </div>
        <div className="mt-0.5 text-[12px] text-ink leading-tight">
          {incident.title}
        </div>
        <div className="mono text-[10px] text-ink-3">{incident.service}</div>
      </Link>
    </li>
  );
}

const SERVICE_LIST: { name: string; health: "ok" | "warn" | "crit" }[] = [
  { name: "checkout-api", health: "crit" },
  { name: "orders-svc", health: "warn" },
  { name: "postgres-primary", health: "warn" },
  { name: "auth-api", health: "ok" },
  { name: "search-api", health: "ok" },
  { name: "billing-worker", health: "ok" },
  { name: "cdn-edge", health: "ok" },
  { name: "mailer", health: "ok" },
  { name: "analytics-ingest", health: "ok" },
  { name: "redis-primary", health: "ok" },
  { name: "kafka-main", health: "ok" },
  { name: "notifier", health: "ok" },
];

function ServiceRow({ name, health }: { name: string; health: "ok" | "warn" | "crit" }) {
  const color =
    health === "crit" ? "var(--crit)" : health === "warn" ? "var(--warn)" : "var(--ok)";
  const bars = health === "crit" ? 2 : health === "warn" ? 5 : 8;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span
        aria-hidden
        className="h-[6px] w-[6px] rounded-full shrink-0"
        style={{ background: color }}
      />
      <span className="mono text-ink-2 truncate flex-1">{name}</span>
      <div aria-hidden className="flex items-end gap-[2px] h-[10px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="w-[2px]"
            style={{
              height: `${30 + Math.abs(Math.sin(i + name.length) * 60) + 10}%`,
              background: i < bars ? color : "var(--line)",
              opacity: i < bars ? 0.85 : 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit: string;
  tone: "accent" | "ink";
}) {
  return (
    <div className="border border-line bg-surface rounded-[3px] p-4">
      <div className="label">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span
          className="display text-[32px] leading-none tabular-nums"
          style={{ color: tone === "accent" ? "var(--accent)" : "var(--ink)" }}
        >
          {value}
        </span>
        <span className="mono text-[10.5px] text-ink-3 uppercase tracking-[0.1em]">
          {unit}
        </span>
      </div>
    </div>
  );
}

function todayLongUTC() {
  return new Date()
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}
