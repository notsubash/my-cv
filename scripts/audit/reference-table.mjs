// Turn docs/redesign/references/data.json into markdown tables + summary stats.
// Usage: node scripts/audit/reference-table.mjs > docs/redesign/references/table.md
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const d = JSON.parse(readFileSync(join(process.cwd(), 'docs/redesign/references/data.json'), 'utf8'))
const hex = (rgb) => {
  const m = rgb?.match(/\d+(\.\d+)?/g)
  if (!m) return '—'
  if (m.length === 4 && +m[3] === 0) return 'transparent'
  return '#' + m.slice(0, 3).map((x) => (+x).toString(16).padStart(2, '0')).join('')
}
const r2 = (x) => (x == null || !isFinite(x) ? '—' : x.toFixed(2))
const med = (a) => { const s = a.filter((x) => x != null && isFinite(x)).sort((p, q) => p - q); return s.length ? s[Math.floor(s.length / 2)] : null }
const ms = (v) => { if (v == null) return null; if (typeof v === 'number') return v; const n = parseFloat(v); return String(v).endsWith('ms') ? n : n * 1000 }

const rows = []
const art = { size: [], lh: [], cpl: [], cpl375: [], h2r: [], h1r: [], pre: [] }
const motionAll = { durs: {}, eases: {} }
for (const [key, site] of Object.entries(d)) {
  for (const kind of ['article', 'home']) {
    const m = site[`${kind}@1440`]; const s = site[`${kind}@375`]
    if (!m || m.error) continue
    const body = m.p?.size
    const h2r = body && m.h2 ? m.h2.size / body : null
    const h1r = body && m.h1 ? m.h1.size / body : null
    if (kind === 'article' || !site['article@1440']) {
      if (body) { art.size.push(body); art.lh.push(m.p.lh); art.cpl.push(m.cplActual); art.cpl375.push(s?.cplActual); if (h2r) art.h2r.push(h2r); if (h1r) art.h1r.push(h1r) }
      if (m.pre) art.pre.push(m.pre.size)
    }
    // motion: recorded events on both widths
    const mot = [...(m.motion || []), ...(s?.motion || [])]
    const kinds = {}
    mot.forEach((e) => {
      kinds[e.kind] = (kinds[e.kind] || 0) + 1
      const dur = String(e.dur).split(',')[0]; const ease = String(e.easing ?? '').split(/,(?![^(]*\))/)[0]
      if (dur && dur !== 'undefined' && dur !== '0s') motionAll.durs[dur] = (motionAll.durs[dur] || 0) + 1
      if (ease && ease !== 'undefined') motionAll.eases[ease] = (motionAll.eases[ease] || 0) + 1
    })
    const topDur = Object.entries(m.transitions || {}).filter(([k]) => k !== '0s').slice(0, 3).map(([k]) => k).join(' ')
    const topEase = Object.keys(m.easings || {}).slice(0, 2).join(' ').replace(/cubic-bezier/g, 'cb')
    const cta = (m.ctas || []).filter((c) => c.filled).sort((a, b) => b.area - a.area)[0]
    rows.push({
      site: key, kind,
      font: `${m.p?.font ?? '—'}`.slice(0, 22),
      size: m.p ? `${m.p.size}/${m.p.lh}` : '—',
      cpl: `${m.cplActual ?? '—'} / ${s?.cplActual ?? '—'}`,
      heads: `${m.h1?.size ?? '—'}/${m.h2?.size ?? '—'}/${m.h3?.size ?? '—'}`,
      ratio: r2(h2r),
      colors: `bg ${hex(m.bg)} · ${(m.textColors || []).slice(0, 2).map((c) => hex(c) + ' ' + c.split(' ').pop()).join(', ')}`,
      link: m.link ? `${hex(m.link.color)} ${m.link.deco === 'underline' ? 'underline' : 'no underline'}` : '—',
      code: m.pre ? `${m.pre.font.slice(0, 14)} ${m.pre.size}px · ${hex(m.pre.bg)} · r${m.pre.radius} · bleed ${m.pre.bleed ?? '—'}px` : '—',
      math: m.math ?? '—',
      caption: m.caption ? `${m.caption.size}px ${hex(m.caption.color)}` : '—',
      motion: `${mot.length} ev ${Object.entries(kinds).map(([k, v]) => `${k.replace('css-', '')}:${v}`).join(' ')} · css ${topDur || '—'} · ${topEase || '—'}`,
      dark: `${m.darkMQ ? 'MQ' : 'no MQ'}${m.toggle ? ' + toggle' : ''} · ${hex(m.darkBg)}`,
      cta: cta ? `"${cta.text}" @${cta.top}px` : 'none (text links)',
      height: `${(m.pageHeight / m.viewport).toFixed(1)} scr`,
    })
  }
}

const cols = ['site', 'kind', 'font', 'size', 'cpl', 'heads', 'ratio', 'colors', 'link', 'code', 'math', 'caption', 'motion', 'dark', 'cta', 'height']
const head = ['Site', 'Page', 'Body font', 'Body px/lh', 'CPL 1440/375', 'h1/h2/h3 px', 'h2÷body', 'Palette (bg · top text colours by share)', 'Link in prose', 'Code block', 'Math', 'Caption', 'Motion recorded (load+scroll) · CSS durations · easings', 'Dark mode (system MQ, toggle, dark bg)', 'Largest filled CTA in fold', 'Length']
console.log('| ' + head.join(' | ') + ' |')
console.log('|' + head.map(() => '---').join('|') + '|')
for (const r of rows) console.log('| ' + cols.map((c) => String(r[c]).replace(/\|/g, '/')).join(' | ') + ' |')
console.log('\n**Medians across long-form pages (article where available, else home):**')
console.log(`- body size ${med(art.size)} px (range ${Math.min(...art.size)}–${Math.max(...art.size)}), line-height ${med(art.lh)}`)
console.log(`- CPL @1440 ${med(art.cpl)} (range ${Math.min(...art.cpl.filter(Boolean))}–${Math.max(...art.cpl.filter(Boolean))}); @375 ${med(art.cpl375)}`)
console.log(`- h2 ÷ body ${r2(med(art.h2r))}, h1 ÷ body ${r2(med(art.h1r))}; code ${med(art.pre)} px`)
console.log(`- recorded motion durations: ${JSON.stringify(Object.fromEntries(Object.entries(motionAll.durs).sort((a, b) => b[1] - a[1]).slice(0, 8)))}`)
console.log(`- recorded easings: ${JSON.stringify(Object.fromEntries(Object.entries(motionAll.eases).sort((a, b) => b[1] - a[1]).slice(0, 6)))}`)
void ms
