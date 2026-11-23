import { useState, useEffect, useCallback, type RefObject } from 'react'
import { List } from 'lucide-react'

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

function useTocItems(articleRef: RefObject<HTMLElement | null>) {
  const [items, setItems] = useState<TocItem[]>([])

  useEffect(() => {
    if (!articleRef.current) return
    const headings = articleRef.current.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]')
    const result: TocItem[] = []
    headings.forEach(h => {
      const level = h.tagName === 'H2' ? 2 : 3
      result.push({ id: h.id, text: h.textContent?.trim() ?? '', level })
    })
    setItems(result)
  }, [articleRef])

  return items
}

export default function BlogToc({ articleRef }: { articleRef: RefObject<HTMLElement | null> }) {
  const items = useTocItems(articleRef)
  const [visible, setVisible] = useState(false)
  const [hasRevealed, setHasRevealed] = useState(false)
  const [activeId, setActiveId] = useState('')
  const [tocOpen, setTocOpen] = useState(false)

  useEffect(() => {
    if (items.length === 0) return
    const check = () => {
      const first = document.getElementById(items[0].id)
      if (!first) return
      const show = first.getBoundingClientRect().top <= 120
      setVisible(show)
      if (show && !hasRevealed) setHasRevealed(true)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [items, hasRevealed])

  useEffect(() => {
    if (!hasRevealed || items.length === 0) return
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50
      if (atBottom) {
        setActiveId(items[items.length - 1].id)
        return
      }
      const threshold = window.innerHeight * 0.35
      let current = ''
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= threshold) current = item.id
      }
      if (current) setActiveId(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [hasRevealed, items])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setTocOpen(false)
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    requestAnimationFrame(() => { window.scrollTo({ top, behavior: 'instant' }) })
  }, [])

  if (items.length === 0) return null


  const tocNav = (
    <nav aria-label="Article table of contents">
      <ul className="toc-list">
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <li key={item.id} className={item.level === 3 ? 'toc-sub' : undefined}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                aria-current={isActive ? 'true' : undefined}
                className="toc-item"
              >
                {item.text}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  // CSS, not Motion: hidden state is visibility:hidden, so nothing half-faded lingers,
  // and the exit (140ms) is quicker than the entrance (220ms).
  const hidden = !visible
  return (
    <>
      {/* Desktop: sticky sidebar */}
      <div
        data-visible={visible || undefined}
        aria-hidden={hidden || undefined}
        className="toc-rail hidden xl:block fixed top-24 left-[max(1rem,calc(50%-42rem))] w-52 max-h-[calc(100vh-8rem)] overflow-y-auto z-30 custom-scrollbar"
      >
        <p className="toc-label">On this page</p>
        {tocNav}
      </div>

      {/* Mobile / narrow desktop: floating button + drawer */}
      <button
        type="button"
        data-visible={visible || undefined}
        aria-hidden={hidden || undefined}
        tabIndex={hidden ? -1 : undefined}
        onClick={() => setTocOpen(o => !o)}
        className="toc-fab xl:hidden fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-40 min-h-11 min-w-11 w-11 h-11 rounded-full bg-card text-foreground border border-border shadow-[var(--shadow-pop)] flex items-center justify-center"
        aria-label="Toggle table of contents"
        aria-expanded={tocOpen}
      >
        <List className="w-5 h-5" aria-hidden="true" />
      </button>
      {visible && tocOpen && (
        <>
          <div className="xl:hidden fixed inset-0 bg-background/60 z-40" onClick={() => setTocOpen(false)} />
          <div className="xl:hidden fixed inset-x-4 bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4.5rem))] z-50 max-h-[70vh] overflow-y-auto bg-card border border-border rounded-xl shadow-[var(--shadow-pop)] p-4 custom-scrollbar sm:inset-x-auto sm:right-6 sm:left-auto sm:w-72">
            <p className="toc-label">On this page</p>
            {tocNav}
          </div>
        </>
      )}
    </>
  )
}
