import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePageSeo } from '../hooks/usePageSeo'

const LINKS = [
  { to: '/lab/a', label: 'A · Ledger' },
  { to: '/lab/b', label: 'B · Evidence rail' },
  { to: '/lab/article', label: 'Article' },
  { to: '/lab/logos', label: 'Logos' },
  { to: '/lab/concepts', label: 'Hero concepts' },
  { to: '/', label: 'Current site' },
]

/** Prototype chrome: noindex + a small switcher strip pinned to the bottom edge. */
export function LabFrame({ title, children }: { title: string; children: ReactNode }) {
  const { pathname } = useLocation()
  usePageSeo({ title: `${title} (prototype)`, description: 'Design prototype, not part of the live site.', path: pathname, noindex: true })
  return (
    <>
      {children}
      <nav
        aria-label="Prototype switcher"
        data-lab-switcher
        style={{
          position: 'fixed', left: '50%', bottom: 12, transform: 'translateX(-50%)', zIndex: 60,
          display: 'flex', gap: 4, padding: 4, borderRadius: 999, font: '500 13px/1 system-ui, sans-serif',
          background: 'rgb(20 20 22 / 0.88)', color: '#fff', backdropFilter: 'blur(8px)', maxWidth: 'calc(100vw - 24px)', overflowX: 'auto',
        }}
      >
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            aria-current={pathname === l.to ? 'page' : undefined}
            style={{ padding: '8px 12px', borderRadius: 999, whiteSpace: 'nowrap', textDecoration: 'none', color: 'inherit', background: pathname === l.to ? 'rgb(255 255 255 / 0.18)' : 'transparent' }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
