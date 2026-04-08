import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Mail, ExternalLink, GraduationCap, Briefcase, Award, FolderGit2, Globe } from 'lucide-react'
import { translations } from './i18n'

function LinkedInLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
    </svg>
  )
}

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/notsubash', icon: 'github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/subash-pandey-73a120168', icon: 'linkedin' },
]

export default function AboutPage() {
  const t = translations.en

  useEffect(() => {
    document.title = 'About | Subash Pandey'
    const desc = document.querySelector('meta[name="description"]') as HTMLMetaElement
    if (desc) desc.content = 'About Subash Pandey — AI/ML Engineer from Nepal, MSc Data Science (Exeter), passionate about GenAI, applied ML, and responsible AI.'
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">About Me</h1>

      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg">
          I'm an AI/ML engineer from Nepal with a strong interest in Generative AI, applied machine learning, network analysis, and building responsible AI.
          I hold an <strong className="text-foreground">MSc in Data Science</strong> from the University of Exeter (Merit) and a <strong className="text-foreground">BSc (Hons) in Computing</strong> from London Metropolitan University (2:1).
        </p>
        <p>
          I take pride in writing clean code, thinking deeply about problems, and building meaningful, responsible AI solutions that create real impact.
          I explore the intersection of research and implementation — from RAG pipelines and LLM evaluation to network analysis and audio feature extraction.
        </p>
        <p>
          At Scopic Software, I build and maintain AI-driven features — from AI receptionists to GenAI sales chatbots with RAG pipelines and evaluation frameworks.
        </p>

        {/* Availability */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">
              Actively looking for remote roles (APAC timezone) in AI/ML Engineering
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Kathmandu, Nepal
          </span>
          <a href="mailto:axlesubash111@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail className="w-4 h-4 text-primary" />
            axlesubash111@gmail.com
          </a>
        </div>

        <div className="pt-6 border-t border-border">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Current Role
          </h2>
          <p>Remote AI/ML Engineer at <strong>Scopic Software LLC</strong> (Oct 2024 - Present)</p>
        </div>

        <div className="pt-6 border-t border-border">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Education
          </h2>
          <ul className="space-y-2">
            {t.education.items.map((item, i) => (
              <li key={i}><strong>{item.title}</strong> — {item.org} ({item.year})</li>
            ))}
          </ul>
        </div>

        {/* Certifications */}
        {t.certifications.items.length > 0 && (
          <div className="pt-6 border-t border-border">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Certifications
            </h2>
            <ul className="space-y-2">
              {t.certifications.items.map((cert, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    {cert.url ? (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        {cert.title} <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    ) : cert.title}
                    <span className="text-muted-foreground/60"> — {cert.org} ({cert.year})</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects Quick Links */}
        <div className="pt-6 border-t border-border">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-primary" />
            Projects
          </h2>
          <div className="flex flex-wrap gap-2">
            {t.projects.items.map((project, i) => (
              <Link
                key={i}
                to="/#projects"
                className="px-4 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm transition-colors"
              >
                {project.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Links
          </h2>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm transition-colors"
              >
                {link.icon === 'linkedin' && <LinkedInLogo className="w-4 h-4" />}
                {link.name}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Link to="/" className="text-primary hover:underline text-sm">← Back to home</Link>
      </div>
    </div>
  )
}
