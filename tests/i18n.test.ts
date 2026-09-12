import { expect, test } from '@playwright/test'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import {
  flattenTranslations,
  syncTranslationRepository,
  updateTranslationDefaults
} from '../scripts/tolgee/repository.mts'
import { resolvePreferredLocale } from '../src/i18n/routing.ts'

async function readProjectFile(path: string) {
  return readFile(resolve(path), 'utf8')
}

test('every namespace has matching Thai and English translation keys', async () => {
  const namespaces = (await readdir(resolve('langs'), { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)

  expect(namespaces).toContain('common')

  for (const namespace of namespaces) {
    const [englishSource, thaiSource] = await Promise.all([
      readFile(join(resolve('langs'), namespace, 'en.json'), 'utf8'),
      readFile(join(resolve('langs'), namespace, 'th.json'), 'utf8')
    ])
    const english = flattenTranslations(JSON.parse(englishSource))
    const thai = flattenTranslations(JSON.parse(thaiSource))

    expect(Object.keys(thai).sort(), namespace).toEqual(Object.keys(english).sort())

    for (const [key, value] of Object.entries({ ...english, ...thai })) {
      expect(value.trim(), `Translation must not be empty: ${namespace}:${key}`).not.toBe('')
    }
  }
})

test('locale routing defaults to Thai, remembers the choice, and always uses a prefix', async () => {
  const [routingSource, proxySource] = await Promise.all([
    readProjectFile('src/i18n/routing.ts'),
    readProjectFile('src/proxy.ts')
  ])

  expect(routingSource).toMatch(/locales = \['th', 'en'\]/)
  expect(routingSource).toMatch(/defaultLocale[^\n]+ = 'th'/)
  expect(routingSource).toMatch(/localeDetection: false/)
  expect(routingSource).toMatch(/name: 'NEXT_LOCALE'/)
  expect(routingSource).toMatch(/maxAge: 60 \* 60 \* 24 \* 365/)
  expect(routingSource).toMatch(/localePrefix: 'always'/)
  expect(proxySource).toMatch(/request\.cookies\.get\(localeCookie\.name\)/)
  expect(proxySource).toMatch(/resolvePreferredLocale\(request\.nextUrl\.pathname, savedLocale\)/)
  expect(proxySource).toMatch(/createMiddleware\(\{ \.\.\.routing, defaultLocale: preferredLocale \}\)/)
  expect(proxySource).toMatch(/response\.cookies\.set\(localeCookie\.name/)
})

test('locale preference uses an explicit prefix, then a saved locale, then Thai', () => {
  expect(resolvePreferredLocale('/en/projects/42', 'th')).toBe('en')
  expect(resolvePreferredLocale('/projects/42', 'en')).toBe('en')
  expect(resolvePreferredLocale('/main')).toBe('th')
  expect(resolvePreferredLocale('/main', 'unsupported')).toBe('th')
})

test('Tolgee stays behind an explicit provider with generated static imports', async () => {
  const [sharedSource, clientSource, switcherSource, generatedConfigSource] = await Promise.all([
    readProjectFile('src/tolgee/shared.ts'),
    readProjectFile('src/tolgee/client.tsx'),
    readProjectFile('src/components/language-switcher.tsx'),
    readProjectFile('src/tolgee/config.ts')
  ])
  const implementation = `${sharedSource}\n${clientSource}\n${switcherSource}`

  expect(implementation).not.toMatch(/globalThis\.fetch\s*=/)
  expect(implementation).not.toMatch(/changeLanguage\s*\(/)
  expect(sharedSource).toMatch(/staticData/)
  expect(sharedSource).toMatch(/NODE_ENV === 'development' && enableDevTools && apiKey && apiUrl/)
  expect(sharedSource).toMatch(/useRemoteDevelopment \? \{ apiKey, apiUrl \} : \{\}/)
  expect(generatedConfigSource).toMatch(/'en:common'/)
  expect(generatedConfigSource).toMatch(/'th:common'/)
  expect(generatedConfigSource).toMatch(/langs\/common\/en\.json/)
  expect(clientSource).toMatch(/permanentChange/)
})

test('pull chains the remote fetch into deterministic repository generation', async () => {
  const manifest = JSON.parse(await readProjectFile('package.json')) as {
    scripts?: Record<string, string>
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }

  for (const script of [
    'i18n:extract',
    'i18n:generate',
    'i18n:check',
    'i18n:compare',
    'i18n:pull',
    'i18n:push',
    'i18n:push-force'
  ]) {
    expect(manifest.scripts?.[script], `Missing package script: ${script}`).toBeTruthy()
  }

  expect(manifest.scripts?.['i18n:pull'] ?? '').toMatch(/i18n:pull:remote && pnpm i18n:generate/)
  expect(manifest.scripts?.['i18n:generate'] ?? '').toMatch(/sync-repository\.mts --write/)
  expect(manifest.scripts?.['i18n:check'] ?? '').toMatch(/sync-repository\.mts/)
  expect(manifest.dependencies?.['next-intl']).toBe('4.14.3')
  expect(manifest.dependencies?.['@tolgee/react']).toBe('7.2.1')
  expect(manifest.devDependencies?.['@tolgee/cli']).toBe('2.20.0')
})

test('repository synchronization updates explicit source fallbacks safely', () => {
  const translations = new Map([
    ['common:greeting', "Hello 'friend'"],
    ['common:multiline', 'Line one\nLine two']
  ])
  const source = `const first = t('common:greeting', 'Old')\nconst second = t("common:multiline", "Old")`
  const result = updateTranslationDefaults(source, translations)

  expect(result.fallbacksChanged).toBe(2)
  expect(result.missingKeys).toEqual([])
  expect(result.source).toContain(`t('common:greeting', 'Hello \\'friend\\'')`)
  expect(result.source).toContain('t("common:multiline", "Line one\\nLine two")')
})

test('repository synchronization reports source keys missing from local catalogs', () => {
  const result = updateTranslationDefaults(`t('feature:missing.key', 'Fallback')`, new Map())

  expect(result.missingKeys).toEqual(['feature:missing.key'])
  expect(result.fallbacksChanged).toBe(0)
})

test('repository synchronization writes pulled values into generated code and source fallbacks', async () => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'frontend-template-tolgee-'))

  try {
    await Promise.all([
      mkdir(join(fixtureRoot, 'langs/common'), { recursive: true }),
      mkdir(join(fixtureRoot, 'src/tolgee'), { recursive: true })
    ])
    await Promise.all([
      writeFile(join(fixtureRoot, 'langs/common/th.json'), '{"greeting":"Local greeting"}\n', 'utf8'),
      writeFile(join(fixtureRoot, 'langs/common/en.json'), '{"greeting":"Hello"}\n', 'utf8'),
      writeFile(join(fixtureRoot, 'src/tolgee/config.ts'), '', 'utf8'),
      writeFile(join(fixtureRoot, 'src/page.ts'), "const value = t('common:greeting', 'Old value')\n", 'utf8')
    ])

    const result = await syncTranslationRepository({ write: true, rootDirectory: fixtureRoot })
    const [source, generatedConfig] = await Promise.all([
      readFile(join(fixtureRoot, 'src/page.ts'), 'utf8'),
      readFile(join(fixtureRoot, 'src/tolgee/config.ts'), 'utf8')
    ])

    expect(result.fallbacksChanged).toBe(1)
    expect(source).toContain("t('common:greeting', 'Local greeting')")
    expect(generatedConfig).toMatch(/langs\/common\/th\.json/)
    await expect(syncTranslationRepository({ write: false, rootDirectory: fixtureRoot })).resolves.toBeDefined()
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true })
  }
})
