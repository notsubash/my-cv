/**
 * Guards that keep the Puppeteer snapshot from flashing on createRoot takeover,
 * and that ban hydrateRoot (that API cannot match page.content() HTML).
 */
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

const failures = []

const nav = read('src/GlobalNav.tsx')
if (/isDark\s*\?\s*<Sun/.test(nav) || /isDark\s*\?\s*<Moon/.test(nav)) {
  failures.push('GlobalNav: theme toggle still branches Sun/Moon on isDark (prerender light vs client dark → React #418)')
}
if (!nav.includes('<Sun') || !nav.includes('<Moon')) {
  failures.push('GlobalNav: theme toggle must always render both Sun and Moon (CSS shows the active one)')
}

const cal = read('src/CalBookButton.tsx')
if (/data-cal-config=\{calConfig\}/.test(cal) && /theme,/.test(cal.split('JSON.stringify')[1]?.slice(0, 200) ?? '')) {
  failures.push('CalBookButton: data-cal-config still includes theme, which useEffect rewrites during prerender')
}
if (/setTheme\(next\)/.test(cal)) {
  failures.push('CalBookButton: setTheme during mount changes data-cal-config between prerender snapshot and first paint')
}

const main = read('src/main.tsx')
if (/\bhydrateRoot\s*\(/.test(main)) {
  failures.push('main.tsx: hydrateRoot cannot match Puppeteer snapshots (merged text nodes) and throws React #418')
}

const css = read('src/index.css')
if (!css.includes('figure:has(svg[role="img"]) > :not(figcaption):has(svg[role="img"])')) {
  failures.push('index.css: framed diagrams must scroll inside the card so SVG nodes cannot paint past the border')
}
if (!css.includes('figure:has(> svg[role="img"])')) {
  failures.push('index.css: unframed diagram figures must be a horizontal scrollport on small screens')
}

if (failures.length) {
  console.error('Hydration safety check failed:\n' + failures.map((f) => `  - ${f}`).join('\n'))
  process.exit(1)
}

console.log('Hydration safety check passed')
