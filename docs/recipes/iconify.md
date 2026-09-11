# Iconify icons

The template uses `@iconify/react` through the shared `Icon` component and does not depend on `lucide-react`.

## Use an existing project icon

```tsx
import { Icon } from '@/components/ui/icon'
import { appIcons } from '@/config/icons'

;<Icon icon={appIcons.arrowBack} className='size-5' aria-hidden='true' />
```

Keep recurring product icons in `src/config/icons.ts` so changing an icon ID updates every consumer. One-off icons can use any Iconify ID directly:

```tsx
<Icon icon='mdi:account-circle' className='size-5' aria-hidden='true' />
```

String IDs load icon data on demand from the public Iconify API and need no account or API key. For an offline-first or strict SSR project, pass locally bundled Iconify icon data to the same wrapper instead of a string ID.

Decorative icons must use `aria-hidden='true'`. If an icon communicates meaning without visible text, give the interactive parent an accessible label.

## shadcn CLI boundary

The shadcn CLI does not currently support Iconify as an icon-library target. Review every newly generated component, replace generated icon imports with `@/components/ui/icon`, and remove any unused icon dependency before committing.
