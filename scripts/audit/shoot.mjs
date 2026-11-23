// Full-page screenshots of every prerendered route.
// Usage: node scripts/audit/shoot.mjs <label> [--themes light,dark] [--widths 375,1440]
// Output: docs/redesign/screenshots/<label>/<route>.<width>.<theme>.webp
import { mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, routes, slug, serve, launch, openPage, settle } from './lib.mjs'

const args = process.argv.slice(2)
const label = args[0] ?? 'baseline'
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`)
  return (i >= 0 ? args[i + 1] : dflt).split(',')
}
const widths = opt('widths', '375,1440').map(Number)
const themes = opt('themes', 'light,dark')
const only = args.includes('--route') ? args[args.indexOf('--route') + 1].split(',') : null

const out = join(ROOT, 'docs/redesign/screenshots', label)
mkdirSync(out, { recursive: true })

// --base <origin> shoots a live deployment instead of dist/ (only that origin is allowed through).
const liveBase = args.includes('--base') ? args[args.indexOf('--base') + 1] : null
const { server, base: localBase } = await serve()
const base = liveBase ?? localBase
const browser = await launch()
try {
  for (const route of only ?? routes()) {
    for (const width of widths) {
      for (const theme of themes) {
        const page = await openPage(browser, { width, theme, allowOrigin: liveBase })
        await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 30000 })
        await settle(page)
        // Full-page capture skips painting off-screen content-visibility:auto regions; force them on.
        await page.addStyleTag({ content: '*{content-visibility:visible!important}[data-lab-switcher]{display:none!important}' })
        await new Promise((r) => setTimeout(r, 300))
        // WebP caps at 16,383 px; long posts fall back to JPEG (65,535 px).
        const tall = await page.evaluate(() => document.documentElement.scrollHeight > 16000)
        const stem = join(out, `${slug(route)}.${width}.${theme}`)
        rmSync(`${stem}.webp`, { force: true }); rmSync(`${stem}.jpg`, { force: true })
        const file = `${stem}.${tall ? 'jpg' : 'webp'}`
        await page.screenshot({ path: file, fullPage: true, type: tall ? 'jpeg' : 'webp', quality: 72 })
        console.log('  ✓', file.replace(ROOT, '.'))
        await page.close()
      }
    }
  }
} finally {
  await browser.close()
  server.close()
}
