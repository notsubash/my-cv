import { Link } from 'react-router-dom'
import { MapPin, Mail, ExternalLink, ArrowLeft, Calendar, Briefcase, GraduationCap, Award, FolderGit2, Globe, Quote, MessageCircle, ThumbsUp } from 'lucide-react'
import { translations } from './i18n'
import { getTechIcon } from './tech-icons'
import { usePageSeo } from './hooks/usePageSeo'

function LinkedInLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
    </svg>
  )
}

function GitHubLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/notsubash', icon: 'github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/subash-pandey-ai', icon: 'linkedin' },
]

function TechBadge({ name }: { name: string }) {
  const icon = getTechIcon(name)
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-muted text-foreground">
      {icon && (
        icon.src ? (
          <img src={icon.src} alt="" className="w-3.5 h-3.5 shrink-0 object-contain" width={14} height={14} loading="lazy" />
        ) : icon.path ? (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill={icon.color} aria-hidden="true">
            <path d={icon.path} />
          </svg>
        ) : null
      )}
      {name}
    </span>
  )
}

interface ExperienceEntry {
  period: string
  role: string
  company: string
  location?: string
  website?: string
  logo?: string
  desc: string
  tags?: string
}

export default function AboutPage() {
  const t = translations.en
  const exp = t.experience

  usePageSeo({
    title: 'About | Subash Pandey',
    description: 'About Subash Pandey — AI/ML Engineer from Nepal, MSc Data Science (Exeter), passionate about GenAI, applied ML, and responsible AI.',
    path: '/about',
  })

  const experiences: ExperienceEntry[] = [
    {
      period: 'Oct 2024 – Present',
      role: exp.santifer.role,
      company: exp.santifer.company,
      location: 'Kathmandu, Nepal (Remote)',
      website: 'https://scopicsoftware.com/',
      logo: '/scopic_software_logo.webp',
      desc: 'Conversational AI platform, GenAI chatbot with LangGraph + RAG + Qdrant, LLM evaluation pipelines, audio feature extraction R&D, SEO SaaS platform as full-stack developer.',
      tags: 'Python · LangGraph · FastAPI · AWS · Docker',
    },
    {
      period: exp.lico.period,
      role: exp.lico.role,
      company: exp.lico.company,
      location: exp.lico.location,
      website: 'https://peacenepal.com/',
      logo: '/peace_nepal_dot_com_logo.webp',
      desc: 'Chatbots for Banking, Travel & Customer Support with RAG and multi-agent frameworks. Deployed interactive web chat applications.',
      tags: 'RAG · Multi-agent · LLM Fine-tuning',
    },
    {
      period: exp.everis.period,
      role: exp.everis.role,
      company: exp.everis.company,
      desc: 'Scalable ML models for data analysis and automation. Deployed models for production in cloud environments.',
      tags: 'HuggingFace · PyTorch · AWS',
    },
    {
      period: exp.contentio.period,
      role: exp.contentio.role,
      company: exp.contentio.company,
      location: exp.contentio.location,
      desc: 'Data pipelines, visualisation with Matplotlib/Seaborn, customer segmentation — 20% reduction in processing time.',
      tags: 'Python · Pandas · SQL',
    },
    {
      period: exp.imark.period,
      role: exp.imark.role,
      company: exp.imark.company,
      location: exp.imark.location,
      logo: '/imark-logo.webp',
      desc: 'React.js to-do application with CRUD backend and user authentication.',
      tags: 'React · Node.js · REST API',
    },
    {
      period: exp.tutor.period,
      role: exp.tutor.role,
      company: exp.tutor.company,
      location: exp.tutor.location,
      desc: 'A-Level Computer Science tutoring and personalised lesson plans.',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      {/* Hero with avatar */}
      <header className="mb-12">
        <div className="flex items-start gap-5 mb-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0 border-2 border-border">
            <img src="/foto-avatar-sm.webp" srcSet="/foto-avatar-sm.webp 192w, /foto-avatar.webp 384w" sizes="96px" alt="Subash Pandey" className="w-full h-full object-cover" width={96} height={96} />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">Subash Pandey</h1>
            <p className="text-lg text-muted-foreground">
              AI/ML Engineer · GenAI Developer · Data Scientist
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            Kathmandu, Nepal
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            April 2026
          </span>
        </div>
      </header>

      {/* Bio */}
      <div className="space-y-4 text-muted-foreground mb-8">
        <p className="text-lg">
          AI/ML engineer from Nepal with a strong interest in <strong className="text-foreground">Generative AI</strong> and <strong className="text-foreground">applied machine learning</strong>.
          I hold an MSc in Data Science from the <strong className="text-foreground">University of Exeter</strong> (Merit) and a BSc (Hons) in Computing from <strong className="text-foreground">London Metropolitan University</strong> (2:1).
        </p>
        <p>
          I build and maintain AI-driven features — from conversational AI to GenAI chatbots with RAG pipelines, LLM evaluation frameworks, and audio feature extraction. I led the development of a GenAI chatbot integrated with CRM using LangGraph, RAG pipelines, and Qdrant for intent detection, contextual retrieval, and analytics tracking.
        </p>
        <p>
          I take pride in writing clean code, thinking deeply about problems, and building meaningful, responsible AI solutions that create real impact.
        </p>
      </div>

      {/* Availability + Role Tags inside */}
      <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-16">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-emerald-400">
            Seeking remote roles · APAC timezone
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {t.roles.map(role => (
            <span key={role} className="px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-sm font-medium text-emerald-300">
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-8 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Experience
        </h2>
        <div className="space-y-8">
          {experiences.map((job, i) => (
            <div key={i} className="flex gap-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                {job.logo ? (
                  <img src={job.logo} alt={job.company} className="w-full h-full object-cover" width={48} height={48} loading="lazy" />
                ) : (
                  <Briefcase className="w-5 h-5 text-muted-foreground/50" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <p className="font-semibold">{job.company}</p>
                  {job.website && (
                    <a href={job.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-0.5 shrink-0">
                      {job.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  )}
                </div>
                {job.location && <p className="text-xs text-muted-foreground/60">{job.location}</p>}
                <p className="text-primary font-medium text-sm mt-0.5">{job.role}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{job.period}{job.tags ? ` · ${job.tags}` : ''}</p>
                <p className="text-sm text-muted-foreground mt-2">{job.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-primary" />
          Projects
        </h2>
        <div className="space-y-5">
          {t.projects.items.map((project, i) => (
            <div key={i} className="group">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold group-hover:text-primary transition-colors">{project.title}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{project.badge}</span>
              </div>
              <p className="text-sm text-muted-foreground">{project.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {project.tech.map(tech => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>
              {project.links && project.links.length > 0 && (
                <div className="flex gap-3 mt-2">
                  {project.links.map((link, j) => (
                    <a key={j} href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                      {link.label} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Certifications
        </h2>
        <div className="space-y-6">
          {(['Udemy', 'Great Learning'] as const).map(org => {
            const certs = t.certifications.items.filter(c => c.org === org)
            if (certs.length === 0) return null
            return (
              <div key={org}>
                <p className="text-sm font-semibold text-primary mb-2">{org}</p>
                <ul className="space-y-1.5 pl-1">
                  {certs.map((cert, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">›</span>
                      {(cert.url as string) ? (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                          {cert.title} <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span>{cert.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Education */}
      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Education
        </h2>
        <ul className="space-y-4">
          {t.education.items.map((item, i) => (
            <li key={i}>
              <p className="font-semibold">{item.org}</p>
              <p className="text-sm text-foreground">{item.title} ({item.year})</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Publications */}
      {t.publications.items.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-primary" />
            Publications
          </h2>
          <div className="space-y-4">
            {t.publications.items.map((pub, i) => (
              <div key={i}>
                <p className="font-semibold">{pub.title}</p>
                <p className="text-sm text-muted-foreground">{pub.org} · {pub.year}</p>
                <p className="text-sm text-muted-foreground mt-1">{pub.desc}</p>
                {pub.links && pub.links.length > 0 && (
                  <div className="flex gap-3 mt-1.5">
                    {pub.links.map((link, j) => (
                      <a key={j} href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                        {link.label} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {t.recommendations.items.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary" />
            {t.recommendations.title}
          </h2>
          <div className="space-y-6">
            {t.recommendations.items.map((rec, i) => (
              <blockquote key={i} className="p-6 rounded-2xl bg-card border border-border">
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">"{rec.quote}"</p>
                <footer className="flex items-start gap-3">
                  <img src="/akash.webp" alt={rec.author} className="w-10 h-10 rounded-full shrink-0 object-cover" width={40} height={40} loading="lazy" />
                  <div>
                    <p className="text-sm font-semibold">{rec.author}</p>
                    <p className="text-xs text-muted-foreground">{rec.role}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{rec.date} · {rec.source}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* LinkedIn Posts — Card style */}
      {t.linkedinPosts.embeds && t.linkedinPosts.embeds.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            {t.linkedinPosts.title}
          </h2>
          <div className="grid gap-4">
            {t.linkedinPosts.embeds.map((post, i) => (
              <a
                key={i}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col p-5 rounded-2xl bg-card border border-border/50 border-t-2 border-t-[hsl(var(--linkedin))] hover:border-border transition-colors group h-full"
              >
                <div className="flex gap-3 flex-1">
                  <img alt="" role="presentation" width={384} height={384} className="w-10 h-10 rounded-full shrink-0 mt-0.5" src="/foto-avatar.webp" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm text-foreground leading-relaxed">
                        {post.hook}<span className="text-muted-foreground">...</span>{' '}
                        <span className="text-[hsl(var(--linkedin))] group-hover:text-[hsl(var(--linkedin))] transition-colors">see more</span>
                      </p>
                      <LinkedInLogo className="w-4 h-4 text-[hsl(var(--linkedin))] shrink-0 mt-0.5" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                    {post.reactions}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {post.comments}
                  </span>
                  <span className="ml-auto text-[hsl(var(--linkedin))] group-hover:text-[hsl(var(--linkedin))] group-hover:underline flex items-center gap-1.5 transition-colors">
                    Read on LinkedIn
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}
            <a
              href={t.linkedinPosts.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              {t.linkedinPosts.cta} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>
      )}

      {/* Connect */}
      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Connect
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${t.email}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm transition-colors"
          >
            <Mail className="w-4 h-4" />
            {t.email}
          </a>
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm transition-colors"
            >
              {link.icon === 'linkedin' && <LinkedInLogo className="w-4 h-4" />}
              {link.icon === 'github' && <GitHubLogo className="w-4 h-4" />}
              {link.name}
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Subash Pandey
          <span className="mx-2 text-border">|</span>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        </p>
      </footer>
    </div>
  )
}
