import { useRef, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { usePageSeo } from '../hooks/usePageSeo'
import posthog from '../posthog'
import { articleScrollPercent, captureOnce, newReadDepths } from '../analytics'

interface BlogSeoConfig {
  title: string
  description: string
  keywords: string
  ogImage: string
  datePublished: string
  /** Material revisions. Defaults to datePublished. */
  dateModified?: string
  slug: string
}

const WORDS_PER_MINUTE = 230

export function useReadingTime() {
  const articleRef = useRef<HTMLElement>(null)
  const readingTimeRef = useRef<HTMLSpanElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!articleRef.current || !readingTimeRef.current) return
    const text = articleRef.current.innerText || ''
    const words = text.split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
    readingTimeRef.current.textContent = `${minutes} min read`
  }, [])

  useEffect(() => {
    if (Reflect.get(window, '__PRERENDER__')) return
    const el = articleRef.current
    if (!el) return
    const slug = pathname.replace(/^\/blog\//, '')
    const fired: number[] = []
    const onScroll = () => {
      const articleTop = el.getBoundingClientRect().top + window.scrollY
      const percent = articleScrollPercent(articleTop, el.offsetHeight, window.scrollY, window.innerHeight)
      for (const depth of newReadDepths(percent, fired)) {
        fired.push(depth)
        captureOnce(sessionStorage, `ph:article_read_depth:${slug}:${depth}`, () => {
          posthog.capture('article_read_depth', { slug, depth })
        })
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const resizeObserver = new ResizeObserver(onScroll)
    resizeObserver.observe(el)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      resizeObserver.disconnect()
    }
  }, [pathname])

  return { articleRef, readingTimeRef }
}

export function useBlogSeo(config: BlogSeoConfig) {
  const dateModified = config.dateModified ?? config.datePublished
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: config.title,
      description: config.description,
      image: `https://www.subash-pandey.com${config.ogImage}`,
      datePublished: config.datePublished,
      dateModified,
      author: {
        '@type': 'Person',
        name: 'Subash Pandey',
        url: 'https://www.subash-pandey.com',
      },
      publisher: {
        '@type': 'Person',
        name: 'Subash Pandey',
        url: 'https://www.subash-pandey.com',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.subash-pandey.com/blog/${config.slug}`,
      },
    }),
    [config.title, config.description, config.ogImage, config.datePublished, dateModified, config.slug],
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
