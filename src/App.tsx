import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FileDown, Github, Hand, Linkedin, MessageSquare } from 'lucide-react'
import { seo } from './i18n'
import { useHomeSeo } from './articles/use-article-seo'
import posthog from './posthog'
import { captureOnce } from './analytics'
import { person } from './home/home-content'
import { ProfileLedger } from './home/ProfileSheet'
import { ContactCta, CvDownload, SiteLinks } from './site/SiteChrome'
import { CopyEmail } from './site/CopyEmail'
import { useLocalTime } from './site/useLocalTime'
import './home/home.css'

const SECTIONS = ['intro', 'contact'] as const

/** Fires home_section_viewed once per session per section (same contract as before the redesign). */
function useSectionViews() {
  useEffect(() => {
    if (Reflect.get(window, '__PRERENDER__')) return
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const section = entry.target.id
        captureOnce(sessionStorage, `ph:home_section_viewed:${section}`, () => {
          posthog.capture('home_section_viewed', { section })
        })
      }
    }, { threshold: 0.1 })
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
}

function App() {
  useHomeSeo({ title: seo.en.title, description: seo.en.description })
  useSectionViews()
  const time = useLocalTime(person.timeZone)

  return (
    <div className="site hm">
      <main id="main-content" className="hm-col">
        <section id="intro" className="hm-hero" aria-labelledby="hm-intro">
          <h1 id="hm-intro" className="hm-intro">
            <span className="hm-wave" role="img" aria-label="Hello"><Hand size="1em" strokeWidth={2} aria-hidden="true" /></span>
            I’m Subash, an AI/ML engineer. I ship AI systems to production.
          </h1>

          <div className="hm-cta">
            <ContactCta placement="hero" className="btn btn--primary">
              <MessageSquare size={17} aria-hidden="true" />
              Let’s talk
            </ContactCta>
            <CvDownload placement="hero" className="btn btn--quiet">
              <FileDown size={16} aria-hidden="true" />
              Download CV
            </CvDownload>
            <Link to="/projects" className="hm-projects-link" onClick={() => posthog.capture('projects_viewed', { placement: 'hero' })}>
              See the projects<ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className="hm-elsewhere">
            <CopyEmail placement="hero" />
            <a className="hm-elsewhere-link" href={person.linkedin} target="_blank" rel="noopener noreferrer"
              onClick={() => posthog.capture('outbound_link_clicked', { destination: 'linkedin', placement: 'hero' })}>
              <Linkedin size={15} aria-hidden="true" />LinkedIn
            </a>
            <a className="hm-elsewhere-link" href={person.github} target="_blank" rel="noopener noreferrer"
              onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'hero' })}>
              <Github size={15} aria-hidden="true" />GitHub
            </a>
          </p>

          <ProfileLedger time={time} />

        </section>

        {/* The hero already carries the calls to action, so home closes on the quiet links only. */}
        <footer id="contact" className="hm-foot-quiet">
          <SiteLinks />
        </footer>
      </main>
    </div>
  )
}

export default App
