import { useState, useEffect, useCallback, type RefObject } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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

  const h2Items = items.filter(i => i.level === 2)
  const activeH2Idx = (() => {
    const idx = h2Items.findIndex(i => i.id === activeId)
    if (idx >= 0) return idx
    const activeItem = items.find(i => i.id === activeId)
    if (activeItem?.level === 3) {
      const pos = items.indexOf(activeItem)
      for (let i = pos - 1; i >= 0; i--) {
        if (items[i].level === 2) return h2Items.indexOf(items[i])
      }
    }
    return -1
  })()

  const lastH2Idx = h2Items.length - 1
  const progressFrac = activeH2Idx >= 0 && lastH2Idx > 0 ? activeH2Idx / lastH2Idx : 0

  const tocNav = (
    <nav aria-label="Article table of contents" className="relative">
      <div className="absolute left-[5.5px] top-[14px] w-px bg-border" style={{ height: 'calc(100% - 28px)' }} />
      <motion.div
        className="absolute left-[5.5px] top-[14px] w-px bg-primary origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progressFrac }}
        style={{ height: 'calc(100% - 28px)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      <ul className="relative space-y-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id
          const isH3 = item.level === 3

          const activeItemIdx = items.findIndex(i => i.id === activeId)
          const thisIdx = items.indexOf(item)
          const isPast = activeItemIdx >= 0 && thisIdx <= activeItemIdx

          return (
            <li key={item.id} className={`flex items-center gap-3 ${isH3 ? 'ml-4' : ''}`}>
              {!isH3 && (
                <motion.span
                  className={`relative z-10 w-3 h-3 rounded-full border-2 shrink-0 transition-colors duration-300 ${
                    isActive ? 'border-primary bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]'
                    : isPast ? 'border-primary/50 bg-card'
                    : 'border-border bg-card'
                  }`}
                  animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              {isH3 && (
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                  isActive ? 'bg-primary' : isPast ? 'bg-primary/40' : 'bg-border'
                }`} />
              )}
              <button
                onClick={() => scrollTo(item.id)}
                className={`text-left tracking-wide py-0.5 transition-all duration-300 ${
                  isH3 ? 'text-[11px]' : 'text-[12px]'
                } ${
                  isActive ? 'text-primary font-semibold translate-x-0.5'
                  : isPast ? 'text-foreground/70'
                  : 'text-muted-foreground/60 hover:text-foreground/80'
                }`}
              >
                {item.text}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop: sticky sidebar */}
          <motion.div
            initial={hasRevealed ? { opacity: 0, x: -12 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden xl:block fixed top-24 left-[max(1rem,calc(50%-42rem))] w-52 max-h-[calc(100vh-8rem)] overflow-y-auto z-30 custom-scrollbar"
          >
            <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-3">
              On this page
            </p>
            {tocNav}
          </motion.div>

          {/* Mobile / narrow desktop: floating button + drawer */}
          <motion.button
            initial={hasRevealed ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => setTocOpen(o => !o)}
            className="xl:hidden fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            aria-label="Toggle table of contents"
          >
            <List className="w-5 h-5" />
          </motion.button>
          {tocOpen && (
            <>
              <div className="xl:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={() => setTocOpen(false)} />
              <div
                className="xl:hidden fixed bottom-20 right-6 z-50 w-72 max-h-[70vh] overflow-y-auto bg-card border border-border rounded-xl shadow-xl p-4 custom-scrollbar"
              >
                <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-3">
                  On this page
                </p>
                {tocNav}
              </div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
