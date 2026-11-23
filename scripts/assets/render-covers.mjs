// Render 16:10 project covers (1280×800 WebP, the homepage preview shape) from each project's own assets.
// Usage: node scripts/assets/render-covers.mjs
//   - craft: public/craft-banner.svg (3.2:1) scaled to fill the frame height and cropped to
//     its left half (logo, tagline, skill chips) so it reads at preview size.
//   - lastcall: supplied by the owner as public/lastcall-banner.png (2:1). The preview box is 16:10, so pad
//     with the banner's own black rather than cropping (cropping cut off the logo mark):
//     `ffmpeg -i public/lastcall-banner.png -vf "scale=1280:-1,pad=1280:800:0:(oh-ih)/2:color=black" -c:v libwebp -quality 84 public/projects/lastcall.webp`
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer'

const ROOT = process.cwd()
const craftSvg = readFileSync(join(ROOT, 'public/craft-banner.svg'), 'utf8')
// 16:10 frame (the homepage preview box). Crop the banner's own viewBox to the logo, tagline and chips
// (x 30–790 of 1280; the terminal panel starts ~800), scale to the frame width, and fade the top and bottom
// edges into the banner background so the letterbox has no seam.
const craftCropped = craftSvg.replace(/viewBox="0 0 1280 400"/, 'viewBox="30 0 760 400"').replace(/ width="1280" height="400"/, '')
const craftHtml = `<!doctype html><html><head><style>
  body { margin:0; width:1280px; height:800px; overflow:hidden; background:#0e1014; display:flex; align-items:center; }
  svg { display:block; width:1280px; height:auto; flex:none;
        -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 14%, #000 86%, transparent 100%);
        mask-image: linear-gradient(to bottom, transparent 0, #000 14%, #000 86%, transparent 100%); }
</style></head><body>${craftCropped}</body></html>`

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.setContent(craftHtml, { waitUntil: 'load' })
  await page.screenshot({ path: join(ROOT, 'public/projects/craft.webp'), type: 'webp', quality: 86 })
  console.log('✓ public/projects/craft.webp')
} finally {
  await browser.close()
}
