# Tolgee localization

The template includes locale-prefixed `/th` and `/en` routes, tracked ICU translations, next-intl navigation, Tolgee server/client providers, a language switcher, and the same pull-to-repository lifecycle used by the eCustom reference project. Thai is the default and source-fallback language. The global proxy prefixes every unlocalized pathname and remembers the last explicit locale in the `NEXT_LOCALE` cookie.

## Structure

```text
langs/
  common/en.json
  common/th.json
src/
  app/[locale]/
  i18n/routing.ts         # locale values plus next-intl route policy
  i18n/navigation.ts      # locale-aware Link and router helpers
  i18n/request.ts         # Server Component request locale
  tolgee/shared.ts
  tolgee/client.tsx
  tolgee/server.tsx
  tolgee/config.ts          # generated namespace/static-import manifest
  proxy.ts
scripts/tolgee/
  tolgee-extractor.cjs
  repository.mts
  sync-repository.mts
.tolgeerc.cjs
```

Use explicit `namespace:key` references and a Thai fallback in source:

```tsx
const t = await getTranslate()
t('research:filters.publicationYear', 'ปีที่เผยแพร่')
```

The colon makes namespace ownership unambiguous to runtime code, the custom extractor, and the repository synchronizer. Keep only truly shared copy in `common`.

## Why `src/i18n` has three files

eCustom keeps locale helpers in one utility because its Tolgee integration is primarily client-side. This template also supports App Router Server Components, so the framework boundaries stay explicit:

- `routing.ts` is the single locale/config source of truth.
- `navigation.ts` creates locale-aware `Link` and router helpers for navigation.
- `request.ts` resolves and validates the locale for server rendering; `next-intl` loads this file through `next.config.ts`.

The former separate `config.ts` was unnecessary duplication and has been merged into `routing.ts`. Tolgee files remain under `src/tolgee` because they own translation loading, while `src/i18n` owns URLs and request locale selection.

## Runtime model

- `next-intl` owns URL locale routing and locale-aware links.
- Server Components call `getTranslate()` from `src/tolgee/server.tsx`.
- Client Components call Tolgee hooks inside `TolgeeNextProvider`.
- The locale layout loads static records on the server and hydrates the client with the same records.
- The language switcher changes the URL. Do not call `changeLanguage()` during render and do not patch global fetch.
- Missing credentials leave bundled translation JSON fully functional.
- `src/tolgee/config.ts` is generated from folders under `langs/`; do not edit it manually.

### Local mode without a Tolgee connection

No Tolgee account or credential is required. `TolgeeBase()` always registers ICU formatting and the generated `staticData` imports from `langs/`. Remote API configuration and DevTools are added only when all of these are true: the app is in development, `NEXT_PUBLIC_TOLGEE_DEVTOOLS=true`, and both the public API URL and key exist.

This keeps one translation API instead of maintaining a separate next-intl message catalog: next-intl owns locale routing/request context, while Tolgee reads the local JSON and formats translated copy. Connecting Tolgee adds catalog management and in-context editing; disconnecting it does not disable i18n.

## Use translations in components

Server Components call the async server helper:

```tsx
import { getTranslate } from '@/tolgee/server'

export default async function Page() {
  const t = await getTranslate()

  return <h1>{t('common:home.hero.lineOne', 'สร้างผลิตภัณฑ์')}</h1>
}
```

Client Components use `useLang()`. Its `t` function has the same signature, while `lang` is the current validated `th` or `en` locale:

```tsx
'use client'

import { useLang } from '@/hooks/use-lang'

export function SaveButton() {
  const { t, lang } = useLang()

  return <button data-locale={lang}>{t('common:action.save', 'บันทึก')}</button>
}
```

For ICU variables, keep the placeholder in both locale JSON files and pass values as the third argument:

```json
{
  "welcome": "สวัสดี {name}",
  "resultCount": "{count, number} รายการ"
}
```

```tsx
t('common:welcome', 'สวัสดี {name}', { name })
t('common:resultCount', '{count, number} รายการ', { count: results.length })
```

## Connect a Tolgee project

Copy `.env.example` to `.env.local` and set only the values needed by your workflow:

```dotenv
NEXT_PUBLIC_TOLGEE_API_URL=https://app.tolgee.io
NEXT_PUBLIC_TOLGEE_API_KEY=
NEXT_PUBLIC_TOLGEE_DEVTOOLS=false
TOLGEE_API_URL=https://app.tolgee.io
TOLGEE_API_KEY=
TOLGEE_PROJECT_ID=
```

Set `NEXT_PUBLIC_TOLGEE_DEVTOOLS=true` only for local in-context editing. The public key must be least-privileged. CLI authentication belongs in the local shell, `.env.local`, or CI secrets; never commit it.

## Commands

```bash
pnpm i18n:generate
pnpm i18n:check
pnpm i18n:compare
pnpm i18n:pull
pnpm i18n:push
pnpm i18n:push-force
```

`i18n:pull` runs the following chain and stops immediately if the remote pull fails:

1. Load Tolgee credentials from `.env.local`.
2. Pull remote values into tracked `langs/<namespace>/<locale>.json` files.
3. Ensure each namespace has both `th.json` and `en.json`.
4. Regenerate the explicit static imports in `src/tolgee/config.ts`.
5. Prefer the pulled Thai value (falling back to English only when Thai is absent) and update the second argument of matching source `t()` calls.
6. Format the changed JSON and TypeScript files.

This means `git diff` shows both pulled catalogs and any changed code fallback. `i18n:check` runs the extractor and performs the same comparison without writing, so CI catches stale repository state. `push` and `push-force` are explicit remote mutations and are intentionally absent from `dev` and `build`.

## Add a namespace

1. Add `langs/<namespace>/th.json` or pull the namespace from Tolgee.
2. Run `pnpm i18n:generate`; the missing English file and static-import config are generated automatically.
3. Reference translations as `t('<namespace>:<key>', '<Thai fallback>')`.
4. Run `pnpm i18n:check` plus the normal quality suite.

Both locale catalogs must contain the same keys. ICU placeholders must receive parameters through `t('namespace:key', 'Thai fallback', variables)`; do not translate first and then perform manual string replacement.
