import { useEffect } from 'react'

export function useHomeSeo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', description)

    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  }, [title, description])
}
