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
    id: 'activity-recognition',
    slugs: { en: 'projects/activity-recognition' },
    titles: { en: 'Activity Recognition with XGBoost' },
    seo: {
      en: {
        title: 'Activity Recognition — Case Study | Subash Pandey',
        description:
          'XGBoost-based human activity recognition from wearable sensor data. 19 activity classes, 85.6% accuracy, hyperparameter tuning via random search.',
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
    '/blog': '/blog',
    '/blog/rag-pipeline': '/blog/rag-pipeline',
    '/blog/audio-feature-extraction': '/blog/audio-feature-extraction',
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
    '/blog': 'Blog',
    '/blog/rag-pipeline': 'Building a Production RAG Pipeline',
    '/blog/audio-feature-extraction': 'Audio Feature Extraction for AI',
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
