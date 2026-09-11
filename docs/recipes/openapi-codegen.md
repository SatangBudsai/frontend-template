# OpenAPI code generation

The template follows the CMU Research Gallery client pattern with `swagger-typescript-api`, Axios, an offline Swagger contract, one generation command, and a thin service index.

## Structure

```text
src/api/example-service/
  example-service.swagger.json # checked example and generator input
  apiGenerated.ts              # generated Axios client and DTOs; never hand-edit
  index.ts                     # stable application-facing service export
tests/openapi-contract.test.ts      # semantic and import-boundary tests
```

Application code imports `@/api/example-service`. It must not import `apiGenerated.ts` directly; the service index owns base URL and future transport policy. Rename `example-service` and its exported client to the real backend service slug when starting a project.

## Commands

```bash
pnpm generate
```

`generate` reads `example-service/example-service.swagger.json`, creates the Axios client and DTOs in the same service folder, then formats the TypeScript output. The checked Swagger file is both the visible example and the reproducible generator input.

`--axios` selects Axios instead of the generator's Fetch transport. `--unwrap-response-data` makes generated endpoint methods return the response body directly instead of an `AxiosResponse<T>`. Keep both flags for the same calling style as the CMU reference.

## Adopt a real backend

1. Replace `src/api/example-service/example-service.swagger.json` with the backend's checked contract.
2. Rename the folder, Swagger file, exported client, and `generate` script paths to the real service slug.
3. Run `pnpm generate`.
4. Review the Swagger and generated TypeScript diff, then run the quality suite.

## Runtime client

Set `NEXT_PUBLIC_SERVICE` to the backend base URL, then use the configured export directly:

```ts
import { exampleService, type HealthResponse } from '@/api/example-service'

const health: HealthResponse = await exampleService.health.getHealth()
```

Keep secret-bearing authentication in a server-only wrapper. A browser client may use a `NEXT_PUBLIC_` URL but must never receive server credentials.

Generation produces the TypeScript shape and endpoint methods. Tests parse the example contract, verify the representative endpoint, protect the service index boundary, and assert that the single command keeps Axios and unwrapped response data enabled.
