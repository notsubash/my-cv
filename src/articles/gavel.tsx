import { Link } from 'react-router-dom'
import CaseStudyLayout, {
  Section,
  InfoGrid,
  InfoCard,
  FindingsList,
  ResultTable,
  Reflection,
} from './CaseStudyLayout'
import CodeBlock from './CodeBlock'

const meta = {
  title: 'Gavel: Durable Multi-Agent Pipeline Engineering',
  badge: 'GenAI / Systems',
  tagline:
    'Running a long judge pipeline on local 9B models: durable SSE runs, fixed LangGraph debate, panel quality gates, and worksheet versions that refuse to lie about their scores.',
  tech: ['Python', 'FastAPI', 'LangGraph', 'Next.js', 'SQLite', 'SSE', 'Pydantic', 'Ollama'],
  links: [
    { label: 'GitHub', url: 'https://github.com/notsubash/gavel', icon: 'github' as const },
  ],
  metrics: [
    { value: '5', label: 'Parallel judges' },
    { value: '19', label: 'SSE event types' },
    { value: '389', label: 'Python unit tests' },
    { value: '3', label: 'Eval tiers' },
  ],
  seoTitle: 'Gavel Multi-Agent Pipeline: Case Study | Subash Pandey',
  seoDescription:
    'Technical case study of Gavel: FastAPI RunManager with SQLite event log, LangGraph debate and re-vote, panel quality gates for local LLMs, and a three-tier eval pyramid.',
  seoKeywords:
    'multi agent LLM pipeline FastAPI, LangGraph debate architecture, SSE durable event log SQLite, structured LLM output guardrails, local Ollama multi agent, panel quality lens uniqueness, LLM eval tier pyramid',
}

const stackRows = [
  { label: 'Backend', value: 'FastAPI 0.138', note: 'Python ≥3.11' },
  { label: 'Orchestration', value: 'LangGraph 1.2', note: 'fixed debate graph' },
  { label: 'Frontend', value: 'Next.js 16', note: 'React 19 + reducer' },
  { label: 'Schemas', value: 'Pydantic 2.10', note: 'verdict + synthesis' },
  { label: 'Persistence', value: '3 SQLite DBs', note: 'WAL mode' },
  { label: 'Local models', value: 'Ollama', note: 'default qwen3.5:9b' },
]

const eventLogRows = [
  { label: 'Writer', value: '1', note: 'RunManager background task' },
  { label: 'Readers', value: 'N', note: 'SSE tabs / reconnects' },
  { label: 'Event id', value: 'monotonic seq', note: 'Last-Event-ID replay' },
  { label: 'Heartbeat', value: '15s', note: 'keeps proxies awake' },
  { label: 'Wall-clock budget', value: '600s', note: 'MAX_RUN_SECONDS' },
  { label: 'Stale recovery', value: '30 min', note: 'after process restart' },
]

const qualityRows = [
  { label: 'Panel retries', value: '≤2', note: 'role-specific nudge' },
  { label: 'Per-judge attempts', value: '≤3', note: 'parse / schema fail' },
  { label: 'Re-vote score cap', value: '±3', note: 'reason must update' },
  { label: 'Lens Jaccard fail', value: '≥0.85', note: 'collapsed concerns' },
  { label: 'Generic evidence cap', value: '40%', note: 'fails differentiation' },
  { label: 'Judge parse gate', value: '≥0.95', note: 'Tier 1 golden set' },
]

const evalRows = [
  { label: 'Tier 0 (CI)', value: '$0', note: 'structural baselines every PR' },
  { label: 'Tier 1 (golden)', value: '12 ideas', note: 'pass_rate must be 1.0' },
  { label: 'Tier 2 (audit)', value: '~$0.50–2/mo', note: '1 DeepSeek call / idea' },
  { label: 'Regression flag', value: 'Δ ≥ 0.5', note: 'any audit dimension' },
]

const testRows = [
  { label: 'Python unit tests', value: '389', note: '49 files' },
  { label: 'Web unit tests', value: '74', note: 'reducer, lens, coaching' },
  { label: 'Playwright E2E', value: '47', note: '8 spec files' },
  { label: 'CI matrix', value: '3.11–3.13', note: 'Ruff + Docker build' },
]

const rateLimitRows = [
  { label: 'Run create', value: '30 / 60s', note: 'burst 10' },
  { label: 'Appeal', value: '5 / 60s', note: 'burst 2' },
]

/** SSE types the frontend reducer handles, in typical run order. */
const sseLifecycleRows = [
  { label: 'stream_connected', value: 'lifecycle', note: 'marks connected; sequence baseline' },
  { label: 'research_findings', value: 'pre-panel', note: 'optional Tavily query + citations' },
  { label: 'phase_started', value: 'lifecycle', note: 'payload.phase = roast | debate' },
  { label: 'judges_dispatched', value: 'roast', note: 'all 5 → thinking' },
  { label: 'judge_verdict_completed', value: 'roast', note: '×5 · verdict + completed/total' },
  { label: 'roast_panel_completed', value: 'roast', note: 'full panel · degenerate flag' },
  { label: 'debate_round_started', value: 'debate', note: 'currentRound = n' },
  { label: 'debate_speaker_thinking', value: 'debate', note: 'activeSpeaker + thinking turn' },
  { label: 'debate_token_delta', value: 'debate', note: 'append delta to turn content' },
  { label: 'debate_message_published', value: 'debate', note: 'finalize turn · streaming=false' },
  { label: 'debate_synthesis_published', value: 'debate', note: 'moderator prose (early)' },
  { label: 'revote_started', value: 're-vote', note: 'snapshot baseline scores' },
  { label: 'revote_judge_completed', value: 're-vote', note: '×5 · score delta + change_reason' },
  { label: 'debate_completed', value: 'debate', note: 'structured synthesis + revised panel' },
  { label: 'run_metrics', value: 'obs', note: 'phase latency · tokens · cost' },
  { label: 'run_completed', value: 'lifecycle', note: 'panel_quality + final panel' },
  { label: 'run_failed', value: 'lifecycle', note: 'message · recoverable' },
  { label: 'run_cancelled', value: 'lifecycle', note: 'cooperative cancel message' },
  { label: 'appeal_completed', value: 'post-run', note: 'revised panel · score deltas' },
]

const verdictSchemaRows = [
  { label: 'judge', value: 'enum', note: 'vc | engineer | pm | customer | competitor' },
  { label: 'verdict', value: 'enum', note: 'PASS | FAIL | CONDITIONAL' },
  { label: 'score', value: '1–10', note: '≤3 FAIL · 4–6 CONDITIONAL · ≥7 PASS' },
  { label: 'roast', value: '20–1000 chars', note: 'plain prose; truncated if over' },
  { label: 'key_concern', value: '≤400', note: 'one sentence' },
  { label: 'recommended_fix', value: 'optional', note: 'actionable sentence' },
  { label: 'evidence_to_change_verdict', value: 'optional', note: 'feeds handoff targets' },
]

const ENVELOPE_CODE = `// Every SSE data frame is the same shape
type ApiEventEnvelope = {
  type: string
  run_id: string
  sequence: number   // monotonic; Last-Event-ID on reconnect
  payload: Record<string, unknown>
  created_at: string
}`

const SSE_WIRE_CODE = `id: 42
data: {"type":"judge_verdict_completed","run_id":"…","sequence":42,"payload":{…},"created_at":"…"}

: heartbeat

id: 43
data: {"type":"debate_token_delta","run_id":"…","sequence":43,"payload":{"speaker":"vc","round":1,"delta":"…"},"created_at":"…"}`

const REDUCER_SKIP_CODE = `// web/src/lib/sse/run-reducer.ts
export function runReducer(state: RunState, envelope: ApiEventEnvelope): RunState {
  // Reconnect / multi-tab safety: ignore gaps already applied
  if (envelope.sequence <= state.lastSequence) return state

  switch (envelope.type) {
    case "debate_token_delta":
      // merge into DebateTurnView.content; keep streaming=true
      …
    case "revote_judge_completed":
      // update judge verdict; store change_reason for delta badges
      …
    case "run_completed":
      // attach panel_quality from payload; status=completed
      …
  }
}`

const PIPELINE_MAP_CODE = `# src/api/events.py — dataclass → snake_case SSE type
def pipeline_event_type(event: PipelineEvent) -> str:
    if isinstance(event, PipelineCompleted):
        return "run_completed"
    if isinstance(event, RunMetrics):
        return "run_metrics"
    return _camel_to_snake(type(event).__name__)
    # JudgeVerdictCompleted → judge_verdict_completed`

function Box({
  x, y, w, h, label, sub, accent,
}: {
  x: number; y: number; w: number; h: number
  label: string; sub?: string; accent?: boolean
}) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={8}
        className={accent
          ? 'fill-[hsl(var(--accent)/0.12)] stroke-[hsl(var(--accent)/0.5)]'
          : 'fill-[hsl(var(--card))] stroke-[hsl(var(--border))]'}
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={y + (sub ? h / 2 - 6 : h / 2 + 1)}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-[hsl(var(--foreground))] text-[11px] font-semibold"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[9px]"
        >
          {sub}
        </text>
      )}
    </g>
  )
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const ux = dx / len
  const uy = dy / len
  const ax = x2 - ux * 6
  const ay = y2 - uy * 6
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} className="stroke-[hsl(var(--primary)/0.45)]" strokeWidth={1.5} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 4},${ay + ux * 4} ${ax + uy * 4},${ay - ux * 4}`}
        className="fill-[hsl(var(--primary)/0.45)]"
      />
    </g>
  )
}

/** Compact layered architecture — same visual language as other site diagrams. */
function SystemArchitectureDiagram() {
  return (
    <figure className="my-5">
      <svg viewBox="0 0 560 220" className="w-full max-w-xl mx-auto" role="img" aria-label="Gavel system architecture">
        <Box x={180} y={8} w={200} h={40} label="Next.js workbench" sub="SSE reducer" />
        <Arrow x1={280} y1={48} x2={280} y2={68} />

        <rect x={40} y={68} width={480} height={72} rx={10}
          className="fill-[hsl(var(--muted)/0.35)] stroke-[hsl(var(--border))]" strokeWidth={1} />
        <text x={56} y={86} className="fill-[hsl(var(--muted-foreground))] text-[8px] font-semibold uppercase tracking-wider">
          FastAPI · single worker
        </text>
        <Box x={56} y={94} w={100} h={36} label="Routes" />
        <Box x={172} y={94} w={120} h={36} label="RunManager" accent />
        <Box x={308} y={94} w={100} h={36} label="pipeline" />
        <Box x={424} y={94} w={80} h={36} label="verify" />

        <Arrow x1={232} y1={140} x2={120} y2={164} />
        <Arrow x1={280} y1={140} x2={280} y2={164} />
        <Arrow x1={358} y1={140} x2={440} y2={164} />

        <Box x={56} y={168} w={128} h={40} label="runs.db" sub="event log" accent />
        <Box x={216} y={168} w={128} h={40} label="workspaces.db" sub="versions" />
        <Box x={376} y={168} w={128} h={40} label="ideas.db" sub="memory" />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">
        One API process, three SQLite stores, models only fill judgment fields
      </figcaption>
    </figure>
  )
}

/** Horizontal pipeline — intentionally small. */
function PipelineDiagram() {
  const steps = [
    { label: 'Readiness', sub: '0 LLM' },
    { label: 'Panel', sub: '5 parallel', accent: true },
    { label: 'Debate', sub: '3×5 turns' },
    { label: 'Re-vote', sub: '±3 cap', accent: true },
    { label: 'Synthesis', sub: 'GO / ITERATE' },
  ]
  return (
    <figure className="my-5">
      <svg viewBox="0 0 560 90" className="w-full max-w-xl mx-auto" role="img" aria-label="Gavel pipeline phases">
        {steps.map((s, i) => {
          const x = 8 + i * 110
          return (
            <g key={s.label}>
              <Box x={x} y={18} w={100} h={44} label={s.label} sub={s.sub} accent={s.accent} />
              {i < steps.length - 1 && <Arrow x1={x + 100} y1={40} x2={x + 110} y2={40} />}
            </g>
          )
        })}
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">
        ~15 model calls on a clean path · handoff after completion · appeal is separate REST
      </figcaption>
    </figure>
  )
}

export default function Gavel() {
  return (
    <CaseStudyLayout meta={meta}>

      <Section title="Overview">
        <p>
          Gavel is a local idea validation workbench. You keep a versioned worksheet, log
          evidence, and run a five-role panel (VC, engineer, PM, customer, competitor) that
          debates, re-votes, and returns a structured GO / ITERATE / NO-GO. This write-up is
          about the systems underneath that surface.
        </p>
        <p>
          I spent more time on failure modes than on prompts. Browser refresh killing a run.
          A 9B model returning five copies of the same concern. A typo edit rewriting the
          worksheet under an old score. Those bugs look boring until they show up in a live
          session, and most of the interesting code is there because of them.
        </p>
        <p>
          Product loop and design choices are in the{' '}
          <Link to="/blog/building-an-idea-workbench" className="text-primary hover:underline">
            companion blog post
          </Link>
          . This page is architecture, contracts, and testing.
        </p>
      </Section>

      <Section title="What I was optimizing for">
        <InfoGrid>
          <InfoCard title="Local models first">
            Default path is Ollama with qwen3.5:9b. Structured JSON fails often. Roles herd.
            Free-form agent orchestration skipped judges on smaller models, which I treated as a
            broken run, not a creative variation.
          </InfoCard>
          <InfoCard title="Runs outlive HTTP">
            Panel + three debate rounds + re-vote is a pile of sequential LLM calls. Refresh,
            laptop sleep, or a second tab should not kill the pipeline or fork state.
          </InfoCard>
          <InfoCard title="Scores need frozen inputs">
            Two panel scores mean nothing if you cannot say which worksheet produced each one.
            Core edits after a run have to fork history.
          </InfoCard>
          <InfoCard title="Eval that is not keyword bingo">
            Prompt changes need a regression signal cheaper than reading every transcript and
            more honest than grepping for concern phrases.
          </InfoCard>
        </InfoGrid>
      </Section>

      <Section title="Stack">
        <ResultTable rows={stackRows} />
      </Section>

      <Section title="System architecture">
        <p>
          I treat production orchestration as a workflow. Application code owns readiness,
          speaker order, retries, event sequence, and completion. Models fill judgment fields
          inside Pydantic schemas. I tried agent-led orchestration early; it looked clean when
          the model cooperated and fell apart on local hardware.
        </p>
        <SystemArchitectureDiagram />
        <FindingsList items={[
          'POST /api/runs returns a run_id immediately. RunManager.ensure_started() kicks stream_pipeline() exactly once.',
          'pipeline.py is two phases: ThreadPoolExecutor(max_workers=5) for the roast panel, then a compiled LangGraph for debate.',
          'Every pipeline event lands in runs.db with a monotonic sequence. SSE clients replay, then wait on in-process wakeups.',
          'The Next.js client folds envelopes through a pure TypeScript reducer (~580 lines, 19 event types) so live and reconnect paths converge.',
          'verification/ is shared by runtime guardrails, eval scorers, and UI degradation hints. Same Jaccard thresholds, same herding checks.',
        ]} />
      </Section>

      <Section title="Pipeline phases">
        <p>
          A clean path is roughly fifteen model calls before you count research or retries.
          Readiness is pure Python. Everything after that is gated and instrumented.
        </p>
        <PipelineDiagram />
        <InfoGrid>
          <InfoCard title="Readiness gate">
            Structure checks first: audience, problem, solution, pricing hypothesis, risky
            assumption, evidence, and either a workaround or named competitors. Problem and
            solution must differ. Ready-level human evidence is narrow (interview quotes, LOIs,
            payments, usage, experiment metrics). A founder note does not count. After a
            completed run, another run needs new human evidence or a changed worksheet.
            Override exists; the default path asks for better input.
          </InfoCard>
          <InfoCard title="Optional research">
            Tavily can run before the panel. Findings emit as an SSE event so the UI can show
            what influenced the result. Research sits inside the same untrusted prompt envelope
            as idea text.
          </InfoCard>
          <InfoCard title="Handoff ingest">
            On run_completed, the manager builds at most twelve deduplicated drafts
            (assumptions, evidence targets, experiments) and stores them against the workspace.
            Nothing enters the ledger until the founder accepts it.
          </InfoCard>
          <InfoCard title="Appeal">
            Separate REST phase after completion. One appeal per run. Uses the post-re-vote
            panel as baseline, re-scores selected judges with new evidence, and does not open a
            second debate. Rate limited harder than run create (5 / 60s).
          </InfoCard>
        </InfoGrid>
      </Section>

      <Section title="LangGraph debate graph">
        <p>
          Debate routing is boring on purpose. <code className="text-foreground text-xs">build_debate_graph()</code> adds
          five speaker nodes in fixed order (vc → engineer → pm → customer → competitor), an
          <code className="text-foreground text-xs"> advance_round</code> node, optional
          <code className="text-foreground text-xs"> revote</code>, and
          <code className="text-foreground text-xs"> moderator</code>. Conditional edges after each
          speaker call <code className="text-foreground text-xs">route_next_speaker</code>; the model
          never picks the next node. Entry is always vc. After the last speaker in a round: loop
          while round &lt; max_debate_rounds (default 3), else revote → moderator → END.
        </p>
        <p>
          Re-vote exists because a transcript without score movement is theater. Each judge
          re-scores against the full debate under a ±3 cap, and a score change has to update its
          reason. <code className="text-foreground text-xs">assess_revote_quality</code> flags herd
          deltas (≥4 judges moving by the same amount) and unexplained moves. Those checks live in
          <code className="text-foreground text-xs"> verification/panel.py</code> and run in both
          production and evals.
        </p>
        <p>
          Abort checks are threaded into speaker and revote nodes so cooperative cancel can stop
          between turns without tearing down the LangGraph mid-token.
        </p>
      </Section>

      <Section title="Durable run engine">
        <p>
          Streaming was the first thing that looked finished and was not. If the pipeline dies
          with the HTTP connection, you have a demo. RunManager + SQLite split writers from
          readers:
        </p>
        <ResultTable rows={eventLogRows} />
        <p className="mt-3">
          <code className="text-foreground text-xs">GET /api/runs/&#123;id&#125;/events</code> is a
          subscriber, not the execution owner. The handler parses <code className="text-foreground text-xs">Last-Event-ID</code>,
          calls <code className="text-foreground text-xs">manager.subscribe(run_id, after_sequence=…)</code>,
          and emits heartbeats on idle so proxies do not close the stream:
        </p>
        <CodeBlock lang="http" code={SSE_WIRE_CODE} />
        <p className="mt-3">
          Perceived streaming, not raw provider-to-browser forwarding. The panel finishes all
          five calls (including retries) before verdict events emit in display order. Debate
          tokens reach SSE after a speaker turn is collected. Progress and replay are real;
          I did not build token forwarding through the whole stack.
        </p>
        <p className="mt-3">
          Single-process assumption is intentional for v0.8. In-memory task handles and
          subscriber wakeups are simple with one uvicorn worker. Two workers would need a shared
          queue and pub/sub. The event log is already durable; the coordination layer is not.
        </p>
        <p className="mt-3">
          Rate limits sit on the public write paths:
        </p>
        <ResultTable rows={rateLimitRows} />
      </Section>

      <Section title="SSE event contract">
        <p>
          Internal pipeline events are frozen dataclasses in <code className="text-foreground text-xs">src/events.py</code>.
          The API maps them to a frontend-safe envelope before they hit SQLite or SSE. Naming is
          mechanical: <code className="text-foreground text-xs">JudgeVerdictCompleted</code> becomes{' '}
          <code className="text-foreground text-xs">judge_verdict_completed</code>, with two special
          cases for completion and metrics.
        </p>
        <CodeBlock lang="python" code={PIPELINE_MAP_CODE} />
        <CodeBlock lang="typescript" code={ENVELOPE_CODE} />
        <p className="mb-3 mt-1">
          Nineteen event types the reducer handles. Typical happy-path order for a full roast:
        </p>
        <ResultTable rows={sseLifecycleRows} />
        <p className="mt-3">
          A few payload details that matter for UI correctness:
        </p>
        <FindingsList items={[
          'judge_verdict_completed carries the full Verdict plus completed/total so the panel can animate progress without waiting for roast_panel_completed.',
          'debate_token_delta only has speaker, round, and delta. The reducer upserts a DebateTurnView and concatenates; debate_message_published freezes the turn.',
          'revote_started snapshots current scores into revoteBaseline so the UI can show deltas after revote_judge_completed.',
          'revote_judge_completed may include change_reason only when the score actually moved (taken from evidence_to_change_verdict).',
          'run_completed attaches panel_quality from the shared verification module (lens uniqueness, generic rate, warnings) so the UI and evals agree.',
          'appeal_completed is not part of the pipeline stream during the roast; it is appended later when POST /appeal finishes, and open SSE subscribers still receive it.',
        ]} />
      </Section>

      <Section title="Frontend reducer">
        <p>
          The workbench does not own run state. It reduces ordered envelopes. That sounds
          obvious until you debug a reconnect that double-applies a re-vote or drops a debate
          token delta.
        </p>
        <CodeBlock lang="typescript" code={REDUCER_SKIP_CODE} />
        <FindingsList items={[
          'Sequence gate first: envelope.sequence ≤ lastSequence → no-op. Live and Last-Event-ID replay converge to the same RunState.',
          'Judge order is a shared const (vc, engineer, pm, customer, competitor) on both sides so role identity cannot drift.',
          'judges_dispatched flips all five JudgeView statuses to thinking before any verdict arrives.',
          'On run_failed mid-panel, pending judges (idle/thinking) are marked failed so the UI does not spin forever.',
          'Observability lands as run_metrics: roast/debate/revote seconds, tokens, estimated_cost_usd, model_runtime local|deepseek, per-call breakdowns.',
          'Cost uses fixed DeepSeek rates ($0.14/M in, $0.28/M out) or $0 for local; token counts fall back to chars÷4 when providers omit usage.',
        ]} />
      </Section>

      <Section title="Verdict and panel contracts">
        <p>
          Schema validation catches missing fields. It does not catch five judges saying the
          same thing with different wording. The Verdict model is the contract between the LLM,
          the event log, the handoff builder, and the UI:
        </p>
        <ResultTable rows={verdictSchemaRows} />
        <p className="mt-3 mb-3">
          Panel quality sits on top of Pydantic. Weak panels retry ≤2 times with role-specific
          nudges. Uniform panels can finish with a low-confidence flag. Lens collapse (Jaccard
          ≥ 0.85 on concerns/evidence, or &gt;40% generic evidence phrases) fails the run.
        </p>
        <ResultTable rows={qualityRows} />
        <p className="mt-3">
          Synthesis is its own schema: overall_recommendation (GO / ITERATE / NO-GO),
          confidence, top strengths/risks/problems (max 3 each), biggest_disagreement,
          recommended_experiment. That structured object ships on debate_completed and is what
          handoff ingest reads, not free-form chat.
        </p>
      </Section>

      <Section title="Worksheet lineage and stores">
        <InfoGrid>
          <InfoCard title="Copy-on-write">
            Thirteen worksheet fields are tracked for diffs. Six core fields bump the version.
            Once a version is linked to a judge run, further core edits fork. Scores stay pinned
            to the input they actually saw.
          </InfoCard>
          <InfoCard title="Concurrency">
            Saves carry a base_version_id. Stale concurrent edits get rejected. Field diffs are
            string equality. I do not need embeddings to notice that pricing changed.
          </InfoCard>
          <InfoCard title="Minor edits">
            A typo on a single core field can stay put when SequenceMatcher similarity is ≥0.92
            and the version is not yet locked by a run.
          </InfoCard>
          <InfoCard title="Prompt envelope">
            Idea text, research, memory, debate, and appeals wrap in tagged untrusted blocks
            with escaped interior delimiters. Same envelope on every model call. Delimiters are
            not magic; they make the trust boundary explicit.
          </InfoCard>
        </InfoGrid>
        <p>
          Three SQLite files: runs.db (event log), workspaces.db (versions + ledger), ideas.db
          (compact memory, optional 768-dim vectors). Memory prompts get summaries only, never
          full old transcripts. Cross-store consistency is the ongoing tax of that split.
        </p>
      </Section>

      <Section title="Eval pyramid and CI">
        <p>
          Twelve golden ideas sit under three tiers. Tier 0 is free structural CI on every PR.
          Tier 1 requires pass_rate = 1.0 on the golden set (full panels, debate message counts,
          lens differentiation, re-vote quality, appeal discrimination). Tier 2 is a monthly
          DeepSeek grader (~$0.50–2) that flags any dimension drop ≥ 0.5. Keyword matching is
          not the pass signal on purpose.
        </p>
        <ResultTable rows={evalRows} />
        <p className="mt-4 mb-3">Test surface around the pipeline:</p>
        <ResultTable rows={testRows} />
        <p className="mt-3">
          CI runs Ruff, Python 3.11–3.13, structural eval fixtures, web unit tests, Playwright,
          and a Docker build.
        </p>
      </Section>

      <Section title="What held up">
        <FindingsList items={[
          'Fixed graphs beat agent planners for this workload. A missing judge is a bug.',
          'Decoupling HTTP from the pipeline turned refresh and multi-tab watching into ordinary subscriber behavior.',
          'Warn on bland consensus, fail on collapsed lenses. Mixing those policies either blocks too much or ships fake specialization.',
          'Sharing verification between runtime and evals kept prompt changes honest. When the scorer and the gate disagree, one of them is wrong.',
          'Copy-on-write worksheets only help if the API refuses to mutate locked inputs. The UI benefit is a side effect of that store rule.',
          'Three SQLite files and one worker were fine early. Cross-store joins and multi-worker coordination are what you pay later.',
        ]} />
      </Section>

      <Reflection>
        <p>
          I would collapse the three SQLite databases sooner next time. Separate files made
          early iteration easy; they now force careful stitching whenever a handoff or appeal
          needs a consistent view across runs and workspaces.
        </p>
        <p>
          Primary-action routing after a run is still partly mirrored in the frontend. The
          backend checklist is the source of truth. Labels and routes should come back from the
          API in one place so I stop updating two lists.
        </p>
        <p>
          Judges already run through Ollama end to end. Some drafting assists still assume
          DeepSeek. That split is the remaining hole for a genuinely local-only path, and it
          annoys me every time I demo without an API key.
        </p>
      </Reflection>

      <Section title="Limitations">
        <FindingsList items={[
          'Single uvicorn worker: background tasks and in-process SSE wakeups are not coordinated across workers.',
          'No multi-user auth. Fine for self-host; a public deploy needs authz on every run and export path.',
          'Appeal re-scores selected judges only. No second debate. One appeal per run.',
          'Cancel and wall-clock budget are cooperative. In-flight judge calls may finish after cancel.',
          'DeepAgents path exists for experiments but is Streamlit-only. API and Next.js stay on the deterministic pipeline.',
          'Cost estimates are static rates plus a chars÷4 fallback. Good enough for orientation, not billing.',
        ]} />
      </Section>

    </CaseStudyLayout>
  )
}
