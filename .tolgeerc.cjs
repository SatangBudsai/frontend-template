const projectId = process.env.TOLGEE_PROJECT_ID
const apiUrl = process.env.TOLGEE_API_URL || process.env.NEXT_PUBLIC_TOLGEE_API_URL || 'https://app.tolgee.io'

module.exports = {
  $schema: 'https://docs.tolgee.io/cli-schema.json',
  apiUrl,
  apiKey: process.env.TOLGEE_API_KEY,
  ...(projectId ? { projectId } : {}),
  format: 'JSON_ICU',
  patterns: ['./src/**/*.{ts,tsx}'],
  extractor: './scripts/tolgee/tolgee-extractor.cjs',
  defaultNamespace: 'common',
  push: {
    filesTemplate: './langs/{namespace}/{languageTag}.json',
    forceMode: 'NO_FORCE'
  },
  pull: {
    path: './langs',
    fileStructureTemplate: '{namespace}/{languageTag}.{extension}',
    delimiter: null
  },
  sync: {
    backup: './.tolgee-backup'
  }
}
