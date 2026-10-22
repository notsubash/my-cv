// Builds the profile banner into ../assets/banner-{light,dark}.svg.
// Run from the my-cv root: node github-profile/banner/build.mjs
//
// Left: name and details. Right: one playful piece, gradient descent with a
// learning rate a bit too high, so the dot overshoots across the basin before
// it settles. Plain SVG + CSS with Outfit and JetBrains Mono embedded, so it
// animates inside a GitHub README <img>. Base styles are the final frame, which
// is also what prefers-reduced-motion viewers see.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '..', 'assets')
mkdirSync(outDir, { recursive: true })

const b64 = (p) => readFileSync(p).toString('base64')
const FONTS = [
  `@font-face{font-family:'Outfit';font-weight:300 700;src:url(data:font/woff2;base64,${b64(join(here, '..', '..', 'public', 'fonts', 'outfit-latin.woff2'))}) format('woff2')}`,
  `@font-face{font-family:'JetBrains Mono';font-weight:400;src:url(data:font/woff2;base64,${b64(join(here, 'fonts', 'jetbrains-mono-latin-400-normal.woff2'))}) format('woff2')}`,
].join('')
const SANS = 'Outfit, system-ui, sans-serif'
const MONO = "'JetBrains Mono', ui-monospace, monospace"

// ---------- theme tokens (from src/index.css) ----------
const hsl = (h, s, l) => {
  s /= 100; l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return '#' + [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')
}
const THEMES = {
  light: {
    bg: hsl(210, 16, 98), ink: hsl(210, 20, 8), sub: hsl(210, 10, 26), muted: hsl(210, 8, 42),
    rule: hsl(210, 12, 84), curve: hsl(210, 8, 62), primary: hsl(200, 80, 34), accent: hsl(174, 65, 28),
  },
  dark: {
    bg: hsl(210, 12, 9), ink: hsl(0, 0, 93), sub: hsl(210, 6, 78), muted: hsl(210, 5, 60),
    rule: hsl(210, 6, 21), curve: hsl(210, 5, 42), primary: hsl(200, 85, 58), accent: hsl(174, 72, 52),
  },
}

// ---------- the loss curve and the descent ----------
const MIN_X = 0.4
const loss = (x) => 0.2 * (x - MIN_X) ** 2 + 0.05
const X_LO = -2.3, X_HI = 3.1, F_HI = 1.45
const PX0 = 712, PX1 = 1196, PY0 = 262, PY1 = 62
const px = (x) => PX0 + ((x - X_LO) / (X_HI - X_LO)) * (PX1 - PX0)
const py = (f) => PY0 - (f / F_HI) * (PY0 - PY1)
const r1 = (n) => +n.toFixed(1)

const xs = Array.from({ length: 161 }, (_, i) => X_LO + ((X_HI - X_LO) * i) / 160)
const curveD = 'M' + xs.map((x) => `${r1(px(x))} ${r1(py(loss(x)))}`).join(' L')

// ---------- motion (seconds) ----------
// A damped swing along the curve: x(s) = x* - A e^(-γs) cos(ωs), with the envelope
// tapered to exactly zero at the end so the dot comes to rest on the minimum.
const L = 9
const MOVE = [0.5, 6.5], FADE = [8.0, 8.8], SETTLE = MOVE[1] + 0.05
const A = 2.5, GAMMA = 0.55, OMEGA = 2 * Math.PI * 0.6, SAMPLES = 150
const span = MOVE[1] - MOVE[0]
const swing = (s) => MIN_X - A * Math.exp(-GAMMA * s) * (1 - (s / span) ** 4) * Math.cos(OMEGA * s)
const point = (x) => ({ x: px(x), y: py(loss(x)) })
const rest = point(MIN_X)

const pct = (t) => `${+((Math.min(Math.max(t, 0), L) / L) * 100).toFixed(3)}%`
const keyframes = (name, frames) => {
  const byPct = new Map()
  for (const [t, decl] of frames) byPct.set(pct(t), decl)
  return `@keyframes ${name}{${[...byPct].map(([p, d]) => `${p}{${d}}`).join('')}}`
}
const at = (p) => `transform:translate(${r1(p.x)}px,${r1(p.y)}px)`

const dotFrames = [[0, at(point(swing(0)))]]
for (let i = 0; i <= SAMPLES; i++) {
  const s = (span * i) / SAMPLES
  dotFrames.push([MOVE[0] + s, at(point(swing(s)))])
}
dotFrames.push([L, at(rest)])

// Comet tail: copies of the dot running a few hundredths of a second behind.
const TAIL = [[6, 0.32], [5, 0.22], [4.2, 0.15], [3.4, 0.1], [2.6, 0.06]]
const TAIL_LAG = 0.055

const css = `
${FONTS}
${keyframes('dot', dotFrames)}
${keyframes('group', [[0, 'opacity:0'], [0.15, 'opacity:0'], [MOVE[0], 'opacity:1'], [FADE[0], 'opacity:1'], [FADE[1], 'opacity:0'], [L, 'opacity:0']])}
${keyframes('ripple', [[0, 'opacity:0;transform:scale(1)'], [SETTLE - 0.02, 'opacity:0;transform:scale(1)'], [SETTLE, 'opacity:0.5;transform:scale(1)'], [SETTLE + 1.4, 'opacity:0;transform:scale(3.2)'], [L, 'opacity:0;transform:scale(3.2)']])}
@keyframes rise{from{opacity:0;transform:translateY(6px)}}
.mono{font-family:${MONO}}
.sans{font-family:${SANS}}
.dot{transform:translate(${r1(rest.x)}px,${r1(rest.y)}px);animation:dot ${L}s linear infinite both}
${TAIL.map((_, k) => `.tail${k}{animation-delay:${((k + 1) * TAIL_LAG).toFixed(3)}s}`).join('\n')}
.group{animation:group ${L}s ease infinite}
.ripple{opacity:0;transform-box:fill-box;transform-origin:center;animation:ripple ${L}s cubic-bezier(.2,.7,.2,1) infinite}
.rise{animation:rise .6s ease-out both}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
`

const svg = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="320" viewBox="0 0 1280 320" role="img" aria-labelledby="t">
<title id="t">Subash Pandey, AI/ML Engineer. GenAI systems, RAG, and applied ML.</title>
<style><![CDATA[${css}]]></style>
<defs><clipPath id="card"><rect width="1280" height="320" rx="16"/></clipPath></defs>
<g clip-path="url(#card)">
  <rect width="1280" height="320" fill="${c.bg}"/>

  <g class="rise">
    <text class="mono" x="64" y="98" font-size="13" letter-spacing="1.6" fill="${c.muted}">AI/ML ENGINEER · KATHMANDU · REMOTE</text>
    <text class="sans" x="61" y="160" font-size="60" font-weight="600" letter-spacing="-1.3" fill="${c.ink}">Subash Pandey</text>
    <text class="sans" x="64" y="204" font-size="22" fill="${c.sub}">Production GenAI and ML systems, and the</text>
    <text class="sans" x="64" y="233" font-size="22" fill="${c.sub}">evaluation that keeps them honest.</text>
  </g>

  <line x1="640" y1="56" x2="640" y2="264" stroke="${c.rule}"/>

  <path d="${curveD}" fill="none" stroke="${c.curve}" stroke-width="2" stroke-linecap="round"/>
  <circle class="ripple" cx="${r1(rest.x)}" cy="${r1(rest.y)}" r="8" fill="none" stroke="${c.accent}" stroke-width="1.5"/>
  <g class="group">
${TAIL.map(([r, a], k) => `    <circle class="dot tail${k}" cx="0" cy="0" r="${r}" fill="${c.primary}" fill-opacity="${a}"/>`).reverse().join('\n')}
    <circle class="dot" cx="0" cy="0" r="7.5" fill="${c.primary}"/>
  </g>
</g>
<rect x="0.5" y="0.5" width="1279" height="319" rx="15.5" fill="none" stroke="${c.rule}"/>
</svg>
`

for (const [name, c] of Object.entries(THEMES)) {
  const out = join(outDir, `banner-${name}.svg`)
  writeFileSync(out, svg(c))
  console.log('wrote', out)
}
