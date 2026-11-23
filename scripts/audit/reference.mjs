// Phase 2 reference study: load live personal sites, screenshot at 375/1440 and
// extract computed typography, measure, colour, code/math/figure styling,
// motion (recorded as it happens) and dark-mode handling.
// Usage: node scripts/audit/reference.mjs [siteKey ...]
// Output: docs/redesign/references/data.json (+ screenshots, gitignored)
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, launch } from './lib.mjs'
import { CPL_FN } from './cpl.mjs'

const SITES = {
  lilianweng: ['https://lilianweng.github.io/', 'https://lilianweng.github.io/posts/2023-06-23-agent/'],
  eugeneyan: ['https://eugeneyan.com/', 'https://eugeneyan.com/writing/llm-patterns/'],
  simonwillison: ['https://simonwillison.net/', 'https://simonwillison.net/2024/Dec/31/llms-in-2024/'],
  huyenchip: ['https://huyenchip.com/', 'https://huyenchip.com/2023/04/11/llm-engineering.html'],
  ciechanowski: ['https://ciechanow.ski/', 'https://ciechanow.ski/gears/'],
  joshwcomeau: ['https://www.joshwcomeau.com/', 'https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/'],
  rauno: ['https://rauno.me/', null],
  emilkowalski: ['https://emilkowal.ski/', 'https://emilkowal.ski/ui/great-animations'],
  paco: ['https://paco.me/', null],
  leerob: ['https://leerob.com/', null],
  brittanychiang: ['https://brittanychiang.com/', null],
  hamel: ['https://hamel.dev/', 'https://hamel.dev/blog/posts/evals/'],
  colah: ['https://colah.github.io/', 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/'],
  karpathy: ['https://karpathy.github.io/', 'https://karpathy.github.io/2015/05/21/rnn-effectiveness/'],
}

const outDir = join(ROOT, 'docs/redesign/references')
mkdirSync(outDir, { recursive: true })
const dataFile = join(outDir, 'data.json')
const data = existsSync(dataFile) ? JSON.parse(readFileSync(dataFile, 'utf8')) : {}
const pick = process.argv.slice(2)

const RECORDER = () => {
  window.__motion = []
  const log = (kind, name, dur, easing, el) => window.__motion.length < 300 && window.__motion.push({ kind, name, dur, easing, el: el ? `${el.tagName?.toLowerCase()}.${String(el.className?.baseVal ?? el.className ?? '').split(' ')[0]}` : '' })
  document.addEventListener('animationstart', (e) => { const cs = getComputedStyle(e.target); log('css-anim', e.animationName, cs.animationDuration, cs.animationTimingFunction, e.target) }, true)
  document.addEventListener('transitionrun', (e) => { const cs = getComputedStyle(e.target); log('css-trans', e.propertyName, cs.transitionDuration, cs.transitionTimingFunction, e.target) }, true)
  const orig = Element.prototype.animate
  Element.prototype.animate = function (kf, opts) {
    const o = typeof opts === 'number' ? { duration: opts } : opts || {}
    log('waapi', Array.isArray(kf) ? Object.keys(kf[0] || {}).join('+') : Object.keys(kf || {}).join('+'), o.duration, o.easing, this)
    return orig.call(this, kf, opts)
  }
}

const MEASURE = () => {
  const sample = 'The quick brown fox jumps over the lazy dog while a model learns from noisy labels, 0.89 F1.'
  const ctx = document.createElement('canvas').getContext('2d')
  const px = (v) => Math.round(parseFloat(v) * 10) / 10
  const cplOf = (el) => {
    const cs = getComputedStyle(el)
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    return Math.round(el.getBoundingClientRect().width / (ctx.measureText(sample).width / sample.length + (parseFloat(cs.letterSpacing) || 0)))
  }
  const vis = (e) => e.offsetParent !== null && e.getBoundingClientRect().width > 0
  const ps = [...document.querySelectorAll('p')].filter((p) => vis(p) && p.textContent.trim().length > 140)
  const groups = {}
  ps.forEach((p) => { const k = `${Math.round(p.getBoundingClientRect().width)}|${getComputedStyle(p).fontSize}`; (groups[k] ??= []).push(p) })
  const para = Object.values(groups).sort((a, b) => b.length - a.length)[0]?.[0]
  window.__para = para
  const st = (el) => {
    if (!el) return null
    const cs = getComputedStyle(el)
    return { font: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), size: px(cs.fontSize), lh: cs.lineHeight === 'normal' ? 'normal' : +(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2), weight: cs.fontWeight, ls: cs.letterSpacing, color: cs.color, mt: px(cs.marginTop), mb: px(cs.marginBottom) }
  }
  const scope = para?.closest('article, main, .post, .content, [class*=prose], [class*=content]') || document.body
  const h = (sel) => [...scope.querySelectorAll(sel)].find(vis) || [...document.querySelectorAll(sel)].find(vis)
  const link = para?.querySelector('a') || [...scope.querySelectorAll('p a')].find(vis)
  const pre = [...document.querySelectorAll('pre')].find(vis)
  const code = [...document.querySelectorAll('p code, li code')].find(vis)
  const fig = [...document.querySelectorAll('figure, img')].find((e) => vis(e) && e.getBoundingClientRect().width > 200)
  const cap = [...document.querySelectorAll('figcaption')].find(vis)
  const katex = document.querySelector('.katex, mjx-container, .MathJax')
  const bodyCs = getComputedStyle(document.body)
  const htmlCs = getComputedStyle(document.documentElement)
  const bg = bodyCs.backgroundColor === 'rgba(0, 0, 0, 0)' ? htmlCs.backgroundColor : bodyCs.backgroundColor
  // colours actually used for text, weighted by characters
  const colors = {}
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (w.nextNode()) { const n = w.currentNode; const t = n.textContent.trim(); if (!t || !n.parentElement || !vis(n.parentElement)) continue; const c = getComputedStyle(n.parentElement).color; colors[c] = (colors[c] || 0) + t.length }
  const total = Object.values(colors).reduce((a, b) => a + b, 0)
  // stylesheet census: transitions, media queries
  const trans = {}; const ease = {}; let darkMQ = false; let reducedMQ = false
  for (const sh of document.styleSheets) {
    let rules; try { rules = sh.cssRules } catch { continue }
    const walk = (rs) => { for (const r of rs) {
      if (r.media) { const m = r.media.mediaText; if (m.includes('prefers-color-scheme')) darkMQ = true; if (m.includes('prefers-reduced-motion')) reducedMQ = true }
      if (r.cssRules) walk(r.cssRules)
      if (r.style) { const d = r.style.transitionDuration || r.style.animationDuration; const e = r.style.transitionTimingFunction || r.style.animationTimingFunction; if (d) d.split(',').forEach((x) => { x = x.trim(); trans[x] = (trans[x] || 0) + 1 }); if (e) e.split(/,(?![^(]*\))/).forEach((x) => { x = x.trim(); ease[x] = (ease[x] || 0) + 1 }) }
    } }
    walk(rules)
  }
  const top = (o, n = 6) => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n))
  // primary CTA candidates in first viewport: buttons / button-like links
  const ctas = [...document.querySelectorAll('a, button')].filter((e) => { const r = e.getBoundingClientRect(); return vis(e) && r.top < innerHeight && r.bottom > 0 }).map((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return { text: (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40), top: Math.round(r.top), filled: cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== bg, area: Math.round(r.width * r.height) } }).filter((c) => c.text)
  const toggle = [...document.querySelectorAll('button, [role=button]')].some((b) => /theme|dark|light|mode/i.test(b.getAttribute('aria-label') || b.title || b.textContent))
  const contentEl = para?.parentElement
  return {
    title: document.title, bg, body: st(document.body), p: st(para), pWidth: para ? Math.round(para.getBoundingClientRect().width) : null, cpl: para ? cplOf(para) : null,
    contentMaxWidth: contentEl ? getComputedStyle(contentEl).maxWidth : null, pCount: ps.length,
    h1: st(h('h1')), h2: st(h('h2')), h3: st(h('h3')),
    link: link ? { color: getComputedStyle(link).color, deco: getComputedStyle(link).textDecorationLine, decoColor: getComputedStyle(link).textDecorationColor, thick: getComputedStyle(link).textDecorationThickness, offset: getComputedStyle(link).textUnderlineOffset } : null,
    pre: pre ? { font: getComputedStyle(pre).fontFamily.split(',')[0].replace(/["']/g, ''), size: px(getComputedStyle(pre).fontSize), lh: +(parseFloat(getComputedStyle(pre).lineHeight) / parseFloat(getComputedStyle(pre).fontSize)).toFixed(2) || 'normal', bg: getComputedStyle(pre).backgroundColor, radius: getComputedStyle(pre).borderRadius, pad: getComputedStyle(pre).padding, border: getComputedStyle(pre).borderTopWidth + ' ' + getComputedStyle(pre).borderTopColor, width: Math.round(pre.getBoundingClientRect().width), bleed: para ? Math.round(pre.getBoundingClientRect().width - para.getBoundingClientRect().width) : null } : null,
    inlineCode: code ? { size: px(getComputedStyle(code).fontSize), bg: getComputedStyle(code).backgroundColor, radius: getComputedStyle(code).borderRadius } : null,
    figure: fig ? { width: Math.round(fig.getBoundingClientRect().width), bleed: para ? Math.round(fig.getBoundingClientRect().width - para.getBoundingClientRect().width) : null, radius: getComputedStyle(fig).borderRadius } : null,
    caption: cap ? st(cap) : null, math: katex ? (katex.className.includes('katex') ? 'KaTeX' : 'MathJax') + ' ' + px(getComputedStyle(katex).fontSize) + 'px' : null,
    textColors: Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c, n]) => `${c} ${Math.round((n / total) * 100)}%`),
    transitions: top(trans), easings: top(ease), darkMQ, reducedMQ, toggle, ctas: ctas.slice(0, 8),
    pageHeight: document.documentElement.scrollHeight, viewport: innerHeight,
  }
}

const browser = await launch()
try {
  for (const [key, urls] of Object.entries(SITES)) {
    if (pick.length && !pick.includes(key)) continue
    data[key] = { urls }
    for (const [kind, url] of [['home', urls[0]], ['article', urls[1]]]) {
      if (!url) continue
      for (const width of [1440, 375]) {
        const page = await browser.newPage()
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36')
        await page.setViewport({ width, height: width < 768 ? 812 : 900, isMobile: width < 768, hasTouch: width < 768 })
        await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
        await page.evaluateOnNewDocument(RECORDER)
        try {
          const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
          await new Promise((r) => setTimeout(r, 2500))
          const tag = `${key}.${kind}.${width}`
          await page.screenshot({ path: join(outDir, `${tag}.fold.webp`), type: 'webp', quality: 75 })
          const m = await page.evaluate(MEASURE)
          m.cplActual = await page.evaluate(`(${CPL_FN})(window.__para)`)
          m.status = resp?.status()
          m.finalUrl = page.url()
          // scroll once through for scroll-linked motion, then capture motion log
          await page.evaluate(async () => { for (let y = 0; y < Math.min(document.documentElement.scrollHeight, 6000); y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)) } })
          m.motion = await page.evaluate(() => window.__motion)
          if (width === 1440) {
            // mid-article shot at first code / math / figure
            const hit = await page.evaluate(() => { const el = document.querySelector('pre, .katex-display, mjx-container[display], figure'); if (!el) return false; el.scrollIntoView({ block: 'center' }); return true })
            if (hit) { await new Promise((r) => setTimeout(r, 800)); await page.screenshot({ path: join(outDir, `${tag}.detail.webp`), type: 'webp', quality: 75 }) }
            await page.evaluate(() => scrollTo(0, 0))
            await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
            await new Promise((r) => setTimeout(r, 600))
            m.darkBg = await page.evaluate(() => { const b = getComputedStyle(document.body).backgroundColor; return b === 'rgba(0, 0, 0, 0)' ? getComputedStyle(document.documentElement).backgroundColor : b })
            await page.screenshot({ path: join(outDir, `${tag}.dark.webp`), type: 'webp', quality: 70 })
          }
          data[key][`${kind}@${width}`] = m
          console.log(`✓ ${tag} status=${m.status} body=${m.p?.size}px/${m.p?.lh} cpl=${m.cpl} actual=${m.cplActual} font=${m.p?.font}`)
        } catch (e) {
          data[key][`${kind}@${width}`] = { error: String(e.message).slice(0, 200) }
          console.log(`✗ ${key}.${kind}.${width}: ${e.message.slice(0, 120)}`)
        }
        await page.close()
      }
    }
    writeFileSync(dataFile, JSON.stringify(data, null, 2))
  }
} finally {
  await browser.close()
}
