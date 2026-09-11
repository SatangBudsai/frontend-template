# Sage knowledge

This directory contains the protocol, reusable roles, project decisions, and implementation flows that Sage reads before changing code.

## Layout

```text
agents/sage/
  AGENTS.md               # Cognition protocol
  commands/               # Sage command bodies
  roles/                  # Reusable senior lenses
  flows/                  # Implementation and protocol flows
  <domain>/               # Project knowledge added as the template evolves
```

## Domains

- [frontend](frontend/) — UI foundation and source-ownership decisions
- [protocol](protocol/) — Sage execution policy
- [sage-product](sage-product/) — Sage control-plane decisions

The template intentionally starts with little product knowledge. Add one decision per file only when a new project establishes a durable rule.
