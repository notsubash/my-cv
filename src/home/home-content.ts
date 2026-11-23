// Homepage copy, written for hiring managers and recruiters.
// Every claim traces to src/i18n.ts (experience, education, projects) or a case-study metric tile.

export const person = {
  name: 'Subash Pandey',
  email: 'axlesubash111@gmail.com',
  github: 'https://github.com/notsubash',
  linkedin: 'https://www.linkedin.com/in/subash-pandey-ai',
  timeZone: 'Asia/Kathmandu',
  utcOffset: 'UTC+5:45',
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
  href: string
  linkLabel: string
  repo?: string
  image: string
  tags: readonly string[]
}

export const work: readonly WorkItem[] = [
  {
    slug: 'gavel',
    title: 'Gavel',
    kind: 'Multi-agent LLM system',
    problem: 'Long multi-agent judge runs on local 9B models died mid-run, and their scores drifted between versions.',
    built: 'A crash-safe FastAPI run engine: SSE streaming, a durable SQLite event log, five parallel LLM judges and a LangGraph debate behind readiness gates.',
    result: { value: '389', label: 'unit tests across 3 eval tiers' },
    href: '/projects/gavel',
    linkLabel: 'Read the case study',
    repo: 'https://github.com/notsubash/gavel',
    image: '/projects/gavel.webp',
    tags: ['LangGraph', 'FastAPI', 'SQLite', 'Next.js'],
  },
  {
    slug: 'activity-recognition',
    title: 'Activity Recognition',
    kind: 'ML evaluation',
    problem: 'An activity classifier scored 0.89 macro-F1, but only because the same 51 people appeared in both training and test data.',
    built: 'A subject-independent pipeline with GroupKFold splits, XGBoost, ONNX export and a CPU FastAPI endpoint.',
    result: { value: '0.89 → 0.29', label: 'macro-F1 once the leak is removed; the smartwatch model holds 0.70' },
    href: '/projects/activity-recognition',
    linkLabel: 'Read the case study',
    repo: 'https://github.com/notsubash/Activity-Recognition',
    image: '/projects/activity-recognition.webp',
    tags: ['XGBoost', 'ONNX', 'FastAPI', 'MLflow'],
  },
  {
    slug: 'cloud-native-ai-platform',
    title: 'Cloud Native AI Platform',
    kind: 'MLOps',
    problem: 'Show that a production-grade AI service does not need a production-grade budget.',
    built: 'A FastAPI summarization service on Kubernetes with Helm, Terraform on Hetzner, Argo CD GitOps, and Prometheus, Grafana and Loki.',
    result: { value: '< $15', label: 'a month, with full observability' },
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
    result: { value: '0 / 6', label: 'seeds parked by the learned planner, written up as a negative result' },
    href: '/blog/when-a-self-parking-car-cannot-trust-its-imagination',
    linkLabel: 'Read the write-up',
    repo: 'https://github.com/notsubash/latent-parking',
    image: '/projects/latent-parking.webp',
    tags: ['PyTorch', 'JEPA', 'MPC'],
  },
  {
    slug: 'steam-ml',
    title: 'Steam Genre Networks',
    kind: 'Network analysis, MSc thesis',
    problem: 'How do game genres evolve, and what actually drives player engagement?',
    built: 'A genre co-occurrence network over the Steam catalogue, with community detection and engagement regressions. Published on Zenodo.',
    result: { value: '27,075', label: 'games mapped into 8 genre communities' },
    href: '/projects/steam-ml',
    linkLabel: 'Read the case study',
    repo: 'https://github.com/notsubash/Game-Genre-Network-Analysis',
    image: '/projects/steam-ml.webp',
    tags: ['NetworkX', 'Gephi', 'Python'],
  },
  {
    slug: 'the-underlying-curve',
    title: 'The Underlying Curve',
    kind: 'Visual explainers',
    problem: 'ML ideas usually arrive as walls of notation.',
    built: 'Short, silent explainers of one idea each, animated in Manim and cut per platform with FFmpeg.',
    result: null,
    resultFallback: 'Ongoing series on Instagram',
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
      'Led a GenAI chatbot built on LangGraph and RAG over Qdrant, integrated with a CRM for intent detection and user-info extraction.',
      'Built and maintain the voice-agent layer (speech-to-text, text-to-speech, turn handling) of a production AI receptionist.',
      'Built evaluation pipelines that track hallucination rate, accuracy, cost and latency for chatbot and RAG releases.',
    ],
  },
  { org: 'Peace Nepal Dot Com', role: 'AI/ML Engineer', period: 'Jul – Nov 2024', points: ['Chatbots for banking, travel and customer support, using RAG and multi-agent frameworks.'] },
  { org: 'Icebrkr AI Solutions', role: 'AI/ML Engineer', period: 'Mar – Jun 2024', points: ['Built, optimised and deployed ML models for analysis and automation on cloud infrastructure.'] },
  { org: 'University of Exeter', role: 'MSc Data Science, Merit', period: '2022 – 2023', points: ['Thesis: machine learning on the Steam video game database.'] },
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
