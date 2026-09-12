# Project instructions

These instructions belong to this repository and are independent from Sage.
Installing or updating Sage must not overwrite, move, or duplicate them under
`agents/sage/`.

## UI work

Before designing, adding, or changing UI, read and follow
[`docs/ui-design-rules.md`](docs/ui-design-rules.md). Treat it as the repository's
source of truth for UI implementation and component selection.

Read [`docs/ui-catalog.md`](docs/ui-catalog.md) before looking for an external
component. Update the catalog whenever a reusable component is added or its
source, primitive family, dependencies, restrictions, responsive behavior, or
accessibility behavior changes.

Repository-specific facts:

- Tailwind CSS v4 is configured CSS-first in `src/app/globals.css`; the absence
  of `tailwind.config.*` is intentional.
- shadcn/ui uses the `base-nova` style and Base UI primitives. Do not mix in
  Radix UI accidentally.
- Use `pnpm ui:add <component>` instead of calling `shadcn add` directly so
  generated icons are converted to the shared Iconify boundary.
- Use `src/components/ui/icon.tsx` with icon names from
  `src/config/icons.ts`; do not import an icon component library directly.
- Use semantic theme tokens from `src/app/globals.css` instead of page-local
  hardcoded colors, radii, shadows, typography, or spacing.
