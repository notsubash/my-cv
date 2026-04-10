import { useEffect, useRef, useCallback } from 'react'

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
  const setMeta = useCallback(() => {
    document.title = `${config.title} | Subash Pandey`

    const desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (desc) desc.content = config.description

    let keywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
    if (!keywords) { keywords = document.createElement('meta'); keywords.name = 'keywords'; document.head.appendChild(keywords) }
    keywords.content = config.keywords

    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null
    if (ogTitle) ogTitle.setAttribute('content', config.title)
    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null
    if (ogDesc) ogDesc.setAttribute('content', config.description)

    const ogImg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null
    if (ogImg) ogImg.setAttribute('content', `https://subash-pandey.com${config.ogImage}`)

    let jsonLd = document.querySelector('script[data-blog-jsonld]') as HTMLScriptElement | null
    if (!jsonLd) {
      jsonLd = document.createElement('script')
      jsonLd.type = 'application/ld+json'
      jsonLd.setAttribute('data-blog-jsonld', 'true')
      document.head.appendChild(jsonLd)
    }
    jsonLd.textContent = JSON.stringify({
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
    })

    return () => {
      if (keywords) keywords.content = ''
      if (ogImg) ogImg.setAttribute('content', 'https://subash-pandey.com/og-image.webp')
      if (jsonLd) jsonLd.remove()
    }
  }, [config.title, config.description, config.keywords, config.ogImage, config.datePublished, config.slug])

  useEffect(setMeta, [setMeta])
}
