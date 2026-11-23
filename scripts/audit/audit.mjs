// Heuristic-support audit: axe-core (light + dark), keyboard walk, reduced-motion
// animation census, computed typography + characters-per-line, above-the-fold
// inventory, and throttled lab LCP/CLS.
// Usage: node scripts/audit/audit.mjs <label>   → docs/redesign/audit/<label>.json (+ fold shots)
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { ROOT, routes, slug, serve, launch, openPage, settle } from './lib.mjs'

const label = process.argv[2] ?? 'baseline'
const outDir = join(ROOT, 'docs/redesign/audit')
const foldDir = join(ROOT, 'docs/redesign/screenshots', `${label}-fold`)
mkdirSync(outDir, { recursive: true })
mkdirSync(foldDir, { recursive: true })
const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')

const ARTICLE = '/blog/when-a-self-parking-car-cannot-trust-its-imagination'
const CASE = '/projects/gavel'
const report = { label, date: new Date().toISOString(), axe: {}, typography: {}, fold: {}, motion: {}, keyboard: {}, perf: {}, page: {} }

// Measures in-page. Avg char width from a representative English sentence in the element's own font.
const MEASURE = () => {
  const sample = 'The quick brown fox jumps over the lazy dog while a model learns from noisy labels, 0.89 F1.'
  const ctx = document.createElement('canvas').getContext('2d')
  const cpl = (el) => {
    const cs = getComputedStyle(el)
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const avg = ctx.measureText(sample).width / sample.length
    const ls = parseFloat(cs.letterSpacing) || 0
    const w = el.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    return Math.round(w / (avg + ls))
  }
  const describe = (el) => {
    if (!el) return null
    const cs = getComputedStyle(el)
    return {
      tag: el.tagName.toLowerCase(), text: el.textContent.trim().slice(0, 70),
      font: cs.fontFamily.split(',')[0].replace(/"/g, ''), size: cs.fontSize, weight: cs.fontWeight,
      lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, color: cs.color,
      width: Math.round(el.getBoundingClientRect().width), cpl: cpl(el),
    }
  }
  const scope = document.querySelector('article') || document.querySelector('main') || document.body
  const ps = [...scope.querySelectorAll('p')].filter((p) => p.textContent.trim().length > 120 && p.offsetParent)
  // Dominant paragraph = the width shared by the most long paragraphs.
  const byWidth = {}
  ps.forEach((p) => { const w = Math.round(p.getBoundingClientRect().width); (byWidth[w] ??= []).push(p) })
  const dominant = Object.values(byWidth).sort((a, b) => b.length - a.length)[0]?.[0]
  // Font-size histogram weighted by characters (text-bearing leaf-ish nodes).
  const sizes = {}
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const n = walker.currentNode
    const t = n.textContent.trim()
    if (!t || !n.parentElement?.offsetParent) continue
    const s = getComputedStyle(n.parentElement).fontSize
    sizes[s] = (sizes[s] || 0) + t.length
  }
  return {
    body: describe(document.body), h1: describe(scope.querySelector('h1')), h2: describe(scope.querySelector('h2')),
    h3: describe(scope.querySelector('h3')), paragraph: describe(dominant), longParagraphs: ps.length,
    pre: describe(scope.querySelector('pre')), katex: describe(scope.querySelector('.katex-display .katex')),
    figcaption: describe(scope.querySelector('figcaption')),
    fontSizesByChars: Object.fromEntries(Object.entries(sizes).sort((a, b) => b[1] - a[1])),
    pageHeight: document.documentElement.scrollHeight, viewport: innerHeight,
  }
}

const FOLD = () => {
  const vh = innerHeight
  const items = []
  document.querySelectorAll('h1,h2,h3,p,a,button,img,li').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.bottom <= 0 || r.top >= vh || r.width === 0 || !el.offsetParent) return
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || +cs.opacity === 0) return
    items.push({ tag: el.tagName.toLowerCase(), top: Math.round(r.top), text: (el.getAttribute('aria-label') || el.textContent || el.getAttribute('alt') || '').trim().replace(/\s+/g, ' ').slice(0, 90) })
  })
  const cta = [...document.querySelectorAll('[data-cal-link]')].map((b) => ({ text: b.textContent.trim(), top: Math.round(b.getBoundingClientRect().top), inFold: b.getBoundingClientRect().bottom < vh }))
  const firstProject = document.querySelector('#projects h3')
  return { items, cta, firstProjectTitleTop: firstProject ? Math.round(firstProject.getBoundingClientRect().top + scrollY) : null, viewport: vh }
}

const { server, base } = await serve()
const browser = await launch()
try {
  // 1. axe on every route, both themes, desktop + mobile (mobile light only to save time)
  for (const route of routes()) {
    for (const [width, theme] of [[1440, 'light'], [1440, 'dark'], [375, 'light']]) {
      const page = await openPage(browser, { width, theme })
      await page.goto(base + route, { waitUntil: 'networkidle0' })
      await settle(page)
      await page.addScriptTag({ content: axeSource })
      const res = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }, resultTypes: ['violations'] })
        return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, sample: v.nodes.slice(0, 4).map((n) => ({ target: n.target.join(' '), summary: n.failureSummary?.split('\n').slice(0, 2).join(' ') })) }))
      })
      report.axe[`${route} @${width} ${theme}`] = res
      console.log(`axe ${route} @${width} ${theme}: ${res.map((v) => `${v.id}(${v.impact}×${v.nodes})`).join(', ') || 'clean'}`)
      await page.close()
    }
  }

  // 2. typography + fold on key templates
  for (const route of ['/', '/about', '/blog', ARTICLE, CASE]) {
    for (const width of [375, 1440]) {
      const page = await openPage(browser, { width, theme: 'light' })
      await page.goto(base + route, { waitUntil: 'networkidle0' })
      await new Promise((r) => setTimeout(r, 1500))
      report.fold[`${route} @${width}`] = await page.evaluate(FOLD)
      await page.screenshot({ path: join(foldDir, `${slug(route)}.${width}.webp`), type: 'webp', quality: 80 })
      await settle(page)
      report.typography[`${route} @${width}`] = await page.evaluate(MEASURE)
      await page.close()
    }
  }

  // 3. motion census: running animations with and without reduced motion
  for (const reducedMotion of [false, true]) {
    for (const route of ['/', ARTICLE]) {
      const page = await openPage(browser, { width: 1440, theme: 'dark', reducedMotion })
      await page.goto(base + route, { waitUntil: 'networkidle0' })
      await new Promise((r) => setTimeout(r, 2500))
      report.motion[`${route} reduce=${reducedMotion}`] = await page.evaluate(() => document.getAnimations().map((a) => {
        const t = a.effect?.getTiming?.() ?? {}
        const el = a.effect?.target
        return { name: a.animationName || a.transitionProperty || a.constructor.name, duration: t.duration, iterations: t.iterations, easing: t.easing, target: el ? `${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).split(' ').slice(0, 3).join('.')}` : null }
      }))
      await page.close()
    }
  }

  // 4. keyboard walk on home @1440
  {
    const page = await openPage(browser, { width: 1440, theme: 'light' })
    await page.goto(base + '/', { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 1200))
    const steps = []
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      steps.push(await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return { tag: 'body' }
        const cs = getComputedStyle(el)
        const r = el.getBoundingClientRect()
        return {
          tag: el.tagName.toLowerCase(),
          name: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
          indicator: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? `outline ${cs.outlineWidth} ${cs.outlineColor}` : cs.boxShadow !== 'none' ? 'box-shadow' : 'NONE',
          y: Math.round(r.top + scrollY), visible: r.width > 0 && r.height > 0,
        }
      }))
    }
    report.keyboard.home = steps
    await page.close()
  }

  // 5. throttled lab perf (Slow-4G-ish + 4x CPU), mobile, cold cache
  for (const route of ['/', ARTICLE, CASE]) {
    const page = await openPage(browser, { width: 375, theme: 'light' })
    const cdp = await page.createCDPSession()
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await page.evaluateOnNewDocument(() => {
      window.__lab = { lcp: 0, lcpEl: '', cls: 0 }
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { window.__lab.lcp = e.startTime; window.__lab.lcpEl = e.element ? `${e.element.tagName.toLowerCase()} ${(e.element.textContent || e.element.currentSrc || '').trim().slice(0, 50)}` : e.url }))
        .observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__lab.cls += e.value }))
        .observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 90000 })
    await new Promise((r) => setTimeout(r, 2000))
    const lab = await page.evaluate(() => ({ ...window.__lab, transferKB: Math.round(performance.getEntriesByType('resource').reduce((s, e) => s + (e.transferSize || 0), 0) / 1024), requests: performance.getEntriesByType('resource').length }))
    report.perf[route] = { lcpMs: Math.round(lab.lcp), lcpElement: lab.lcpEl, cls: +lab.cls.toFixed(3), transferKB: lab.transferKB, requests: lab.requests }
    console.log('perf', route, report.perf[route])
    await page.close()
  }
} finally {
  await browser.close()
  server.close()
}

writeFileSync(join(outDir, `${label}.json`), JSON.stringify(report, null, 2))
console.log('wrote', join(outDir, `${label}.json`))
