// First-viewport screenshots (no scrolling), for checking hero treatments.
// Usage: MSYS_NO_PATHCONV=1 node scripts/audit/probe-fold.mjs <outDir> <route>@<width>@<theme> [...]
// e.g.  node scripts/audit/probe-fold.mjs docs/redesign/screenshots/fold /@1440@light /@375@dark
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, serve, launch, openPage, slug } from './lib.mjs'

const [outDir, ...specs] = process.argv.slice(2)
mkdirSync(join(ROOT, outDir), { recursive: true })
const { server, base } = await serve(4214)
const b = await launch()
try {
  for (const spec of specs) {
    const [route, w, theme] = spec.split('@')
    const p = await openPage(b, { width: Number(w), theme })
    await p.goto(base + route, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 1800)) // let the hero animation finish
    const file = join(ROOT, outDir, `${slug(route)}.${w}.${theme}.png`)
    await p.screenshot({ path: file })
    console.log('  ✓', file.replace(ROOT, '.'))
    await p.close()
  }
} finally {
  await b.close()
  server.close()
}
