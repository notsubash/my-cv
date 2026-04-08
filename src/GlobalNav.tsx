import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, House, ChevronRight } from 'lucide-react'
import { getPageTitles } from './articles/registry'

const PAGE_TITLE = getPageTitles()

function useTheme() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    if (localStorage.getItem('theme')) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
      document.documentElement.classList.toggle('dark', e.matches)
      document.documentElement.classList.toggle('light', !e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    document.documentElement.style.setProperty('--theme-transition', 'none')
    document.querySelectorAll('*').forEach(el => {
      (el as HTMLElement).style.transition = 'none'
    })

    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.style.removeProperty('--theme-transition')
        document.querySelectorAll('*').forEach(el => {
          (el as HTMLElement).style.transition = ''
        })
      })
    })
  }, [isDark])

  return { isDark, toggleTheme }
}

function ThemeToggle({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
    </button>
  )
}

export default function GlobalNav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const { isDark, toggleTheme } = useTheme()
  const pageTitle = PAGE_TITLE[pathname] ?? null

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  const barShown = useRef(false)
  const hasBar = !isHome
  const animateBar = hasBar && !barShown.current
  if (hasBar) barShown.current = true

  const backLinkShown = useRef(false)
  const animateBackLink = !isHome && !backLinkShown.current
  if (!isHome) backLinkShown.current = true

  const fade = (duration: string) => ({ animation: `nav-fade-in ${duration} ease-out` })

  if (hasBar) {
    return (
      <nav className="sticky top-0 z-50 relative">
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border"
          style={animateBar ? fade('0.35s') : undefined}
        />
        <div className="relative pt-4 pb-3 px-6 pl-14 xl:pl-6 flex items-center justify-between">
          <div className="min-w-0 flex items-center">
            <nav
              aria-label="Breadcrumb"
              className="inline-flex items-center gap-1.5 text-sm"
              style={animateBackLink ? fade('0.4s') : undefined}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <House className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              {pageTitle && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-foreground font-medium hover:text-foreground transition-colors cursor-pointer truncate"
                  >
                    {pageTitle}
                  </button>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          </div>
        </div>
      </nav>
    )
  }

  if (!hydrated) return null

  return (
    <div className="fixed top-4 right-6 z-50 flex items-center gap-3">
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  )
}
