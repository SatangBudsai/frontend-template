import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import test from 'node:test'

async function readProjectFile(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

async function readSourceTree() {
  const sourceRoot = new URL('../src/', import.meta.url)
  const paths = await readdir(sourceRoot, { recursive: true })
  const sourceFiles = paths.filter(path => /\.(?:ts|tsx)$/.test(path))

  return Promise.all(sourceFiles.map(path => readFile(new URL(path.replaceAll('\\', '/'), sourceRoot), 'utf8'))).then(
    files => files.join('\n')
  )
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

test('TanStack Query and Redux use request-safe provider boundaries', async () => {
  const [manifestSource, layoutSource, queryProviderSource, reduxProviderSource, storeSource, hooksSource] =
    await Promise.all([
      readProjectFile('package.json'),
      readProjectFile('src/app/[locale]/layout.tsx'),
      readProjectFile('src/providers/query-provider.tsx'),
      readProjectFile('src/providers/redux-provider.tsx'),
      readProjectFile('src/store/store.ts'),
      readProjectFile('src/store/hooks.ts')
    ])
  const manifest = JSON.parse(manifestSource) as { dependencies?: Record<string, string> }

  assert.equal(manifest.dependencies?.['@tanstack/react-query'], '5.102.8')
  assert.equal(manifest.dependencies?.['@reduxjs/toolkit'], '2.12.0')
  assert.equal(manifest.dependencies?.['react-redux'], '9.3.0')
  assert.match(queryProviderSource, /environmentManager\.isServer\(\)/)
  assert.match(queryProviderSource, /staleTime: 60_000/)
  assert.match(reduxProviderSource, /useState\(makeStore\)/)
  assert.match(storeSource, /export function makeStore\(\)/)
  assert.doesNotMatch(storeSource, /export const store\s*=/)
  assert.match(hooksSource, /useDispatch\.withTypes<AppDispatch>\(\)/)
  assert.match(
    layoutSource,
    /<ReduxProvider>\s*<QueryProvider>\s*<AuthProvider>\{children\}<\/AuthProvider>\s*<\/QueryProvider>\s*<\/ReduxProvider>/
  )
})

test('Iconify is the shared icon runtime and Lucide is absent', async () => {
  const [manifestSource, iconSource, iconConfigSource, componentsSource, applicationSource] = await Promise.all([
    readProjectFile('package.json'),
    readProjectFile('src/components/ui/icon.tsx'),
    readProjectFile('src/config/icons.ts'),
    readProjectFile('components.json'),
    readSourceTree()
  ])
  const manifest = JSON.parse(manifestSource) as { dependencies?: Record<string, string> }
  const components = JSON.parse(componentsSource) as { iconLibrary?: string }

  assert.equal(manifest.dependencies?.['@iconify/react'], '6.0.2')
  assert.equal(manifest.dependencies?.['lucide-react'], undefined)
  assert.equal(components.iconLibrary, undefined)
  assert.match(iconSource, /from '@iconify\/react'/)
  assert.match(iconConfigSource, /material-symbols:/)
  assert.doesNotMatch(applicationSource, /lucide-react/)
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
  assert.match(globalErrorSource, /global-error\.module\.css/)
  assert.match(globalErrorSource, /role='alert'/)
  assert.match(notFoundSource, /href='\/'/)
  assert.match(catchAllSource, /notFound\(\)/)
})

test('CI runs the complete documented quality gate', async () => {
  const workflowSource = await readProjectFile('.github/workflows/quality.yml')

  assert.match(workflowSource, /permissions:\s+contents: read/)

  for (const command of ['format:check', 'lint', 'typecheck', 'test', 'build']) {
    assert.match(workflowSource, new RegExp(`run: pnpm ${command.replace(':', '\\:')}`))
  }

  assert.doesNotMatch(workflowSource, /playwright|test:e2e/i)
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
