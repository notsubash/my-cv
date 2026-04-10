import { useRef, useEffect, useMemo } from 'react'
import { usePageSeo } from '../hooks/usePageSeo'

interface BlogSeoConfig {
  title: string
  description: string
  keywords: string
  ogImage: string
  datePublished: string
  slug: string
}

const WORDS_PER_MINUTE = 230

export function useReadingTime() {
  const articleRef = useRef<HTMLElement>(null)
  const readingTimeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!articleRef.current || !readingTimeRef.current) return
    const text = articleRef.current.innerText || ''
    const words = text.split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
    readingTimeRef.current.textContent = `${minutes} min read`
  }, [])

  return { articleRef, readingTimeRef }
}

export function useBlogSeo(config: BlogSeoConfig) {
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: config.title,
      description: config.description,
      image: `https://subash-pandey.com${config.ogImage}`,
      datePublished: config.datePublished,
      dateModified: config.datePublished,
      author: {
        '@type': 'Person',
        name: 'Subash Pandey',
        url: 'https://subash-pandey.com',
      },
      publisher: {
        '@type': 'Person',
        name: 'Subash Pandey',
        url: 'https://subash-pandey.com',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://subash-pandey.com/blog/${config.slug}`,
      },
    }),
    [config.title, config.description, config.ogImage, config.datePublished, config.slug],
  )

  usePageSeo({
    title: `${config.title} | Subash Pandey`,
    description: config.description,
    path: `/blog/${config.slug}`,
    ogType: 'article',
    ogImage: config.ogImage,
    keywords: config.keywords,
    jsonLd,
  })
}
