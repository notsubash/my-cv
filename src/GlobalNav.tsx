import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, House, ChevronRight, ChevronUp } from 'lucide-react'
import { getPageTitles } from './articles/registry'

const PAGE_TITLE = getPageTitles()

function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

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
    const root = document.documentElement
    root.classList.add('theme-switching')

    const next = !isDark
    setIsDark(next)
    root.classList.toggle('dark', next)
    root.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('theme-switching')
      })
    })
  }, [isDark])

  return { isDark, toggleTheme }
}

const navIconBtn =
  'min-h-11 min-w-11 w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors'

function ThemeToggle({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={navIconBtn}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      <Sun className="w-5 h-5 text-primary hidden [.dark_&]:block" aria-hidden="true" />
      <Moon className="w-5 h-5 text-primary [.dark_&]:hidden" aria-hidden="true" />
    </button>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => setShow(window.scrollY > 240)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  if (!show) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={navIconBtn}
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5 text-primary" aria-hidden="true" />
    </button>
  )
}

export default function GlobalNav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isBlogPost = pathname.startsWith('/blog/')
  const { isDark, toggleTheme } = useTheme()
  const pageTitle = PAGE_TITLE[pathname] ?? null

  if (!isHome) {
    return (
      <div className="sticky top-0 z-50 relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border" />
        <div className="relative flex items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:px-6">
          <div className="min-w-0 flex items-center">
            <nav
              aria-label="Breadcrumb"
              className="inline-flex min-w-0 items-center gap-1.5 text-sm"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 min-h-11 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <House className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              {isBlogPost && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  <Link
                    to="/blog"
                    className="inline-flex items-center min-h-11 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    Blog
                  </Link>
                </>
              )}
              {pageTitle && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="min-w-0 truncate text-foreground font-medium hover:text-foreground transition-colors cursor-pointer min-h-11"
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
      </div>
    )
  }

  // Both icons stay in the tree; CSS follows html.dark so the first paint
  // matches the blocking theme script (no wrong-icon flash on takeover).
  return (
    <div className="fixed top-[max(1rem,env(safe-area-inset-top))] right-[max(1.5rem,env(safe-area-inset-right))] z-50 flex items-center gap-3">
      <BackToTop />
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  )
}
