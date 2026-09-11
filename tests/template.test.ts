import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function readProjectFile(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('shadcn configuration points to the source-owned UI directory', async () => {
  const source = await readProjectFile('components.json')
  const config = JSON.parse(source) as {
    rsc: boolean
    aliases: { ui: string; utils: string }
  }

  assert.equal(config.rsc, true)
  assert.equal(config.aliases.ui, '@/components/ui')
  assert.equal(config.aliases.utils, '@/lib/utils')
})

test('package manifest does not depend on HeroUI', async () => {
  const source = await readProjectFile('package.json')
  assert.doesNotMatch(source, /@heroui|@nextui/i)
})

test('theme support is wired through the root layout', async () => {
  const [manifestSource, layoutSource] = await Promise.all([
    readProjectFile('package.json'),
    readProjectFile('src/app/[locale]/layout.tsx')
  ])
  const manifest = JSON.parse(manifestSource) as { dependencies?: Record<string, string> }

  assert.equal(manifest.dependencies?.['next-themes'], '0.4.6')
  assert.match(layoutSource, /suppressHydrationWarning/)
  assert.match(layoutSource, /<ThemeProvider[^>]+defaultTheme='system'[^>]+enableSystem/)
})

test('App Router fallback boundaries are present', async () => {
  const [loadingSource, errorSource, globalErrorSource, notFoundSource, catchAllSource] = await Promise.all([
    readProjectFile('src/app/[locale]/loading.tsx'),
    readProjectFile('src/app/[locale]/error.tsx'),
    readProjectFile('src/app/global-error.tsx'),
    readProjectFile('src/app/[locale]/not-found.tsx'),
    readProjectFile('src/app/[locale]/[...rest]/page.tsx')
  ])

  assert.match(loadingSource, /aria-busy='true'/)
  assert.match(errorSource, /'use client'/)
  assert.match(errorSource, /reset/)
  assert.match(globalErrorSource, /<html lang='en'>/)
  assert.match(globalErrorSource, /<body>/)
  assert.match(notFoundSource, /href='\/'/)
  assert.match(catchAllSource, /notFound\(\)/)
})

test('CI runs the complete documented quality gate', async () => {
  const workflowSource = await readProjectFile('.github/workflows/quality.yml')

  assert.match(workflowSource, /permissions:\s+contents: read/)

  for (const command of ['format:check', 'lint', 'typecheck', 'test', 'build']) {
    assert.match(workflowSource, new RegExp(`run: pnpm ${command.replace(':', '\\:')}`))
  }
})

test('integration recipes document the implemented boundaries', async () => {
  const [openApiSource, tolgeeSource] = await Promise.all([
    readProjectFile('docs/recipes/openapi-codegen.md'),
    readProjectFile('docs/recipes/tolgee.md')
  ])

  assert.match(openApiSource, /pnpm generate/i)
  assert.match(openApiSource, /src\/api\/example-service/i)
  assert.match(openApiSource, /--axios/)
  assert.match(openApiSource, /contract/i)

  assert.match(tolgeeSource, /namespace/i)
  assert.match(tolgeeSource, /Do not call `changeLanguage\(\)` during render/)
  assert.match(tolgeeSource, /TOLGEE_API_KEY/)
})
