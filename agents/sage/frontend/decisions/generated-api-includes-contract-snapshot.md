---
id: generated-api-includes-contract-snapshot
type: team_decision
title: Generated API output includes a readable contract snapshot
domain: frontend
tags: [template, openapi, generated-code, developer-experience]
status: deprecated
enforcement: warn
applies_to: [src/api/**, package.json]
source: human
supersedes: ""
related: [ship-runnable-integration-foundations]
timestamp: 2026-09-11T00:00:00+07:00
---

Co-locate each readable Swagger/OpenAPI JSON snapshot with its generated client and handwritten service export under `src/api/<service>/`. Organize API modules by service ownership rather than placing the whole module under a broad `generated` bucket; only `apiGenerated.ts` is machine-owned. Refresh the snapshot from the backend through the guarded sync command, never by hand, and make the non-mutating API check fail when the generated client drifts from it.

Deprecated by `service-local-generate-only-api-workflow`, which removes the unused sync/check command surface.
