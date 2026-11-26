import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

/* Figures for the Lastcall post (see .claude/skills/blog-visuals). HTML first so labels stay readable on a
   phone; colours come from the site tokens, so light and dark both work. The accent means one thing
   throughout: what Lastcall acts on. Motion only where the figure explains a change; reduced motion gets
   the end state. Motion 12 animates `transform` strings and opacity only, which stay on the compositor. */

const ui: CSSProperties = { fontFamily: 'var(--font-ui)' }
const frame: CSSProperties = {
  ...ui,
  background: 'var(--color-surface)',
  border: '1px solid var(--color-rule)',
  borderRadius: 'var(--radius-md)',
  padding: '1rem',
}
const meta: CSSProperties = { fontSize: '0.75rem', color: 'var(--color-ink-3)', lineHeight: 1.4 }
const strong: CSSProperties = { fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.35 }
const body: CSSProperties = { fontSize: '0.8125rem', color: 'var(--color-ink-2)', lineHeight: 1.45 }
const accent = 'var(--color-accent)'
const wash = 'color-mix(in srgb, var(--color-accent) 10%, transparent)'
const plainList: CSSProperties = { listStyle: 'none', margin: 0, padding: 0 }
const EASE_OUT = [0.23, 1, 0.32, 1] as const

function Figure({ caption, label, children }: { caption: ReactNode; label: string; children: ReactNode }) {
  return (
    <figure role="group" aria-label={label}>
      <div style={frame}>{children}</div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function SmallButton({ onClick, pressed, children, label }: { onClick: () => void; pressed?: boolean; children: ReactNode; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      style={{
        ...ui,
        minHeight: 32,
        padding: '0.25rem 0.625rem',
        borderRadius: 999,
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
        color: pressed ? 'var(--color-ink)' : 'var(--color-ink-2)',
        border: `1px solid ${pressed ? accent : 'var(--color-rule)'}`,
        background: pressed ? wash : 'transparent',
      }}
    >
      {children}
    </button>
  )
}

/* ── 1. The same week, played day by day ──────────────────────────────── */

type Cell = { text: string; hot?: boolean } | null
const DAYS = ['Mon', 'Wed', 'Thu', 'Fri']
const LANES: { name: string; cells: Cell[] }[] = [
  {
    name: 'Without Lastcall',
    cells: [{ text: 'Post scheduled' }, { text: 'Tee sells out', hot: true }, null, { text: 'Post sends people to a sold-out page', hot: true }],
  },
  {
    name: 'With Lastcall',
    cells: [{ text: 'Post scheduled' }, { text: 'Sold out, post held in drafts', hot: true }, { text: 'Back in stock, post back in the queue' }, { text: 'Goes out on time' }],
  },
]
const LAST_DAY = DAYS.length - 1

export function GapWeek() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  // Starts complete, so the prerendered page and reduced motion show the whole week.
  const [day, setDay] = useState(LAST_DAY)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    let d = -1
    const tick = () => {
      d += 1
      setDay(Math.min(d, LAST_DAY))
      if (d >= LAST_DAY) window.clearInterval(id)
    }
    const first = window.setTimeout(tick, 0)
    const id = window.setInterval(tick, 1100)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(id)
    }
  }, [inView, reduce, run])

  const grid: CSSProperties = { display: 'grid', gridTemplateColumns: `repeat(${DAYS.length}, minmax(0, 1fr))`, gap: '0.375rem' }
  return (
    <Figure
      label="The same week with and without Lastcall. On Wednesday the tee sells out: without Lastcall the post still goes out on Friday to a sold-out page; with Lastcall it is held, then restored when the tee is back, and goes out on time."
      caption="The same post, the same week. The two weeks split on Wednesday, when the tee sells out."
    >
      <div ref={ref}>
        <div style={grid} aria-hidden="true">
          {DAYS.map((d, i) => (
            <div
              key={d}
              style={{
                ...meta,
                paddingBottom: '0.25rem',
                borderBottom: `2px solid ${i === day ? accent : 'var(--color-rule)'}`,
                color: i <= day ? 'var(--color-ink-2)' : 'var(--color-ink-3)',
                fontWeight: i === day ? 600 : 400,
                transition: 'border-color 200ms ease, color 200ms ease',
              }}
            >
              {d}
            </div>
          ))}
        </div>
        {LANES.map((lane) => (
          <div key={lane.name} style={{ marginTop: '0.875rem' }}>
            <div style={{ ...strong, fontSize: '0.8125rem', marginBottom: '0.375rem' }}>{lane.name}</div>
            <ol data-plain style={{ ...grid, ...plainList }}>
              {lane.cells.map((c, i) => {
                const shown = i <= day
                return (
                  <li
                    key={i}
                    aria-label={c ? `${DAYS[i]}: ${c.text}` : undefined}
                    aria-hidden={c ? undefined : true}
                    style={{
                      margin: 0,
                      padding: c ? '0.375rem 0.4375rem' : 0,
                      minHeight: '3.5rem',
                      fontSize: '0.75rem',
                      lineHeight: 1.35,
                      borderRadius: 6,
                      color: c?.hot ? 'var(--color-ink)' : 'var(--color-ink-2)',
                      border: c && shown ? `1px solid ${c.hot ? accent : 'var(--color-rule)'}` : '1px dashed var(--color-rule)',
                      background: c?.hot && shown ? wash : 'transparent',
                      transition: 'background-color 200ms ease, border-color 200ms ease',
                    }}
                  >
                    {c && (
                      <motion.span
                        style={{ display: 'block' }}
                        initial={false}
                        animate={{ opacity: shown ? 1 : 0, transform: shown ? 'translateY(0px)' : 'translateY(4px)' }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                      >
                        {c.text}
                      </motion.span>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
        {!reduce && (
          <div style={{ marginTop: '0.75rem' }}>
            <SmallButton onClick={() => setRun((r) => r + 1)} label="Replay the week">Replay the week</SmallButton>
          </div>
        )}
      </div>
    </Figure>
  )
}

/* ── 2. How the 17 days went ──────────────────────────────────────────── */

const STEPS: { date: string; text: string; key?: boolean }[] = [
  { date: 'Oct 28', text: 'No app code. Paused and restored a post in Buffer by hand, then wrote the plan.' },
  { date: 'Oct 29', text: 'Sign in with Buffer works.' },
  { date: 'Oct 30', text: 'One real post held and restored through the app, live on a server. First accuracy test, on 122 links.', key: true },
  { date: 'Oct 31', text: 'Automatic holds, emails, and a demo shop whose items can sell out.' },
  { date: 'Nov 2', text: 'Ready for judges: sample posts and public sell-out buttons.' },
  { date: 'Nov 5–9', text: 'Job boards, WooCommerce stores, and the departures-board design.' },
  { date: 'Nov 13', text: 'Final checks. Submissions close.' },
]

export function BuildTimeline() {
  return (
    <Figure
      label="Build timeline from October 28 to November 13"
      caption="The whole loop worked on day three. Every day after that added depth to something that already ran."
    >
      <ol data-plain style={plainList}>
        {STEPS.map((s, i) => (
          <li key={s.date} style={{ margin: 0, display: 'grid', gridTemplateColumns: '4.25rem 1rem minmax(0, 1fr)', columnGap: '0.5rem' }}>
            <span style={{ ...meta, fontVariantNumeric: 'tabular-nums', paddingTop: '0.1rem' }}>{s.date}</span>
            <span aria-hidden="true" style={{ position: 'relative' }}>
              {i < STEPS.length - 1 && (
                <span style={{ position: 'absolute', left: '50%', top: '0.9rem', bottom: '-0.2rem', width: 1, background: 'var(--color-rule)' }} />
              )}
              <span
                style={{
                  position: 'absolute', left: 'calc(50% - 4px)', top: '0.35rem', width: 9, height: 9, borderRadius: 999,
                  background: s.key ? accent : 'var(--color-surface)',
                  border: `1.5px solid ${s.key ? accent : 'var(--color-ink-3)'}`,
                }}
              />
            </span>
            <span style={{ fontSize: '0.875rem', lineHeight: 1.45, color: s.key ? 'var(--color-ink)' : 'var(--color-ink-2)', fontWeight: s.key ? 600 : 400, paddingBottom: '0.75rem' }}>
              {s.text}
            </span>
          </li>
        ))}
      </ol>
    </Figure>
  )
}

/* ── 4. Who talks to whom: a sequence diagram ─────────────────────────── */

const LANE_NAMES = ['Shop', 'Lastcall', 'Buffer'] as const
type Lane = 0 | 1 | 2
type Msg = { from: Lane; to: Lane; what: string; cost?: string; reply?: boolean; hot?: boolean }
const PHASES: { when: string; msgs: Msg[] }[] = [
  {
    when: 'Every three hours, and when you open the app',
    msgs: [
      { from: 1, to: 2, what: 'Your channels and the next 30 days of posts?', cost: '1 request' },
      { from: 2, to: 1, what: 'The scheduled posts', reply: true },
    ],
  },
  {
    when: 'For each link in those posts',
    msgs: [
      { from: 1, to: 0, what: 'Is this still for sale?', cost: '0 to Buffer' },
      { from: 0, to: 1, what: 'Feed: sold out', reply: true },
    ],
  },
  {
    when: 'When a link is stale',
    msgs: [
      { from: 1, to: 2, what: 'Read the post again', cost: '1 request' },
      { from: 1, to: 2, what: 'Same text, to Drafts, tag "held"', cost: '1 request', hot: true },
    ],
  },
  {
    when: 'When it is fresh on two checks, 5 minutes apart',
    msgs: [
      { from: 1, to: 2, what: 'Read the post again', cost: '1 request' },
      { from: 1, to: 2, what: 'Same text, back at its original time', cost: '1 request' },
    ],
  },
]
const laneX = (l: Lane) => `${(l * 2 + 1) * (100 / 6)}%`

function Arrow({ m, delay, play }: { m: Msg; delay: number; play: boolean }) {
  const left = Math.min(m.from, m.to)
  const span = Math.abs(m.to - m.from)
  const rightward = m.to > m.from
  const color = m.hot ? accent : 'var(--color-ink-3)'
  return (
    <div style={{ position: 'relative', marginLeft: laneX(left as Lane), width: `${(span * 100) / 3}%`, padding: '0.5rem 0 0.75rem' }}>
      <div style={{ ...body, fontSize: '0.75rem', textAlign: 'center', padding: '0 0.25rem', color: m.hot ? 'var(--color-ink)' : 'var(--color-ink-2)', fontWeight: m.hot ? 600 : 400 }}>
        {m.what}
        {m.cost && <span style={{ ...meta, display: 'block', color: m.hot ? accent : 'var(--color-ink-3)' }}>{m.cost}</span>}
      </div>
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ transform: play ? 'scaleX(1)' : 'scaleX(0)', opacity: play ? 1 : 0 }}
        transition={{ duration: 0.35, delay, ease: EASE_OUT }}
        style={{ position: 'relative', height: 8, marginTop: '0.25rem', transformOrigin: rightward ? 'left center' : 'right center' }}
      >
        <div style={{ position: 'absolute', top: 3.5, left: 0, right: 0, borderTop: `1.5px ${m.reply ? 'dashed' : 'solid'} ${color}` }} />
        <div
          style={{
            position: 'absolute', top: 0, [rightward ? 'right' : 'left']: -1, width: 0, height: 0,
            borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
            [rightward ? 'borderLeft' : 'borderRight']: `6px solid ${color}`,
          }}
        />
      </motion.div>
    </div>
  )
}

export function BufferSequence() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  const [armed, setArmed] = useState(false)
  // Drawn by default (prerender, no script, reduced motion); arms only once it is about to be seen.
  useEffect(() => {
    if (reduce || inView || Reflect.get(window, '__PRERENDER__')) return
    const raf = window.requestAnimationFrame(() => setArmed(true))
    return () => window.cancelAnimationFrame(raf)
  }, [reduce, inView])
  const play = !armed || inView
  let n = 0
  return (
    <Figure
      label="Sequence diagram: Lastcall reads the scheduled posts from Buffer, asks each shop whether the item is still for sale, and when a link is stale reads the post and moves it to Drafts with a held tag. When the link is fresh again, it reads the post and puts it back at its original time. Checking links costs no Buffer requests; a hold or a restore costs two."
      caption="Everything Lastcall sends, in order. Checking links costs Buffer nothing. A hold or a restore costs two requests, because Lastcall reads the post right before it edits it."
    >
      <div ref={ref} style={{ position: 'relative' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: '1.75rem 0 0 0', pointerEvents: 'none' }}>
          {LANE_NAMES.map((_, l) => (
            <div key={l} style={{ position: 'absolute', top: 0, bottom: 0, left: laneX(l as Lane), borderLeft: '1px dashed var(--color-rule)' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', textAlign: 'center' }}>
          {LANE_NAMES.map((name) => (
            <div key={name} style={{ ...strong, fontSize: '0.8125rem' }}>
              <span style={{ display: 'inline-block', padding: '0.125rem 0.5rem', borderRadius: 6, border: '1px solid var(--color-rule)', background: 'var(--color-surface)', position: 'relative' }}>{name}</span>
            </div>
          ))}
        </div>
        <ol data-plain style={{ ...plainList, position: 'relative', marginTop: '0.5rem' }}>
          {PHASES.map((ph) => (
            <li key={ph.when} style={{ margin: '0.5rem 0 0' }}>
              <div style={{ ...meta, textAlign: 'center' }}>
                <span style={{ background: 'var(--color-surface)', padding: '0 0.375rem', position: 'relative' }}>{ph.when}</span>
              </div>
              {ph.msgs.map((m) => (
                <Arrow key={m.what + m.from} m={m} play={play} delay={reduce ? 0 : 0.12 * n++} />
              ))}
            </li>
          ))}
        </ol>
      </div>
    </Figure>
  )
}

/* ── 5. 150 real links, one square each ──────────────────────────────── */

type Kind = 'caught' | 'missed' | 'cant' | 'fresh'
const GROUPS: { kind: Kind; n: number; label: string }[] = [
  { kind: 'caught', n: 59, label: 'Stale, caught' },
  { kind: 'missed', n: 3, label: 'Stale, still waiting for a second look' },
  { kind: 'cant', n: 3, label: "Can't check, as expected" },
  { kind: 'fresh', n: 85, label: 'Fresh, left alone' },
]
const COLS = 25
const SIZE = 14
const GAP = 4

function Square({ kind, x, y, label, dim }: { kind: Kind; x: number; y: number; label: string; dim?: boolean }) {
  const common = { x: x + 0.75, y: y + 0.75, width: SIZE - 1.5, height: SIZE - 1.5, rx: 3 }
  const style: CSSProperties =
    kind === 'caught' ? { fill: accent }
    : kind === 'missed' ? { fill: 'none', stroke: accent, strokeWidth: 1.5 }
    : kind === 'cant' ? { fill: 'none', stroke: 'var(--color-ink-3)', strokeWidth: 1.5, strokeDasharray: '3 2' }
    : { fill: 'var(--color-ink-3)', opacity: 0.32 }
  return (
    <rect {...common} style={{ ...style, ...(dim ? { opacity: 0.12 } : null), transition: 'opacity 200ms ease' }}>
      <title>{label}</title>
    </rect>
  )
}

export function HarnessGrid() {
  const [focus, setFocus] = useState<Kind | null>(null)
  const cells = GROUPS.flatMap((g) => Array.from({ length: g.n }, () => g))
  const rows = Math.ceil(cells.length / COLS)
  const w = COLS * (SIZE + GAP) - GAP
  const h = rows * (SIZE + GAP) - GAP
  return (
    <Figure
      label="Accuracy test on 150 real links, November 9, 2026"
      caption="The run on November 9: 150 real links, one square each. No fresh link was called stale. Tap a group to pick it out."
    >
      <svg data-fluid viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }} role="img" aria-label="59 stale links caught, 3 stale links still waiting for a second look, 3 can't check, 85 fresh links left alone. No fresh link was marked stale.">
        {cells.map((g, i) => (
          <Square key={i} kind={g.kind} label={g.label} dim={focus !== null && focus !== g.kind} x={(i % COLS) * (SIZE + GAP)} y={Math.floor(i / COLS) * (SIZE + GAP)} />
        ))}
      </svg>
      <ul data-plain style={{ ...plainList, margin: '0.875rem 0 0', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {GROUPS.map((g) => (
          <li key={g.kind} style={{ margin: 0 }}>
            <button
              type="button"
              aria-pressed={focus === g.kind}
              onClick={() => setFocus((f) => (f === g.kind ? null : g.kind))}
              style={{
                ...ui, ...body,
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 32,
                padding: '0.25rem 0.625rem', borderRadius: 999, cursor: 'pointer',
                border: `1px solid ${focus === g.kind ? accent : 'var(--color-rule)'}`,
                background: focus === g.kind ? wash : 'transparent',
              }}
            >
              <svg width={SIZE} height={SIZE} aria-hidden="true">
                <Square kind={g.kind} x={0} y={0} label={g.label} />
              </svg>
              <span>
                <strong style={{ color: 'var(--color-ink)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{g.n}</strong> {g.label.toLowerCase()}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Figure>
  )
}

/* ── Real screenshots ─────────────────────────────────────────────────── */

export function Screenshot({ src, alt, caption, width, height }: { src: string; alt: string; caption: ReactNode; width: number; height: number }) {
  return (
    <figure>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-rule)' }}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
