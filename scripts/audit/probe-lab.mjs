// Budget check for the /lab prototypes: true CPL of running text + axe in both themes/widths.
// Usage: MSYS_NO_PATHCONV=1 node scripts/audit/probe-lab.mjs
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { serve, launch, openPage, settle } from './lib.mjs'
import { CPL_FN } from './cpl.mjs'

const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')
const TARGETS = [['/lab/a', '.la-problem, .la-sub'], ['/lab/b', '.lb-pbr dd, .lb-role'], ['/lab/article', '.art-grid > p']]
const { server, base } = await serve(4177)
const b = await launch()
try {
  for (const [route, sel] of TARGETS) {
    for (const width of [375, 1440]) {
      for (const theme of ['light', 'dark']) {
        const p = await openPage(b, { width, theme })
        await p.goto(base + route, { waitUntil: 'networkidle0' })
        await settle(p)
        const info = await p.evaluate((sel) => {
          const els = [...document.querySelectorAll(sel)].filter((e) => e.textContent.length > 120)
          const e = els.sort((a, b) => b.textContent.length - a.textContent.length)[0]
          window.__para = e
          const cs = getComputedStyle(e)
          return { font: cs.fontFamily.split(',')[0], size: cs.fontSize, lh: cs.lineHeight, h: document.documentElement.scrollHeight, vh: innerHeight }
        }, sel)
        info.cpl = await p.evaluate(`(${CPL_FN})(window.__para)`)
        await p.addScriptTag({ content: axeSource })
        const v = await p.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((x) => `${x.id}(${x.impact}×${x.nodes.length}: ${x.nodes[0].target.join(' ')})`))
        console.log(route, width, theme, `${info.font} ${info.size}/${info.lh} cpl=${info.cpl} length=${(info.h / info.vh).toFixed(1)}scr`, v.length ? v.join(', ') : 'axe clean')
        await p.close()
      }
    }
  }
} finally {
  await b.close()
  server.close()
}
