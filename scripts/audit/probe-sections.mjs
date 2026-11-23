// Check whether homepage sections below Projects actually paint for a real scrolling user.
// Usage: node scripts/audit/probe-sections.mjs
import { join } from 'node:path'
import { ROOT, serve, launch, openPage } from './lib.mjs'

const { server, base } = await serve(4176)
const b = await launch()
try {
  const p = await openPage(b, { width: 1440, theme: 'light' })
  await p.goto(base + '/', { waitUntil: 'networkidle0' })
  for (const id of ['experience', 'speaking', 'education', 'tech']) {
    // Scroll like a user: wheel steps so IntersectionObserver fires naturally.
    await p.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: 'start' }), id)
    await new Promise((r) => setTimeout(r, 1500))
    const info = await p.evaluate((id) => {
      const s = document.getElementById(id)
      if (!s) return { missing: true }
      const r = s.getBoundingClientRect()
      const hidden = [...s.querySelectorAll('*')].filter((e) => getComputedStyle(e).opacity === '0').length
      return { top: Math.round(r.top), height: Math.round(r.height), textChars: s.innerText.length, opacity0: hidden, cv: getComputedStyle(s).contentVisibility }
    }, id)
    console.log(id, JSON.stringify(info))
    await p.screenshot({ path: join(ROOT, `docs/redesign/screenshots/baseline-fold/home-section-${id}.1440.webp`), type: 'webp', quality: 75 })
  }
} finally {
  await b.close()
  server.close()
}
