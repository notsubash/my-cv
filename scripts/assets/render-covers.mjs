// Render 16:9 project covers (1280×720 WebP) from each project's own assets.
// Usage: node scripts/assets/render-covers.mjs <lastcall-repo-dir>
//   - craft:    public/craft-banner.svg, centred on its own background colour
//   - lastcall: the repo's logo + a crop of its real timeline screen (docs/design/screens)
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer'

const ROOT = process.cwd()
const lastcallDir = process.argv[2]
if (!lastcallDir) throw new Error('pass the LastCall repo directory')

const dataUri = (file, mime) => `data:${mime};base64,${readFileSync(file).toString('base64')}`

const craftSvg = readFileSync(join(ROOT, 'public/craft-banner.svg'), 'utf8')
const craftHtml = `<!doctype html><html><head><style>svg{width:1160px;height:auto;border-radius:20px;box-shadow:0 0 0 1px rgb(255 255 255 / 0.06)}</style></head><body style="margin:0;width:1280px;height:720px;background:#0e1014;display:grid;place-items:center">
${craftSvg}</body></html>`

const logo = dataUri(join(lastcallDir, 'docs/brand/lastcall-logo.svg'), 'image/svg+xml')
const screen = dataUri(join(lastcallDir, 'docs/design/screens/timeline-desktop.png'), 'image/png')
// Colours sampled from the product: app background, header navy, stale yellow.
const lastcallHtml = `<!doctype html><html><head><style>
  body { margin:0; width:1280px; height:720px; overflow:hidden; background:#e3ebe8; font-family: system-ui, "Segoe UI", sans-serif; position:relative; }
  .copy { position:absolute; left:84px; top:0; bottom:0; width:420px; display:flex; flex-direction:column; justify-content:center; gap:28px; }
  .copy img { width:300px; }
  .copy p { margin:0; font-size:34px; line-height:1.18; font-weight:700; color:#203a52; letter-spacing:-0.01em; }
  .copy small { font-size:20px; line-height:1.4; color:#3f5566; font-weight:500; }
  .shot { position:absolute; left:560px; top:70px; width:820px; height:520px; overflow:hidden; border-radius:16px;
          box-shadow: 0 30px 60px rgb(32 58 82 / 0.22), 0 4px 12px rgb(32 58 82 / 0.12); background:#e3ebe8; }
  .shot img { position:absolute; width:1100px; left:-230px; top:-292px; }
</style></head><body>
  <div class="copy">
    <img src="${logo}" alt="">
    <p>Holds a scheduled post before its link goes stale.</p>
    <small>Sold out, job closed, event cancelled: caught before it publishes.</small>
  </div>
  <div class="shot"><img src="${screen}" alt=""></div>
</body></html>`

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
try {
  for (const [name, html] of [['craft', craftHtml], ['lastcall', lastcallHtml]]) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 })
    await page.setContent(html, { waitUntil: 'load' })
    await page.screenshot({ path: join(ROOT, `public/projects/${name}.webp`), type: 'webp', quality: 86 })
    console.log('✓ public/projects/' + name + '.webp')
    await page.close()
  }
} finally {
  await browser.close()
}
