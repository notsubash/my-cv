import { type ReactNode } from 'react'
import CodeBlock from './CodeBlock'

function DiagramBox({
  x, y, w, h, label, sublabel, accent, dashed,
}: {
  x: number; y: number; w: number; h: number
  label: string; sublabel?: string; accent?: boolean; dashed?: boolean
}) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={8}
        className={accent ? 'fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]' : 'fill-[hsl(var(--card))] stroke-[hsl(var(--border))]'}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <text
        x={x + w / 2}
        y={y + (sublabel ? h / 2 - 6 : h / 2 + 1)}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-[hsl(var(--foreground))] text-[11px] font-semibold"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[9px]"
        >
          {sublabel}
        </text>
      )}
    </g>
  )
}

function DiagramArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const ux = dx / len
  const uy = dy / len
  const ax = x2 - ux * 6
  const ay = y2 - uy * 6
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} className="stroke-[hsl(var(--primary)/0.5)]" strokeWidth={1.5} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 4},${ay + ux * 4} ${ax + uy * 4},${ay - ux * 4}`}
        className="fill-[hsl(var(--primary)/0.5)]"
      />
    </g>
  )
}

function ArchFrame({
  children, viewBox, label, caption, mermaid,
}: {
  children: ReactNode
  viewBox: string
  label: string
  caption: string
  mermaid?: string
}) {
  return (
    <figure className="my-8">
      <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card/90 to-muted/40 p-3 sm:p-5">
        <svg viewBox={viewBox} className="w-full" role="img" aria-label={label}>
          {children}
        </svg>
      </div>
      <figcaption className="text-center text-xs text-muted-foreground mt-2.5 px-2">{caption}</figcaption>
      {mermaid && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">Mermaid source</summary>
          <CodeBlock lang="mermaid" code={mermaid} />
        </details>
      )}
    </figure>
  )
}

const LEAKAGE_MERMAID = `flowchart LR
  W["Same 5 s phone flatten"] --> A["A2 leaky shuffle"]
  W --> B["B GroupKFold on subject_id"]
  A --> A2["0.8925 macro-F1"]
  B --> B2["0.2924 macro-F1"]`

/** Blog only: same representation, leaky vs grouped. */
export function LeakageSplitDiagram() {
  return (
    <ArchFrame
      viewBox="0 0 640 210"
      label="Same 5 second phone flatten: leaky shuffle scores 0.8925 macro-F1, GroupKFold scores 0.2924"
      caption="Same repaired 5 s flatten and 982-tree family. Protocol A2 shuffles windows. Protocol B groups by subject_id."
      mermaid={LEAKAGE_MERMAID}
    >
      <DiagramBox x={12} y={78} w={150} h={54} label="5 s phone flatten" sublabel="T=100, C=6" accent />
      <DiagramArrow x1={162} y1={92} x2={198} y2={48} />
      <DiagramArrow x1={162} y1={118} x2={198} y2={162} />
      <DiagramBox x={200} y={20} w={168} h={54} label="A2 leaky shuffle" sublabel="same 51 people both sides" />
      <DiagramArrow x1={368} y1={47} x2={404} y2={47} />
      <DiagramBox x={406} y={20} w={220} h={54} label="0.8925 macro-F1" sublabel="do not cite this" />
      <DiagramBox x={200} y={136} w={168} h={54} label="B GroupKFold" sublabel="groups = subject_id" accent />
      <DiagramArrow x1={368} y1={163} x2={404} y2={163} />
      <DiagramBox x={406} y={136} w={220} h={54} label="0.2924 macro-F1" sublabel="same representation" accent />
    </ArchFrame>
  )
}

const REPAIR_MERMAID = `flowchart LR
  R["Raw WISDM txt"] --> P["Parse runs"]
  P --> I["Interpolate 20 Hz"]
  I --> A["Align accel+gyro"]
  A --> W["Session 5 s windows"]
  W --> F["104-d stats or flatten"]`

/** Blog only: how a window becomes 5 s of real time. */
export function RepairPipelineDiagram() {
  return (
    <ArchFrame
      viewBox="0 0 640 120"
      label="Repair path from raw WISDM text through 20 Hz alignment to session-safe windows and features"
      caption="Windows stay inside one subject, activity, and device. Flatten exists only to compare against the v1 notebook."
      mermaid={REPAIR_MERMAID}
    >
      <DiagramBox x={8} y={32} w={96} h={52} label="Raw txt" sublabel="z field has ;" />
      <DiagramArrow x1={104} y1={58} x2={122} y2={58} />
      <DiagramBox x={124} y={32} w={92} h={52} label="Parse runs" sublabel="gap or activity" />
      <DiagramArrow x1={216} y1={58} x2={234} y2={58} />
      <DiagramBox x={236} y={32} w={100} h={52} label="20 Hz grid" sublabel="interpolate" accent />
      <DiagramArrow x1={336} y1={58} x2={354} y2={58} />
      <DiagramBox x={356} y={32} w={100} h={52} label="Align IMU" sublabel="coverage, not join" />
      <DiagramArrow x1={456} y1={58} x2={474} y2={58} />
      <DiagramBox x={476} y={32} w={156} h={52} label="5 s / 1 s hop" sublabel="104-d stats or flatten" accent />
    </ArchFrame>
  )
}

const PROTOCOL_MERMAID = `flowchart TB
  A["A1/A2 leaky shuffle"] --> A2["same 51 people both sides"]
  B["B GroupKFold on subject_id"] --> B2["main table, no shared people"]
  C["C 46/5 x 3 grouped holdout"] --> C2["phone check, not 51-fold LOSO"]
  D["D phone vs watch"] --> D2["specified, not run"]`

/** Case study only: which protocol a number belongs to. */
export function ProtocolCompareDiagram() {
  return (
    <ArchFrame
      viewBox="0 0 640 210"
      label="Four evaluation protocols: leaky shuffle, GroupKFold, grouped holdout, and unrun hardware transfer"
      caption="Every public number names a protocol. A2 vs B is the leakage pair. C tracks B, not A. D is specified and not run."
      mermaid={PROTOCOL_MERMAID}
    >
      <DiagramBox x={12} y={20} w={148} h={54} label="A1 / A2 leaky" sublabel="shuffle windows" />
      <DiagramArrow x1={160} y1={47} x2={196} y2={47} />
      <DiagramBox x={198} y={20} w={118} h={54} label="Same 51 ids" sublabel="both sides" />
      <DiagramBox x={348} y={20} w={148} h={54} label="B GroupKFold" sublabel="groups = subject_id" accent />
      <DiagramArrow x1={496} y1={47} x2={532} y2={47} />
      <DiagramBox x={534} y={20} w={94} h={54} label="Main table" sublabel="cite this" accent />
      <DiagramBox x={12} y={136} w={148} h={54} label="C 46/5 x 3" sublabel="grouped holdout" />
      <DiagramArrow x1={160} y1={163} x2={196} y2={163} />
      <DiagramBox x={198} y={136} w={118} h={54} label="Not LOSO" sublabel="tracks B, not A" />
      <DiagramBox x={348} y={136} w={148} h={54} label="D phone vs watch" sublabel="hardware transfer" dashed />
      <DiagramArrow x1={496} y1={163} x2={532} y2={163} />
      <DiagramBox x={534} y={136} w={94} h={54} label="Not run" sublabel="specified only" dashed />
    </ArchFrame>
  )
}

const SERVE_MERMAID = `flowchart LR
  cfg["protocol_b_watch_stat_xgb"] --> fit["Refit on all windows"]
  fit --> onnx["ONNX trees"]
  py["Python 104-d stats"] --> api["FastAPI POST /predict"]
  onnx --> api
  api --> ok["18-way label"]
  api --> bad["422 on T/C/device/Hz"]`

/** Case study only: what the CPU API actually scores. */
export function ServePathDiagram() {
  return (
    <ArchFrame
      viewBox="0 0 640 175"
      label="Watch statistical XGBoost export: Python features, ONNX trees, FastAPI predict"
      caption="Cite GroupKFold from the metrics JSON. The served ONNX is a refit, not a fold. Wrong device or window length is 422."
      mermaid={SERVE_MERMAID}
    >
      <DiagramBox x={12} y={20} w={140} h={50} label="Watch windows" sublabel="5 s, 20 Hz, C=6" />
      <DiagramArrow x1={152} y1={45} x2={184} y2={45} />
      <DiagramBox x={186} y={20} w={140} h={50} label="104-d stats" sublabel="Python" />
      <DiagramArrow x1={326} y1={45} x2={358} y2={45} />
      <DiagramBox x={360} y={20} w={140} h={50} label="XGBoost trees" sublabel="ONNX" accent />
      <DiagramArrow x1={500} y1={45} x2={532} y2={45} />
      <DiagramBox x={534} y={20} w={94} h={50} label="/predict" sublabel="CPU" accent />
      <DiagramBox x={186} y={104} w={140} h={50} label="Export refit" sublabel="not a GroupKFold fold" dashed />
      <DiagramBox x={360} y={104} w={140} h={50} label="Cite JSON" sublabel="0.7031 Protocol B" />
      <DiagramArrow x1={256} y1={104} x2={256} y2={70} />
      <DiagramArrow x1={430} y1={104} x2={430} y2={70} />
    </ArchFrame>
  )
}
