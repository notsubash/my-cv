// Shared helpers for the redesign audit scripts: static server over dist/,
// a Puppeteer browser that blocks every non-localhost request (so audits never
// send PostHog / Cal.com / Vercel events), and the route list from prerender.mjs.
import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import puppeteer from 'puppeteer'

export const ROOT = process.cwd()
const DIST = join(ROOT, 'dist')

export function routes() {
  const src = readFileSync(join(ROOT, 'scripts/prerender.mjs'), 'utf8')
  const block = src.match(/const ROUTES = \[([\s\S]*?)\]/)[1]
  return [...block.matchAll(/'([^']+)'/g)].map((m) => m[1])
}

export function slug(route) {
  return route === '/' ? 'home' : route.slice(1).replace(/\//g, '__')
}

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.mp4': 'video/mp4', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml',
  '.txt': 'text/plain', '.pdf': 'application/pdf',
}

export function serve(port = 4174) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0])
      let file = join(DIST, url === '/' ? 'index.html' : url)
      if (!extname(file)) {
        const idx = join(file, 'index.html')
        file = existsSync(idx) ? idx : join(DIST, '404.html')
      }
      if (!existsSync(file)) { res.writeHead(404); res.end(); return }
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
      res.end(readFileSync(file))
    })
    server.listen(port, () => resolve({ server, base: `http://localhost:${port}` }))
  })
}

export async function launch() {
  return puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
}

/** New page with external requests blocked and theme / motion emulated. */
export async function openPage(browser, { width, theme = 'light', reducedMotion = false }) {
  const page = await browser.newPage()
  const mobile = width < 768
  await page.setViewport({ width, height: mobile ? 812 : 900, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile })
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: theme },
    { name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' },
  ])
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const u = req.url()
    if (u.startsWith('http://localhost') || u.startsWith('data:') || u.startsWith('blob:')) req.continue()
    else req.abort()
  })
  return page
}

/** Scroll the whole page so whileInView / IntersectionObserver content mounts, then return to top. */
export async function settle(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 900))
}
