# Iconify icons

The template renders the Lucide collection through the shared `Icon` component without depending on `lucide-react` or the public Iconify API at runtime.

## Use a project icon

```tsx
import { Icon } from '@/components/ui/icon'
import { appIcons } from '@/config/icons'

;<Icon icon={appIcons.arrowBack} className='size-5' aria-hidden='true' />
```

Keep every UI icon in `src/config/icons.ts` as a semantic key with a `lucide:*` value. Decorative icons use `aria-hidden='true'`; icon-only controls put the accessible label on their interactive parent.

## Offline bundle

`pnpm icons:generate` reads `appIcons` and copies only the selected SVG data from `@iconify-json/lucide` into the tracked `src/config/icon-data.ts`. The shared wrapper passes this local data directly to Iconify, so SSR and the first client render do not fetch from Iconify API.

`pnpm dev` regenerates the subset before startup. `pnpm icons:check`, production builds, and CI fail when `icons.ts` and the generated subset differ. Do not edit `icon-data.ts` manually.

## Add shadcn components

```bash
pnpm ui:add select dialog dropdown-menu
```

Always use `pnpm ui:add` instead of calling `shadcn add` directly. The wrapper:

1. Runs the local shadcn CLI.
2. Replaces generated `lucide-react` imports and JSX with `appIcons` plus the shared `Icon`.
3. Adds missing `lucide:*` IDs to `src/config/icons.ts`.
4. Regenerates the offline subset and removes `lucide-react` if the CLI added it.
5. Fails when an icon usage cannot be converted safely.

Run `pnpm ui:check-icons` to enforce the import boundary without changing files.
