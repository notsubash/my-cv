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
export const facts = [
  { term: 'Role', detail: 'AI/ML Engineer at Scopic Software', note: 'Oct 2024 – now' },
  { term: 'Focus', detail: 'RAG, LangGraph agents, LLM evaluation, voice AI' },
  { term: 'Stack', detail: 'Python, PyTorch, LangGraph, FastAPI, AWS, Docker, Kubernetes' },
  { term: 'Education', detail: 'MSc Data Science, University of Exeter' },
  { term: 'Based', detail: 'Kathmandu, working remotely', clock: true },
  { term: 'Open to', detail: 'Remote AI/ML engineering roles' },
] as const

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
    kind: 'Full-stack product, built solo for the Buffer Commit contest',
    problem: 'Scheduled social posts keep publishing after the product sells out, the job closes or the event is cancelled.',
    built: 'A Buffer app that checks every queued link and holds stale posts as drafts. A deterministic rule engine decides, never a model, so a blocked page can never cause a hold.',
    result: { value: '100% / 95%', label: 'precision / recall on 150 real links: zero false holds; 1,773 automated tests' },
    href: 'https://lastcall.subash-pandey.com',
    external: true,
    linkLabel: 'Open the live app',
    image: '/projects/lastcall.webp',
    tags: ['TypeScript', 'Hono', 'SQLite', 'OAuth PKCE'],
  },
  {
    slug: 'gavel',
    title: 'Gavel',
    kind: 'Multi-agent LLM system',
    problem: 'One model reviewing a startup idea gives one confident opinion and no way to check it.',
    built: 'A panel of five LLM judges (investor, engineer, product manager, customer, competitor) that score an idea, debate it in LangGraph rounds and return a structured verdict. A FastAPI engine streams each run and resumes it after a crash.',
    result: { value: '$0', label: 'API cost per run: five judges and a debate on local 9B models, capped at 10 minutes, replayable after a crash' },
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
    problem: 'Agent skills are easy to write and hard to trust: no evals, no pinned versions, no review.',
    built: 'A Claude Code plugin marketplace and dependency-free CLI: 17 skills in 5 plugins, 42 third-party skills pinned to audited commits, guardrail hooks, and an LLM-judged eval suite that CI enforces.',
    result: { value: '+0.67', label: 'task-score gain over the no-skill baseline; 100% trigger accuracy on evaluated skills' },
    href: 'https://github.com/notsubash/claude-skills',
    external: true,
    linkLabel: 'View on GitHub',
    image: '/projects/craft.webp',
    tags: ['Node.js', 'LLM-as-judge', 'GitHub Actions'],
  },
  {
    slug: 'activity-recognition',
    title: 'Activity Recognition',
    kind: 'ML evaluation',
    problem: 'An activity classifier scored 0.89 macro-F1, but only because the same 51 people appeared in both training and test data.',
    built: 'A subject-independent pipeline with GroupKFold splits, XGBoost, ONNX export and a CPU FastAPI endpoint.',
    result: { value: '0.89 → 0.29', label: 'macro-F1 once the leak is removed; the smartwatch model holds 0.70' },
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
    problem: 'Moving an AI API from a laptop to a cluster usually means hand-run deploys, no rollback and no view of failures.',
    built: 'A FastAPI summarization service shipped through CI to a Terraform-built k3s cluster, released by Argo CD with Helm rollbacks, and watched through Prometheus, Grafana and Loki.',
    result: { value: '< $15', label: 'a month, with GitOps releases and full observability' },
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
    problem: 'Can a self-parking planner tell when its learned world model is wrong?',
    built: 'A CEM planner, a JEPA latent dynamics model, latent MPC and three distrust signals in highway-env.',
    result: { value: '0.41 m', label: 'from the stall with neighbours parked; the learned model beats the no-change baseline to horizon 20' },
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
    built: 'Short, silent explainers of one idea each, animated in Manim and rendered separately for widescreen and vertical with FFmpeg.',
    result: { value: '100K', label: 'views and 1,000+ followers in the first 40 days' },
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
    ],
  },
  { org: 'Peace Nepal Dot Com', role: 'AI/ML Engineer', period: 'Jul – Nov 2024', points: ['Chatbots for banking, travel and customer support with RAG and a multi-agent framework; fine-tuned LLMs for 5 domain use cases.'] },
  { org: 'Icebrkr AI Solutions', role: 'AI/ML Engineer', period: 'Mar – Jun 2024', points: ['Built, optimised and deployed ML models for analysis and automation on cloud infrastructure.'] },
  { org: 'University of Exeter', role: 'MSc Data Science, Merit', period: '2022 – 2023', points: ['Thesis: machine learning on the Steam video game database (27,075 games, 8 genre communities).'] },
  { org: 'Contentio Lab', role: 'Data Analyst', period: 'Aug 2021 – Apr 2022', points: ['Python data pipelines that cut processing time by 20%; segmentation and churn analysis for marketing and sales.'] },
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
