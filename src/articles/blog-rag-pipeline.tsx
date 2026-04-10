import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import BlogNav from './BlogNav'
import BlogToc from './BlogToc'
import { useBlogSeo, useReadingTime } from './useBlogSeo'

function DiagramBox({ x, y, w, h, label, sublabel, accent }: { x: number; y: number; w: number; h: number; label: string; sublabel?: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8}
        className={accent ? 'fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]' : 'fill-[hsl(var(--card))] stroke-[hsl(var(--border))]'}
        strokeWidth={1.5}
      />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 6 : h / 2 + 1)} textAnchor="middle" dominantBaseline="middle"
        className="fill-[hsl(var(--foreground))] text-[11px] font-semibold"
      >{label}</text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" dominantBaseline="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[9px]"
        >{sublabel}</text>
      )}
    </g>
  )
}

function DiagramArrow({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
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
      {label && (
        <text x={(x1 + x2) / 2 + (Math.abs(uy) > 0.5 ? 8 : 0)} y={(y1 + y2) / 2 - 6} textAnchor="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[8px]"
        >{label}</text>
      )}
    </g>
  )
}

function PipelineDiagram() {
  return (
    <figure className="my-6">
      <svg viewBox="0 0 640 260" className="w-full" role="img" aria-label="RAG pipeline architecture diagram">
        <DiagramBox x={10} y={10} w={100} h={50} label="Data Source" sublabel="Documents" />
        <DiagramArrow x1={110} y1={35} x2={140} y2={35} />
        <DiagramBox x={140} y={10} w={110} h={50} label="Clean & Parse" sublabel="Format-aware" />
        <DiagramArrow x1={250} y1={35} x2={280} y2={35} />
        <DiagramBox x={280} y={10} w={110} h={50} label="Chunk" sublabel="Headers → Recursive" />
        <DiagramArrow x1={390} y1={35} x2={420} y2={35} />
        <DiagramBox x={420} y={10} w={100} h={50} label="Embed" sublabel="OpenAI" />
        <DiagramArrow x1={520} y1={35} x2={550} y2={35} />
        <DiagramBox x={550} y={10} w={80} h={50} label="Qdrant" accent />

        <text x={320} y={90} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[9px] uppercase tracking-widest">indexing ↑ · serving ↓</text>

        <DiagramBox x={10} y={110} w={100} h={50} label="User Query" />
        <DiagramArrow x1={110} y1={135} x2={140} y2={135} />
        <DiagramBox x={140} y={110} w={110} h={50} label="Parallel LLM" sublabel="Classify · Rewrite · …" accent />
        <DiagramArrow x1={250} y1={135} x2={280} y2={135} />
        <DiagramBox x={280} y={110} w={110} h={50} label="Hybrid Retrieve" sublabel="Filter + Similarity" />
        <DiagramArrow x1={335} y1={110} x2={590} y2={60} label="" />
        <DiagramArrow x1={390} y1={135} x2={420} y2={135} />
        <DiagramBox x={420} y={110} w={100} h={50} label="LLM Generate" sublabel="w/ RAG context" accent />
        <DiagramArrow x1={520} y1={135} x2={550} y2={135} />
        <DiagramBox x={550} y={110} w={80} h={50} label="Response" />

        <DiagramArrow x1={470} y1={160} x2={470} y2={190} />
        <DiagramBox x={360} y={190} w={220} h={50} label="Post-RAG Routing" sublabel="Routing · Off-topic · Actions" />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">End-to-end pipeline: indexing (top) and serving (bottom)</figcaption>
    </figure>
  )
}

function HybridRetrievalDiagram() {
  return (
    <figure className="my-6">
      <svg viewBox="0 0 520 220" className="w-full" role="img" aria-label="Hybrid retrieval strategy diagram">
        <DiagramBox x={10} y={10} w={130} h={50} label="Rewritten Query" sublabel="+ entity filter" />

        <DiagramArrow x1={140} y1={25} x2={200} y2={25} />
        <DiagramArrow x1={140} y1={45} x2={200} y2={125} />

        <DiagramBox x={200} y={5} w={140} h={44} label="Filtered Search" sublabel="larger k · scoped" accent />
        <DiagramBox x={200} y={105} w={140} h={44} label="Unfiltered Search" sublabel="smaller k · broad" />

        <DiagramArrow x1={340} y1={27} x2={380} y2={80} />
        <DiagramArrow x1={340} y1={127} x2={380} y2={100} />

        <DiagramBox x={380} y={65} w={130} h={50} label="Merge & Dedup" sublabel="Filtered first" accent />

        <DiagramArrow x1={445} y1={115} x2={445} y2={150} />
        <DiagramBox x={370} y={150} w={140} h={44} label="LLM Generation" sublabel="With combined docs" />

        <text x={230} y={80} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px] italic">domain-specific docs</text>
        <text x={230} y={165} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px] italic">general content</text>
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Hybrid retrieval: filtered results get priority, general context fills in</figcaption>
    </figure>
  )
}

export default function BlogRagPipeline() {
  useBlogSeo({
    title: 'Building a RAG Pipeline: Patterns That Worked',
    description: 'Patterns and techniques for building RAG systems with LangGraph, Qdrant, and OpenAI. Covers chunking, hybrid retrieval, query rewriting, and hallucination prevention.',
    keywords: 'rag pipeline tutorial, langgraph qdrant python, how to build rag chatbot, hybrid retrieval augmented generation, prevent llm hallucination production, vector database chunking strategy, query rewriting llm, production rag architecture, langchain alternative langgraph',
    ogImage: '/og-blog-rag-pipeline.webp',
    datePublished: '2026-04-10',
    slug: 'rag-pipeline',
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

        <header className="mb-10">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> April 2026</span>
            <span className="text-border">·</span>
            <span ref={readingTimeRef}>10 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Building a RAG Pipeline: Patterns That Worked
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            After experimenting with different RAG architectures, I wanted to write down the patterns that held up. Not the tutorials where everything works on the first try, but the messy parts: cleaning data nobody warned you about, retrieval strategies that need more thought than "just do top-k", and the failure modes that only show up once you start testing seriously.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['LangGraph', 'Qdrant', 'RAG', 'OpenAI', 'FastAPI', 'Python'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          This post is a personal exploration of general RAG patterns using publicly available tools and techniques. It does not describe any proprietary system or production architecture.
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 id="setup" className="font-display text-lg font-semibold text-foreground mb-3">Context and stack</h2>
            <p>
              These patterns apply well to content-heavy corpora: lots of documents, structured data, metadata that matters for filtering. The kind of scenario where naive top-k similarity search falls apart fast.
            </p>
            <p className="mt-3">
              A stack that works well for this kind of problem: <strong className="text-foreground">LangGraph</strong> for conversation orchestration, <strong className="text-foreground">Qdrant</strong> (or any vector store) for indexing, <strong className="text-foreground">OpenAI embeddings</strong> for vectorization, and <strong className="text-foreground">FastAPI</strong> as the serving layer. The patterns here are transferable regardless of what you're building.
            </p>
            <PipelineDiagram />
          </section>

          <section>
            <h2 id="ingestion" className="font-display text-lg font-semibold text-foreground mb-3">Ingestion is where most of the work goes</h2>
            <p>
              One thing worth knowing: cleaning source documents properly eats a large chunk of total effort. Real-world content comes with inconsistent formatting, embedded metadata, and structural noise. Feed that raw into a text splitter and you get garbage chunks.
            </p>
            <p className="mt-3">
              What helps is detecting the content format first and running format-specific cleaning before chunking. This sounds like boilerplate work, but bad chunks make everything downstream worse. Retrieval gets noisy, the LLM gets confused, and answers degrade in ways that are hard to trace back to the source.
            </p>
          </section>

          <section>
            <h2 id="chunking" className="font-display text-lg font-semibold text-foreground mb-3">Chunking that actually helps retrieval</h2>
            <p>
              A two-stage approach works well. First, split on <strong className="text-foreground">document headers</strong> to keep structure intact. Then run each section through a <strong className="text-foreground">recursive character splitter</strong> with ordered separators: section breaks, paragraph breaks, lines, sentences, words.
            </p>
            <p className="mt-3">
              The thing that made the biggest difference was <strong className="text-foreground">prepending contextual metadata to every chunk</strong>. A few lines at the top with enough context for the embedding to distinguish this chunk from similar ones. Without this, generic-sounding chunks all land in the same region of embedding space and retrieval precision drops.
            </p>
            <p className="mt-3">
              The sweet spot tends to be somewhere in the 2000-4000 character range with about 10% overlap. Smaller chunks improve precision but the LLM gets less context and starts hallucinating details. Bigger chunks are the opposite problem. You have to experiment with your own corpus to find the right balance.
            </p>
          </section>

          <section>
            <h2 id="retrieval" className="font-display text-lg font-semibold text-foreground mb-3">Retrieval: the part that actually matters</h2>
            <p>
              This is where most of the interesting engineering lives. Simple top-k similarity search works fine for generic questions, but it breaks down once queries reference specific entities or categories in your corpus. That kind of query needs metadata-aware retrieval, not just vector similarity.
            </p>

            <h3 id="query-rewriting" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Query rewriting</h3>
            <p>
              Before retrieval, the user message gets rewritten by a small LLM call into a better search query. Conversational messages like "yeah what about that?" get expanded using chat history into something self-contained. Obvious idea, but it tends to be the single most impactful change for retrieval quality.
            </p>
            <p className="mt-3">
              One quirk worth knowing: if your corpus is narrowly scoped, repeated entity names in rewritten queries can act as noise in the embedding space. A post-processing step that normalizes or removes the dominant entity gives a measurable improvement in retrieval relevance.
            </p>

            <h3 id="hybrid-retrieval" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Entity-aware hybrid retrieval</h3>
            <p>
              When a query mentions a specific entity that maps to your metadata (a topic, a category, a keyword), a parallel LLM call can extract it. If it finds one, you can run <strong className="text-foreground">two searches</strong>:
            </p>
            <ol className="list-decimal list-inside space-y-1 mt-2 ml-2">
              <li><strong className="text-foreground">Filtered search</strong> (larger k): vector search with a metadata filter scoping to the relevant content type and extracted entity</li>
              <li><strong className="text-foreground">Unfiltered search</strong> (smaller k): regular similarity search across all content</li>
            </ol>
            <p className="mt-3">
              Results are merged and deduplicated. The filtered results come first (higher priority), then general results fill in. This matters because if you only do filtered search, you miss the broader contextual pages. But if you only do unfiltered search, the most relevant domain-specific documents get buried.
            </p>
            <HybridRetrievalDiagram />
          </section>

          <section>
            <h2 id="parallel-classification" className="font-display text-lg font-semibold text-foreground mb-3">Parallel classification: trading money for latency</h2>
            <p>
              Most RAG pipelines need to answer several questions about a user message before retrieval: what's the intent? Does this need RAG at all? What entities are present? Is the query ambiguous?
            </p>
            <p className="mt-3">
              These are all separate LLM calls. Running them sequentially adds up fast — several calls at a few hundred milliseconds each. Running them in parallel with a <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">ThreadPoolExecutor</code> changes the math:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Intent classification (does this need RAG?)</li>
              <li>Entity extraction</li>
              <li>Query rewriting for search</li>
              <li>Ambiguity or follow-up detection</li>
            </ul>
            <p className="mt-3">
              Total latency becomes the time of the slowest call, not the sum. The tradeoff is cost: N calls means N× the tokens per turn. For most use cases that's worth it. For a side project, run them sequentially.
            </p>
            <p className="mt-3">
              A gotcha with LangGraph specifically: <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">deepcopy</code> the state before passing it to parallel threads. LangGraph state is a mutable dict, and concurrent writes to the same dict produce non-reproducible bugs that only appear under load.
            </p>
          </section>

          <section>
            <h2 id="hallucination-prevention" className="font-display text-lg font-semibold text-foreground mb-3">Hallucination prevention: the empty results problem</h2>
            <p>
              The worst failure mode in RAG isn't a wrong answer. It's a confidently wrong answer about something the corpus doesn't cover. If the retriever returns nothing, the LLM will fill in the gap from its training data. That's hallucination, and in production it's worse than saying "I don't know."
            </p>
            <p className="mt-3">
              The pattern that works: when retrieval returns zero relevant documents, skip the LLM entirely and return an honest templated response. No generation, no hallucination risk. The user gets a straightforward "I don't have information on that" and a path to continue.
            </p>
            <p className="mt-3">
              The retriever is your ground truth. If it finds nothing, don't ask the LLM to improvise.
            </p>
          </section>

          <section>
            <h2 id="conversation-flow" className="font-display text-lg font-semibold text-foreground mb-3">Graph-based conversation flow</h2>
            <p>
              Multi-turn RAG conversations need routing logic after every response. Should the next step be a follow-up question? A handoff? A redirect? LangGraph's <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">StateGraph</code> is good for this because it makes the flow an explicit state machine with conditional edges.
            </p>
            <p className="mt-3">
              One non-obvious insight: <strong className="text-foreground">answer the question before routing</strong>. If someone asks something, give them the RAG response first, then decide on the next action. The instinct is to route early, but users who get their question answered first are more willing to go along with whatever you suggest next.
            </p>
          </section>

          <section>
            <h2 id="retrospective" className="font-display text-lg font-semibold text-foreground mb-3">Worth trying next</h2>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3">
              <p>
                <strong className="text-foreground">Smaller, more focused chunks with a parent-child retrieval strategy.</strong> Large chunks work, but they're a compromise. I'd try storing small child chunks for retrieval precision and fetching the larger parent chunk for LLM context. Several frameworks support this now out of the box.
              </p>
              <p>
                <strong className="text-foreground">Evaluation from day one.</strong> Setting up an evaluation pipeline early saves a lot of pain. Every time you change a prompt, a chunk size, or a retrieval parameter, you need to know what broke. A judge LLM scoring conversations against a rubric works well for this, but it's the kind of thing that's easy to put off until you've already introduced regressions you can't trace.
              </p>
              <p>
                <strong className="text-foreground">Reranking helps more than you'd think.</strong> Adding a cross-encoder reranker on top of initial retrieval results noticeably improves relevance, especially for longer queries where the best semantic match isn't the most useful document for the actual question. If you haven't tried reranking, it's a high-impact addition for relatively low effort.
              </p>
              <p>
                <strong className="text-foreground">Cache the classification results.</strong> The parallel classification calls are the biggest cost driver. Many users ask similar categories of questions. A semantic cache (embedding similarity on the query, return cached classification if it's close enough) could cut costs without hurting quality much.
              </p>
            </div>
          </section>

          <section>
            <h2 id="conclusion" className="font-display text-lg font-semibold text-foreground mb-3">Wrapping up</h2>
            <p>
              Most of the work in a production RAG system isn't the retrieval or the generation. It's cleaning the source data, making metadata useful, handling the cases when retrieval returns nothing, and having an evaluation loop so you notice when things get worse. The LLM call at the end is the easy part.
            </p>
            <p className="mt-3">
              If you're working through similar problems, feel free to reach out. Always happy to compare notes.
            </p>
          </section>

        </div>

        <BlogNav />

      </article>
    </main>
  )
}
