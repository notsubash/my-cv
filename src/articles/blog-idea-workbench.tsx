import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import BlogNav from './BlogNav'
import BlogToc from './BlogToc'
import { useBlogSeo, useReadingTime } from './useBlogSeo'

/** Set when the walkthrough is published. Empty = hidden. */
const YOUTUBE_VIDEO_ID = ''

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/** Reveal a figure once it scrolls into view. Fires once, then disconnects. */
function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

/** Shared SVG scaffolding: gradients, arrowhead, shadow, and flow keyframes. */
function VizDefs() {
  return (
    <defs>
      <style>{`
        @keyframes viz-dash { to { stroke-dashoffset: -24; } }
        .viz-flow { stroke-dasharray: 5 7; animation: viz-dash 1.2s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .viz-flow { animation: none; stroke-dasharray: none; }
        }
      `}</style>
      <linearGradient id="viz-accent" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(var(--accent) / 0.24)" />
        <stop offset="100%" stopColor="hsl(var(--accent) / 0.09)" />
      </linearGradient>
      <linearGradient id="viz-card" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(var(--card))" />
        <stop offset="100%" stopColor="hsl(var(--muted) / 0.4)" />
      </linearGradient>
      <marker id="viz-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary) / 0.6)" />
      </marker>
      <filter id="viz-shadow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="2.4" floodColor="#000" floodOpacity="0.16" />
      </filter>
    </defs>
  )
}

function VizShell({
  children,
  viewBox,
  label,
  caption,
}: {
  children: ReactNode | ((inView: boolean) => ReactNode)
  viewBox: string
  label: string
  caption: string
}) {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <figure ref={ref} className="my-8">
      <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card/90 to-muted/40 p-3 sm:p-5 shadow-[inset_0_1px_0_0_hsl(var(--border)/0.35)]">
        <svg viewBox={viewBox} className="w-full overflow-visible" role="img" aria-label={label}>
          <VizDefs />
          <g
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(12px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            {typeof children === 'function' ? children(inView) : children}
          </g>
        </svg>
      </div>
      <figcaption className="text-center text-xs text-muted-foreground mt-2.5 px-2">{caption}</figcaption>
    </figure>
  )
}

function Node({
  x, y, w, h, title, sub, accent, soft,
}: {
  x: number; y: number; w: number; h: number
  title: string; sub?: string; accent?: boolean; soft?: boolean
}) {
  const cy = y + h / 2
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={10}
        fill={accent ? 'url(#viz-accent)' : soft ? 'hsl(var(--muted) / 0.55)' : 'url(#viz-card)'}
        stroke={accent ? 'hsl(var(--accent) / 0.55)' : 'hsl(var(--border))'}
        strokeWidth={1.5}
        filter="url(#viz-shadow)"
      />
      <text
        x={x + w / 2}
        y={sub ? cy - 7 : cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-[hsl(var(--foreground))] text-[11px] font-semibold"
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={cy + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[8.5px]"
        >
          {sub}
        </text>
      )}
    </g>
  )
}

function ArrowLine({
  x1, y1, x2, y2, flow, label,
}: {
  x1: number; y1: number; x2: number; y2: number; flow?: boolean; label?: string
}) {
  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="hsl(var(--primary) / 0.5)"
        strokeWidth={1.6}
        markerEnd="url(#viz-arrow)"
        className={flow ? 'viz-flow' : undefined}
      />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 6}
          textAnchor="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[8px]"
        >
          {label}
        </text>
      )}
    </g>
  )
}

function ValidationLoopViz() {
  const reduced = usePrefersReducedMotion()

  const stages = [
    { label: 'Worksheet', sub: 'versioned', angle: -90 },
    { label: 'Evidence', sub: 'signals', angle: -18 },
    { label: 'Readiness', sub: 'policy', angle: 54 },
    { label: 'Judge run', sub: 'panel', angle: 126 },
    { label: 'Handoff', sub: 'drafts', angle: 198 },
  ]
  const cx = 320
  const cy = 145
  const r = 100
  // Clockwise full-circle path starting at the top, for the orbiting pulse.
  const loopPath = `M${cx},${cy - r} a${r},${r} 0 1,1 -0.01,0`

  return (
    <VizShell
      viewBox="0 0 640 300"
      label="Gavel validation loop from worksheet through judgment and handoff"
      caption="The panel is a station on a loop. The next version of the idea is the product."
    >
      {(inView) => (
        <>
          <circle cx={cx} cy={cy} r={r + 22} fill="none" stroke="hsl(var(--border))" strokeWidth={1} strokeDasharray="2 6" opacity={0.65} />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth={2.5}
            strokeDasharray={inView ? '560 50' : '0 610'}
            style={{ transition: 'stroke-dasharray 1.1s ease-out' }}
          />
          <polygon
            points={`${cx},${cy - r - 8} ${cx - 6},${cy - r + 4} ${cx + 6},${cy - r + 4}`}
            fill="hsl(var(--primary) / 0.55)"
            transform={`rotate(36 ${cx} ${cy})`}
          />

          {inView && !reduced && (
            <circle r={5.5} fill="hsl(var(--primary))" opacity={0.9}>
              <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={loopPath} />
            </circle>
          )}

          <circle cx={cx} cy={cy} r={40} fill="url(#viz-accent)" stroke="hsl(var(--accent) / 0.5)" strokeWidth={1.5} filter="url(#viz-shadow)" />
          <text x={cx} y={cy - 5} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[11px] font-semibold">next version</text>
          <text x={cx} y={cy + 11} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[9px]">of the idea</text>

          {stages.map((s, i) => {
            const rad = (s.angle * Math.PI) / 180
            const x = cx + Math.cos(rad) * r
            const y = cy + Math.sin(rad) * r
            return (
              <g
                key={s.label}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'none' : 'scale(0.82)',
                  transformOrigin: `${x}px ${y}px`,
                  transition: `opacity 0.45s ease-out ${0.25 + i * 0.09}s, transform 0.45s ease-out ${0.25 + i * 0.09}s`,
                }}
              >
                <circle cx={x} cy={y} r={32} fill="url(#viz-card)" stroke="hsl(var(--border))" strokeWidth={1.5} filter="url(#viz-shadow)" />
                <text x={x} y={y - 5} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[10px] font-semibold">{s.label}</text>
                <text x={x} y={y + 10} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px]">{s.sub}</text>
              </g>
            )
          })}
        </>
      )}
    </VizShell>
  )
}

function ControlPlaneViz() {
  return (
    <VizShell
      viewBox="0 0 640 292"
      label="Split between application control plane and probabilistic model judgment"
      caption="Code owns sequencing and acceptance. Models fill the judgment fields."
    >
      <rect x={12} y={10} width={616} height={120} rx={14} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth={1.2} />
      <rect x={12} y={160} width={616} height={120} rx={14} fill="hsl(var(--accent) / 0.07)" stroke="hsl(var(--accent) / 0.35)" strokeWidth={1.2} />
      <text x={28} y={32} className="fill-[hsl(var(--muted-foreground))] text-[9px] font-semibold uppercase tracking-[0.14em]">application control</text>
      <text x={28} y={182} className="fill-[hsl(var(--muted-foreground))] text-[9px] font-semibold uppercase tracking-[0.14em]">model judgment</text>

      <Node x={28} y={46} w={132} h={64} title="Readiness" sub="allow / block" accent />
      <Node x={176} y={46} w={132} h={64} title="Fixed graph" sub="all five speak" />
      <Node x={324} y={46} w={132} h={64} title="Schema + QA" sub="retry or fail" accent />
      <Node x={472} y={46} w={136} h={64} title="Event log" sub="ordered, durable" />

      <Node x={28} y={196} w={132} h={64} title="5 lenses" sub="parallel verdicts" />
      <Node x={176} y={196} w={132} h={64} title="Debate" sub="argue the case" accent />
      <Node x={324} y={196} w={132} h={64} title="Re-vote" sub="±3 with reason" />
      <Node x={472} y={196} w={136} h={64} title="Synthesis" sub="GO · ITERATE · NO-GO" accent />

      <ArrowLine x1={94} y1={196} x2={94} y2={110} flow />
      <ArrowLine x1={390} y1={196} x2={390} y2={110} flow />
      <text x={102} y={154} className="fill-[hsl(var(--muted-foreground))] text-[8px]">after gate</text>
      <text x={398} y={154} className="fill-[hsl(var(--muted-foreground))] text-[8px]">validated</text>
    </VizShell>
  )
}

function ReadinessTreeViz() {
  return (
    <VizShell
      viewBox="0 0 640 300"
      label="Deterministic readiness decision tree"
      caption="A cheap policy ladder. The model never decides whether it gets to speak."
    >
      <Node x={220} y={8} w={200} h={50} title="Structure checks" sub="audience · problem · solution" accent />

      <line x1={260} y1={58} x2={140} y2={84} stroke="hsl(var(--primary) / 0.4)" strokeWidth={1.5} markerEnd="url(#viz-arrow)" />
      <line x1={380} y1={58} x2={500} y2={84} stroke="hsl(var(--primary) / 0.4)" strokeWidth={1.5} markerEnd="url(#viz-arrow)" />

      <Node x={40} y={84} w={200} h={50} title="fail → too_vague" sub="block unless override" soft />
      <Node x={400} y={84} w={200} h={50} title="pass → evidence?" sub="human signals only" />

      <line x1={460} y1={134} x2={250} y2={168} stroke="hsl(var(--primary) / 0.4)" strokeWidth={1.5} markerEnd="url(#viz-arrow)" />
      <line x1={540} y1={134} x2={540} y2={168} stroke="hsl(var(--primary) / 0.4)" strokeWidth={1.5} markerEnd="url(#viz-arrow)" />

      <Node x={150} y={168} w={200} h={50} title="no → speculative" sub="can run, low confidence" />
      <Node x={440} y={168} w={200} h={50} title="yes → ready" sub="quotes · LOI · pay · usage" accent />

      <line x1={250} y1={218} x2={250} y2={240} stroke="hsl(var(--primary) / 0.35)" strokeWidth={1.5} />
      <line x1={540} y1={218} x2={540} y2={240} stroke="hsl(var(--primary) / 0.35)" strokeWidth={1.5} />
      <line x1={250} y1={240} x2={540} y2={240} stroke="hsl(var(--primary) / 0.35)" strokeWidth={1.5} />
      <line x1={395} y1={240} x2={395} y2={252} stroke="hsl(var(--primary) / 0.35)" strokeWidth={1.5} />

      <Node x={320} y={252} w={150} h={36} title="rerun needs delta" soft />
    </VizShell>
  )
}

function PanelQualityViz() {
  return (
    <VizShell
      viewBox="0 0 640 300"
      label="Panel quality pipeline from schema validation through overlap policy"
      caption="Valid JSON is necessary and nowhere near sufficient. Uniform panels warn; lens collapse fails."
    >
      <Node x={16} y={14} w={108} h={48} title="5 verdicts" sub="parallel" />
      <ArrowLine x1={124} y1={38} x2={148} y2={38} flow />
      <Node x={148} y={14} w={100} h={48} title="Schema" sub="Pydantic" accent />
      <ArrowLine x1={248} y1={38} x2={272} y2={38} flow />
      <Node x={272} y={14} w={120} h={48} title="Quality QA" sub="overlap · generics" />
      <ArrowLine x1={392} y1={38} x2={416} y2={38} flow />
      <Node x={416} y={14} w={140} h={48} title="Retry ≤ 2" sub="role-specific nudge" accent />

      <line x1={486} y1={62} x2={486} y2={90} stroke="hsl(var(--primary) / 0.4)" strokeWidth={1.5} />
      <line x1={320} y1={90} x2={486} y2={90} stroke="hsl(var(--primary) / 0.4)" strokeWidth={1.5} />
      <line x1={320} y1={90} x2={320} y2={108} stroke="hsl(var(--primary) / 0.4)" strokeWidth={1.5} />

      <Node x={240} y={108} w={160} h={48} title="Uniform panel?" soft />
      <text x={190} y={122} textAnchor="end" className="fill-[hsl(var(--muted-foreground))] text-[8px]">yes</text>
      <ArrowLine x1={240} y1={132} x2={176} y2={132} />
      <Node x={16} y={108} w={160} h={48} title="Warn + flag" sub="low confidence" soft />

      <text x={336} y={172} className="fill-[hsl(var(--muted-foreground))] text-[8px]">no</text>
      <line x1={320} y1={156} x2={320} y2={188} stroke="hsl(var(--primary) / 0.4)" strokeWidth={1.5} />

      <Node x={240} y={188} w={160} h={48} title="Lens collapse?" soft />
      <text x={190} y={202} textAnchor="end" className="fill-[hsl(var(--muted-foreground))] text-[8px]">yes</text>
      <ArrowLine x1={240} y1={212} x2={176} y2={212} />
      <Node x={16} y={188} w={160} h={48} title="Fail the run" soft />

      <text x={450} y={202} className="fill-[hsl(var(--muted-foreground))] text-[8px]">no</text>
      <ArrowLine x1={400} y1={212} x2={464} y2={212} flow />
      <Node x={464} y={188} w={160} h={48} title="Accept panel" accent />

      <text x={320} y={272} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[9px]">
        bland consensus can warn · collapsed lenses fail the run
      </text>
    </VizShell>
  )
}

function DurableRunViz() {
  const reduced = usePrefersReducedMotion()
  const events = [
    { x: 100, t: '0', l: 'start' },
    { x: 200, t: '1–5', l: 'verdicts' },
    { x: 310, t: '6…', l: 'debate' },
    { x: 420, t: 'n−1', l: 're-vote' },
    { x: 540, t: 'n', l: 'done' },
  ]

  return (
    <VizShell
      viewBox="0 0 640 318"
      label="Durable run architecture with background manager, SQLite event log, and reconnecting SSE clients"
      caption="The HTTP connection is a subscriber. The run is a background task with an append-only log."
    >
      {(inView) => (
        <>
          <Node x={12} y={12} w={96} h={46} title="Browser" sub="POST /runs" />
          <ArrowLine x1={108} y1={35} x2={132} y2={35} flow />
          <Node x={132} y={12} w={112} h={46} title="FastAPI" sub="returns run_id" accent />
          <ArrowLine x1={244} y1={35} x2={268} y2={35} flow />
          <Node x={268} y={12} w={132} h={46} title="RunManager" sub="1 background task" />
          <ArrowLine x1={400} y1={35} x2={424} y2={35} flow />
          <Node x={424} y={12} w={152} h={46} title="Pipeline" sub="panel → debate → …" accent />

          <ArrowLine x1={334} y1={58} x2={334} y2={82} flow />
          <text x={344} y={74} className="fill-[hsl(var(--muted-foreground))] text-[8px]">append</text>

          <rect x={60} y={82} width={520} height={78} rx={12} fill="hsl(var(--muted) / 0.4)" stroke="hsl(var(--border))" strokeWidth={1.2} />
          <text x={76} y={100} className="fill-[hsl(var(--muted-foreground))] text-[9px] font-semibold uppercase tracking-wider">SQLite event log</text>
          <line
            x1={100} y1={126} x2={540} y2={126}
            stroke="hsl(var(--primary) / 0.45)" strokeWidth={2}
            className={inView ? 'viz-flow' : undefined}
          />

          {inView && !reduced && (
            <circle r={4} fill="hsl(var(--primary))">
              <animateMotion dur="4.5s" repeatCount="indefinite" path="M100,126 H540" />
            </circle>
          )}

          {events.map((e, i) => (
            <g
              key={e.t}
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.35s ease-out ${0.2 + i * 0.12}s`,
              }}
            >
              <circle cx={e.x} cy={126} r={7} fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth={2} />
              <text x={e.x} y={116} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[8px] font-semibold">{e.t}</text>
              <text x={e.x} y={148} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px]">{e.l}</text>
            </g>
          ))}

          <ArrowLine x1={160} y1={160} x2={160} y2={188} flow />
          <ArrowLine x1={480} y1={160} x2={480} y2={188} flow />
          <text x={168} y={178} className="fill-[hsl(var(--muted-foreground))] text-[8px]">replay</text>
          <text x={488} y={178} className="fill-[hsl(var(--muted-foreground))] text-[8px]">live</text>

          <Node x={60} y={188} w={200} h={48} title="SSE subscriber A" sub="Last-Event-ID = 3" />
          <Node x={380} y={188} w={200} h={48} title="SSE subscriber B" sub="fresh tab" />

          <line x1={160} y1={236} x2={160} y2={258} stroke="hsl(var(--primary) / 0.35)" strokeWidth={1.5} />
          <line x1={480} y1={236} x2={480} y2={258} stroke="hsl(var(--primary) / 0.35)" strokeWidth={1.5} />
          <Node x={60} y={258} w={200} h={42} title="pure reducer" sub="same final view" accent />
          <Node x={380} y={258} w={200} h={42} title="pure reducer" sub="same final view" accent />
        </>
      )}
    </VizShell>
  )
}

function VersionCowViz() {
  return (
    <VizShell
      viewBox="0 0 640 260"
      label="Worksheet version history with copy-on-write after a run locks a version"
      caption="Scores are meaningless without a frozen input. After a run, core edits fork."
    >
      <line x1={80} y1={50} x2={520} y2={50} stroke="hsl(var(--border))" strokeWidth={2} />

      <Node x={40} y={22} w={100} h={56} title="v1" sub="draft fields" />
      <Node x={200} y={22} w={120} h={56} title="v2" sub="pricing changed" accent />
      <Node x={420} y={22} w={120} h={56} title="v3" sub="post-run edit" accent />

      {/* fork marker between v2 and v3 */}
      <path d="M320 50 C320 78, 420 78, 420 50" fill="none" stroke="hsl(var(--primary) / 0.45)" strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={370} y={92} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px]">copy-on-write</text>

      <line x1={260} y1={78} x2={260} y2={118} stroke="hsl(var(--primary) / 0.45)" strokeWidth={1.5} />
      <Node x={200} y={118} w={120} h={40} title="judge run A" soft />

      <line x1={480} y1={78} x2={480} y2={118} stroke="hsl(var(--primary) / 0.45)" strokeWidth={1.5} />
      <Node x={420} y={118} w={120} h={40} title="judge run B" soft />

      <rect x={60} y={180} width={520} height={56} rx={10} fill="hsl(var(--muted) / 0.4)" stroke="hsl(var(--border))" strokeWidth={1} />
      <text x={320} y={204} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[10px] font-semibold">
        typo fixes can stay on v2 until a run locks it
      </text>
      <text x={320} y={222} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[9px]">
        base_version_id rejects stale edits · string-equal field diffs
      </text>
    </VizShell>
  )
}

function HandoffFlowViz() {
  const reduced = usePrefersReducedMotion()
  const flows = [
    { from: 'top problems', to: 'assumptions', w: 9 },
    { from: 'evidence to change score', to: 'evidence targets', w: 13 },
    { from: 'recommended fixes', to: 'draft experiments', w: 11 },
    { from: 'synthesis experiment', to: 'primary test', w: 7 },
  ]

  return (
    <VizShell
      viewBox="0 0 640 268"
      label="Post-run handoff mapping critique fields into validation work items"
      caption="At most twelve deduplicated drafts. Nothing enters the ledger until the founder accepts it."
    >
      {(inView) => (
        <>
          <text x={130} y={24} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[10px] font-semibold uppercase tracking-[0.12em]">run output</text>
          <text x={510} y={24} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[10px] font-semibold uppercase tracking-[0.12em]">workspace</text>

          {flows.map((f, i) => {
            const y = 44 + i * 48
            const mid = y + 16
            const d = `M240 ${mid} C310 ${mid}, 330 ${mid}, 400 ${mid}`
            return (
              <g
                key={f.from}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'none' : 'translateX(-8px)',
                  transition: `opacity 0.4s ease-out ${i * 0.12}s, transform 0.4s ease-out ${i * 0.12}s`,
                }}
              >
                <rect x={20} y={y} width={220} height={32} rx={8} fill="url(#viz-card)" stroke="hsl(var(--border))" strokeWidth={1.2} filter="url(#viz-shadow)" />
                <text x={130} y={y + 21} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[10px]">{f.from}</text>
                <path d={d} fill="none" stroke="hsl(var(--primary))" strokeOpacity={0.28} strokeWidth={f.w} strokeLinecap="round" />
                {inView && !reduced && (
                  <circle r={2.6} fill="hsl(var(--primary))">
                    <animateMotion dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} />
                  </circle>
                )}
                <rect x={400} y={y} width={220} height={32} rx={8} fill="url(#viz-accent)" stroke="hsl(var(--accent) / 0.45)" strokeWidth={1.2} filter="url(#viz-shadow)" />
                <text x={510} y={y + 21} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[10px]">{f.to}</text>
              </g>
            )
          })}

          <text x={320} y={252} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[9px]">
            appeals re-evaluate the panel · they do not write validation records
          </text>
        </>
      )}
    </VizShell>
  )
}

function TrustBoundaryViz() {
  const lanes = [
    { tag: 'idea', y: 56 },
    { tag: 'research', y: 96 },
    { tag: 'memory', y: 136 },
    { tag: 'debate', y: 176 },
    { tag: 'appeal', y: 216 },
  ]

  return (
    <VizShell
      viewBox="0 0 640 280"
      label="Prompt trust boundary wrapping untrusted user and retrieved content"
      caption="Every model call gets the same tagged envelope. Escaped interior tags keep delimiters honest."
    >
      {(inView) => (
        <>
          <rect x={24} y={24} width={400} height={232} rx={14} fill="hsl(var(--card))" stroke="hsl(var(--primary) / 0.35)" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={40} y={46} className="fill-[hsl(var(--muted-foreground))] text-[9px] font-semibold uppercase tracking-[0.12em]">untrusted envelope</text>

          {lanes.map((lane, i) => (
            <g
              key={lane.tag}
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.35s ease-out ${0.15 + i * 0.1}s`,
              }}
            >
              <rect x={44} y={lane.y} width={360} height={30} rx={7} fill="hsl(var(--muted) / 0.5)" stroke="hsl(var(--border))" strokeWidth={1} />
              <text x={58} y={lane.y + 19} className="fill-[hsl(var(--muted-foreground))] text-[9px]">&lt;{lane.tag}&gt;</text>
              <text x={224} y={lane.y + 19} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">user / retrieved content</text>
              <text x={386} y={lane.y + 19} textAnchor="end" className="fill-[hsl(var(--muted-foreground))] text-[9px]">&lt;/{lane.tag}&gt;</text>
            </g>
          ))}

          <ArrowLine x1={424} y1={140} x2={468} y2={140} flow />
          <Node x={468} y={105} w={148} h={70} title="model call" sub="judgment only" accent />
        </>
      )}
    </VizShell>
  )
}

function DemoVideoSlot() {
  if (!YOUTUBE_VIDEO_ID) return null

  return (
    <figure className="my-8">
      <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-card shadow-[inset_0_1px_0_0_hsl(var(--border)/0.35)]">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
          title="Gavel walkthrough"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <figcaption className="text-center text-xs text-muted-foreground mt-2.5">Walkthrough</figcaption>
    </figure>
  )
}

export default function BlogIdeaWorkbench() {
  useBlogSeo({
    title: 'Building Gavel: Turning AI Opinions Into Experiments',
    description:
      'How I built Gavel: readiness as policy code, structured multi-agent judgment, durable SSE runs, versioned worksheets, and post-run handoffs that turn critique into work.',
    keywords:
      'Gavel idea validation, AI startup idea validator architecture, multi agent app LangGraph, founder idea validation, FastAPI SSE durable event log, Next.js FastAPI LangGraph, structured LLM output guardrails, AI judge panel architecture, LangGraph deterministic workflow, versioned idea worksheet',
    ogImage: '/Gavel.webp',
    datePublished: '2026-07-14',
    slug: 'building-an-idea-workbench',
  })
  const { articleRef, readingTimeRef } = useReadingTime()

  return (
    <main className="min-h-screen bg-background">
      <BlogToc articleRef={articleRef} />
      <article ref={articleRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> July 2026</span>
            <span className="text-border">·</span>
            <span ref={readingTimeRef}>20 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Building Gavel: Turning AI Opinions Into Experiments
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            Most multi-agent demos end when the model finishes talking. Gavel starts there.
            I wanted a local workbench where an idea can be sharpened, gated, judged under a fixed workflow,
            and converted into assumptions and experiments a founder can actually run.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Python', 'FastAPI', 'LangGraph', 'Next.js', 'SQLite', 'SSE'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <figure className="mb-8">
          <img
            src="/Gavel.webp"
            alt="Gavel app interface showing the idea worksheet and validation workspace"
            className="w-full rounded-2xl border border-border shadow-[0_12px_40px_-24px_hsl(var(--foreground)/0.35)]"
            width={1536}
            height={1024}
            loading="eager"
          />
          <figcaption className="text-center text-xs text-muted-foreground mt-2.5">
            Gavel: worksheet, evidence, and a judge panel that feeds the next version
          </figcaption>
        </figure>

        <DemoVideoSlot />

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          Source:{' '}
          <a href="https://github.com/notsubash/gavel" className="text-primary hover:underline">
            github.com/notsubash/gavel
          </a>
          . Local or self-hosted today: no accounts, single API worker. For metrics, event types,
          and the eval pyramid, see the{' '}
          <Link to="/projects/gavel" className="text-primary hover:underline">
            technical case study
          </Link>
          .
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 id="product" className="font-display text-lg font-semibold text-foreground mb-3">The product boundary</h2>
            <p>
              Gavel is organized around a versioned idea worksheet: audience, problem, current workaround,
              proposed solution, pricing hypothesis, competitors, and the riskiest assumption. Around that document
              live assumptions, evidence, experiments, and interview notes. A five-role judge panel can evaluate a
              version once the idea is specific enough to evaluate.
            </p>
            <p className="mt-3">
              The first prototype stopped at the panel. Five roles scored a pitch, argued, synthesized, and the
              founder left with a label. That is a demo. It is not a habit. The useful product question is uglier:
              which assumption is weakest, what evidence would change the answer, and what can someone do this week?
              Once I took that seriously, the panel became one station on a longer loop.
            </p>
            <ValidationLoopViz />
            <p className="mt-3">
              Almost everything hard in the codebase exists because of that loop: readiness policy, durable runs,
              copy-on-write versions, panel quality checks, handoffs, appeals, research, and assist endpoints.
              The flashy part is judgment. The engineering is keeping judgment from lying about its input or
              evaporating into chat.
            </p>
          </section>

          <section>
            <h2 id="control-plane" className="font-display text-lg font-semibold text-foreground mb-3">Own the control plane</h2>
            <p>
              I tried agent-led orchestration early. It looked elegant when the model cooperated. Smaller local
              models did not reliably call all five judges. A missing engineer or customer is not a creative
              variation. It is a broken run.
            </p>
            <p className="mt-3">
              The production path is boring on purpose. Five initial verdicts run concurrently. A fixed LangGraph
              state machine controls debate order and round count. After the transcript, every judge re-votes in
              parallel under a score-move cap. The moderator emits a structured synthesis. Models write the
              substance. Application code decides whether a role is skipped, whether another round appears, and
              whether malformed output is accepted.
            </p>
            <ControlPlaneViz />
            <p className="mt-3">
              That split shows up in call sites, not in a slide titled "guardrails." If a policy matters, it lives
              next to unit tests. If a field is judgment, it lives in a schema the model fills.
            </p>
          </section>

          <section>
            <h2 id="readiness" className="font-display text-lg font-semibold text-foreground mb-3">Readiness is policy, not vibes</h2>
            <p>
              A vague pitch produces five polished versions of "needs more detail." That burns tokens and teaches
              nothing. Gavel evaluates readiness before it spends a model call.
            </p>
            <ReadinessTreeViz />
            <p className="mt-3">
              The gate checks structure first: audience, problem, solution, pricing hypothesis, risky assumption,
              existing evidence, and either a current workaround or named competitors. Problem and solution must
              differ. Human evidence for a ready label is narrow: interview quotes, LOIs, payments, usage, or
              experiment metrics. A founder note does not count. After a completed run, another run needs new human
              evidence or a changed worksheet. Override exists. Default path asks for better input.
            </p>
            <p className="mt-3">
              I kept this in ordinary code so the policy can be wrong in a reviewable way. Too strict or too loose
              is a PR with tests. It is not another prompt that drifts when the provider updates weights.
            </p>
          </section>

          <section>
            <h2 id="contracts" className="font-display text-lg font-semibold text-foreground mb-3">Contracts for judgment quality</h2>
            <p>
              Each judge returns a structured verdict: score, label, critique, key concern, recommended fix, and
              evidence that would change the score. The panel schema requires exactly one verdict per role.
              Schema validation catches shape failures. It does not catch five roles saying the same thing in
              different fonts.
            </p>
            <PanelQualityViz />
            <p className="mt-3">
              A second layer checks score-label alignment, missing action fields, duplicate concerns, generic
              evidence requests, and heavy text overlap. Weak panels retry up to twice with role-specific
              instructions. Uniform panels can complete with a low-confidence flag. Non-uniform panels whose lenses
              still collapse onto the same proof fail the run. Those are different failure modes. Bland consensus
              is usable with a warning. Fake specialization is not.
            </p>
            <p className="mt-3">
              Re-voting is capped at three points, and a score change must update its reason from the debate.
              Without that, the transcript is theater. Structural evals for all five roles and a monthly
              model-graded audit sit on top, because valid JSON is not useful judgment.
            </p>
          </section>

          <section>
            <h2 id="durable-runs" className="font-display text-lg font-semibold text-foreground mb-3">Streaming is not a run engine</h2>
            <p>
              Long model calls turn ordinary browser behavior into correctness bugs. People refresh. They close a
              laptop. They open the same run in a second tab. If the pipeline dies with the HTTP connection, you do
              not have an application. You have a fragile live demo.
            </p>
            <DurableRunViz />
            <p className="mt-3">
              Each run is one background task. Events append to SQLite with a monotonic sequence. SSE clients
              subscribe, replay, and reconnect with Last-Event-ID. The pipeline continues with zero listeners.
              The frontend reducer ignores stale or duplicate sequences, merges debate token deltas, applies
              re-votes, and converges to the same view whether events arrived live or after a reconnect.
              Cancellation, a wall-clock budget, and stale-run recovery after process restart live in the same manager.
            </p>
            <p className="mt-3">
              One honest footnote: this is perceived streaming. The panel finishes all five calls, including
              retries, before emitting verdict events in display order. Debate is collected before custom token
              chunks reach SSE. Progress and replay are real. Provider-to-browser token forwarding is not what I built.
            </p>
          </section>

          <section>
            <h2 id="versions" className="font-display text-lg font-semibold text-foreground mb-3">Pin every score to its input</h2>
            <p>
              Comparing two scores without knowing which worksheet produced them is cargo cult analytics. Gavel
              stores worksheet versions and links every judge run to the exact version it saw.
            </p>
            <VersionCowViz />
            <p className="mt-3">
              Core-field edits create a new version. Typos and non-core changes can stay put until that version is
              referenced by a run. After that, saves copy-on-write so history cannot be rewritten under an old
              score. Every save carries a base version id so the API can reject stale concurrent edits. Field diffs
              are string equality. A local workbench does not need embeddings to notice that pricing changed.
            </p>
          </section>

          <section>
            <h2 id="handoff" className="font-display text-lg font-semibold text-foreground mb-3">Critique has to become work</h2>
            <p>
              The post-run handoff is the feature that made the rest worthwhile. Synthesis problems become
              assumption drafts. Evidence requests become evidence targets. Recommended fixes become experiment
              drafts. The server stores at most twelve deduplicated suggestions. The UI asks the founder which ones
              belong in the ledger.
            </p>
            <HandoffFlowViz />
            <p className="mt-3">
              Calling them drafts is load-bearing language. Judge output is not evidence. An AI experiment is not
              automatically a good experiment. The system shortens the distance from critique to action without
              treating the model as the source of truth. Appeals stay separate: a founder can challenge selected
              concerns with new evidence, and the appeal re-evaluates the panel instead of writing validation records.
            </p>
          </section>

          <section>
            <h2 id="ledger" className="font-display text-lg font-semibold text-foreground mb-3">The validation ledger is the real surface</h2>
            <p>
              Once handoffs exist, the worksheet stops being a form. Assumptions have status. Evidence attaches to
              claims. Experiments carry hypothesis, method, and outcome. Interview notes sit next to the quotes that
              actually move readiness.
            </p>
            <p className="mt-3">
              That feedback changed the judge schema. Every verdict asks for evidence that would change the score
              because that field has somewhere to land. Every synthesis problem is a candidate assumption because
              the workspace already knows how to track one. Primary-action routing after a run points at the next
              useful move: collect missing evidence, run a drafted experiment, revise the worksheet, or challenge a
              concern. Some of that routing is still mirrored in the frontend. The intent is not: leave people with
              a PDF of opinions.
            </p>
          </section>

          <section>
            <h2 id="context" className="font-display text-lg font-semibold text-foreground mb-3">Context without transcript landfill</h2>
            <p>
              A run can start with optional Tavily research, emitted before panel events so the UI can show what
              influenced the result. Past ideas can contribute memory by recency, or by semantic retrieval when that
              mode is on. Prompts never receive full old transcripts. They get compact records: scores, concerns,
              synthesis, appeal outcome. Local models drift when the window fills with prior arguments, and full
              transcripts are expensive even when the provider can absorb them.
            </p>
            <TrustBoundaryViz />
            <p className="mt-3">
              Idea text, research, memory, worksheet fields, debate, and appeals are wrapped as tagged untrusted
              data. Interior tags are escaped. That does not erase prompt injection. It gives every model call the
              same explicit trust boundary, which is the best I can do without pretending delimiters are magic.
            </p>
          </section>

          <section>
            <h2 id="assists" className="font-display text-lg font-semibold text-foreground mb-3">AI where ambiguity helps</h2>
            <p>
              Outside the judge run, Gavel can draft a worksheet from rough notes, clarify a field, suggest
              interview questions, summarize a week, propose assumptions, and scan competitors. Those are assists
              with a human in the loop. Model calls draft and judge. Regular code owns readiness, speaker order,
              event sequence, lifecycle transitions, and completed status.
            </p>
            <p className="mt-3">
              I care more about that split than about whether the panel looks impressive in a GIF. Ambiguity belongs
              in judgment and drafting. Determinism belongs in whether the system is allowed to spend tokens and how
              the result is stored.
            </p>
          </section>

          <section>
            <h2 id="local-first" className="font-display text-lg font-semibold text-foreground mb-3">Local-first constraints</h2>
            <p>
              Gavel targets local or self-hosted use. No accounts. A stable local user id is enough for one machine.
              Judge runs can use Ollama. Some assist endpoints still assume DeepSeek, which is a hole I still need
              to close for a genuinely local-only path.
            </p>
            <p className="mt-3">
              There are three SQLite databases: runs, workspaces, and idea memory. Different lifecycles made that
              convenient while the product was still moving. Cross-store consistency is the tax. The single-worker
              assumption is similar. In-memory task handles and subscriber wake-ups are simple when one process owns
              the world. They become wrong behind two API workers. The event log is already durable; multi-worker
              needs a shared queue and pub/sub.
            </p>
          </section>

          <section>
            <h2 id="tradeoffs" className="font-display text-lg font-semibold text-foreground mb-3">Tradeoffs I would revisit</h2>
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 space-y-3">
              <p>
                <strong className="text-foreground">Single-process run manager.</strong> Durable history, in-memory
                wake-ups. Multi-worker needs shared coordination.
              </p>
              <p>
                <strong className="text-foreground">Local identity.</strong> Fine for self-host. Public deploy needs
                authz on every run and export path.
              </p>
              <p>
                <strong className="text-foreground">Three SQLite stores.</strong> Convenient early. Consistency is
                the ongoing cost.
              </p>
              <p>
                <strong className="text-foreground">Frontend-mirrored primary actions.</strong> Backend checklist is
                source of truth; labels and routes should come back from the API.
              </p>
              <p>
                <strong className="text-foreground">Assist provider split.</strong> Judges can go through Ollama;
                drafting assists still need the same provider choice end to end.
              </p>
            </div>
          </section>

          <section>
            <h2 id="what-stuck" className="font-display text-lg font-semibold text-foreground mb-3">What stuck</h2>
            <p>
              The panel is still the part people want to see. Most of my debugging time went elsewhere: forcing a
              repeated run to require a real delta, keeping five roles distinct, capping re-vote movement, replaying
              ordered events after a reconnect, and stopping a typo fix from rewriting the worksheet under an old
              score.
            </p>
            <p className="mt-3">
              That is the distance between the first prototype and Gavel. The model response used to be the last
              screen. Now it produces a short list of things a founder can test, ignore, or challenge before revising
              the worksheet and running the next version. The interesting engineering was making that loop honest.
            </p>
          </section>
        </div>

        <BlogNav />
      </article>
    </main>
  )
}
