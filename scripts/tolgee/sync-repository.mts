import { syncTranslationRepository } from './repository.mts'

const write = process.argv.includes('--write')
const result = await syncTranslationRepository({ write })
const action = write ? 'Updated' : 'Verified'

console.log(
  `${action} Tolgee repository state: ${result.namespaces.length} namespace(s), ${result.fallbacksChanged} fallback update(s), ${result.filesCreated.length} locale file(s) created.`
)
