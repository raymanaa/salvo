export type Severity = "P0" | "P1" | "P2" | "P3";
export type IncidentStatus = "live" | "investigating" | "mitigating" | "resolved";

export type SourceAlert = {
  id: string;
  name: string;
  source: "prometheus" | "datadog" | "grafana" | "cloudwatch";
  firstFiredAt: string;
  count: number;
  note?: string;
};

export type GraphNode = {
  id: string;
  kind: "alert" | "service" | "cause" | "incident";
  label: string;
  meta?: string;
  severity?: Severity;
  score?: number; // 0-100, for cause candidates
  x: number;
  y: number;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  kind: "correlates" | "emits" | "impacts" | "caused_by";
  weight?: number;
  inferring?: boolean;
};

export type RunbookStep = {
  id: string;
  label: string;
  detail: string;
  snippet?: string;
  confidence: number; // 0 - 100
  kind: "check" | "mitigate" | "rollback" | "comms" | "postmortem";
};

export type TimelineEvent = {
  atIso: string;
  actor: "salvo" | "human";
  who?: string;
  label: string;
  detail?: string;
};

export type Incident = {
  id: string;
  slug: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  firedAt: string;
  resolvedAt?: string;
  assignee: {
    name: string;
    role: string;
    avatar: string;
  };
  summary: string;
  sourceAlerts: SourceAlert[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  topCause?: {
    title: string;
    confidence: number;
    rationale: string;
  };
  runbook: RunbookStep[];
  timeline: TimelineEvent[];
};

export const INCIDENTS: Incident[] = [
  {
    id: "inc-2341",
    slug: "inc-2341",
    title: "Checkout 500s spiked — checkout-api",
    service: "checkout-api",
    severity: "P0",
    status: "mitigating",
    firedAt: "2026-04-21T03:42:00Z",
    assignee: {
      name: "Maya Alves",
      role: "On-call SRE",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    summary:
      "42 correlated alerts clustered into a single incident. Top candidate is the deploy of checkout-api@v412 which landed 3m 10s before the first alert. Salvo proposes rollback.",
    sourceAlerts: [
      { id: "a1", name: "checkout-api 5xx > 2%", source: "datadog", firstFiredAt: "2026-04-21T03:42:00Z", count: 18, note: "primary signal" },
      { id: "a2", name: "checkout-api p99 latency > 4s", source: "prometheus", firstFiredAt: "2026-04-21T03:42:12Z", count: 9 },
      { id: "a3", name: "postgres replication lag > 3s", source: "prometheus", firstFiredAt: "2026-04-21T03:43:01Z", count: 7, note: "likely downstream" },
      { id: "a4", name: "PagerDuty: high-sev business-checkout", source: "datadog", firstFiredAt: "2026-04-21T03:43:44Z", count: 4 },
      { id: "a5", name: "Sentry: UnhandledRejection spike", source: "datadog", firstFiredAt: "2026-04-21T03:44:12Z", count: 4 },
    ],
    graph: {
      nodes: [
        { id: "alert-5xx", kind: "alert", label: "5xx > 2%", meta: "datadog · 18 fires", severity: "P0", x: 0, y: 40 },
        { id: "alert-p99", kind: "alert", label: "p99 > 4s", meta: "prometheus", severity: "P1", x: 0, y: 170 },
        { id: "alert-lag", kind: "alert", label: "replica lag", meta: "prometheus", severity: "P1", x: 0, y: 300 },
        { id: "svc-checkout", kind: "service", label: "checkout-api", meta: "v412 · 3m old", x: 340, y: 150 },
        { id: "svc-orders", kind: "service", label: "orders-svc", meta: "v88", x: 340, y: 300 },
        { id: "svc-postgres", kind: "service", label: "postgres-primary", meta: "16.3", x: 340, y: 430 },
        { id: "incident", kind: "incident", label: "INC-2341", meta: "P0 · mitigating", x: 700, y: 210 },
        { id: "c-deploy", kind: "cause", label: "checkout-api@v412 deploy", meta: "3m 10s pre-alert", score: 92, x: 1000, y: 70 },
        { id: "c-schema", kind: "cause", label: "payments table lock", meta: "ALTER TABLE running", score: 48, x: 1000, y: 210 },
        { id: "c-traffic", kind: "cause", label: "DDoS / traffic surge", meta: "no edge CDN anomaly", score: 12, x: 1000, y: 350 },
      ],
      edges: [
        { id: "e1", source: "alert-5xx", target: "svc-checkout", kind: "emits", weight: 0.94 },
        { id: "e2", source: "alert-p99", target: "svc-checkout", kind: "emits", weight: 0.81 },
        { id: "e3", source: "alert-lag", target: "svc-postgres", kind: "emits", weight: 0.77 },
        { id: "e4", source: "svc-checkout", target: "svc-orders", kind: "impacts", weight: 0.6 },
        { id: "e5", source: "svc-checkout", target: "svc-postgres", kind: "impacts", weight: 0.5 },
        { id: "e6", source: "svc-checkout", target: "incident", kind: "correlates", weight: 1 },
        { id: "e7", source: "svc-postgres", target: "incident", kind: "correlates", weight: 0.7 },
        { id: "e8", source: "incident", target: "c-deploy", kind: "caused_by", weight: 0.92 },
        { id: "e9", source: "incident", target: "c-schema", kind: "caused_by", weight: 0.48, inferring: true },
        { id: "e10", source: "incident", target: "c-traffic", kind: "caused_by", weight: 0.12, inferring: true },
      ],
    },
    topCause: {
      title: "checkout-api@v412 deploy introduced a regression",
      confidence: 92,
      rationale:
        "The deploy landed 3m 10s before the first 5xx fire. Diff contains a change to the Stripe retry loop. No other service has deployed in the last 6 hours. Confidence scaled up by the tight temporal coupling.",
    },
    runbook: [
      {
        id: "r1",
        label: "Rollback checkout-api to v411",
        detail: "Immediate mitigation — v411 had a 2-hour clean window before v412 shipped.",
        snippet: "kubectl rollout undo deploy/checkout-api --to-revision=411",
        confidence: 92,
        kind: "rollback",
      },
      {
        id: "r2",
        label: "Confirm replica lag recovers",
        detail: "Replication lag should drop under 500ms within 90s of rollback.",
        snippet: "watch -n5 'psql -c \"SELECT pg_last_wal_replay_lsn() - pg_current_wal_lsn()\"'",
        confidence: 85,
        kind: "check",
      },
      {
        id: "r3",
        label: "Post update to #incident-live",
        detail: "Draft message linking INC-2341 and the deploy. Salvo has pre-written one.",
        snippet: "Rolling back checkout-api → v411. Root cause candidate: Stripe retry loop in v412. Will confirm in 3m.",
        confidence: 100,
        kind: "comms",
      },
      {
        id: "r4",
        label: "Open postmortem doc",
        detail: "Salvo will pre-populate timeline, alerts, and candidate causes.",
        confidence: 100,
        kind: "postmortem",
      },
    ],
    timeline: [
      { atIso: "2026-04-21T03:38:50Z", actor: "salvo", label: "checkout-api@v412 deployed", detail: "CI/CD · auto-rollout" },
      { atIso: "2026-04-21T03:42:00Z", actor: "salvo", label: "First 5xx alert fires", detail: "datadog · checkout-api" },
      { atIso: "2026-04-21T03:42:44Z", actor: "salvo", label: "42 alerts clustered into INC-2341" },
      { atIso: "2026-04-21T03:43:10Z", actor: "salvo", label: "Top cause candidate: v412 deploy (92%)" },
      { atIso: "2026-04-21T03:43:30Z", actor: "human", who: "Maya Alves", label: "Acknowledged page" },
      { atIso: "2026-04-21T03:44:15Z", actor: "human", who: "Maya Alves", label: "Ran rollback step 01" },
    ],
  },
  {
    id: "inc-2340",
    slug: "inc-2340",
    title: "Slow search queries — search-api",
    service: "search-api",
    severity: "P1",
    status: "resolved",
    firedAt: "2026-04-20T19:11:00Z",
    resolvedAt: "2026-04-20T19:46:00Z",
    assignee: {
      name: "Daniel Rodriguez",
      role: "SRE",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    summary:
      "search-api p99 latency degraded to 2.8s over 20 minutes. Salvo correlated with an index rebuild on the search-ES cluster that had been running since 18:40. Resolved on its own.",
    sourceAlerts: [
      { id: "a1", name: "search-api p99 > 2s", source: "grafana", firstFiredAt: "2026-04-20T19:11:00Z", count: 12 },
      { id: "a2", name: "elasticsearch heap > 85%", source: "prometheus", firstFiredAt: "2026-04-20T19:11:40Z", count: 6 },
    ],
    graph: {
      nodes: [
        { id: "alert-lat", kind: "alert", label: "p99 > 2s", meta: "grafana", severity: "P1", x: 0, y: 90 },
        { id: "alert-heap", kind: "alert", label: "ES heap > 85%", meta: "prometheus", severity: "P2", x: 0, y: 260 },
        { id: "svc-search", kind: "service", label: "search-api", meta: "v73", x: 340, y: 90 },
        { id: "svc-es", kind: "service", label: "search-es cluster", meta: "7.17", x: 340, y: 260 },
        { id: "incident", kind: "incident", label: "INC-2340", meta: "P1 · resolved", x: 700, y: 175 },
        { id: "c-index", kind: "cause", label: "index rebuild job", meta: "running since 18:40", score: 88, x: 1000, y: 90 },
        { id: "c-shard", kind: "cause", label: "hot shard", meta: "nodes-3,4", score: 34, x: 1000, y: 260 },
      ],
      edges: [
        { id: "e1", source: "alert-lat", target: "svc-search", kind: "emits", weight: 0.92 },
        { id: "e2", source: "alert-heap", target: "svc-es", kind: "emits", weight: 0.8 },
        { id: "e3", source: "svc-search", target: "svc-es", kind: "impacts", weight: 0.7 },
        { id: "e4", source: "svc-search", target: "incident", kind: "correlates" },
        { id: "e5", source: "svc-es", target: "incident", kind: "correlates" },
        { id: "e6", source: "incident", target: "c-index", kind: "caused_by", weight: 0.88 },
        { id: "e7", source: "incident", target: "c-shard", kind: "caused_by", weight: 0.34, inferring: true },
      ],
    },
    topCause: {
      title: "Background index rebuild saturating heap",
      confidence: 88,
      rationale:
        "Index rebuild job started at 18:40, heap climb began at 18:44, p99 followed at 19:11. The job self-terminates; no action required beyond monitoring.",
    },
    runbook: [
      { id: "r1", label: "Confirm index-rebuild job", detail: "Should be in the ES task queue; expected to drain at 19:45.", snippet: "curl -s es-01:9200/_tasks | jq .", confidence: 88, kind: "check" },
      { id: "r2", label: "Monitor p99 recovery", detail: "No mitigation needed; latency should trend back under 800ms by 19:50.", confidence: 90, kind: "check" },
      { id: "r3", label: "Note in postmortem", detail: "Index rebuilds should not overlap peak-traffic window (17:00–20:00 UTC).", confidence: 100, kind: "postmortem" },
    ],
    timeline: [
      { atIso: "2026-04-20T18:40:00Z", actor: "salvo", label: "Index rebuild job started" },
      { atIso: "2026-04-20T19:11:00Z", actor: "salvo", label: "First p99 alert" },
      { atIso: "2026-04-20T19:12:02Z", actor: "salvo", label: "INC-2340 opened · cause candidate: index rebuild (88%)" },
      { atIso: "2026-04-20T19:46:00Z", actor: "salvo", label: "Alert resolved · job completed" },
    ],
  },
  {
    id: "inc-2339",
    slug: "inc-2339",
    title: "Auth sessions dropped — auth-api",
    service: "auth-api",
    severity: "P1",
    status: "resolved",
    firedAt: "2026-04-19T14:27:00Z",
    resolvedAt: "2026-04-19T15:02:00Z",
    assignee: {
      name: "Priya Patel",
      role: "SRE",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    summary:
      "Redis session store had a 4-second blip; auth-api dropped 1.1% of sessions. Salvo correlated with a Redis failover event; no rollback required, but added a hedge for future failovers.",
    sourceAlerts: [
      { id: "a1", name: "auth-api session-miss > 0.5%", source: "datadog", firstFiredAt: "2026-04-19T14:27:00Z", count: 15 },
      { id: "a2", name: "redis primary flapping", source: "prometheus", firstFiredAt: "2026-04-19T14:27:03Z", count: 3 },
    ],
    graph: {
      nodes: [
        { id: "alert-miss", kind: "alert", label: "session-miss > 0.5%", meta: "datadog", severity: "P1", x: 0, y: 90 },
        { id: "alert-flap", kind: "alert", label: "redis flapping", meta: "prometheus", severity: "P2", x: 0, y: 260 },
        { id: "svc-auth", kind: "service", label: "auth-api", meta: "v141", x: 340, y: 90 },
        { id: "svc-redis", kind: "service", label: "redis-primary", meta: "7.2", x: 340, y: 260 },
        { id: "incident", kind: "incident", label: "INC-2339", meta: "P1 · resolved", x: 700, y: 175 },
        { id: "c-failover", kind: "cause", label: "Redis failover", meta: "auto-failover 14:27:02", score: 94, x: 1000, y: 90 },
        { id: "c-network", kind: "cause", label: "Network partition", meta: "no az anomaly", score: 18, x: 1000, y: 260 },
      ],
      edges: [
        { id: "e1", source: "alert-miss", target: "svc-auth", kind: "emits" },
        { id: "e2", source: "alert-flap", target: "svc-redis", kind: "emits" },
        { id: "e3", source: "svc-auth", target: "svc-redis", kind: "impacts" },
        { id: "e4", source: "svc-auth", target: "incident", kind: "correlates" },
        { id: "e5", source: "svc-redis", target: "incident", kind: "correlates" },
        { id: "e6", source: "incident", target: "c-failover", kind: "caused_by", weight: 0.94 },
        { id: "e7", source: "incident", target: "c-network", kind: "caused_by", weight: 0.18, inferring: true },
      ],
    },
    topCause: {
      title: "Redis primary failover dropped transient sessions",
      confidence: 94,
      rationale:
        "Redis sentinels triggered an auto-failover at 14:27:02; auth-api's session cache lost 1.1% of keys in the 4s transition. Expected behavior; mitigation is a client-side retry.",
    },
    runbook: [
      { id: "r1", label: "Wait for failover to complete", detail: "auth-api will self-heal once sentinels converge.", confidence: 94, kind: "check" },
      { id: "r2", label: "Add session-miss retry in auth client", detail: "Follow-up ticket — the failover is expected; the client should handle it.", snippet: "// in src/auth/client.ts:\nsession ||= await session.retryOnMiss({ delayMs: 120 });", confidence: 95, kind: "postmortem" },
    ],
    timeline: [
      { atIso: "2026-04-19T14:27:02Z", actor: "salvo", label: "Redis sentinels triggered failover" },
      { atIso: "2026-04-19T14:27:00Z", actor: "salvo", label: "First session-miss alert" },
      { atIso: "2026-04-19T14:28:14Z", actor: "salvo", label: "INC-2339 opened · cause: Redis failover (94%)" },
      { atIso: "2026-04-19T15:02:00Z", actor: "salvo", label: "Auto-resolved · session-miss back under 0.1%" },
    ],
  },
];

export function getIncident(slug: string) {
  return INCIDENTS.find((i) => i.slug === slug);
}

export function severityConfig(s: Severity) {
  return {
    P0: { label: "P0", ink: "var(--crit)", bg: "var(--crit-soft)" },
    P1: { label: "P1", ink: "var(--warn)", bg: "var(--warn-soft)" },
    P2: { label: "P2", ink: "var(--ink-2)", bg: "var(--surface-2)" },
    P3: { label: "P3", ink: "var(--ink-3)", bg: "var(--surface-2)" },
  }[s];
}

export function statusConfig(s: IncidentStatus) {
  return {
    live: { label: "LIVE", ink: "var(--crit)", dot: "var(--crit)" },
    investigating: { label: "INVESTIGATING", ink: "var(--warn)", dot: "var(--warn)" },
    mitigating: { label: "MITIGATING", ink: "var(--accent)", dot: "var(--accent)" },
    resolved: { label: "RESOLVED", ink: "var(--ok)", dot: "var(--ok)" },
  }[s];
}

export function fmtTimeAgo(iso: string, ref?: Date): string {
  const then = new Date(iso).getTime();
  const now = (ref ?? new Date()).getTime();
  const s = Math.max(0, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
