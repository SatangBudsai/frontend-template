import { expect, test } from '@playwright/test'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'

async function collectSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async entry => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? collectSourceFiles(path) : [path]
    })
  )

  return files.flat()
}

test('checked Swagger example is a valid template contract', async () => {
  const source = await readFile(resolve('src/api/example-service/example-service.swagger.json'), 'utf8')
  const contract = JSON.parse(source) as {
    openapi?: string
    info?: { title?: string }
    paths?: Record<string, { get?: { responses?: Record<string, unknown> } }>
  }

  expect(contract.openapi ?? '').toMatch(/^3\./)
  expect(contract.info?.title).toBe('Frontend Template API')
  expect(contract.paths?.['/health']?.get?.responses?.['200']).toBeTruthy()
})

test('application source does not import generated API internals directly', async () => {
  const sourceRoot = resolve('src')
  const files = (await collectSourceFiles(sourceRoot)).filter(path => ['.ts', '.tsx'].includes(extname(path)))

  for (const path of files) {
    const projectPath = relative(resolve(), path).replaceAll('\\', '/')
    if (/^src\/api\/[^/]+\/(?:apiGenerated|index)\.ts$/.test(projectPath)) continue

    const source = await readFile(path, 'utf8')
    expect(source, projectPath).not.toMatch(/(?:@\/api\/[^'"\n]+\/|from ['"]\.\.?\/[^'"\n]*?)apiGenerated/)
  }
})

test('generated service client exposes the template operation', async () => {
  const generated = await readFile(resolve('src/api/example-service/apiGenerated.ts'), 'utf8')

  expect(generated).toMatch(/export class Api/)
  expect(generated).toMatch(/getHealth:/)
  expect(generated).toMatch(/path: `\/health`/)
})

test('package exposes one Axios API generation command', async () => {
  const manifest = JSON.parse(await readFile(resolve('package.json'), 'utf8')) as {
    scripts?: Record<string, string>
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }

  expect(manifest.scripts?.generate).toBeTruthy()
  for (const obsoleteScript of ['api:validate', 'api:sync', 'api:generate', 'api:check', 'api:refresh']) {
    expect(manifest.scripts?.[obsoleteScript], `Unexpected package script: ${obsoleteScript}`).toBeUndefined()
  }

  expect(manifest.scripts?.generate).toMatch(/swagger-typescript-api generate/)
  expect(manifest.scripts?.generate).toMatch(/src\/api\/example-service\/example-service\.swagger\.json/)
  expect(manifest.scripts?.generate).toMatch(/--axios/)
  expect(manifest.scripts?.generate).toMatch(/--unwrap-response-data/)
  expect(manifest.dependencies?.axios).toBe('1.18.1')
  expect(manifest.devDependencies?.['swagger-typescript-api']).toBe('13.12.6')
})

test('service wrapper fails clearly when its runtime base URL is missing', async () => {
  const source = await readFile(resolve('src/api/example-service/index.ts'), 'utf8')

  expect(source).toMatch(/NEXT_PUBLIC_SERVICE\?\.trim\(\)/)
  expect(source).toMatch(/NEXT_PUBLIC_SERVICE is required before using exampleService/)
})
