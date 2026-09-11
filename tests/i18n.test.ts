import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'

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

  assert.ok(namespaces.includes('common'))

  for (const namespace of namespaces) {
    const [englishSource, thaiSource] = await Promise.all([
      readFile(join(resolve('langs'), namespace, 'en.json'), 'utf8'),
      readFile(join(resolve('langs'), namespace, 'th.json'), 'utf8')
    ])
    const english = flattenTranslations(JSON.parse(englishSource))
    const thai = flattenTranslations(JSON.parse(thaiSource))

    assert.deepEqual(Object.keys(thai).sort(), Object.keys(english).sort(), namespace)

    for (const [key, value] of Object.entries({ ...english, ...thai })) {
      assert.ok(value.trim(), `Translation must not be empty: ${namespace}:${key}`)
    }
  }
})

test('locale routing defaults to Thai, remembers the choice, and always uses a prefix', async () => {
  const [routingSource, proxySource] = await Promise.all([
    readProjectFile('src/i18n/routing.ts'),
    readProjectFile('src/proxy.ts')
  ])

  assert.match(routingSource, /locales = \['th', 'en'\]/)
  assert.match(routingSource, /defaultLocale[^\n]+ = 'th'/)
  assert.match(routingSource, /localeDetection: false/)
  assert.match(routingSource, /name: 'NEXT_LOCALE'/)
  assert.match(routingSource, /maxAge: 60 \* 60 \* 24 \* 365/)
  assert.match(routingSource, /localePrefix: 'always'/)
  assert.match(proxySource, /request\.cookies\.get\(localeCookie\.name\)/)
  assert.match(proxySource, /resolvePreferredLocale\(request\.nextUrl\.pathname, savedLocale\)/)
  assert.match(proxySource, /createMiddleware\(\{ \.\.\.routing, defaultLocale: preferredLocale \}\)/)
  assert.match(proxySource, /response\.cookies\.set\(localeCookie\.name/)
})

test('locale preference uses an explicit prefix, then a saved locale, then Thai', () => {
  assert.equal(resolvePreferredLocale('/en/projects/42', 'th'), 'en')
  assert.equal(resolvePreferredLocale('/projects/42', 'en'), 'en')
  assert.equal(resolvePreferredLocale('/main'), 'th')
  assert.equal(resolvePreferredLocale('/main', 'unsupported'), 'th')
})

test('Tolgee stays behind an explicit provider with generated static imports', async () => {
  const [sharedSource, clientSource, switcherSource, generatedConfigSource] = await Promise.all([
    readProjectFile('src/tolgee/shared.ts'),
    readProjectFile('src/tolgee/client.tsx'),
    readProjectFile('src/components/language-switcher.tsx'),
    readProjectFile('src/tolgee/config.ts')
  ])
  const implementation = `${sharedSource}\n${clientSource}\n${switcherSource}`

  assert.doesNotMatch(implementation, /globalThis\.fetch\s*=/)
  assert.doesNotMatch(implementation, /changeLanguage\s*\(/)
  assert.match(sharedSource, /staticData/)
  assert.match(sharedSource, /NODE_ENV === 'development' && enableDevTools && apiKey && apiUrl/)
  assert.match(sharedSource, /useRemoteDevelopment \? \{ apiKey, apiUrl \} : \{\}/)
  assert.match(generatedConfigSource, /'en:common'/)
  assert.match(generatedConfigSource, /'th:common'/)
  assert.match(generatedConfigSource, /langs\/common\/en\.json/)
  assert.match(clientSource, /permanentChange/)
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
    assert.ok(manifest.scripts?.[script], `Missing package script: ${script}`)
  }

  assert.match(manifest.scripts?.['i18n:pull'] ?? '', /i18n:pull:remote && pnpm i18n:generate/)
  assert.match(manifest.scripts?.['i18n:generate'] ?? '', /sync-repository\.mts --write/)
  assert.match(manifest.scripts?.['i18n:check'] ?? '', /sync-repository\.mts/)

  assert.equal(manifest.dependencies?.['next-intl'], '4.14.3')
  assert.equal(manifest.dependencies?.['@tolgee/react'], '7.2.1')
  assert.equal(manifest.devDependencies?.['@tolgee/cli'], '2.20.0')
})

test('repository synchronization updates explicit source fallbacks safely', () => {
  const translations = new Map([
    ['common:greeting', "สวัสดี 'คุณ'"],
    ['common:multiline', 'บรรทัดหนึ่ง\nบรรทัดสอง']
  ])
  const source = `const first = t('common:greeting', 'Old')\nconst second = t("common:multiline", "Old")`
  const result = updateTranslationDefaults(source, translations)

  assert.equal(result.fallbacksChanged, 2)
  assert.deepEqual(result.missingKeys, [])
  assert.match(result.source, /t\('common:greeting', 'สวัสดี \\'คุณ\\''\)/)
  assert.match(result.source, /t\("common:multiline", "บรรทัดหนึ่ง\\nบรรทัดสอง"\)/)
})

test('repository synchronization reports source keys missing from local catalogs', () => {
  const result = updateTranslationDefaults(`t('feature:missing.key', 'Fallback')`, new Map())

  assert.deepEqual(result.missingKeys, ['feature:missing.key'])
  assert.equal(result.fallbacksChanged, 0)
})

test('repository synchronization writes pulled values into generated code and source fallbacks', async () => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'frontend-template-tolgee-'))

  try {
    await Promise.all([
      mkdir(join(fixtureRoot, 'langs/common'), { recursive: true }),
      mkdir(join(fixtureRoot, 'src/tolgee'), { recursive: true })
    ])
    await Promise.all([
      writeFile(join(fixtureRoot, 'langs/common/th.json'), '{"greeting":"สวัสดี"}\n', 'utf8'),
      writeFile(join(fixtureRoot, 'langs/common/en.json'), '{"greeting":"Hello"}\n', 'utf8'),
      writeFile(join(fixtureRoot, 'src/tolgee/config.ts'), '', 'utf8'),
      writeFile(join(fixtureRoot, 'src/page.ts'), "const value = t('common:greeting', 'Old value')\n", 'utf8')
    ])

    const result = await syncTranslationRepository({ write: true, rootDirectory: fixtureRoot })
    const [source, generatedConfig] = await Promise.all([
      readFile(join(fixtureRoot, 'src/page.ts'), 'utf8'),
      readFile(join(fixtureRoot, 'src/tolgee/config.ts'), 'utf8')
    ])

    assert.equal(result.fallbacksChanged, 1)
    assert.match(source, /t\('common:greeting', 'สวัสดี'\)/)
    assert.match(generatedConfig, /langs\/common\/th\.json/)
    await assert.doesNotReject(syncTranslationRepository({ write: false, rootDirectory: fixtureRoot }))
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true })
  }
})
