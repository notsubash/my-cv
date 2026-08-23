import type { ComponentType } from 'react'

export interface ArticleSeo {
  title: string
  description: string
}

export interface ArticleConfig {
  id: string
  slugs: { en: string }
  titles: { en: string }
  seo: { en: ArticleSeo }
  sectionLabels: { en: Record<string, string> }
  type: 'collab' | 'case-study' | 'bridge'
  ogImage?: string
  component: () => Promise<{ default: ComponentType<Record<string, never>> }>
}

export const articleRegistry: ArticleConfig[] = [
  {
    id: 'gavel',
    slugs: { en: 'projects/gavel' },
    titles: { en: 'Gavel: Durable Multi-Agent Pipeline Engineering' },
    seo: {
      en: {
        title: 'Gavel Multi-Agent Pipeline — Case Study | Subash Pandey',
        description:
          'Technical case study of Gavel: FastAPI RunManager with SQLite event log, LangGraph debate and re-vote, panel quality gates for local LLMs, and a three-tier eval pyramid.',
      },
    },
    sectionLabels: { en: {} },
    type: 'case-study',
    component: () => import('./gavel'),
  },
  {
    id: 'activity-recognition',
    slugs: { en: 'projects/activity-recognition' },
    titles: { en: 'Subject-independent HAR on WISDM' },
    seo: {
      en: {
        title: 'WISDM HAR: Subject-Independent Case Study | Subash Pandey',
        description:
          'Subject-independent WISDM HAR with GroupKFold XGBoost. Same 5 s phone flatten: 0.8925 leaky macro-F1 vs 0.2924 grouped. Watch statistical model 0.7031. CPU FastAPI for one 5 s window.',
      },
    },
    sectionLabels: { en: {} },
    type: 'case-study',
    component: () => import('./activity-recognition'),
  },
  {
    id: 'steam-ml',
    slugs: { en: 'projects/steam-ml' },
    titles: { en: 'Machine Learning the Steam Video Games Database' },
    seo: {
      en: {
        title: 'Steam Video Games ML — Case Study | Subash Pandey',
        description:
          'Network analysis + machine learning on the Steam Video Game Database. Bipartite genre networks, community detection, and regression to predict average playtime.',
      },
    },
    sectionLabels: { en: {} },
    type: 'case-study',
    component: () => import('./steam-ml'),
  },
  {
    id: 'wikipedia-voting',
    slugs: { en: 'projects/wikipedia-voting' },
    titles: { en: 'Wikipedia Administrator Voting Network Analysis' },
    seo: {
      en: {
        title: 'Wikipedia Voting Network — Case Study | Subash Pandey',
        description:
          'Network science analysis of the Wikipedia Administrator voting network. Centrality measures, Louvain community detection, and clustering effects on 7,115 users and 100,762 votes.',
      },
    },
    sectionLabels: { en: {} },
    type: 'case-study',
    component: () => import('./wikipedia-voting'),
  },
]

export function getAltPaths(): Record<string, string> {
  const paths: Record<string, string> = {
    '/': '/',
    '/about': '/about',
    '/notes': '/notes',
    '/blog': '/blog',
    '/blog/rag-pipeline': '/blog/rag-pipeline',
    '/blog/steam-genre-networks': '/blog/steam-genre-networks',
    '/blog/ml-from-scratch': '/blog/ml-from-scratch',
    '/blog/activity-recognition-pipeline': '/blog/activity-recognition-pipeline',
    '/blog/building-an-idea-workbench': '/blog/building-an-idea-workbench',
    '/blog/building-a-cloud-native-ai-platform': '/blog/building-a-cloud-native-ai-platform',
    '/privacy': '/privacy',
  }
  for (const article of articleRegistry) {
    const slug = article.slugs.en
    paths[`/${slug}`] = `/${slug}`
  }
  return paths
}

export function getPageTitles(): Record<string, string> {
  const titles: Record<string, string> = {
    '/': "Subash Pandey's Portfolio",
    '/about': 'About',
    '/notes': 'Technical Notes',
    '/blog': 'Blog',
    '/privacy': 'Privacy',
    '/blog/rag-pipeline': 'Building a Production RAG Pipeline',
    '/blog/steam-genre-networks': 'What 27,000 Steam Games Reveal About Genre Evolution',
    '/blog/ml-from-scratch': 'Learning ML and Deep Learning by Building Everything Twice',
    '/blog/activity-recognition-pipeline': 'Rebuilding WISDM HAR after a leaky 0.89',
    '/blog/building-an-idea-workbench': 'Building Gavel: Turning AI Opinions Into Experiments',
    '/blog/building-a-cloud-native-ai-platform': 'Building a Cloud Native AI Platform Under $15 a Month',
  }
  for (const article of articleRegistry) {
    titles[`/${article.slugs.en}`] = article.titles.en
  }
  return titles
}

export function getSectionLabels(): Record<string, Record<string, string>> {
  return {}
}

export function getEsSlugs(): Set<string> {
  return new Set<string>()
}
