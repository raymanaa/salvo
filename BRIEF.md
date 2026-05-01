# Salvo — On-call incident copilot

> Portfolio project #6. An agent that watches your alert stream and proposes the root cause before the second page.

## M0 — Design direction (LOCKED)

### Reference vibe
**Linear + Sentry + Honeycomb** — engineering-console aesthetic, *light* theme. Rejects the default dark-ops dogma; Loupe (project #2) already owned dark+indigo. Salvo is the ops console that ships with a headlamp, not a dim cave.

### Typography
- **Display**: Bricolage Grotesque (variable, opsz + wdth axes) — distinct from Fraunces, Newsreader, Source Serif, Inter, Work Sans, Public Sans.
- **Body + UI**: Instrument Sans — humanist sans with a characterful italic, genuinely uncommon.
- **Mono**: JetBrains Mono — keeps continuity with the engineering audience; used heavily for service names, stack traces, incident IDs.

### Layout
- **Three-pane app:** narrow left **alert inbox** (time-ordered), central **React Flow incident graph** (alert node → candidate root causes → affected services), right **runbook drawer** (proposed action list with one-click copy).
- Distinct from Axon (sidebar + right canvas), Loupe (dark flat shell), Chorus (sidebar + tabs), Dossier (no sidebar), Cadence (horizontal time-first, right-rail).
- Top bar: severity switcher (P0 / P1 / P2 / all) + team picker.

### Palette — "Ops console light"
- `--paper`: `#f5f6f8` (cool off-white)
- `--surface`: `#ffffff`
- `--surface-2`: `#eef0f4` (subtle panel inset)
- `--ink`: `#0f1115` (near-black, cool)
- `--ink-2`: `#3a3f47`
- `--ink-3`: `#6b7280`
- `--line`: `#e2e5ea`
- `--accent`: `#2563eb` (electric signal blue — distinct from Loupe indigo `#818cf8`)
- `--crit`: `#dc2626` (crimson — P0)
- `--warn`: `#f59e0b` (amber — P1 / anomaly)
- `--ok`: `#16a34a` (forest green — resolved / clear)

## Audience
- SRE / on-call engineers
- Platform engineering managers
- Incident commanders
- Small-team devops (first-responder)

## Real problem
The first ten minutes of an incident determine the next six hours. On-call engineers get paged at 3am with a stack of 40 correlated alerts. They spend fifteen minutes just figuring out which alerts are causal and which are downstream. Salvo watches the alert firehose, clusters correlated alerts, proposes the top-3 candidate root causes with graph-based evidence, and drafts a runbook the responder can either accept or override. Existing incumbents (PagerDuty AI, Grafana IRM, Datadog Watchdog) are bundled with enterprise observability contracts and don't expose the graph. Salvo is the copilot you'd want if you'd prefer to close the incident before standup.

## What Salvo is
- Paste an alert (or connect Prometheus / Datadog / Grafana) → Salvo clusters correlated alerts into a single incident.
- Candidate root-cause graph materializes in real time: alert → affected service(s) → candidate cause nodes, each with evidence edges (deploy diff, log anomaly, metric spike).
- Auto-drafted runbook: ordered steps with copy-to-clipboard `kubectl` / `psql` snippets.
- Timeline of who-did-what with automated postmortem stub.

## Stack
- Next 16 static export + Cloudflare Workers
- `@xyflow/react` for the incident graph (React Flow successor)
- Instrument Sans + Bricolage Grotesque + JetBrains Mono via next/font
- framer-motion for entry animations + graph-node reveals
- lucide-react for icons

## Landing page requirements
1. **Animated hero diagram**: An incident graph *materializing* over ~10s: an alert fires (top-left pulse), a few correlated alerts pop in, edges draw animated-dashed lines to a central "incident" node, then three candidate root-cause nodes stream in on the right with scored edges back to the incident. A green "resolved" stamp at the end.
2. **Inline product component**: A real React Flow `IncidentGraph` with 3 sample incidents pickable via tabs; edges animate; clicking a candidate node opens a runbook preview.

## Milestones (compact — 5 total)
- M0 — Design direction (this doc)
- M1 — Scaffold + landing + deploy
- M2 — Incidents index + reader with React Flow graph
- M3 — /method + /security + README
- M4 — Polish
