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

export const articleRegistry: ArticleConfig[] = []

export function getAltPaths(): Record<string, string> {
  return {
    '/': '/',
    '/about': '/about',
    '/privacy': '/privacy',
  }
}

export function getPageTitles(): Record<string, string> {
  return {
    '/': "Subash Pandey's Portfolio",
    '/about': 'About',
  }
}

export function getSectionLabels(): Record<string, Record<string, string>> {
  return {}
}

export function getEsSlugs(): Set<string> {
  return new Set<string>()
}
