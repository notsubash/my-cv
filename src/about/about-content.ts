// About page content. Facts come from the Nov 2026 CV and src/i18n.ts.
//
// ── Adding photos to the "On Instagram" grid ───────────────────────────────
// 1. Put the image in public/about/ (square-ish crops look best; ~1200px, .webp).
// 2. Add an entry below: { src: '/about/your-file.webp', alt: 'what is in the photo', href: 'https://www.instagram.com/p/…' }
//    `href` is optional; without it the tile opens the full-size image.
// 3. Set INSTAGRAM_URL to your profile so the "Follow" link appears.
// The grid shows up to 9 tiles; the four below are seeded from photos already on the site.

export const INSTAGRAM_URL = '' // e.g. 'https://www.instagram.com/your-handle/'

export type AboutPhoto = { src: string; alt: string; href?: string }

export const photos: AboutPhoto[] = [
  { src: '/graduation.webp', alt: 'Graduation day beside the University of Exeter plaque' },
  { src: '/prime-college-talk.webp', alt: 'Speaking at Prime College, Kathmandu, mid-talk' },
  { src: '/prime-college-group.webp', alt: 'With students at Prime College after the talk' },
  { src: '/personal-pic.webp', alt: 'At a cafe after getting soaked in the rain' },
]

export const skills = [
  { label: 'Platforms and frameworks', items: 'LangGraph, LangChain, FastAPI, PyTorch, scikit-learn, XGBoost, Qdrant, OpenSearch, Docker, Kubernetes, Helm, Argo CD, Terraform' },
  { label: 'Languages', items: 'Python, TypeScript, SQL' },
  { label: 'What I focus on', items: 'Retrieval (RAG), multi-agent systems, LLM evaluation, voice AI, MLOps' },
  { label: 'Education', items: 'MSc Data Science, University of Exeter (Merit) · BSc (Hons) Computing, London Metropolitan University (2:1)' },
]

export const recentWork = [
  { title: 'LastCall', note: 'holds scheduled social posts whose links went stale', href: 'https://lastcall.subash-pandey.com', external: true },
  { title: 'Gavel', note: 'a five-judge LLM panel that debates startup ideas', href: '/blog/building-an-idea-workbench' },
  { title: 'Craft', note: 'evaluated Claude Code skills, pinned and reviewed', href: 'https://github.com/notsubash/claude-skills', external: true },
]

export const workedWith = ['Scopic Software', 'Peace Nepal Dot Com', 'Icebrkr AI Solutions', 'Contentio Lab', 'iMark']
