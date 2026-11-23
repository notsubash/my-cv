import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, FileText, Video } from 'lucide-react'
import { usePageSeo } from '../hooks/usePageSeo'
import posthog from '../posthog'
import { SiteFooter } from '../site/SiteChrome'

export interface CaseStudyLink {
  label: string
  url: string
  icon: 'github' | 'fileText' | 'video' | 'external' | 'youtube' | 'tiktok' | 'instagram' | 'facebook'
}

export interface MetricCard {
  value: string
  label: string
}

export interface CaseStudyMeta {
  title: string
  badge: string
  kind?: string
  tagline: string
  tech: string[]
  links: CaseStudyLink[]
  metrics: MetricCard[]
  seoTitle: string
  seoDescription: string
  seoKeywords?: string
}

function LinkIcon({ icon }: { icon: CaseStudyLink['icon'] }) {
  const className = 'w-4 h-4'
  switch (icon) {
    case 'github': return <Github className={className} />
    case 'fileText': return <FileText className={className} />
    case 'video': return <Video className={className} />
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.5 15.6V8.4L15.8 12z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14.1.1c.9 0 1.8 0 2.7.1.1 1.1.4 2.1 1.1 2.9.8.8 1.9 1.2 3 1.3v2.8c-1 0-2-.2-2.9-.7-.4-.2-.8-.4-1.1-.6v8.4c0 3.4-2.6 6.1-6 6.2-1.1.1-2.2-.2-3.1-.8-1.7-1.1-2.7-3-2.7-5.1 0-3.3 2.6-6 5.9-6.1.3 0 .6 0 .9.1v2.9c-.2 0-.5-.1-.7-.1-1.6.1-2.8 1.5-2.7 3.1.1 1.5 1.4 2.7 2.9 2.6 1.5-.1 2.6-1.3 2.6-2.8V.1z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.16c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.67 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85c.15-3.26 1.69-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24c3.26 0 3.67-.01 4.95-.07 4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95C23.1 2.7 20.7.27 16.36.07 15.08.01 14.67 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12.1A10 10 0 1 0 10.6 22v-7H8.1v-2.9h2.5V9.9c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5v1.9h2.8l-.4 2.9h-2.4V22A10 10 0 0 0 22 12.1z" />
        </svg>
      )
    default: return <ExternalLink className={className} />
  }
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="case-section">
      <h2>{title}</h2>
      <div className="case-body">{children}</div>
    </section>
  )
}

export function InfoGrid({ children }: { children: ReactNode }) {
  return <dl className="case-info">{children}</dl>
}

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <dt>{title}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function FindingsList({ items }: { items: string[] }) {
  return (
    <ul className="case-findings">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  )
}

export function Reflection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="case-section case-reflection">
      <h2>{title || 'What I would do differently'}</h2>
      <div className="case-body">{children}</div>
    </section>
  )
}

export function ResultTable({ rows }: { rows: { label: string; value: string; note?: string }[] }) {
  return (
    <table className="case-table">
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <th scope="row">{row.label}</th>
            <td>
              <span className="case-table-value">{row.value}</span>
              {row.note && <span className="case-table-note">{row.note}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function CaseStudyLayout({ meta, children }: { meta: CaseStudyMeta; children: ReactNode }) {
  const { pathname } = useLocation()

  usePageSeo({
    title: meta.seoTitle,
    description: meta.seoDescription,
    path: pathname,
    keywords: meta.seoKeywords,
  })

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="case">
        <Link to="/#work">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All work
        </Link>

        <header>
          <p className="case-kind">{meta.kind || 'Case study'} · {meta.badge}</p>
          <h1>{meta.title}</h1>
          <p>{meta.tagline}</p>
          <p className="case-tech">{meta.tech.join(' · ')}</p>
          {meta.links.length > 0 && (
            <p className="case-links">
              {meta.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => posthog.capture('project_link_clicked', {
                    link_type: link.icon,
                    project_title: meta.title,
                    project_slug: pathname,
                    placement: 'case_study',
                  })}
                  className="btn btn--quiet"
                >
                  <LinkIcon icon={link.icon} />
                  {link.label}
                </a>
              ))}
            </p>
          )}
        </header>

        {meta.metrics.length > 0 && (
          <dl className="case-metrics">
            {meta.metrics.map((m, i) => (
              <div key={i}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="prose-custom case-content">{children}</div>

        <SiteFooter placement="case_study" />
      </div>
    </main>
  )
}
