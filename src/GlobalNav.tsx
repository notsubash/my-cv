import { useState, useEffect, useCallback } from 'react'
import { Sun, Moon, ChevronUp } from 'lucide-react'

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
  'min-h-11 min-w-11 w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center hover:border-foreground/40 transition-colors'

function ThemeToggle({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={navIconBtn}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      <Sun className="w-5 h-5 text-foreground hidden [.dark_&]:block" aria-hidden="true" />
      <Moon className="w-5 h-5 text-foreground [.dark_&]:hidden" aria-hidden="true" />
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
      <ChevronUp className="w-5 h-5 text-foreground" aria-hidden="true" />
    </button>
  )
}

export default function GlobalNav() {
  // Every page now carries SiteHeader; GlobalNav is only the floating theme toggle + back-to-top.
  const { isDark, toggleTheme } = useTheme()

  // Both icons stay in the tree; CSS follows html.dark so the first paint
  // matches the blocking theme script (no wrong-icon flash on takeover).
  return (
    <div className="fixed top-[max(1rem,env(safe-area-inset-top))] right-[max(1.5rem,env(safe-area-inset-right))] z-50 flex items-center gap-3">
      <BackToTop />
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  )
}
