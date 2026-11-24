// Projects page catalogue beyond "Selected work". Pulled from github.com/notsubash
// (public, non-fork repos, Nov 2026). Descriptions follow each repo's own README or
// description; anything without one is described by what the repo contains, nothing more.

export type RepoLink = { label: string; href: string; internal?: boolean }

export type Repo = {
  name: string
  title: string
  description: string
  language: string
  year: number
  /** Extra destinations besides the code: live app, write-up, case study, paper. */
  links?: readonly RepoLink[]
}

const gh = (name: string) => `https://github.com/notsubash/${name}`
export const repoUrl = (r: Repo) => gh(r.name)

/** Smaller builds worth a look that aren't flagship case studies. */
export const moreWork: readonly Repo[] = [
  {
    name: 'PageAnchor',
    title: 'PageAnchor',
    description: 'Document Q&A where every answer cites a verifiable region on the page, or refuses. Hybrid retrieval and quote verification behind a CLI, API, MCP server and a Next.js citation overlay.',
    language: 'Python',
    year: 2026,
  },
  {
    name: 'my-cv',
    title: 'This site',
    description: 'React and Vite, prerendered at build, with its own accessibility, analytics and layout audit scripts.',
    language: 'TypeScript',
    year: 2026,
    links: [{ label: 'Live', href: 'https://www.subash-pandey.com' }],
  },
  {
    name: 'Game-Genre-Network-Analysis',
    title: 'Steam genre networks',
    description: 'MSc thesis. Network analysis of Steam genres over time: 27,075 games mapped into 8 genre communities, with centrality and the emergence of sub-genres.',
    language: 'Notebook',
    year: 2023,
    links: [
      { label: 'Write-up', href: '/blog/steam-genre-networks', internal: true },
      { label: 'Zenodo', href: 'https://zenodo.org/records/17621070' },
    ],
  },
  {
    name: 'WikiVoteNetworkAnalysis',
    title: 'Wikipedia voting network',
    description: 'Network analysis of Wikipedia admin elections: centrality, community detection and clustering on 7,115 users and 100,762 votes.',
    language: 'Notebook',
    year: 2024,
    links: [{ label: 'Case study', href: '/projects/wikipedia-voting', internal: true }],
  },
  {
    name: 'Floki-eCommerce',
    title: 'Floki',
    description: 'A full-stack MERN storefront: search and reviews, JWT accounts, PayPal checkout, and an admin UI for products, users and orders.',
    language: 'JavaScript',
    year: 2021,
  },
  {
    name: 'muse_pytorch',
    title: 'MUSE in PyTorch',
    description: 'An implementation of MUSE in PyTorch.',
    language: 'Python',
    year: 2024,
  },
  {
    name: 'ML-DL-implementations',
    title: 'ML and DL from scratch',
    description: 'Machine learning and deep learning algorithms implemented by hand, plus small projects built on them.',
    language: 'Notebook',
    year: 2024,
    links: [{ label: 'Write-up', href: '/blog/ml-from-scratch', internal: true }],
  },
]

/** Learning logs: kept public because the progress is the point. */
export const practice: readonly Repo[] = [
  { name: 'exercism', title: 'Exercism', description: 'Daily exercises across programming languages.', language: 'C++', year: 2026 },
  { name: 'my-go-learning', title: 'Learning Go', description: 'Go from fundamentals to design patterns.', language: 'Go', year: 2026 },
  { name: 'Pytorch-course', title: 'PyTorch course', description: 'PyTorch fundamentals, implemented as I learned them.', language: 'Python', year: 2024, links: [{ label: 'Write-up', href: '/blog/ml-from-scratch', internal: true }] },
  { name: 'My-Python-Learning', title: 'Advanced Python', description: 'Notes and exercises in advanced Python.', language: 'Python', year: 2024 },
]

/** Older or one-off work, newest first. */
export const archive: readonly Repo[] = [
  { name: 'ai-talk-prime-ICT-v8', title: 'AI in Nepal, the talk', description: 'Slides for my talk at Prime College: where AI in Nepal stands today and where it is headed.', language: 'Slides', year: 2026 },
  { name: 'stock-variables', title: 'Stock variables', description: 'A notebook exploring stock market variables.', language: 'Notebook', year: 2024 },
]
