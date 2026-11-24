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

/** Recruiter checklist: the six things a screen looks for, in the order they look. */
export type Fact = { term: string; detail: string; note?: string; clock?: boolean }

export const facts: readonly Fact[] = [
  { term: 'Role', detail: 'AI/ML Engineer at Scopic Software' },
  { term: 'Focus', detail: 'Backend, Agentic AI, LLM evaluation, voice AI, SaaS' },
  { term: 'Stack', detail: 'Python, PyTorch, LangGraph, FastAPI, AWS, Docker, Kubernetes' },
  { term: 'Education', detail: 'MSc Data Science, University of Exeter' },
  { term: 'Based', detail: 'Kathmandu, working remotely', clock: true },
  { term: 'Open to', detail: 'Remote AI/ML engineering roles' },
]

export type WorkItem = {
  slug: string
  title: string
  kind: string
  problem: string
  built: string
  result: { value: string; label: string } | null
  resultFallback?: string
  /** Internal route, external URL, or absent for confidential work */
  href?: string
  external?: boolean
  linkLabel?: string
  repo?: string
  image?: string
  tags: readonly string[]
}

export const work: readonly WorkItem[] = [
  {
    slug: 'lastcall',
    title: 'LastCall',
    kind: 'Full-stack product, built for Buffer Commit',
    problem: 'Scheduled posts still publish after the linked product sells out or the job closes.',
    built: 'A Buffer app that checks every queued link and holds stale posts. Rules decide, never a model.',
    result: { value: '100% / 95%', label: 'precision / recall on 150 real links; 1,773 tests' },
    href: 'https://lastcall.subash-pandey.com',
    external: true,
    linkLabel: 'Open the live app',
    image: '/projects/lastcall.webp',
    tags: ['TypeScript', 'Hono', 'Buffer GraphQL API', 'OAuth PKCE'],
  },
  {
    slug: 'gavel',
    title: 'Gavel',
    kind: 'Multi-agent LLM system',
    problem: 'One model’s review of an idea is one unchecked opinion.',
    built: 'Five LLM judges score, debate and re-vote in LangGraph; a FastAPI engine streams and resumes each run.',
    result: { value: '≥95%', label: 'valid verdicts from local 9B judges, gated on a golden set' },
    href: '/blog/building-an-idea-workbench',
    linkLabel: 'Read the write-up',
    repo: 'https://github.com/notsubash/gavel',
    image: '/projects/gavel.webp',
    tags: ['LangGraph', 'FastAPI', 'Pydantic', 'SQLite'],
  },
  {
    slug: 'craft',
    title: 'Craft',
    kind: 'Agent tooling and evaluation',
    problem: 'Agent skills ship without evals, pinned versions or review. Personal skills directory for Claude.',
    built: 'A Claude Code marketplace and CLI: 17 skills, 42 audited third-party skills, evals enforced in CI.',
    result: { value: '+0.67', label: 'task score over the no-skill baseline' },
    href: 'https://github.com/notsubash/claude-skills',
    external: true,
    linkLabel: 'View on GitHub',
    image: '/projects/craft.webp',
    tags: ['Node.js','Claude', 'LLM-as-judge', 'GitHub Actions'],
  },
  {
    slug: 'activity-recognition',
    title: 'Activity Recognition',
    kind: 'ML evaluation',
    problem: 'A 0.89 macro-F1 came from the same 51 people in train and test.',
    built: 'Subject-independent splits, XGBoost, ONNX export and a CPU FastAPI endpoint.',
    result: { value: '0.89 → 0.29', label: 'macro-F1 after removing subject leakage' },
    href: '/blog/activity-recognition-pipeline',
    linkLabel: 'Read the write-up',
    repo: 'https://github.com/notsubash/Activity-Recognition',
    image: '/projects/activity-recognition.webp',
    tags: ['XGBoost', 'ONNX', 'FastAPI', 'MLflow'],
  },
  {
    slug: 'cloud-native-ai-platform',
    title: 'Cloud Native AI Platform',
    kind: 'MLOps',
    problem: 'AI APIs often reach a cluster with manual deploys and no monitoring.',
    built: 'FastAPI on Terraform-built k3s, Argo CD GitOps with rollbacks, Prometheus and Grafana.',
    result: { value: '< $15', label: 'a month, fully observable' },
    href: '/blog/building-a-cloud-native-ai-platform',
    linkLabel: 'Read the write-up',
    repo: 'https://github.com/notsubash/cloud-native-AI-platform',
    image: '/projects/cloud-native-ai-platform.webp',
    tags: ['Kubernetes', 'Terraform', 'Argo CD', 'Prometheus'],
  },
  {
    slug: 'latent-parking',
    title: 'Latent Parking',
    kind: 'World models and control',
    problem: 'Can a planner tell when its learned world model is wrong?',
    built: 'CEM planning, a JEPA latent model, latent MPC and three distrust signals.',
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
    problem: 'ML ideas usually arrive as walls of notation.',
    built: 'Silent one-idea explainers, animated in Manim and cut with FFmpeg.',
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
      'Lead a GenAI sales chatbot on LangGraph and RAG over Qdrant, integrated with Zoho CRM for lead qualification and scoring; it processes 5+ warm leads a month.',
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
