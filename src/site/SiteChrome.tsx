import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CalBookButton } from '../CalBookButton'
import posthog from '../posthog'
import { BLOG_ENABLED } from '../config'
import { person } from '../home/home-content'
import './site.css'

const NAV = [
  { to: '/projects', match: (p: string) => p.startsWith('/projects'), label: 'Projects' },
  { to: '/cv', match: (p: string) => p === '/cv', label: 'Experience' },
  ...(BLOG_ENABLED ? [{ to: '/blog', match: (p: string) => p.startsWith('/blog') || p === '/notes', label: 'Blog' }] : []),
  { to: '/about', match: (p: string) => p === '/about', label: 'About' },
]

/** The name as a logo: weight contrast plus an accent full stop that turns on hover. */
export function Wordmark({ current = false }: { current?: boolean }) {
  return (
    <Link to="/" className="wordmark" aria-label={`${person.name}, home`} aria-current={current ? 'page' : undefined}>
      <span className="wordmark-first" aria-hidden="true">subash</span>
      <span className="wordmark-last" aria-hidden="true">pandey</span>
      <span className="wordmark-dot" aria-hidden="true" />
    </Link>
  )
}

/** Download link for the hosted PDF CV; every placement is tracked. */
export function CvDownload({ placement, className = 'link', children = 'Download CV' }: { placement: string; className?: string; children?: ReactNode }) {
  return (
    <a className={className} href={person.cv} download onClick={() => posthog.capture('cv_downloaded', { placement })}>
      {children}
    </a>
  )
}

/** Footer question shared by home and inner pages. */
export const FOOTER_LINE = 'Hiring for an ML or AI engineering role, or building something? I’d like to hear about it.'

export type ContactPlacement = 'hero' | 'nav' | 'footer' | 'case_study' | 'article' | 'cv' | 'about'

/** The site's main call to action: a low-stakes "let's talk" that leads to the contact page (message or booking). */
export function ContactCta({ placement, className, children }: { placement: ContactPlacement; className: string; children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <Link to="/contact" className={className} aria-current={pathname === '/contact' ? 'page' : undefined}
      onClick={() => posthog.capture('contact_cta_clicked', { placement })}>
      {children}
    </Link>
  )
}

/** One header for every page: who, where to go, and the booking action. */
export function SiteHeader({ width = 'col' }: { width?: 'col' | 'wide' }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  return (
    <header className={`site-bar site-bar--${width}`}>
      <Wordmark current={isHome} />
      <nav aria-label="Primary" className="site-nav">
        {NAV.map((n) => {
          const href = isHome && n.to.startsWith('/#') ? n.to.slice(1) : n.to
          const current = n.match(pathname)
          return href.startsWith('#')
            ? <a key={n.label} href={href}>{n.label}</a>
            : <Link key={n.label} to={href} aria-current={current ? 'page' : undefined}>{n.label}</Link>
        })}
      </nav>
      <ContactCta placement="nav" className="btn btn--small site-bar-cta">Let’s talk</ContactCta>
    </header>
  )
}

/** Closing block for inner pages: the booking question, then the quiet links. */
export function SiteFooter({ placement, width = 'col' }: { placement: 'case_study' | 'article' | 'cv' | 'about' | 'footer'; width?: 'col' | 'wide' }) {
  return (
    <footer className={`site-foot site-foot--${width}`} aria-labelledby="site-foot-h">
      <h2 id="site-foot-h" className="site-foot-line">{FOOTER_LINE}</h2>
      <div className="site-foot-cta">
        <ContactCta placement={placement} className="btn btn--primary">Let’s talk</ContactCta>
        <CalBookButton placement={placement} className="link">Or book a call</CalBookButton>
        <a className="link" href={`mailto:${person.email}`} onClick={() => posthog.capture('contact_email_clicked', { placement })}>{person.email}</a>
      </div>
      <SiteLinks />
    </footer>
  )
}

export function SiteLinks() {
  return (
    <p className="site-links">
      <a className="link" href={person.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('outbound_link_clicked', { destination: 'linkedin', placement: 'footer' })}>LinkedIn</a>
      <a className="link" href={person.github} target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'footer' })}>GitHub</a>
      <Link className="link" to="/contact">Contact</Link>
      <Link className="link" to="/open-source">Open source</Link>
      <Link className="link" to="/notes">Notes</Link>
      <Link className="link" to="/privacy">Privacy</Link>
    </p>
  )
}

/**
 * Router-level chrome: the shared header on every page, and keyboard access to anything that scrolls sideways
 * (wide code, equations, diagrams) so it passes axe scrollable-region-focusable.
 */
export function SiteShell() {
  const { pathname } = useLocation()
  useEffect(() => {
    const mark = () => {
      let n = 0
      document.querySelectorAll<HTMLElement>('main pre, main .katex-display, main figure, main figure > div, main .eq, main table, main [class*="overflow-x-auto"]').forEach((el) => {
        if (el.hasAttribute('tabindex')) return
        const ox = getComputedStyle(el).overflowX
        if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 1) {
          el.tabIndex = 0
          if (!el.getAttribute('aria-label') && !el.getAttribute('role')) {
            // Landmarks need distinct names: use the figure's own caption or diagram title when it has one.
            const figure = el.closest('figure')
            const own = figure?.querySelector('figcaption')?.textContent?.trim() || el.querySelector('svg[aria-label]')?.getAttribute('aria-label')
            n += 1
            el.setAttribute('role', 'region')
            el.setAttribute('aria-label', own ? `${own.slice(0, 80)} (scrollable)` : `Scrollable content ${n}`)
          }
        }
      })
    }
    const t = window.setTimeout(mark, 400)
    let r: number | undefined
    const onResize = () => { window.clearTimeout(r); r = window.setTimeout(mark, 200) }
    window.addEventListener('resize', onResize)
    return () => { window.clearTimeout(t); window.clearTimeout(r); window.removeEventListener('resize', onResize) }
  }, [pathname])
  // Every page, home included, shares this one header. It lives outside the page transition,
  // so it never remounts or fades between routes.
  if (pathname.startsWith('/lab/')) return null
  return <SiteHeader />
}
