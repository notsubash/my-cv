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
        <DiagramBox x={10} y={10} w={100} h={50} label="WordPress" sublabel="MySQL CMS" />
        <DiagramArrow x1={110} y1={35} x2={140} y2={35} />
        <DiagramBox x={140} y={10} w={110} h={50} label="Clean & Detect" sublabel="HTML / Shortcode" />
        <DiagramArrow x1={250} y1={35} x2={280} y2={35} />
        <DiagramBox x={280} y={10} w={110} h={50} label="Chunk" sublabel="Headers → Recursive" />
        <DiagramArrow x1={390} y1={35} x2={420} y2={35} />
        <DiagramBox x={420} y={10} w={100} h={50} label="Embed" sublabel="OpenAI" />
        <DiagramArrow x1={520} y1={35} x2={550} y2={35} />
        <DiagramBox x={550} y={10} w={80} h={50} label="Qdrant" accent />

        <text x={320} y={90} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[9px] uppercase tracking-widest">indexing ↑ · serving ↓</text>

        <DiagramBox x={10} y={110} w={100} h={50} label="User Query" />
        <DiagramArrow x1={110} y1={135} x2={140} y2={135} />
        <DiagramBox x={140} y={110} w={110} h={50} label="5× Parallel LLM" sublabel="Classify · Rewrite · …" accent />
        <DiagramArrow x1={250} y1={135} x2={280} y2={135} />
        <DiagramBox x={280} y={110} w={110} h={50} label="Hybrid Retrieve" sublabel="Filter + Similarity" />
        <DiagramArrow x1={335} y1={110} x2={590} y2={60} label="" />
        <DiagramArrow x1={390} y1={135} x2={420} y2={135} />
        <DiagramBox x={420} y={110} w={100} h={50} label="LLM Generate" sublabel="w/ RAG context" accent />
        <DiagramArrow x1={520} y1={135} x2={550} y2={135} />
        <DiagramBox x={550} y={110} w={80} h={50} label="Response" />

        <DiagramArrow x1={470} y1={160} x2={470} y2={190} />
        <DiagramBox x={360} y={190} w={220} h={50} label="Post-RAG Routing" sublabel="Lead Qual · Off-topic · CRM" />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">End-to-end pipeline: indexing (top) and serving (bottom)</figcaption>
    </figure>
  )
}

function HybridRetrievalDiagram() {
  return (
    <figure className="my-6">
      <svg viewBox="0 0 520 220" className="w-full" role="img" aria-label="Hybrid retrieval strategy diagram">
        <DiagramBox x={10} y={10} w={130} h={50} label="Rewritten Query" sublabel="+ tech filter: React" />

        <DiagramArrow x1={140} y1={25} x2={200} y2={25} />
        <DiagramArrow x1={140} y1={45} x2={200} y2={125} />

        <DiagramBox x={200} y={5} w={140} h={44} label="Filtered Search" sublabel="k=10 · projects only" accent />
        <DiagramBox x={200} y={105} w={140} h={44} label="Unfiltered Search" sublabel="k=5 · all content" />

        <DiagramArrow x1={340} y1={27} x2={380} y2={80} />
        <DiagramArrow x1={340} y1={127} x2={380} y2={100} />

        <DiagramBox x={380} y={65} w={130} h={50} label="Merge & Dedup" sublabel="Filtered first" accent />

        <DiagramArrow x1={445} y1={115} x2={445} y2={150} />
        <DiagramBox x={370} y={150} w={140} h={44} label="LLM Generation" sublabel="With combined docs" />

        <text x={230} y={80} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px] italic">project portfolio</text>
        <text x={230} y={165} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px] italic">FAQs, services, blog</text>
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Hybrid retrieval: filtered results get priority, general context fills in</figcaption>
    </figure>
  )
}

export default function BlogRagPipeline() {
  useBlogSeo({
    title: 'Building a Production RAG Pipeline: Lessons from a Real Sales Chatbot',
    description: 'Practical lessons from building a LangGraph + Qdrant RAG pipeline for a production sales chatbot. Covers chunking, hybrid retrieval, query rewriting, and hallucination prevention.',
    keywords: 'rag pipeline tutorial, langgraph qdrant python, how to build rag chatbot, hybrid retrieval augmented generation, prevent llm hallucination production, sales chatbot ai, vector database chunking strategy, query rewriting llm, production rag architecture, langchain alternative langgraph',
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
            Building a Production RAG Pipeline: What I Learned the Hard Way
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            I spent a few months building a retrieval-augmented generation system for a real sales chatbot. Not a weekend prototype, but a system handling actual users, real CMS content, and a business that cared about the quality of every response. This post covers the technical decisions that mattered most.
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

        <hr className="border-border mb-10" />

        {/* Body */}
        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 id="setup" className="font-display text-lg font-semibold text-foreground mb-3">The setup</h2>
            <p>
              The project was a sales chatbot for a software company. The bot needed to answer questions about services, showcase portfolio projects, and qualify leads. All the source content lived in a WordPress CMS: blog posts, service pages, project case studies, testimonials, timelines.
            </p>
            <p className="mt-3">
              The stack: <strong className="text-foreground">LangGraph</strong> for conversation orchestration, <strong className="text-foreground">Qdrant</strong> as the vector store, <strong className="text-foreground">OpenAI embeddings</strong> (text-embedding-3-small) for indexing, and <strong className="text-foreground">FastAPI</strong> serving the whole thing. Deployed on AWS Lambda behind API Gateway.
            </p>
            <p className="mt-3">
              I'm keeping specifics about the company and their clients out of this post. The technical decisions are what matter here and they're fully transferable to any content-heavy RAG system.
            </p>
            <PipelineDiagram />
          </section>

          <section>
            <h2 id="ingestion" className="font-display text-lg font-semibold text-foreground mb-3">Ingestion: WordPress is messier than you think</h2>
            <p>
              The first thing I underestimated was how messy real CMS content is. WordPress stores posts as HTML with shortcodes, custom page-builder markup (Divi in this case), inline styles, and metadata scattered across multiple tables. Feeding that directly into a text splitter produces garbage chunks full of <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">[et_pb_section]</code> tags and broken HTML.
            </p>
            <p className="mt-3">
              So the ingestion pipeline pulls published content from MySQL (posts, pages, portfolio projects, testimonials), cleans the markup, and detects the content type. Is it Divi shortcode HTML? Regular WordPress HTML? Markdown? Each gets a different cleaning pass before chunking. This sounds like boilerplate, but it was easily 30% of the total effort on the project. Bad chunks make everything downstream worse: retrieval gets noisy, the LLM gets confused, and the answers degrade in ways that are hard to debug.
            </p>
          </section>

          <section>
            <h2 id="chunking" className="font-display text-lg font-semibold text-foreground mb-3">Chunking: hierarchical splitting with metadata headers</h2>
            <p>
              I used a two-stage chunking approach. First, the cleaned content is split on <strong className="text-foreground">HTML or Markdown headers</strong> (h1 through h6) to preserve document structure. Then each header-level section goes through a <strong className="text-foreground">recursive character splitter</strong> with a priority order of separators: section breaks first, then paragraph breaks, then lines, then sentences, then words.
            </p>
            <p className="mt-3">
              The key thing that made retrieval quality jump was <strong className="text-foreground">prepending a textual header to every chunk</strong>. Each chunk gets a few lines at the top with the page title, content type, summary, and (for portfolio projects) the technologies used. This is important because embedding models encode the full chunk text, and a chunk that says "Built with React and Node.js" with no context about which project it refers to is almost useless for retrieval.
            </p>
            <p className="mt-3">
              Chunk sizes ended up at around 4000 characters with 400 character overlap. I tried smaller chunks early on and retrieval precision went up, but the LLM had less context per chunk and started hallucinating details. The 4000/400 sweet spot gave enough context per chunk while keeping retrieval focused.
            </p>
          </section>

          <section>
            <h2 id="retrieval" className="font-display text-lg font-semibold text-foreground mb-3">Retrieval: the part that actually matters</h2>
            <p>
              This is where most of the interesting engineering ended up. Simple top-k similarity search was the baseline, and it worked okay for generic questions. But the bot needed to handle queries like "do you have experience with React Native?" or "show me your healthcare projects." That requires metadata-aware retrieval, not just vector similarity.
            </p>

            <h3 id="query-rewriting" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Query rewriting</h3>
            <p>
              Before retrieval, the user message gets rewritten by a small LLM call into a better search query. Conversational messages like "yeah what about that?" get expanded using chat history into something like "What services does the company offer for mobile app development?" This sounds obvious, but it's the single most impactful change I made to retrieval quality.
            </p>
            <p className="mt-3">
              One quirk I ran into: the company name kept appearing in rewritten queries, and since the entire corpus is about that company, it acted as noise in the embedding space. I added a post-processing step that strips the company name from search queries and replaces it with "you." Small change, measurable improvement in retrieval relevance.
            </p>

            <h3 id="hybrid-retrieval" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Technology-aware hybrid retrieval</h3>
            <p>
              When a user asks about a specific technology, a parallel LLM call extracts the technology name. If it finds one (say, "React Native"), the retriever does <strong className="text-foreground">two searches</strong>:
            </p>
            <ol className="list-decimal list-inside space-y-1 mt-2 ml-2">
              <li><strong className="text-foreground">Filtered search</strong> (k=10): Qdrant metadata filter on <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">content_type == project</code> AND <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">technologies contains "React Native"</code></li>
              <li><strong className="text-foreground">Unfiltered search</strong> (k=5): regular similarity search across all content</li>
            </ol>
            <p className="mt-3">
              Results are merged and deduplicated. The filtered results come first (higher priority), then general results fill in. This matters because if you only do filtered search, you miss the FAQ and service pages that explain the company's approach to that technology. But if you only do unfiltered search, the specific project examples get buried.
            </p>
            <p className="mt-3">
              One thing that bit me: <strong className="text-foreground">Qdrant string matching is case-sensitive</strong>. A filter for "javascript" won't match metadata stored as "JavaScript." I had to generate case variations (original, lowercase, uppercase, title case) and use <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">MatchAny</code> to cover all of them. Not elegant, but it works reliably.
            </p>
            <HybridRetrievalDiagram />
          </section>

          <section>
            <h2 id="parallel-classification" className="font-display text-lg font-semibold text-foreground mb-3">Parallel classification: trading money for latency</h2>
            <p>
              Before RAG even fires, the system needs to figure out what the user wants. Is this a service inquiry? A portfolio question? Off-topic chat? Are they asking about pricing? Are they providing their contact info?
            </p>
            <p className="mt-3">
              These are all separate LLM calls. Running them sequentially adds up fast: 5 calls at 300-500ms each means 1.5-2.5 seconds before retrieval even starts. So I run all five in parallel with a <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">ThreadPoolExecutor</code>:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Query classification (intent + whether RAG is needed)</li>
              <li>User info extraction (name, email, company)</li>
              <li>Query rewriting for search</li>
              <li>Ambiguity analysis</li>
              <li>Technology filter extraction</li>
            </ul>
            <p className="mt-3">
              Total latency for the parallel block is the time of the slowest call, not the sum. In practice this brought classification from ~2 seconds down to ~500ms. The tradeoff is cost: you're paying for 5x the tokens. For a sales chatbot where every lead matters, the latency improvement was worth it. For a hobby project, I'd just run them sequentially.
            </p>
            <p className="mt-3">
              One thing I learned: <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">deepcopy</code> the state before passing it to parallel threads. LangGraph state is a mutable dict, and concurrent writes to the same dict will produce bizarre, non-reproducible bugs that only show up under load.
            </p>
          </section>

          <section>
            <h2 id="hallucination-prevention" className="font-display text-lg font-semibold text-foreground mb-3">Hallucination prevention: the empty results problem</h2>
            <p>
              The most dangerous failure mode in a sales bot isn't a wrong answer. It's a confidently wrong answer about capabilities the company doesn't have. If someone asks "do you do blockchain development?" and the retriever returns nothing, the LLM will happily make something up if you let it.
            </p>
            <p className="mt-3">
              My approach: when the technology filter matches zero documents, the system short-circuits the LLM entirely and returns a templated honest response: "While we have experience with [technology], I don't have public portfolio examples to share." No LLM generation, no hallucination risk. The user still gets a useful answer and a path to continue the conversation.
            </p>
            <p className="mt-3">
              This is a pattern I'd use again in any RAG system. The retriever is your ground truth. If it returns nothing, don't ask the LLM to fill in the gap. Admit the gap.
            </p>
          </section>

          <section>
            <h2 id="conversation-flow" className="font-display text-lg font-semibold text-foreground mb-3">Graph-based conversation flow</h2>
            <p>
              The conversation isn't just question-answer-question-answer. After a RAG response, the system needs to decide: should it ask for contact info? Route to a pricing discussion? Hand off to lead qualification? Flag as off-topic?
            </p>
            <p className="mt-3">
              I used LangGraph's <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">StateGraph</code> to model this as an explicit state machine. Nodes handle classification, retrieval, generation, lead qualification, off-topic responses, and CRM integration. Conditional edges between nodes encode the routing rules.
            </p>
            <p className="mt-3">
              The main non-obvious routing decision: <strong className="text-foreground">RAG runs before lead qualification</strong>, not after. If someone asks a question about services, answer the question first, then try to qualify the lead. The instinct is to capture contact info as early as possible, but it ruins the user experience. People who get their question answered are more willing to share their email afterward.
            </p>
          </section>

          <section>
            <h2 id="retrospective" className="font-display text-lg font-semibold text-foreground mb-3">What I'd do differently</h2>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3">
              <p>
                <strong className="text-foreground">Smaller, more focused chunks with a parent-child retrieval strategy.</strong> The 4000-character chunks work, but they're a compromise. I'd try storing 500-char child chunks for retrieval precision and fetching the parent 4000-char chunk for LLM context. Several frameworks support this now out of the box.
              </p>
              <p>
                <strong className="text-foreground">Evaluation from day one.</strong> I built an evaluation pipeline later in the project, and it was invaluable for catching regressions. But I wish I'd had it from the start. Every time you change a prompt, a chunk size, or a retrieval parameter, you need to know what broke. I ended up using a judge LLM (GPT-4.1) scoring multi-turn conversations against a rubric, exporting to Excel for review. It works, but I should have invested in it earlier.
              </p>
              <p>
                <strong className="text-foreground">Reranking helped more than I expected.</strong> I added a cross-encoder reranker on top of the retrieved docs after the initial top-k similarity search and metadata filters. It noticeably improved relevance, especially for longer queries where the best semantic match isn't always the most useful document for answering the question. If you're building a RAG system and haven't tried reranking yet, it's one of the highest-impact additions for relatively low effort.
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
              If you're building something similar, I'm happy to compare notes on architecture decisions.
            </p>
          </section>

        </div>

        <BlogNav />

      </article>
    </main>
  )
}
