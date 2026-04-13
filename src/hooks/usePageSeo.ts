import { useEffect, useCallback } from 'react'

const BASE_URL = 'https://subash-pandey.com'

const DEFAULTS = {
  title: 'Subash Pandey | AI/ML Engineer & GenAI Developer',
  description:
    'AI/ML Engineer from Nepal specializing in Generative AI and applied machine learning. Building meaningful AI solutions with RAG, LangGraph, and Python.',
  ogDescription:
    'AI/ML Engineer from Nepal building meaningful AI solutions with GenAI, RAG pipelines, and applied machine learning. Open to remote roles (APAC timezone).',
  twitterDescription:
    'AI/ML Engineer from Nepal specializing in Generative AI and applied machine learning. Building meaningful AI solutions with RAG, LangGraph, and Python.',
  ogImage: '/og-image.webp',
  ogType: 'website',
  robots: 'index, follow',
}

export interface PageSeoConfig {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
  ogImage?: string
  keywords?: string
  jsonLd?: Record<string, unknown>
  noindex?: boolean
}

function setMetaTag(
  attr: 'name' | 'property',
  key: string,
  content: string,
): HTMLMetaElement {
  let el = document.querySelector(
    `meta[${attr}="${key}"]`,
  ) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return el
}

export function usePageSeo(config: PageSeoConfig) {
  const apply = useCallback(() => {
    const fullUrl = `${BASE_URL}${config.path}`
    const imageUrl = `${BASE_URL}${config.ogImage ?? DEFAULTS.ogImage}`

    document.title = config.title

    setMetaTag('name', 'description', config.description)

    const canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null
    if (canonical) canonical.href = fullUrl

    setMetaTag('property', 'og:url', fullUrl)
    setMetaTag('property', 'og:type', config.ogType ?? 'website')
    setMetaTag('property', 'og:title', config.title)
    setMetaTag('property', 'og:description', config.description)
    setMetaTag('property', 'og:image', imageUrl)

    setMetaTag('name', 'twitter:title', config.title)
    setMetaTag('name', 'twitter:description', config.description)
    setMetaTag('name', 'twitter:image', imageUrl)

    if (config.keywords) {
      setMetaTag('name', 'keywords', config.keywords)
    }

    if (config.noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow')
    } else {
      setMetaTag('name', 'robots', 'index, follow')
    }

    let jsonLdNode: HTMLScriptElement | null = null
    if (config.jsonLd) {
      jsonLdNode = document.querySelector(
        'script[data-page-jsonld]',
      ) as HTMLScriptElement | null
      if (!jsonLdNode) {
        jsonLdNode = document.createElement('script')
        jsonLdNode.type = 'application/ld+json'
        jsonLdNode.setAttribute('data-page-jsonld', 'true')
        document.head.appendChild(jsonLdNode)
      }
      jsonLdNode.textContent = JSON.stringify(config.jsonLd)
    }

    return () => {
      document.title = DEFAULTS.title

      setMetaTag('name', 'description', DEFAULTS.description)

      if (canonical) canonical.href = `${BASE_URL}/`

      setMetaTag('property', 'og:url', `${BASE_URL}/`)
      setMetaTag('property', 'og:type', DEFAULTS.ogType)
      setMetaTag('property', 'og:title', DEFAULTS.title)
      setMetaTag('property', 'og:description', DEFAULTS.ogDescription)
      setMetaTag('property', 'og:image', `${BASE_URL}${DEFAULTS.ogImage}`)

      setMetaTag('name', 'twitter:title', DEFAULTS.title)
      setMetaTag(
        'name',
        'twitter:description',
        DEFAULTS.twitterDescription,
      )
      setMetaTag('name', 'twitter:image', `${BASE_URL}${DEFAULTS.ogImage}`)

      if (config.keywords) {
        const kw = document.querySelector(
          'meta[name="keywords"]',
        ) as HTMLMetaElement | null
        if (kw) kw.content = ''
      }

      if (config.noindex) {
        setMetaTag('name', 'robots', DEFAULTS.robots)
      }

      if (jsonLdNode) jsonLdNode.remove()
    }
  }, [
    config.title,
    config.description,
    config.path,
    config.ogType,
    config.ogImage,
    config.keywords,
    config.noindex,
    config.jsonLd,
  ])

  useEffect(apply, [apply])
}
