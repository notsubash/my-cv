import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, FileText, Video } from 'lucide-react'
import { usePageSeo } from '../hooks/usePageSeo'
import posthog from '../posthog'

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
    <section className="mb-10">
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-primary inline-block shrink-0" />
        {title}
      </h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

export function InfoGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-10">
      {children}
    </div>
  )
}

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">{title}</p>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

export function FindingsList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Reflection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
        <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-3">
          {title || "What I'd do differently"}
        </p>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          {children}
        </div>
      </div>
    </section>
  )
}

export function ResultTable({ rows }: { rows: { label: string; value: string; note?: string }[] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {rows.map((row, i) => (
        <div key={i} className={`flex items-start justify-between gap-3 px-4 py-3 text-sm ${i !== rows.length - 1 ? 'border-b border-border' : ''}`}>
          <span className="text-foreground font-medium min-w-0">{row.label}</span>
          <div className="text-right shrink-0 max-w-[55%]">
            <span className="text-primary font-semibold">{row.value}</span>
            {row.note && <span className="ml-2 text-xs text-muted-foreground break-words">{row.note}</span>}
          </div>
        </div>
      ))}
    </div>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Back nav */}
        <Link
          to="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to projects
        </Link>

        {/* Hero */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
              {meta.badge}
            </span>
            <span className="text-xs text-muted-foreground">{meta.kind || 'Case Study'}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight text-balance">
            {meta.title}
          </h1>
          <p className="text-base text-muted-foreground mb-5 leading-relaxed">
            {meta.tagline}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {meta.tech.map(t => (
              <span key={t} className="px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                {t}
              </span>
            ))}
          </div>

          {/* Links */}
          {meta.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
                  className="inline-flex min-h-11 items-center gap-1.5 px-3 py-2 rounded-lg text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <LinkIcon icon={link.icon} />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Key metrics */}
        {meta.metrics.length > 0 && (
          <div className={`grid gap-3 mb-10 ${meta.metrics.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : meta.metrics.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
            {meta.metrics.map((m, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="font-display text-2xl font-bold text-primary">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        <hr className="border-border mb-10" />

        {/* Page content */}
        {children}

      </div>
    </main>
  )
}
