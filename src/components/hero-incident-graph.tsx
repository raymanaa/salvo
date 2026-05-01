"use client";

/**
 * HeroIncidentGraph — the animated project-diagram for Salvo's landing.
 *
 * Rule 2: project-specific animated diagram. This is a hand-rolled SVG
 * incident graph on a 12s loop — alerts fire (top-left with pulse),
 * correlation edges draw themselves to a central incident node,
 * then three candidate root-cause nodes stream in on the right with
 * dashed "inferring" edges that solidify for the winning candidate.
 */
export function HeroIncidentGraph() {
  return (
    <div className="relative w-full">
      <div className="relative mx-auto max-w-[1100px] border border-line bg-surface overflow-hidden rounded-[4px]">
        {/* Studio top-bar */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3 bg-surface-2">
          <div className="flex items-center gap-3">
            <span aria-hidden className="relative inline-flex h-[9px] w-[9px]">
              <span className="absolute inset-0 rounded-full alert-pulse" style={{ background: "var(--crit)" }} />
              <span className="relative h-[9px] w-[9px] rounded-full" style={{ background: "var(--crit)" }} />
            </span>
            <span className="mono text-[10.5px] text-ink-2 tracking-[0.12em]">
              INC-2341 · P0 · CHECKOUT-API · LIVE DRAFTING
            </span>
          </div>
          <span className="label !text-[9.5px]">SALVO v0.9</span>
        </div>

        <div className="relative aspect-[16/8] md:aspect-[16/7]">
          <svg
            viewBox="0 0 1100 560"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
              </marker>
              <filter id="softshadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* Background dot grid */}
            <g>
              {Array.from({ length: 24 }).map((_, r) =>
                Array.from({ length: 48 }).map((__, c) => (
                  <circle
                    key={`${r}-${c}`}
                    cx={c * 24 + 12}
                    cy={r * 24 + 12}
                    r={0.7}
                    fill="var(--line-2)"
                  />
                )),
              )}
            </g>

            {/* Edges (alerts → services → incident → causes) */}
            <g fill="none" strokeLinecap="round">
              {/* Alert → service */}
              <AnimatedEdge d="M 170 80 Q 260 80, 340 150" delay="1.4s" />
              <AnimatedEdge d="M 170 240 L 340 240" delay="1.8s" />
              <AnimatedEdge d="M 170 400 Q 260 400, 340 320" delay="2.2s" />

              {/* Service → incident */}
              <AnimatedEdge d="M 500 150 Q 590 150, 640 260" delay="3.0s" accent />
              <AnimatedEdge d="M 500 240 L 640 275" delay="3.4s" accent />
              <AnimatedEdge d="M 500 320 Q 590 320, 640 290" delay="3.8s" accent />

              {/* Incident → causes */}
              <AnimatedEdge d="M 820 275 Q 880 240, 930 140" delay="5.0s" dashed />
              <AnimatedEdge d="M 820 275 L 930 275" delay="5.4s" dashed />
              <AnimatedEdge d="M 820 275 Q 880 310, 930 410" delay="5.8s" dashed />

              {/* Winning cause → solidifies */}
              <path
                d="M 820 275 Q 880 240, 930 140"
                className="winner-edge"
                stroke="var(--accent)"
                strokeWidth="2.5"
                fill="none"
              />
            </g>

            {/* Alerts */}
            <AlertPip x={70} y={80}  label="5xx > 2%"     sev="P0" delay="1.0s" />
            <AlertPip x={70} y={240} label="p99 > 4s"     sev="P1" delay="1.4s" />
            <AlertPip x={70} y={400} label="replica lag"  sev="P1" delay="1.8s" />

            {/* Services */}
            <ServicePip x={340} y={150} label="checkout-api" meta="v412 · 3m" delay="2.4s" />
            <ServicePip x={340} y={240} label="orders-svc"   meta="v88"       delay="2.8s" />
            <ServicePip x={340} y={320} label="postgres"     meta="16.3"      delay="3.2s" />

            {/* Incident node (center) */}
            <IncidentPip x={640} y={240} delay="4.0s" />

            {/* Causes (right) */}
            <CausePip x={930} y={70}  label="v412 deploy"     score={92} delay="5.4s" tone="accent" />
            <CausePip x={930} y={240} label="payments lock"   score={48} delay="5.8s" tone="warn" />
            <CausePip x={930} y={410} label="traffic surge"   score={12} delay="6.2s" tone="muted" />

            {/* Final seal — "salvo proposes rollback" */}
            <g className="seal" transform="translate(870 480)">
              <rect x={0} y={0} rx={3} ry={3} width={200} height={34} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
              <text
                x={100}
                y={22}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={11}
                letterSpacing="0.12em"
                fill="var(--accent)"
                fontWeight={600}
              >
                ROLLBACK · PROPOSED
              </text>
            </g>
          </svg>
        </div>

        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[11px] text-ink-3">
          <span className="mono">
            <span style={{ color: "var(--crit)" }}>●</span> 3 alerts &nbsp;
            <span style={{ color: "var(--ink-2)" }}>●</span> 3 services &nbsp;
            <span style={{ color: "var(--accent)" }}>●</span> 3 candidates
          </span>
          <span className="mono tracking-[0.12em]">PIPELINE v0.9 · signal ok</span>
        </div>
      </div>

      <style>{`
        /* 14s master loop */
        .pip { opacity: 0; animation: pip-life 14s linear infinite both; }
        @keyframes pip-life {
          0%, 3%    { opacity: 0; transform: translateY(4px); }
          8%        { opacity: 1; transform: translateY(0); }
          88%       { opacity: 1; transform: translateY(0); }
          94%, 100% { opacity: 0; transform: translateY(-2px); }
        }
        .alert-pip rect { stroke-dasharray: 2 0; }
        .alert-pip .halo {
          transform-box: fill-box;
          transform-origin: center;
          animation: alert-halo 1.4s ease-out infinite;
        }
        @keyframes alert-halo {
          0%   { opacity: 0.5; r: 4; }
          100% { opacity: 0;   r: 18; }
        }
        .edge-path {
          stroke: var(--line-2);
          stroke-width: 1.5;
          stroke-dasharray: 240 240;
          stroke-dashoffset: 240;
          animation: edge-draw 14s linear infinite both;
          fill: none;
        }
        .edge-path.accent  { stroke: var(--ink-4); stroke-width: 1.8; }
        .edge-path.dashed  {
          stroke: var(--ink-4);
          stroke-dasharray: 5 4;
          stroke-dashoffset: 0;
          opacity: 0;
          animation: edge-fade 14s linear infinite both;
        }
        @keyframes edge-draw {
          0%, 8%    { stroke-dashoffset: 240; opacity: 0; }
          12%       { opacity: 1; }
          28%       { stroke-dashoffset: 0;   opacity: 1; }
          88%       { stroke-dashoffset: 0;   opacity: 1; }
          94%, 100% { stroke-dashoffset: 0;   opacity: 0; }
        }
        @keyframes edge-fade {
          0%, 32%   { opacity: 0; }
          38%       { opacity: 1; }
          88%       { opacity: 1; }
          94%, 100% { opacity: 0; }
        }

        .winner-edge {
          stroke-dasharray: 260 260;
          stroke-dashoffset: 260;
          opacity: 0;
          animation: winner-life 14s linear infinite both;
          filter: drop-shadow(0 0 6px rgba(37, 99, 235, 0.35));
        }
        @keyframes winner-life {
          0%, 48%   { stroke-dashoffset: 260; opacity: 0; }
          54%       { opacity: 1; }
          66%       { stroke-dashoffset: 0;   opacity: 1; }
          88%       { stroke-dashoffset: 0;   opacity: 1; }
          94%, 100% { opacity: 0; }
        }

        .seal {
          opacity: 0;
          transform: translate(870px, 480px) scale(0.9);
          transform-origin: center;
          animation: seal-life 14s linear infinite both;
        }
        @keyframes seal-life {
          0%, 70%  { opacity: 0; }
          76%      { opacity: 1; }
          88%      { opacity: 1; }
          94%, 100%{ opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function AnimatedEdge({
  d,
  delay,
  accent,
  dashed,
}: {
  d: string;
  delay: string;
  accent?: boolean;
  dashed?: boolean;
}) {
  return (
    <path
      className={["edge-path", accent && "accent", dashed && "dashed"]
        .filter(Boolean)
        .join(" ")}
      d={d}
      style={{ animationDelay: delay }}
    />
  );
}

function AlertPip({
  x,
  y,
  label,
  sev,
  delay,
}: {
  x: number;
  y: number;
  label: string;
  sev: "P0" | "P1";
  delay: string;
}) {
  const color = sev === "P0" ? "var(--crit)" : "var(--warn)";
  return (
    <g className="pip alert-pip" transform={`translate(${x - 100} ${y - 24})`} style={{ animationDelay: delay }}>
      <circle cx={8} cy={24} r={4} fill={color} className="halo" />
      <rect x={0} y={0} width={170} height={48} rx={4} ry={4} fill="var(--surface)" stroke={color} strokeWidth="1.25" filter="url(#softshadow)" />
      <text x={16} y={20} fontFamily="var(--font-mono)" fontSize={9.5} letterSpacing="0.08em" fill={color} fontWeight={600}>
        {sev} · ALERT
      </text>
      <text x={16} y={36} fontFamily="var(--font-sans)" fontSize={12} fill="var(--ink)">
        {label}
      </text>
    </g>
  );
}

function ServicePip({ x, y, label, meta, delay }: { x: number; y: number; label: string; meta: string; delay: string }) {
  return (
    <g className="pip" transform={`translate(${x - 80} ${y - 22})`} style={{ animationDelay: delay }}>
      <rect x={0} y={0} width={160} height={44} rx={4} ry={4} fill="var(--surface-2)" stroke="var(--line-2)" />
      <text x={14} y={18} fontFamily="var(--font-mono)" fontSize={9} letterSpacing="0.14em" fill="var(--ink-3)" fontWeight={500}>
        SERVICE
      </text>
      <text x={14} y={32} fontFamily="var(--font-sans)" fontSize={12} fill="var(--ink)" fontWeight={500}>
        {label}
      </text>
      <text x={156} y={32} fontFamily="var(--font-mono)" fontSize={9} fill="var(--ink-3)" textAnchor="end">
        {meta}
      </text>
    </g>
  );
}

function IncidentPip({ x, y, delay }: { x: number; y: number; delay: string }) {
  return (
    <g className="pip" transform={`translate(${x - 90} ${y - 28})`} style={{ animationDelay: delay }}>
      <rect x={0} y={0} width={180} height={56} rx={4} ry={4} fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} filter="url(#softshadow)" />
      <text x={16} y={20} fontFamily="var(--font-mono)" fontSize={9.5} letterSpacing="0.14em" fill="var(--ink)" fontWeight={600}>
        INCIDENT
      </text>
      <text x={16} y={40} fontFamily="var(--font-display)" fontSize={15} fontWeight={600} fill="var(--ink)">
        INC-2341
      </text>
      <text x={164} y={40} fontFamily="var(--font-mono)" fontSize={9.5} fill="var(--crit)" fontWeight={600} textAnchor="end">
        P0
      </text>
    </g>
  );
}

function CausePip({
  x,
  y,
  label,
  score,
  delay,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  score: number;
  delay: string;
  tone: "accent" | "warn" | "muted";
}) {
  const color =
    tone === "accent"
      ? "var(--accent)"
      : tone === "warn"
        ? "var(--warn)"
        : "var(--ink-4)";
  return (
    <g className="pip" transform={`translate(${x - 90} ${y - 28})`} style={{ animationDelay: delay }}>
      <rect x={0} y={0} width={180} height={56} rx={4} ry={4} fill="var(--surface)" stroke={color} strokeWidth={1.5} filter="url(#softshadow)" />
      <text x={14} y={18} fontFamily="var(--font-mono)" fontSize={9.5} letterSpacing="0.12em" fill={color} fontWeight={600}>
        CAUSE · {score}%
      </text>
      <text x={14} y={36} fontFamily="var(--font-sans)" fontSize={12} fill="var(--ink)">
        {label}
      </text>
      <rect x={14} y={44} width={152} height={3} rx={1.5} fill="var(--line)" />
      <rect x={14} y={44} width={152 * (score / 100)} height={3} rx={1.5} fill={color} />
    </g>
  );
}
