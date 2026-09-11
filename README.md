# Next.js production template

A runnable Next.js 16 foundation with React Server Components, Tailwind CSS v4, source-owned shadcn/ui, Iconify, a Swagger-generated Axios client, TanStack Query, Redux Toolkit, Thai/English Tolgee localization, system-aware themes, route fallbacks, tests, and CI.

## Start

```bash
pnpm install
pnpm generate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Every unprefixed route receives a locale prefix: `/main` becomes `/th/main` on the first visit. The language switcher stores the choice in the `NEXT_LOCALE` cookie, so later unprefixed routes use the selected locale instead.

No backend or Tolgee account is required for local development. The repository includes a small OpenAPI contract and bundled translation files.

TanStack Query is ready for interactive client-side server state. Redux Toolkit is ready for global mutable client state through a request-safe provider. Do not copy the same remote data into both stores.

Icons use the shared Iconify wrapper at `src/components/ui/icon.tsx`; starter icon IDs live in `src/config/icons.ts`. `lucide-react` is not included.

## Generated API types

```bash
pnpm generate # generate the Axios client and DTOs from Swagger
```

Replace `src/api/example-service/example-service.swagger.json` with the backend contract, rename `example-service` to the backend service slug, update the paths in the `generate` script, and run it again. `apiGenerated.ts` is machine-owned and must not be edited manually. Application modules import `exampleService` and DTOs through that folder's `index.ts`, not from `apiGenerated.ts` directly.

## Localization

Routes always include `th` or `en`. Tracked translation files live in `langs/<namespace>/<locale>.json`; server and client integration lives in `src/tolgee`.

```bash
pnpm i18n:generate  # regenerate namespaces and source fallbacks from langs/
pnpm i18n:check     # extraction + non-mutating repository drift check
pnpm i18n:pull      # pull, update tracked code/JSON, and format
pnpm i18n:compare
pnpm i18n:push
pnpm i18n:push-force
```

Remote Tolgee credentials are optional and belong in `.env.local` or CI secrets. Without them, the same `t()` API reads bundled JSON from `langs/` and ICU formatting still works. After a successful `i18n:pull`, the command regenerates `src/tolgee/config.ts` and updates Thai fallback text in explicit `t('namespace:key', 'fallback')` calls, so the pulled state appears in the repository diff. Local JSON remains the runtime source of truth.

## Add UI components

```bash
pnpm dlx shadcn@latest add card input dialog
```

Generated source lives in `src/components/ui` and shares `src/lib/utils.ts`.

The shadcn CLI does not currently offer Iconify as an icon-library target. After adding a component that contains icons, replace its generated icon imports with the shared `Icon` wrapper and remove any icon dependency the CLI added.

## Quality checks

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm generate
pnpm i18n:check
pnpm test
pnpm build
```

## Structure

```text
langs/                     # Tracked Tolgee namespaces by locale
src/
  api/example-service/     # Co-located Swagger, generated Axios client, and service export
  app/[locale]/            # Thai/English routes and boundaries
  components/              # Shared components and source-owned shadcn/ui
  config/icons.ts          # Project-wide Iconify icon IDs
  i18n/                    # next-intl routing and navigation
  providers/               # Request-safe client provider boundaries
  store/                   # Redux store factory and typed hooks
  tolgee/                  # Shared, server, and client Tolgee integration
scripts/tolgee/            # Extractor and pull-to-repository synchronizer
tests/                     # Contract and architecture tests
.github/workflows/         # CI quality gate
```

See [OpenAPI code generation](docs/recipes/openapi-codegen.md), [TanStack Query](docs/recipes/tanstack-query.md), [Redux Toolkit](docs/recipes/redux-toolkit.md), [Iconify](docs/recipes/iconify.md), [Tolgee localization](docs/recipes/tolgee.md), and [template setup](docs/template-setup.md) for adoption details.
