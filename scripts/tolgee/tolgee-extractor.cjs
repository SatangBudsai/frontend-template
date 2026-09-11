module.exports = function extractNamespacedTranslations(code) {
  const keys = []
  const callPattern = /\bt\(\s*(['"])([^'"]+)\1(?:\s*,\s*(['"])((?:\\.|[^\\])*?)\3)?/g
  let match

  while ((match = callPattern.exec(code)) !== null) {
    const fullKey = match[2]
    const separator = fullKey.indexOf(':')

    if (separator <= 0 || separator === fullKey.length - 1) continue

    keys.push({
      namespace: fullKey.slice(0, separator),
      keyName: fullKey.slice(separator + 1),
      defaultValue: match[4],
      line: code.slice(0, match.index).split('\n').length
    })
  }

  return { keys, warnings: [] }
}
