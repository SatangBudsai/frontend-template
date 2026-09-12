---
id: keep-auth-tokens-out-of-persistent-client-state
type: team_decision
title: Keep auth tokens out of persistent client state
domain: frontend
tags: [authentication, redux, token, security]
status: proposed
enforcement: warn
applies_to: ["src/auth/**", "src/store/**", "src/api/**"]
source: ai
supersedes: ""
related: [include-redux-toolkit-baseline, service-local-generate-only-api-workflow]
timestamp: 2026-09-12T00:00:00+07:00
---

Keep the JWE access token and CSRF token only in the application-owned in-memory auth client. Keep the opaque refresh token in an HttpOnly cookie owned by the API. Redux may hold lifecycle and account display state, but tokens must never enter Redux persistence, localStorage, sessionStorage, URLs, or logs.
