// Render 16:9 project covers (1280×720 WebP) from each project's own assets.
// Usage: node scripts/assets/render-covers.mjs
//   - craft: public/craft-banner.svg (3.2:1) scaled to fill the frame height and cropped to
//     its left half (logo, tagline, skill chips) so it reads at preview size.
//   - lastcall: supplied by the owner as public/lastcall-banner.png; converted with
//     `ffmpeg -i public/lastcall-banner.png -vf scale=1280:-1 -c:v libwebp -quality 84 public/projects/lastcall.webp`
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer'

const ROOT = process.cwd()
const craftSvg = readFileSync(join(ROOT, 'public/craft-banner.svg'), 'utf8')
// 400px banner height × 1.8 = 720px frame height; the crop keeps x 0–711 of the original.
const craftHtml = `<!doctype html><html><head><style>
  body { margin:0; width:1280px; height:720px; overflow:hidden; background:#0e1014; }
  svg { display:block; width:2304px; height:720px; margin-left:-40px; }
</style></head><body>${craftSvg}</body></html>`

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 })
  await page.setContent(craftHtml, { waitUntil: 'load' })
  await page.screenshot({ path: join(ROOT, 'public/projects/craft.webp'), type: 'webp', quality: 86 })
  console.log('✓ public/projects/craft.webp')
} finally {
  await browser.close()
}
