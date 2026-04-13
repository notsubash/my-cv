import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import puppeteer from 'puppeteer'

const DIST = join(process.cwd(), 'dist')
const PORT = 4173
const BASE = `http://localhost:${PORT}`

const ROUTES = [
  '/',
  '/about',
  '/blog',
  '/blog/rag-pipeline',
  '/blog/audio-feature-extraction',
  '/blog/steam-genre-networks',
  '/blog/ml-from-scratch',
  '/projects/activity-recognition',
  '/projects/steam-ml',
  '/projects/wikipedia-voting',
  '/privacy',
]

const NOT_FOUND_ROUTE = '/this-page-does-not-exist-404'

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.xml':  'application/xml',
  '.txt':  'text/plain',
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url)

      if (!existsSync(filePath) && !extname(filePath)) {
        filePath = join(DIST, 'index.html')
      }

      if (!existsSync(filePath)) {
        res.writeHead(404)
        res.end('Not found')
        return
      }

      const ext = extname(filePath)
      const mime = MIME_TYPES[ext] || 'application/octet-stream'
      const content = readFileSync(filePath)
      res.writeHead(200, { 'Content-Type': mime })
      res.end(content)
    })

    server.listen(PORT, () => {
      console.log(`  Static server running on ${BASE}`)
      resolve(server)
    })
  })
}

async function prerenderRoute(page, route) {
  const url = `${BASE}${route}`
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

  await page.evaluate(() => {
    return new Promise((resolve) => {
      if (document.querySelector('#root')?.children.length > 0) {
        resolve()
      } else {
        const observer = new MutationObserver(() => {
          if (document.querySelector('#root')?.children.length > 0) {
            observer.disconnect()
            resolve()
          }
        })
        observer.observe(document.querySelector('#root'), { childList: true })
        setTimeout(resolve, 5000)
      }
    })
  })

  await new Promise((r) => setTimeout(r, 500))

  const html = await page.content()
  return html
}

function writeRoute(route, html) {
  let outPath
  if (route === '/') {
    outPath = join(DIST, 'index.html')
  } else {
    outPath = join(DIST, route.slice(1), 'index.html')
  }

  const dir = dirname(outPath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  writeFileSync(outPath, html, 'utf-8')
  console.log(`  ✓ ${route} → ${outPath.replace(DIST, 'dist')}`)
}

async function main() {
  console.log('\n🔨 Pre-rendering pages...\n')

  const server = await startServer()
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    for (const route of ROUTES) {
      const html = await prerenderRoute(page, route)
      writeRoute(route, html)
    }

    console.log('\n  Pre-rendering 404 page...')
    const html404 = await prerenderRoute(page, NOT_FOUND_ROUTE)
    writeFileSync(join(DIST, '404.html'), html404, 'utf-8')
    console.log('  ✓ 404 → dist/404.html')

    await page.close()
  } finally {
    await browser.close()
    server.close()
  }

  console.log(`\n✅ Pre-rendered ${ROUTES.length + 1} pages\n`)
}

main().catch((err) => {
  console.error('Pre-rendering failed:', err)
  process.exit(1)
})
