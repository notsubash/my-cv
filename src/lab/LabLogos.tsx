import { type ReactNode } from 'react'
import { LabFrame } from './LabFrame'
import '../site/site.css'
import './lab-logos.css'

// Logo concepts for the favicon / mark. Each draws on a 64×64 grid so it can be rasterised
// to 16/32/48/180/512 px once one is chosen. Colours use the site tokens via CSS variables.
type Concept = { id: string; name: string; style: string; why: string; shortlisted?: boolean; mark: (tone: 'light' | 'dark') => ReactNode }

const INK = { light: '#16181b', dark: '#ebecee' }
const PAPER = { light: '#fbfbfa', dark: '#111315' }
const ACCENT = { light: '#cf3a0e', dark: '#ff7a52' }
const WASH = { light: '#ffcbb8', dark: '#5c2416' }


// v2: 5-wide letterforms on an exact 16-cell grid (1 cell = 4 units = 1px at 16px favicon size)
const S_PX = ['.####', '#....', '.###.', '....#', '####.']
const P_PX = ['####.', '#...#', '#...#', '#...#', '####.', '#....', '#....']
function pixels(rows: string[], x0: number, y0: number, size: number, fill: string) {
  return rows.flatMap((row, y) => [...row].map((c, x) => c === '#'
    ? <rect key={`${x0}-${x}-${y}`} x={x0 + x * size} y={y0 + y * size} width={size} height={size} fill={fill} />
    : null))
}

const concepts: Concept[] = [
  {
    id: 'sp-dot', name: 'sp.', style: 'Monogram', shortlisted: true,
    why: 'The wordmark condensed: lowercase initials with the poppy full stop. Matches the header exactly.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="sp. monogram">
        <rect width="64" height="64" rx="14" fill={INK[t]} />
        <text x="9" y="43" fontFamily="Outfit, system-ui" fontWeight="750" fontSize="34" letterSpacing="-2.5" fill={PAPER[t]}>sp</text>
        <rect x="47" y="35" width="8" height="8" rx="1.5" fill={ACCENT[t]} />
      </svg>
    ),
  },
  {
    id: 'highlight-s', name: 'Highlighted S', style: 'Signature',
    why: 'The site’s signature move (the reviewer’s highlighter marking evidence) applied to the initial.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="Highlighted S">
        <rect width="64" height="64" rx="14" fill={PAPER[t]} stroke={t === 'light' ? '#e2e3e5' : '#2a2d32'} />
        <rect x="10" y="33" width="44" height="17" rx="3" fill={WASH[t]} />
        <text x="32" y="47" textAnchor="middle" fontFamily="Outfit, system-ui" fontWeight="750" fontSize="44" fill={INK[t]}>S</text>
      </svg>
    ),
  },
  {
    id: 'monoline-s', name: 'Monoline S', style: 'Geometric',
    why: 'One continuous stroke from an ink dot, the way a pen starts a signature. A single path, so it stays crisp at 16 px.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="Monoline S">
        <rect width="64" height="64" rx="14" fill={ACCENT[t]} />
        <path d="M43 21.5c-2.2-3.6-6.2-5.5-10.9-5.5-6.6 0-10.6 3.6-10.6 8.6 0 11.4 22 6.3 22 17.4 0 5.2-4.6 8.6-11.2 8.6-5.3 0-9.5-2.2-11.8-6"
          fill="none" stroke={PAPER.light} strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="43" cy="21.5" r="4.6" fill={INK.light} />
      </svg>
    ),
  },
  {
    id: 'ridgeline', name: 'Ridgeline', style: 'Abstract',
    why: 'A Himalayan ridgeline that is also a loss curve settling to its minimum: where you are from, and what you do.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="Mountain ridgeline as a loss curve">
        <rect width="64" height="64" rx="14" fill={INK[t]} />
        <path d="M9 44 L19 24 L25 33 L33 17 L42 37 L48 31 L55 44" fill="none" stroke={PAPER[t]} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="55" cy="44" r="4.5" fill={ACCENT[t]} />
      </svg>
    ),
  },
  {
    id: 'devanagari', name: 'सु', style: 'Cultural',
    why: 'The first syllable of Subash in Devanagari. Personal and unmistakable; depends on a Devanagari face when rasterised.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="Devanagari syllable su">
        <rect width="64" height="64" rx="14" fill={ACCENT[t]} />
        <text x="32" y="43" textAnchor="middle" fontFamily="'Nirmala UI', 'Noto Sans Devanagari', 'Kohinoor Devanagari', sans-serif" fontWeight="700" fontSize="34" fill={PAPER.light}>सु</text>
      </svg>
    ),
  },
  {
    id: 'bracket', name: '[sp]', style: 'Technical', shortlisted: true,
    why: 'Initials inside brackets, like an index or an eval tag. Reads as code without a terminal costume.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="sp in brackets">
        <rect width="64" height="64" rx="14" fill={PAPER[t]} stroke={t === 'light' ? '#e2e3e5' : '#2a2d32'} />
        <g fill="none" stroke={ACCENT[t]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 16h-4v32h4" />
          <path d="M50 16h4v32h-4" />
        </g>
        <text x="32" y="41" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontWeight="500" fontSize="22" fill={INK[t]}>sp</text>
      </svg>
    ),
  },
  {
    id: 'descent', name: 'Descent', style: 'Abstract',
    why: 'Gradient descent in one picture: steps that shorten as they roll into the minimum, which is lit. What training actually looks like.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="Gradient descent into a minimum">
        <rect width="64" height="64" rx="14" fill={INK[t]} />
        <path d="M10 18 Q32 62 54 18" fill="none" stroke={PAPER[t]} strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
        <circle cx="16.6" cy="29.2" r="2.6" fill={PAPER[t]} />
        <circle cx="23.2" cy="36.5" r="2.6" fill={PAPER[t]} />
        <circle cx="28.5" cy="39.4" r="2.6" fill={PAPER[t]} />
        <circle cx="32" cy="40" r="4.6" fill={ACCENT[t]} />
      </svg>
    ),
  },
  {
    id: 'attention', name: 'Attention', style: 'Abstract',
    why: 'A 4×4 attention map: weights fade with distance, and one cell is where the model looked. Quietly says “LLMs”.',
    mark: (t) => {
      const w = [[1, .55, .25, .12], [.55, 1, .5, .2], [.25, .5, 1, .55], [.12, .2, .55, 1]]
      return (
        <svg viewBox="0 0 64 64" role="img" aria-label="Attention matrix">
          <rect width="64" height="64" rx="14" fill={INK[t]} />
          {w.flatMap((row, r) => row.map((v, c) => (
            <rect key={`${r}${c}`} x={11 + c * 11} y={11 + r * 11} width="9" height="9" rx="2"
              fill={r === 1 && c === 2 ? ACCENT[t] : PAPER[t]} fillOpacity={r === 1 && c === 2 ? 1 : v} />
          )))}
        </svg>
      )
    },
  },
  {
    id: 'boundary', name: 'Boundary', style: 'Abstract',
    why: 'A curved decision boundary between two classes, with one point on each side. Classification, reduced to a shape.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="Decision boundary between two classes">
        <defs><clipPath id={`bd-${t}`}><rect width="64" height="64" rx="14" /></clipPath></defs>
        <g clipPath={`url(#bd-${t})`}>
          <rect width="64" height="64" fill={INK[t]} />
          <path d="M64 0 V64 H26 C40 50 22 20 40 0 Z" fill={ACCENT[t]} />
        </g>
        <circle cx="17" cy="22" r="4.5" fill={PAPER[t]} />
        <circle cx="47" cy="44" r="4.5" fill={PAPER[t]} />
      </svg>
    ),
  },
  {
    id: 'signal', name: 'Signal', style: 'Abstract',
    why: 'A voice waveform that settles into a clean line and lands on a point: noisy input, resolved output. Nods to the voice-agent work.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="Waveform resolving into a line">
        <rect width="64" height="64" rx="14" fill={INK[t]} />
        <path d="M9 32 C12 18 15 18 18 32 S24 46 27 32 S31 24 34 32 S37 36 40 32 H50" fill="none" stroke={PAPER[t]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="53" cy="32" r="4.5" fill={ACCENT[t]} />
      </svg>
    ),
  },
  {
    id: 'layers', name: 'Layers', style: 'Abstract',
    why: 'Three stacked layers, the top one lit: a model’s layers, or a system’s stack. Simple enough to survive 16 px.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="Three stacked layers">
        <rect width="64" height="64" rx="14" fill={PAPER[t]} stroke={t === 'light' ? '#e2e3e5' : '#2a2d32'} />
        <rect x="14" y="38" width="36" height="10" rx="3" fill={INK[t]} fillOpacity="0.35" />
        <rect x="14" y="27" width="36" height="10" rx="3" fill={INK[t]} fillOpacity="0.65" />
        <rect x="14" y="16" width="36" height="10" rx="3" fill={ACCENT[t]} />
      </svg>
    ),
  },
  {
    id: 'bracket-dot', name: '[sp.]', style: 'Combination',
    why: 'Your two shortlisted marks merged: the technical brackets around the monogram, full stop included.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="sp. in brackets">
        <rect width="64" height="64" rx="14" fill={INK[t]} />
        <g fill="none" stroke={ACCENT[t]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 16h-4v32h4" /><path d="M50 16h4v32h-4" />
        </g>
        <text x="16" y="40.5" fontFamily="Outfit, system-ui" fontWeight="750" fontSize="23" letterSpacing="-1.6" fill={PAPER[t]}>sp</text>
        <rect x="42" y="35" width="5" height="5" rx="1" fill={ACCENT[t]} />
      </svg>
    ),
  },
  {
    id: 'seal', name: 'Seal', style: 'Emblem',
    why: 'An emblem with the initials inside a ring of text. Strong on a CV, slides or a sticker; the ring drops out at favicon size.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="SP seal">
        <defs><path id={`ring-${t}`} d="M32 32 m-22 0 a22 22 0 1 1 44 0 a22 22 0 1 1 -44 0" /></defs>
        <circle cx="32" cy="32" r="31" fill={INK[t]} />
        <circle cx="32" cy="32" r="16" fill={ACCENT[t]} />
        <text fontFamily="Outfit, system-ui" fontWeight="600" fontSize="6.4" letterSpacing="1.6" fill={PAPER[t]}>
          <textPath href={`#ring-${t}`}>SUBASH PANDEY · AI/ML ENGINEER · </textPath>
        </text>
        <text x="32" y="37.5" textAnchor="middle" fontFamily="Outfit, system-ui" fontWeight="750" fontSize="15" letterSpacing="-0.8" fill={PAPER.light}>SP</text>
      </svg>
    ),
  },
  {
    id: 'quarter-s', name: 'Quarter s', style: 'Negative space',
    why: 'An s drawn with no letter at all: two quarter circles leave the shape between them. Reads as a mark first, a letter second.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="s formed by two quarter circles">
        <rect width="64" height="64" rx="14" fill={ACCENT[t]} />
        <path d="M14 14 H40 A10 10 0 0 1 40 34 H32 A9 9 0 0 1 32 14 Z" fill={PAPER.light} />
        <path d="M50 50 H24 A10 10 0 0 1 24 30 H32 A9 9 0 0 1 32 50 Z" fill={INK.light} />
      </svg>
    ),
  },
  {
    id: 'pixel', name: 'sp in pixels', style: 'Pixel', shortlisted: true,
    why: 'Chosen. Redrawn with 5-pixel letterforms on an exact 16-cell grid: at 16, 32 and 48 px every edge lands on a real pixel, so it stays the sharpest and most readable favicon of the set.',
    mark: (t) => (
      <svg viewBox="0 0 64 64" role="img" aria-label="sp in pixel type" shapeRendering="crispEdges">
        <rect width="64" height="64" rx="12" fill={INK[t]} shapeRendering="auto" />
        {pixels(S_PX, 8, 16, 4, PAPER[t])}
        {pixels(P_PX, 32, 16, 4, PAPER[t])}
        <rect x="56" y="32" width="4" height="4" fill={ACCENT[t]} />
      </svg>
    ),
  },
]

function Tab({ mark }: { mark: ReactNode }) {
  return (
    <div className="lg-tab" aria-hidden="true">
      <span className="lg-tab-icon">{mark}</span>
      <span className="lg-tab-title">Subash Pandey | AI/ML Engineer</span>
    </div>
  )
}

export default function LabLogos() {
  return (
    <LabFrame title="Logo options">
      <main id="main-content" className="site">
        <div className="site-col site-col--wide">
          <header className="site-intro">
            <h1>Logo options</h1>
            <p>Fifteen directions across monogram, technical, abstract, emblem, negative-space and pixel styles. Pick one (or two to combine) and I’ll produce the favicon set from it.</p>
          </header>
          <ol className="lg-list">
            {concepts.map((c, i) => (
              <li key={c.id} className="lg-item" id={c.id}>
                <div className="lg-meta">
                  <p className="lg-num">{i + 1}</p>
                  <h2>{c.name}</h2>
                  <p className="lg-style">{c.style}{c.shortlisted && <span className="lg-short">Shortlisted</span>}</p>
                  <p className="lg-why">{c.why}</p>
                </div>
                <div className="lg-show">
                  <div className="lg-big lg-big--light">{c.mark('light')}</div>
                  <div className="lg-big lg-big--dark">{c.mark('dark')}</div>
                  <div className="lg-sizes">
                    <span style={{ width: 48, height: 48 }}>{c.mark('light')}</span>
                    <span style={{ width: 32, height: 32 }}>{c.mark('light')}</span>
                    <span style={{ width: 16, height: 16 }}>{c.mark('light')}</span>
                    <span className="lg-sizes-label">48 · 32 · 16 px</span>
                  </div>
                  <Tab mark={c.mark('light')} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </LabFrame>
  )
}
