---
id: reuse-ui-components-before-custom-controls
type: team_decision
title: Reuse UI components before custom controls
domain: frontend
tags: [components, shadcn, registry, accessibility, dependencies]
status: proposed
enforcement: warn
applies_to: ['src/**/*.tsx', components.json, package.json]
source: human
supersedes: ''
related: [own-shadcn-component-source, use-iconify-template-icons]
timestamp: 2026-09-12T15:00:00+07:00
---

Use a project-owned component for interactive or design-system controls whenever one already exists. Read its source and public API before use; do not recreate Button, Select, Dialog, Dropdown Menu, Tabs, form controls, feedback, or navigation controls with ad hoc styled HTML.

When the project has no suitable control, investigate in this order before writing one from scratch:

1. Search the official shadcn/ui registry and inspect the component with the current CLI version.
2. Search configured namespaced registries and credible shadcn-compatible registries, plugins, or extensions.
3. Evaluate a focused npm component only when it provides meaningful behavior the source-owned primitive does not. Check maintenance, accessibility, license, dependency weight, React/Next compatibility, and whether the project can own the resulting boundary.
4. Build a custom component only when the options above do not meet the requirement; record the concrete mismatch that justified custom code.

For this repository, install shadcn components with `pnpm ui:add <component...>` so generated icons pass through the Iconify conversion and verification workflow.

This rule applies to reusable controls, not semantic document structure. Continue using native elements such as `main`, `section`, `nav`, `header`, `footer`, headings, paragraphs, lists, and `form` when they express the correct HTML semantics. Do not install a component package merely to replace semantic markup or a trivial non-interactive element.
