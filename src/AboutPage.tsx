import { Link } from 'react-router-dom'
import { MapPin, Mail, ExternalLink, Calendar, GraduationCap, Globe, Quote, Zap } from 'lucide-react'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import { CalBookButton } from './CalBookButton'
import posthog from './posthog'

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

function StoryPhoto({
  src,
  alt,
  caption,
  width,
  height,
  portrait = false,
}: {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
  portrait?: boolean
}) {
  return (
    <figure className={`my-6 ${portrait ? 'mx-auto max-w-sm' : ''}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="w-full h-auto rounded-xl border border-border/50"
      />
      {caption ? (
        <figcaption className={`mt-2 text-xs text-muted-foreground ${portrait ? 'text-center' : ''}`}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export default function AboutPage() {
  const t = translations.en
  const recommendation = t.recommendations.items[0]

  usePageSeo({
    title: 'About | Subash Pandey',
    description: 'About Subash Pandey — AI/ML engineer from Kathmandu. Exeter MSc, GenAI in production, open to remote roles.',
    path: '/about',
  })

  return (
    <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 md:py-24">
      <header className="mb-14">
        <div className="flex items-start gap-5 mb-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0 border-2 border-border">
            <img src="/foto-avatar-sm.webp" srcSet="/foto-avatar-sm.webp 192w, /foto-avatar.webp 384w" sizes="96px" alt="Subash Pandey" className="w-full h-full object-cover" width={96} height={96} />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1">Subash Pandey</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              AI/ML Engineer · GenAI Developer · Data Scientist
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            Kathmandu, Nepal
          </span>
        </div>
      </header>

      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-4">Where I started</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            I'm from Kathmandu. Midway through my bachelor's in computing, I was doing data analysis and started messing around with tools like Weka. That was the spark. Watching a model learn from a dataset felt weirdly fun, so I kept going deeper into ML and GenAI.
          </p>
          <p>
            I finished a BSc (Hons) in Computing with <strong className="text-foreground">London Metropolitan University</strong> (2:1), then did an MSc in Data Science at the <strong className="text-foreground">University of Exeter</strong> (Merit). Somewhere in there, this stopped being a side hobby and became the thing I actually wanted to build for a living.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-4">Exeter days</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Studying in the UK was a lot. One month I had five exams, a thesis to submit, and a part-time job so I could cover living costs. It was chaotic, but I look back on it fondly. I learned I can handle a packed calendar and still enjoy the ride.
          </p>
          <p>
            Graduation day felt great. Worth every late night.
          </p>
        </div>
        <StoryPhoto
          src="/graduation.webp"
          alt="Subash in graduation gown beside the University of Exeter plaque"
          caption="Graduation day at Exeter"
          width={1200}
          height={911}
        />
      </section>

      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-4">UK years, then home</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Living abroad wasn't only lectures. I got to wander, meet people, and take photos like this one in London when the sky was doing its usual grey thing.
          </p>
          <StoryPhoto
            src="/UK_stay.webp"
            alt="Subash with Tower Bridge and the Thames behind him in London"
            caption="A grey day in London"
            width={1200}
            height={900}
          />
          <p>
            Now I'm back in Kathmandu, working remotely. I like problems where automation makes someone's day easier: chat systems, voice features, evaluation, assessment tools, and the product pieces around them. Different projects, same curiosity.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-4">How I work</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          I enjoy taking an idea past the demo and into something people can actually use. {t.summary.p2}{' '}
          <span className="text-foreground font-medium">{t.summary.p2Highlight}</span>
          {t.summary.p2End}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.coreCompetencies.items.map((item, i) => (
            <div key={i} className="p-3 rounded-xl border border-border/60">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium leading-tight">{item.title}</span>
              </div>
              <p className="text-xs text-muted-foreground pl-6 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-4">Outside the laptop</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            What I treasure most from all of this is the friends and people I met. Shared laughs, shared stress, shared nights out. That stuff stays with you.
          </p>
          <p>
            Away from work I play football and watch a lot of it. Real Madrid is my club. I like travelling whenever I get the chance, and I happily lose an afternoon in a gallery.
          </p>
          <p>
            This one is after getting soaked in heavy rain. We finally sat down for food and I was just glad to be dry, warm, and about to eat.
          </p>
        </div>
        <StoryPhoto
          src="/personal-pic.webp"
          alt="Subash smiling with arms up at a cafe, ready for a meal after the rain"
          caption="Post-rain meal energy"
          width={900}
          height={1200}
          portrait
        />
      </section>

      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-4">What I'm looking for</h2>
        <p className="text-muted-foreground mb-5 leading-relaxed">
          I'm open to remote AI/ML or GenAI roles where I can help build things end to end. Based in Kathmandu (APAC), happy to keep overlap with US and EU teams.
        </p>
        <div className="p-5 rounded-2xl bg-success/10 border border-success/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--success))] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--success))]" />
            </span>
            <span className="text-sm font-medium text-success">
              Open to remote roles · APAC timezone
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            If that sounds useful for your team, I'd love to chat.
          </p>
        </div>
      </section>

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

      {recommendation && (
        <section className="mb-16">
          <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary" />
            {t.recommendations.title}
          </h2>
          <blockquote className="p-6 rounded-2xl bg-card border border-border">
            <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">"{recommendation.quote}"</p>
            <footer className="flex items-start gap-3">
              <img src="/akash.webp" alt={recommendation.author} className="w-10 h-10 rounded-full shrink-0 object-cover" width={40} height={40} loading="lazy" />
              <div>
                <p className="text-sm font-semibold">{recommendation.author}</p>
                <p className="text-xs text-muted-foreground">{recommendation.role}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{recommendation.date} · {recommendation.source}</p>
              </div>
            </footer>
          </blockquote>
        </section>
      )}

      <section className="mb-16">
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Connect
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
            <CalBookButton
              className="inline-flex items-center justify-center gap-2 min-h-11 w-full px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors sm:w-auto"
            >
              <Calendar className="w-4 h-4" />
              {t.cta.bookCall}
            </CalBookButton>
            <a
              href={`mailto:${t.email}`}
              onClick={() => posthog.capture('contact_email_clicked', { placement: 'about' })}
              className="inline-flex items-center justify-center gap-2 min-h-11 w-full px-5 py-2.5 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 text-sm transition-colors break-all sm:w-auto sm:break-normal"
            >
              <Mail className="w-4 h-4" />
              {t.email}
            </a>
          </div>
          <nav aria-label="Social profiles" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {SOCIAL_LINKS.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => posthog.capture('outbound_link_clicked', { destination: link.icon, placement: 'about' })}
                className="inline-flex items-center gap-1.5 min-h-11 hover:text-foreground transition-colors"
              >
                {link.icon === 'linkedin' && <LinkedInLogo className="w-4 h-4" />}
                {link.icon === 'github' && <GitHubLogo className="w-4 h-4" />}
                {link.name}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>
      </section>

      <footer className="pt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Subash Pandey
          <span className="mx-2 text-border">|</span>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        </p>
      </footer>
    </main>
  )
}
