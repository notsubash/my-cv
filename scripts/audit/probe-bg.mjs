// Diagnose which element paints the page background near the top-left.
import { serve, launch, openPage } from './lib.mjs'
const { server, base } = await serve(4215)
const b = await launch()
try {
  const p = await openPage(b, { width: 1440, theme: 'light' })
  await p.goto(base + '/', { waitUntil: 'networkidle0' })
  const info = await p.evaluate(() => {
    const out = []
    for (const el of [document.documentElement, document.body, document.getElementById('root'), document.elementFromPoint(60, 300)]) {
      const cs = getComputedStyle(el)
      out.push({ el: el.tagName + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 3).join('.') : ''),
        bgColor: cs.backgroundColor, bgImage: cs.backgroundImage.slice(0, 90) })
    }
    return out
  })
  console.log(JSON.stringify(info, null, 1))
} finally {
  await b.close()
  server.close()
}
