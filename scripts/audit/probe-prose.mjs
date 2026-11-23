// Measure the real running-text paragraph (median long <p>) on key templates.
// Usage: node scripts/audit/probe-prose.mjs
import { serve, launch, openPage } from './lib.mjs'
import { CPL_FN } from './cpl.mjs'

const TARGETS = [
  ['/blog/when-a-self-parking-car-cannot-trust-its-imagination', '.prose-custom p'],
  ['/projects/gavel', 'article p'],
  ['/about', 'main p'],
  ['/', '#projects p'],
]
const { server, base } = await serve(4175)
const b = await launch()
try {
  for (const [route, sel] of TARGETS) {
    for (const width of [375, 1440]) {
      const p = await openPage(b, { width })
      await p.goto(base + route, { waitUntil: 'networkidle0' })
      const m = (await p.evaluate((sel) => {
        const ctx = document.createElement('canvas').getContext('2d')
        const s = 'The quick brown fox jumps over the lazy dog while a model learns from noisy labels, 0.89 F1.'
        const els = [...document.querySelectorAll(sel)].filter((e) => e.textContent.length > 150 && e.offsetParent)
        if (!els.length) return null
        const e = els[Math.floor(els.length / 2)]
        const cs = getComputedStyle(e)
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
        const w = e.getBoundingClientRect().width
        const cpl = Math.round(w / (ctx.measureText(s).width / s.length + (parseFloat(cs.letterSpacing) || 0)))
        window.__para = e
        return { n: els.length, size: cs.fontSize, lh: cs.lineHeight, color: cs.color, width: Math.round(w), cpl }
      }, sel))
      if (m) m.cplActual = await p.evaluate(`(${CPL_FN})(window.__para)`)
      console.log(route, width, JSON.stringify(m))
      await p.close()
    }
  }
} finally {
  await b.close()
  server.close()
}
