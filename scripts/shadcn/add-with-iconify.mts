import { spawnSync } from 'node:child_process'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const sourceRoot = path.join(projectRoot, 'src')
const iconConfigPath = path.join(sourceRoot, 'config', 'icons.ts')
const lucideImportPattern = /import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"];?\s*/g

type IconMapping = {
  key: string
  icon: string
}

async function listSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(entry => {
      const fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return listSourceFiles(fullPath)
      return /\.tsx?$/.test(entry.name) ? [fullPath] : []
    })
  )

  return nested.flat()
}

function toIconMapping(componentName: string): IconMapping {
  const baseName = componentName.replace(/Icon$/, '')
  const key = `${baseName.charAt(0).toLowerCase()}${baseName.slice(1)}`
  const icon = baseName
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()

  return { key, icon: `lucide:${icon}` }
}

function addSharedImports(source: string) {
  const imports = [
    source.includes("from '@/config/icons'") ? null : "import { appIcons } from '@/config/icons'",
    source.includes("from '@/components/ui/icon'") ? null : "import { Icon } from '@/components/ui/icon'"
  ].filter(Boolean)

  if (!imports.length) return source

  const importBlock = `${imports.join('\n')}\n\n`
  const importStatements = [...source.matchAll(/^import[\s\S]*?from\s+['"][^'"]+['"];?$/gm)]
  const lastImport = importStatements.at(-1)
  if (lastImport?.index !== undefined) {
    const insertAt = lastImport.index + lastImport[0].length
    return `${source.slice(0, insertAt)}\n\n${importBlock}${source.slice(insertAt).trimStart()}`
  }

  const directive = source.match(/^(['"]use client['"];?\s*)/)
  return directive ? `${directive[0]}\n${importBlock}${source.slice(directive[0].length)}` : `${importBlock}${source}`
}

async function convertLucideImports(filePath: string): Promise<IconMapping[]> {
  const source = await readFile(filePath, 'utf8')
  const imports = [...source.matchAll(lucideImportPattern)]
  if (!imports.length) return []

  const componentNames = imports.flatMap(match =>
    match[1]
      .split(',')
      .map(name => name.trim())
      .filter(Boolean)
      .map(name => name.split(/\s+as\s+/).at(-1) ?? name)
  )
  const mappings = componentNames.map(toIconMapping)
  let output = source.replace(lucideImportPattern, '')

  for (const [index, componentName] of componentNames.entries()) {
    const { key } = mappings[index]
    output = output
      .replace(new RegExp(`<${componentName}(?=[\\s/>])`, 'g'), `<Icon icon={appIcons.${key}}`)
      .replace(new RegExp(`</${componentName}>`, 'g'), '</Icon>')

    if (new RegExp(`\\b${componentName}\\b`).test(output)) {
      throw new Error(
        `${path.relative(projectRoot, filePath)} still uses ${componentName} outside JSX. Convert that usage manually.`
      )
    }
  }

  await writeFile(filePath, addSharedImports(output), 'utf8')
  return mappings
}

async function updateIconConfig(mappings: IconMapping[]) {
  if (!mappings.length) return

  const source = await readFile(iconConfigPath, 'utf8')
  const objectPattern = /export const appIcons = \{\n([\s\S]*?)\n\} as const/
  const match = source.match(objectPattern)
  if (!match) throw new Error('src/config/icons.ts must keep the standard appIcons object shape.')

  const entries = match[1]
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
  const existingKeys = new Set(entries.map(line => line.match(/^([A-Za-z\d_$]+):/)?.[1]).filter(Boolean))

  for (const mapping of mappings) {
    if (!existingKeys.has(mapping.key)) {
      entries.push(`${mapping.key}: '${mapping.icon}',`)
      existingKeys.add(mapping.key)
    }
  }

  entries.sort((left, right) => left.localeCompare(right))
  const body = entries.map(entry => `  ${entry}`).join('\n')
  await writeFile(
    iconConfigPath,
    source.replace(objectPattern, `export const appIcons = {\n${body}\n} as const`),
    'utf8'
  )
}

function run(command: string, args: string[]) {
  const useCurrentPnpm = command === 'pnpm' && process.env.npm_execpath
  const executable = useCurrentPnpm ? process.execPath : command
  const commandArgs = useCurrentPnpm ? [process.env.npm_execpath as string, ...args] : args
  const result = spawnSync(executable, commandArgs, { cwd: projectRoot, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

async function removeLucideDependency() {
  const manifestPath = path.join(projectRoot, 'package.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }

  if (manifest.dependencies?.['lucide-react'] || manifest.devDependencies?.['lucide-react']) {
    run('pnpm', ['remove', 'lucide-react'])
  }
}

async function assertIconifyOnly(files: string[]) {
  const offenders: string[] = []
  for (const filePath of files) {
    if ((await readFile(filePath, 'utf8')).includes('lucide-react'))
      offenders.push(path.relative(projectRoot, filePath))
  }

  const manifest = await readFile(path.join(projectRoot, 'package.json'), 'utf8')
  if (manifest.includes('lucide-react')) offenders.push('package.json')

  if (offenders.length) {
    throw new Error(`Lucide remains in: ${offenders.join(', ')}`)
  }
}

const args = process.argv.slice(2)
const checkOnly = args.length === 1 && args[0] === '--check'

if (!checkOnly && !args.length) {
  console.error('Usage: pnpm ui:add <component...> [shadcn add options]')
  process.exit(1)
}

if (!checkOnly) run('pnpm', ['exec', 'shadcn', 'add', ...args])

const sourceFiles = await listSourceFiles(sourceRoot)

if (checkOnly) {
  await assertIconifyOnly(sourceFiles)
  console.log('Icon check passed: no lucide-react usage found.')
  process.exit(0)
}

const mappings = (await Promise.all(sourceFiles.map(convertLucideImports))).flat()
await updateIconConfig(mappings)
await removeLucideDependency()
await assertIconifyOnly(sourceFiles)
run('pnpm', ['icons:generate'])

if (mappings.length) {
  run('pnpm', ['exec', 'prettier', '--write', ...sourceFiles, iconConfigPath])
  console.log(`Converted ${mappings.length} generated icon usage(s) to the shared Iconify wrapper.`)
} else {
  console.log('No generated Lucide icons needed conversion.')
}
