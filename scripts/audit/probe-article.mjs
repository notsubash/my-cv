// Viewport shots of an article at specific elements, for typography review.
// Usage: MSYS_NO_PATHCONV=1 node scripts/audit/probe-article.mjs <route> <label> [width]
import { join } from 'node:path'
import { mkdirSync } from 'node:fs'
import { ROOT, serve, launch, openPage } from './lib.mjs'

const [route, label = 'probe', w = '1440'] = process.argv.slice(2)
const out = join(ROOT, 'docs/redesign/screenshots', `${label}-detail`)
mkdirSync(out, { recursive: true })
const TARGETS = [
  ['header', '.post > header, .case > header'],
  ['list', '.prose-custom ul, .prose-custom ol'],
  ['diagram', '.prose-custom figure svg[role="img"], .prose-custom figure:has(svg)'],
  ['code', '.prose-custom .codeblock'],
  ['figure', '.prose-custom figure:not(.codeblock):has(img)'],
  ['math', '.prose-custom .eq'],
  ['callout', '.prose-custom [class*="rounded"][class*="border"]:not(figure)'],
]
const { server, base } = await serve(4190)
const b = await launch()
try {
  const p = await openPage(b, { width: Number(w), theme: 'light' })
  await p.goto(base + route, { waitUntil: 'networkidle0' })
  for (const [name, sel] of TARGETS) {
    const found = await p.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (!el) return false
      el.scrollIntoView({ block: 'center' })
      return true
    }, sel)
    if (!found) { console.log('  - no', name); continue }
    await new Promise((r) => setTimeout(r, 500))
    const file = join(out, `${route.split('/').pop() || 'home'}.${w}.${name}.webp`)
    await p.screenshot({ path: file, type: 'webp', quality: 80 })
    console.log('  ✓', file.replace(ROOT, '.'))
  }
} finally {
  await b.close()
  server.close()
}
