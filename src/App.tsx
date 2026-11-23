import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Calendar, Check, Copy, FileText } from 'lucide-react'
import { seo } from './i18n'
import { useHomeSeo } from './articles/use-article-seo'
import { CalBookButton } from './CalBookButton'
import posthog from './posthog'
import { captureOnce } from './analytics'
import { BLOG_ENABLED } from './config'
import { experience, facts, person, posts, recommendation, work, type WorkItem } from './home/home-content'
import './home/home.css'

const SECTIONS = ['work', 'experience', 'writing', 'contact'] as const

const isPrerender = () => Boolean(Reflect.get(window, '__PRERENDER__'))

/** Fires home_section_viewed once per session per section (same contract as before the redesign). */
function useSectionViews() {
  useEffect(() => {
    if (isPrerender()) return
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

/** Local time in Kathmandu, so a recruiter can see the working-hours overlap at a glance. Client only. */
function useLocalTime(timeZone: string) {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    if (isPrerender()) return
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [timeZone])
  return time
}

function CopyEmail({ placement }: { placement: 'hero' | 'footer' }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = useCallback(() => {
    posthog.capture('contact_email_clicked', { placement, action: 'copy' })
    navigator.clipboard.writeText(person.email).then(
      () => {
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), 1800)
      },
      () => { window.location.href = `mailto:${person.email}` },
    )
  }, [placement])
  return (
    <button type="button" className="hm-btn hm-btn--quiet hm-copy" data-copied={copied || undefined} onClick={copy}>
      <span className="hm-copy-icon" aria-hidden="true">
        <Copy size={16} className="hm-copy-a" />
        <Check size={16} className="hm-copy-b" />
      </span>
      <span aria-live="polite">{copied ? 'Email copied' : 'Copy email'}</span>
    </button>
  )
}

function WorkRow({ item, index, onActive }: { item: WorkItem; index: number; onActive: (i: number, el: HTMLElement) => void }) {
  const track = (link_type: string) => posthog.capture('project_link_clicked', {
    link_type, project_title: item.title, position: index + 1, result_shown: Boolean(item.result), placement: 'home',
  })
  return (
    <li
      className="hm-row"
      onPointerEnter={(e) => onActive(index, e.currentTarget)}
      onFocus={(e) => onActive(index, e.currentTarget)}
    >
      <Link to={item.href} className="hm-row-link" onClick={() => track('case_study')}>
        <div className="hm-row-main">
          <h3 className="hm-row-title">
            {item.title}
            <ArrowRight className="hm-row-arrow" size={17} aria-hidden="true" />
          </h3>
          <p className="hm-row-kind">{item.kind}</p>
          <p className="hm-row-line"><span className="hm-label">Problem</span>{item.problem}</p>
          <p className="hm-row-line hm-row-line--built"><span className="hm-label">Built</span>{item.built}</p>
        </div>
        <div className="hm-row-result">
          {item.result ? (
            <>
              <span className="hm-result-value">{item.result.value}</span>
              <span className="hm-result-label">{item.result.label}</span>
            </>
          ) : (
            <span className="hm-result-label">{item.resultFallback}</span>
          )}
        </div>
        <span className="sr-only">. {item.linkLabel}</span>
      </Link>
      <p className="hm-row-foot">
        <span className="hm-tags">{item.tags.join(' · ')}</span>
        {item.repo && (
          <a className="hm-link hm-row-repo" href={item.repo} target="_blank" rel="noopener noreferrer" onClick={() => track('repository')}>
            Code<ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only"> for {item.title} (opens GitHub)</span>
          </a>
        )}
      </p>
    </li>
  )
}

/** Desktop-only preview that follows the hovered or focused row in the right margin. */
function WorkList() {
  const listRef = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [y, setY] = useState(0)
  const [armed, setArmed] = useState(false) // images load only after first interaction
  const onActive = useCallback((i: number, el: HTMLElement) => {
    setArmed(true)
    setActive(i)
    setY(el.offsetTop)
  }, [])
  return (
    <div className="hm-work" onPointerLeave={() => setActive(null)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(null) }}>
      <ol ref={listRef} className="hm-rows">
        {work.map((item, i) => <WorkRow key={item.slug} item={item} index={i} onActive={onActive} />)}
      </ol>
      <div className="hm-preview" data-open={active !== null || undefined} style={{ '--y': `${y}px` } as CSSProperties} aria-hidden="true">
        {armed && work.map((item, i) => (
          <img key={item.slug} src={item.image} alt="" decoding="async" data-on={active === i || undefined} width={640} height={360} />
        ))}
      </div>
    </div>
  )
}

function App() {
  useHomeSeo({ title: seo.en.title, description: seo.en.description })
  useSectionViews()
  const time = useLocalTime(person.timeZone)

  return (
    <div className="hm">
      <header className="hm-bar">
        <Link to="/" className="hm-name" aria-current="page">
          <img className="hm-avatar" src="/foto-avatar-sm.webp" alt="" width={32} height={32} />
          {person.name}
        </Link>
        <nav aria-label="Primary" className="hm-nav">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          {BLOG_ENABLED && <a href="#writing">Writing</a>}
          <Link to="/about">About</Link>
        </nav>
        <CalBookButton placement="nav" className="hm-btn hm-btn--small hm-bar-cta">Book a call</CalBookButton>
      </header>

      <main id="main-content" className="hm-col">
        <section className="hm-hero" aria-labelledby="hm-intro">
          <h1 id="hm-intro" className="hm-lede">
            I’m Subash, an AI/ML engineer. I ship <mark className="hm-mark hm-mark--1">LLM systems to production</mark>, and
            I build the <mark className="hm-mark hm-mark--2">evaluations that prove they work</mark>.
          </h1>

          <dl className="hm-facts">
            {facts.map((f) => (
              <div key={f.term} className="hm-fact">
                <dt>{f.term}</dt>
                <dd className={f.term === 'Open to' ? 'hm-open' : undefined}>
                  {f.detail}
                  {'note' in f && <span className="hm-fact-note"> · {f.note}</span>}
                  {'clock' in f && (
                    <span className="hm-fact-note">
                      {' '}· {person.utcOffset}
                      <span className="hm-clock">{time ? <> · <time>{time}</time> there now</> : null}</span>
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="hm-cta">
            <CalBookButton placement="hero" className="hm-btn hm-btn--primary">
              <Calendar size={18} aria-hidden="true" />
              Book a 30-min intro
            </CalBookButton>
            <Link to="/cv" className="hm-btn hm-btn--quiet" onClick={() => posthog.capture('cv_viewed', { placement: 'hero' })}>
              <FileText size={16} aria-hidden="true" />
              Full CV
            </Link>
            <CopyEmail placement="hero" />
          </div>
        </section>

        <section id="work" aria-labelledby="hm-work-h" className="hm-section">
          <div className="hm-head">
            <h2 id="hm-work-h">Selected work</h2>
            <p>The problem, what I built, and what it showed</p>
          </div>
          <WorkList />
        </section>

        <figure className="hm-quote">
          <blockquote>
            <p>“{recommendation.quote}”</p>
          </blockquote>
          <figcaption>
            <img src="/akash.webp" alt="" width={36} height={36} loading="lazy" decoding="async" />
            <span>
            <a className="hm-link" href={recommendation.href} target="_blank" rel="noopener noreferrer"
              onClick={() => posthog.capture('outbound_link_clicked', { destination: 'linkedin', placement: 'recommendation' })}>
              {recommendation.author}
            </a>
            , {recommendation.role} · {recommendation.source}
            </span>
          </figcaption>
        </figure>

        <section id="experience" aria-labelledby="hm-exp-h" className="hm-section">
          <div className="hm-head">
            <h2 id="hm-exp-h">Experience</h2>
            <Link to="/cv" className="hm-link" onClick={() => posthog.capture('cv_viewed', { placement: 'experience' })}>Full CV, talks and certifications</Link>
          </div>
          <ol className="hm-exp">
            {experience.map((job) => (
              <li key={job.org} className="hm-job">
                <p className="hm-job-period">{job.period}</p>
                <div>
                  <h3><span>{job.role}</span><span className="hm-job-org">{job.org}</span></h3>
                  <ul>{job.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {BLOG_ENABLED && (
          <section id="writing" aria-labelledby="hm-writing-h" className="hm-section">
            <div className="hm-head">
              <h2 id="hm-writing-h">Writing</h2>
              <Link to="/blog" className="hm-link" onClick={() => posthog.capture('blog_catalog_clicked', { placement: 'home' })}>All posts</Link>
            </div>
            <ul className="hm-posts">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="hm-link" onClick={() => posthog.capture('blog_post_clicked', { slug: p.slug, placement: 'home' })}>{p.title}</Link>
                  <span className="hm-post-date">{p.date}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer id="contact" className="hm-section hm-foot" aria-labelledby="hm-contact-h">
          <h2 id="hm-contact-h" className="hm-foot-line">Hiring for an ML or AI engineering role? Thirty minutes is enough to see if there’s a fit.</h2>
          <div className="hm-cta">
            <CalBookButton placement="footer" className="hm-btn hm-btn--primary">
              <Calendar size={18} aria-hidden="true" />
              Book a 30-min intro
            </CalBookButton>
            <a className="hm-link" href={`mailto:${person.email}`} onClick={() => posthog.capture('contact_email_clicked', { placement: 'footer' })}>{person.email}</a>
          </div>
          <p className="hm-foot-links">
            <a className="hm-link" href={person.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('outbound_link_clicked', { destination: 'linkedin', placement: 'footer' })}>LinkedIn</a>
            <a className="hm-link" href={person.github} target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'footer' })}>GitHub</a>
            <Link className="hm-link" to="/open-source">Open source</Link>
            <Link className="hm-link" to="/notes">Notes</Link>
            <Link className="hm-link" to="/privacy">Privacy</Link>
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
