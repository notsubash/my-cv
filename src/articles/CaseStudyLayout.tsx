import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, FileText, Video } from 'lucide-react'

export interface CaseStudyLink {
  label: string
  url: string
  icon: 'github' | 'fileText' | 'video' | 'external'
}

export interface MetricCard {
  value: string
  label: string
}

export interface CaseStudyMeta {
  title: string
  badge: string
  tagline: string
  tech: string[]
  links: CaseStudyLink[]
  metrics: MetricCard[]
  seoTitle: string
  seoDescription: string
  seoKeywords?: string
}

function LinkIcon({ icon }: { icon: CaseStudyLink['icon'] }) {
  switch (icon) {
    case 'github': return <Github className="w-4 h-4" />
    case 'fileText': return <FileText className="w-4 h-4" />
    case 'video': return <Video className="w-4 h-4" />
    default: return <ExternalLink className="w-4 h-4" />
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
        <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i !== rows.length - 1 ? 'border-b border-border' : ''}`}>
          <span className="text-foreground font-medium">{row.label}</span>
          <div className="text-right">
            <span className="text-primary font-semibold">{row.value}</span>
            {row.note && <span className="ml-2 text-xs text-muted-foreground">{row.note}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CaseStudyLayout({ meta, children }: { meta: CaseStudyMeta; children: ReactNode }) {
  useEffect(() => {
    document.title = meta.seoTitle
    const desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (desc) desc.content = meta.seoDescription
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null
    if (ogTitle) ogTitle.setAttribute('content', meta.seoTitle)
    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null
    if (ogDesc) ogDesc.setAttribute('content', meta.seoDescription)

    let keywords: HTMLMetaElement | null = null
    if (meta.seoKeywords) {
      keywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
      if (!keywords) { keywords = document.createElement('meta'); keywords.name = 'keywords'; document.head.appendChild(keywords) }
      keywords.content = meta.seoKeywords
    }

    return () => {
      document.title = 'Subash Pandey | AI/ML Engineer · GenAI Developer · Data Scientist'
      if (keywords) keywords.content = ''
    }
  }, [meta.seoTitle, meta.seoDescription, meta.seoKeywords])

  return (
    <main className="min-h-screen bg-background">
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
            <span className="text-xs text-muted-foreground">Case Study</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
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
          <div className={`grid gap-4 mb-10 ${meta.metrics.length === 3 ? 'grid-cols-3' : meta.metrics.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
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
