// Homepage copy, written for hiring managers and recruiters.
// Every claim traces to src/i18n.ts, public CV (Nov 2026), a case-study metric tile,
// or numbers the owner supplied (Scopic routing benchmark, 2026-11-23).

export const person = {
  name: 'Subash Pandey',
  email: 'axlesubash111@gmail.com',
  github: 'https://github.com/notsubash',
  linkedin: 'https://www.linkedin.com/in/subash-pandey-ai',
  timeZone: 'Asia/Kathmandu',
  utcOffset: 'UTC+5:45',
  cv: '/Subash-Pandey-CV.pdf',
}

/** Recruiter checklist: the six things a screen looks for, laid out as the hero's profile sheet. */
export type Profile = {
  role: { title: string; org: string }
  focus: readonly string[]
  stack: readonly string[]
  education: { degree: string; school: string }
  based: { city: string; mode: string }
  openTo: string
}

export const profile: Profile = {
  role: { title: 'AI/ML Engineer', org: 'Scopic Software' },
  focus: ['Backend', 'Agentic AI', 'MLOps', 'Evals', 'AI SaaS'],
  stack: ['Python', 'PyTorch', 'LangGraph', 'FastAPI', 'AWS', 'Docker', 'Kubernetes', 'Agentic coding'],
  education: { degree: 'MSc Data Science', school: 'University of Exeter' },
  based: { city: 'Kathmandu, Nepal', mode: 'working remotely' },
  openTo: 'Remote AI/ML engineering roles',
}

export type WorkItem = {
  slug: string
  title: string
  kind: string
  /** One or two sentences: what it is, how it works, why it matters. */
  summary: string
  result: { value: string; label: string } | null
  /** Internal route, external URL, or absent for confidential work */
  href?: string
  external?: boolean
  linkLabel?: string
  repo?: string
  image?: string
  /** Show the whole image instead of cropping it to the card (charts with an unusual aspect). */
  imageFit?: 'contain'
  tags: readonly string[]
}

export const work: readonly WorkItem[] = [
  {
    slug: 'craft',
    title: 'Craft',
    kind: 'Agent tooling and evaluation',
    summary: 'A Claude Code plugin marketplace and CLI for agent skills: 17 of my own and 42 audited third-party ones, each pinned to a version and evaluated in CI, so a skill only ships if it beats working without it.',
    result: { value: '+0.67', label: 'task score over the no-skill baseline' },
    href: 'https://github.com/notsubash/claude-skills',
    external: true,
    linkLabel: 'View on GitHub',
    image: '/projects/craft.webp',
    tags: ['Node.js','Claude', 'LLM-as-judge', 'GitHub Actions'],
  },
  {
    slug: 'lastcall',
    title: 'LastCall',
    kind: 'Full-stack product, built for Buffer Commit',
    summary: 'A Buffer app that checks the links in your scheduled posts and holds any post whose product has sold out or whose job has closed, so nothing stale goes out. Plain rules decide, never a model.',
    result: { value: '100% / 95%', label: 'precision / recall on 150 real links; 1,773 tests' },
    href: 'https://lastcall.subash-pandey.com',
    external: true,
    linkLabel: 'Open the live app',
    image: '/projects/lastcall.webp',
    tags: ['TypeScript', 'Hono', 'Buffer GraphQL API', 'OAuth PKCE'],
  },
  {
    slug: 'cloud-native-ai-platform',
    title: 'Cloud Native AI Platform',
    kind: 'MLOps',
    summary: 'A FastAPI summarisation API on a Kubernetes cluster built with Terraform, deployed through Argo CD with one-step rollbacks and monitored in Prometheus and Grafana, all for under $15 a month.',
    result: { value: '< $15', label: 'a month, fully observable' },
    href: '/blog/building-a-cloud-native-ai-platform',
    linkLabel: 'Read the write-up',
    repo: 'https://github.com/notsubash/cloud-native-AI-platform',
    image: '/projects/cloud-native-ai-platform.webp',
    tags: ['Kubernetes', 'Terraform', 'Argo CD', 'Prometheus'],
  },
  {
    slug: 'gavel',
    title: 'Gavel',
    kind: 'Multi-agent LLM system',
    summary: 'Five LLM judges score an idea, argue about it and vote again in LangGraph, so you get a checked verdict instead of one model’s opinion. A FastAPI engine streams each run and can pick it back up.',
    result: { value: '≥95%', label: 'valid verdicts from local 9B judges, gated on a golden set' },
    href: '/blog/building-an-idea-workbench',
    linkLabel: 'Read the write-up',
    repo: 'https://github.com/notsubash/gavel',
    image: '/projects/gavel.webp',
    tags: ['LangGraph', 'FastAPI', 'Pydantic', 'SQLite'],
  },
  {
    slug: 'activity-recognition',
    title: 'Activity Recognition',
    kind: 'ML evaluation',
    summary: 'An activity classifier for phone and watch sensors, rebuilt after its 0.89 score turned out to come from testing on the same people it trained on. Honest per-person splits drop it to 0.29; it ships as ONNX behind a CPU API.',
    result: { value: '0.89 → 0.29', label: 'macro-F1 after removing subject leakage' },
    href: '/blog/activity-recognition-pipeline',
    linkLabel: 'Read the write-up',
    repo: 'https://github.com/notsubash/Activity-Recognition',
    image: '/projects/activity-recognition.webp',
    imageFit: 'contain',
    tags: ['XGBoost', 'ONNX', 'FastAPI', 'MLflow'],
  },
  {
    slug: 'latent-parking',
    title: 'Latent Parking',
    kind: 'World models and control',
    summary: 'A self-parking car that plans by imagining futures with a learned world model, plus three signals that tell it when that imagination has stopped being trustworthy.',
    result: { value: '0.41 m', label: 'from the stall, neighbours parked' },
    href: '/blog/when-a-self-parking-car-cannot-trust-its-imagination',
    linkLabel: 'Read the write-up',
    repo: 'https://github.com/notsubash/latent-parking',
    image: '/projects/latent-parking.webp',
    tags: ['PyTorch', 'JEPA', 'MPC'],
  },
  {
    slug: 'the-underlying-curve',
    title: 'The Underlying Curve',
    kind: 'Visual explainers',
    summary: 'Short, silent videos that explain one machine learning idea each with animation instead of notation, made in Manim and FFmpeg.',
    result: { value: '100K+', label: 'views and 2,000+ followers' },
    href: '/projects/the-underlying-curve',
    linkLabel: 'Watch the series',
    image: '/projects/the-underlying-curve.webp',
    tags: ['Manim', 'FFmpeg'],
  },
]

export const experience = [
  {
    org: 'Scopic Software',
    role: 'AI/ML Engineer',
    period: 'Oct 2024 – now',
    points: [
      'Benchmarked a replacement routing classifier against GPT-4o-mini: 88% vs 80% handler accuracy, 86% vs 77% intent, about 6× cheaper, p95 under 0.6 s.',
      'Lead a GenAI sales chatbot on LangGraph and RAG over Qdrant, integrated with Zoho CRM for lead qualification and scoring.',
      'Built evaluation pipelines for chatbot and RAG releases that raised response accuracy by 20% while lowering latency and cost.',
      'Develop and maintain a production AI receptionist platform, including its voice-agent layer (speech-to-text, text-to-speech, turn handling).',
      'Build an AI interviewer platform, assessment engine and interviewer agent.',
      'Work on SEO Keyword Clustering and Search Intent Analysis for a SaaS product.',
    ],
  },
  { org: 'Peace Nepal Dot Com', role: 'AI/ML Engineer', period: 'Jul – Nov 2024', points: ['RAG and multi-agent chatbots for banking, travel and support; fine-tuned LLMs for 5 use cases.'] },
  { org: 'Icebrkr AI Solutions', role: 'AI/ML Engineer', period: 'Mar – Jun 2024', points: ['Built and deployed ML models for analysis and automation in the cloud.'] },
  { org: 'University of Exeter', role: 'MSc Data Science, Merit', period: '2022 – 2023', points: ['Thesis: 27,075 Steam games mapped into 8 genre communities.'] },
  { org: 'Contentio Lab', role: 'Data Analyst', period: 'Aug 2021 – Apr 2022', points: ['Python pipelines that cut processing time 20%; churn and segmentation analysis.'] },
] as const

/** The homepage's closing claim, proved by the visual: each shipped project on its own stack. */
export type RangeRow = { project: string; stack: readonly string[]; href: string; external?: boolean }

export const range = {
  claim: 'In the age of AI, the stack is a choice, not a ceiling.',
  caption: 'Five builds, five stacks.',
  rows: [
    { project: 'LastCall', stack: ['TypeScript', 'Hono'], href: 'https://lastcall.subash-pandey.com', external: true },
    { project: 'Gavel', stack: ['Python', 'LangGraph', 'FastAPI'], href: '/blog/building-an-idea-workbench' },
    { project: 'AI platform', stack: ['Terraform', 'Kubernetes', 'Argo CD'], href: '/blog/building-a-cloud-native-ai-platform' },
    { project: 'Latent Parking', stack: ['PyTorch'], href: '/blog/when-a-self-parking-car-cannot-trust-its-imagination' },
    { project: 'This site', stack: ['React', 'Vite'], href: 'https://github.com/notsubash/my-cv', external: true },
  ] as readonly RangeRow[],
}

export const recommendation = {
  quote: 'He helped my team and me navigate our initial AI strategy, clarify our approach, and identify the right areas to prioritize.',
  author: 'Akash Raghuvanshi',
  role: 'AI Product Leader',
  source: 'LinkedIn recommendation',
  href: 'https://www.linkedin.com/in/subash-pandey-ai/details/recommendations/',
}

export const posts = [
  { slug: 'when-a-self-parking-car-cannot-trust-its-imagination', title: 'Teaching a Car to Park by Imagining the Future, and Learning When Not to Trust It', date: 'Aug 2026' },
  { slug: 'activity-recognition-pipeline', title: 'Rebuilding WISDM HAR after a leaky 0.89', date: 'Aug 2026' },
  { slug: 'building-a-cloud-native-ai-platform', title: 'Building a Cloud Native AI Platform Under $15 a Month', date: 'Aug 2026' },
  { slug: 'building-an-idea-workbench', title: 'Building Gavel: Turning AI Opinions Into Experiments', date: 'Jul 2026' },
] as const
