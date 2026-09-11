import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'
import test from 'node:test'

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

  assert.match(contract.openapi ?? '', /^3\./)
  assert.equal(contract.info?.title, 'Frontend Template API')
  assert.ok(contract.paths?.['/health']?.get?.responses?.['200'])
})

test('application source does not import generated API internals directly', async () => {
  const sourceRoot = resolve('src')
  const files = (await collectSourceFiles(sourceRoot)).filter(path => ['.ts', '.tsx'].includes(extname(path)))

  for (const path of files) {
    const projectPath = relative(resolve(), path).replaceAll('\\', '/')

    if (
      projectPath === 'src/api/example-service/apiGenerated.ts' ||
      projectPath === 'src/api/example-service/index.ts'
    ) {
      continue
    }

    const source = await readFile(path, 'utf8')
    assert.doesNotMatch(source, /(?:@\/api\/[^'"\n]+\/|from ['"]\.\.?\/[^'"\n]*?)apiGenerated/, projectPath)
  }
})

test('generated service client exposes the template operation', async () => {
  const generated = await readFile(resolve('src/api/example-service/apiGenerated.ts'), 'utf8')

  assert.match(generated, /export class Api/)
  assert.match(generated, /getHealth:/)
  assert.match(generated, /path: `\/health`/)
})

test('package exposes one Axios API generation command', async () => {
  const manifest = JSON.parse(await readFile(resolve('package.json'), 'utf8')) as {
    scripts?: Record<string, string>
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }

  assert.ok(manifest.scripts?.generate)

  for (const obsoleteScript of ['api:validate', 'api:sync', 'api:generate', 'api:check', 'api:refresh']) {
    assert.equal(manifest.scripts?.[obsoleteScript], undefined, `Unexpected package script: ${obsoleteScript}`)
  }

  assert.match(manifest.scripts.generate, /swagger-typescript-api generate/)
  assert.match(manifest.scripts.generate, /src\/api\/example-service\/example-service\.swagger\.json/)
  assert.match(manifest.scripts.generate, /--axios/)
  assert.match(manifest.scripts.generate, /--unwrap-response-data/)

  assert.equal(manifest.dependencies?.['axios'], '1.18.1')
  assert.equal(manifest.devDependencies?.['swagger-typescript-api'], '13.12.6')
})
