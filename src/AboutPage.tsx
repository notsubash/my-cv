import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Mail, ExternalLink, GraduationCap, Briefcase } from 'lucide-react'

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/notsubash' },
]

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About | Subash Pandey'
    const desc = document.querySelector('meta[name="description"]') as HTMLMetaElement
    if (desc) desc.content = 'About Subash Pandey — AI/ML Engineer from Nepal.'
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">About Me</h1>

      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg">
          I'm an AI/ML engineer from Nepal with a strong interest in Generative AI and applied machine learning.
          I enjoy exploring the intersection of research and implementation, and I'm driven by curiosity, clarity, and continuous learning.
        </p>
        <p>
          I take pride in writing clean code, thinking deeply about problems, and building meaningful, responsible AI solutions that create real impact.
        </p>

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
            <li><strong>MSc Data Science</strong> — University of Exeter (2022-2023), Merit</li>
            <li><strong>BSc (Hons) Computing</strong> — London Metropolitan University (2019-2021), 2:1</li>
          </ul>
        </div>

        <div className="pt-6 border-t border-border">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            Links
          </h2>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm transition-colors"
              >
                {link.name}
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
