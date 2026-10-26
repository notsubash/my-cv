import { translations } from './i18n'

export type OssRepo = {
  name: string
  description: string
  language: string
  stars: number
}

export type OssContribution = {
  repo: string
  number: number
  title: string
  related?: number
}

export const ossRepos = translations.en.openSource.repos as readonly OssRepo[]

/** Newest first, as ordered in translations. */
export const ossContributions = translations.en.openSource.contributions as readonly OssContribution[]

/** Splits a conventional-commit title ("fix(index): ...") into its type, scope and a capitalized summary. */
export function parseTitle(title: string) {
  const match = /^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)$/.exec(title)
  if (!match) return { type: null, scope: null, summary: title }
  const summary = match[3].charAt(0).toUpperCase() + match[3].slice(1)
  return { type: match[1], scope: match[2] ?? null, summary }
}

export function prUrl(repo: string, number: number) {
  return `https://github.com/${repo}/pull/${number}`
}

export function formatStars(stars: number) {
  return stars >= 1000 ? `${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(stars)
}
