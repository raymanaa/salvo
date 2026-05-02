# Salvo — On-call incident copilot

Light-theme ops console that watches your alert firehose, clusters correlated alerts, proposes the top-three candidate root causes, and drafts the runbook.

Live: https://salvo.raymnz.com

## Stack
- Next 16 · static export · Cloudflare Workers + Static Assets
- `@xyflow/react` for the incident graph
- Instrument Sans + Bricolage Grotesque + JetBrains Mono (next/font)
- framer-motion · lucide-react

## Portfolio context
Built by Rayen Manaa as part of an AI-SaaS portfolio (axon, loupe, chorus, dossier, cadence, salvo). See `BRIEF.md` for the locked design direction that was fixed before scaffolding.

## Develop
```
pnpm install
pnpm dev
```

## Deploy
```
pnpm build
pnpm wrangler deploy
```
