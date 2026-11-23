// Content for the /lab design prototypes. Every claim and number is lifted from
// existing copy (src/i18n.ts) or the case-study metric tiles (src/articles/*).
// Nothing here is invented; gaps are marked `null` and called out in the plan.

export type Work = {
  slug: string
  title: string
  kind: string
  problem: string
  built: string
  result: { value: string; label: string } | null
  resultNote?: string
  href: string
  hrefLabel: 'Case study' | 'Write-up' | 'Series'
  repo?: string
  image: string
  year: string
}

export const identity = {
  name: 'Subash Pandey',
  role: 'AI/ML Engineer',
  employer: 'Scopic Software',
  since: 'Oct 2024',
  location: 'Kathmandu · Remote, APAC time zone',
  status: 'Interviewing for remote AI/ML engineering roles',
  email: 'axlesubash111@gmail.com',
  github: 'https://github.com/notsubash',
  linkedin: 'https://www.linkedin.com/in/subash-pandey-ai',
}

/** Production work at Scopic. No public metrics exist yet (see plan §content gaps). */
export const production = [
  { title: 'GenAI chatbot', detail: 'LangGraph + RAG over Qdrant, wired into a CRM for intent detection, user-info extraction and contextual replies.' },
  { title: 'Voice agent layer', detail: 'Speech-to-text, text-to-speech and turn orchestration inside a legacy AI receptionist, in production.' },
  { title: 'LLM evaluation pipelines', detail: 'Hallucination rate, answer accuracy, cost and latency for chatbot and RAG releases.' },
]

export const work: Work[] = [
  {
    slug: 'gavel',
    title: 'Gavel',
    kind: 'Multi-agent LLM systems',
    problem: 'Long judge pipelines on local 9B models stall mid-run, and scores drift between worksheet versions.',
    built: 'A FastAPI run engine streaming over SSE with a durable SQLite event log, five parallel judges and a fixed LangGraph debate behind readiness gates.',
    result: { value: '389', label: 'unit tests across 3 eval tiers' },
    resultNote: '5 parallel judges · 19 SSE event types',
    href: '/projects/gavel',
    hrefLabel: 'Case study',
    repo: 'https://github.com/notsubash/gavel',
    image: '/projects/gavel.webp',
    year: '2026',
  },
  {
    slug: 'activity-recognition',
    title: 'Activity Recognition',
    kind: 'Evaluation / leakage',
    problem: 'Human-activity models reported on random splits look far better than they generalise to new people.',
    built: 'A subject-independent 18-class pipeline on WISDM (51 subjects) with GroupKFold, XGBoost, ONNX export and a CPU FastAPI endpoint.',
    result: { value: '0.89 → 0.29', label: 'macro-F1 once subject leakage is removed' },
    resultNote: 'Watch statistical XGBoost holds 0.70',
    href: '/projects/activity-recognition',
    hrefLabel: 'Case study',
    repo: 'https://github.com/notsubash/Activity-Recognition',
    image: '/projects/activity-recognition.webp',
    year: '2026',
  },
  {
    slug: 'cloud-native-ai-platform',
    title: 'Cloud Native AI Platform',
    kind: 'MLOps / platform',
    problem: 'Run a production-shaped AI service, with GitOps and observability, on a hobby budget.',
    built: 'FastAPI on Kubernetes via Helm, Terraform on Hetzner, Argo CD GitOps, Prometheus, Grafana and Loki.',
    result: { value: '< $15', label: 'per month, fully observable' },
    href: '/blog/building-a-cloud-native-ai-platform',
    hrefLabel: 'Write-up',
    repo: 'https://github.com/notsubash/cloud-native-AI-platform',
    image: '/projects/cloud-native-ai-platform.webp',
    year: '2026',
  },
  {
    slug: 'latent-parking',
    title: 'Latent Parking',
    kind: 'World models / control',
    problem: 'Can a planner tell when its learned world model is lying to it?',
    built: 'A CEM planner, a JEPA latent dynamics model, latent MPC and three distrust signals on highway-env parking.',
    result: { value: '0 / 6', label: 'seeds parked by learned latent MPC' },
    resultNote: 'A documented negative result: distrust signals sit at chance',
    href: '/blog/when-a-self-parking-car-cannot-trust-its-imagination',
    hrefLabel: 'Write-up',
    repo: 'https://github.com/notsubash/latent-parking',
    image: '/projects/latent-parking.webp',
    year: '2026',
  },
  {
    slug: 'steam-ml',
    title: 'Steam Genre Networks',
    kind: 'Network analysis',
    problem: 'How do game genres evolve, and what actually drives player engagement?',
    built: 'A genre co-occurrence network (NetworkX, Gephi) with community detection and engagement regressions.',
    result: { value: '27,075', label: 'games analysed · 8 genre communities' },
    resultNote: 'Paper on Zenodo',
    href: '/projects/steam-ml',
    hrefLabel: 'Case study',
    repo: 'https://github.com/notsubash/Game-Genre-Network-Analysis',
    image: '/projects/steam-ml.webp',
    year: '2025',
  },
  {
    slug: 'the-underlying-curve',
    title: 'The Underlying Curve',
    kind: 'Visual explainers',
    problem: 'ML ideas are usually explained with walls of notation.',
    built: 'Mute, one-object visual explainers rendered in Manim, encoded and cropped per platform with FFmpeg.',
    result: null,
    resultNote: 'Ongoing Instagram series',
    href: '/projects/the-underlying-curve',
    hrefLabel: 'Series',
    image: '/projects/the-underlying-curve.webp',
    year: '2026',
  },
]

export const proof = {
  quote: 'He helped my team and me navigate our initial AI strategy, clarify our approach, and identify the right areas to prioritize.',
  author: 'Akash Raghuvanshi',
  role: 'AI Product Leader',
  source: 'LinkedIn recommendation',
}

export const writing = [
  { title: 'Teaching a Car to Park by Imagining the Future, and Learning When Not to Trust It', href: '/blog/when-a-self-parking-car-cannot-trust-its-imagination', date: 'Aug 2026' },
  { title: 'Rebuilding WISDM HAR after a leaky 0.89', href: '/blog/activity-recognition-pipeline', date: 'Aug 2026' },
  { title: 'Building a Cloud Native AI Platform Under $15 a Month', href: '/blog/building-a-cloud-native-ai-platform', date: 'Aug 2026' },
  { title: 'Building Gavel: Turning AI Opinions Into Experiments', href: '/blog/building-an-idea-workbench', date: 'Jul 2026' },
]
