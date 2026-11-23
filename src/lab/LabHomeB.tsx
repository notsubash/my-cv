import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Calendar, FileDown, Github, Linkedin, Mail } from 'lucide-react'
import { identity, production, work, proof, writing } from './lab-content'
import { LabFrame } from './LabFrame'
import './lab.css'
import './lab-b.css'

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'production', label: 'Production' },
  { id: 'writing', label: 'Writing' },
] as const

/** Direction B — "Evidence rail". Sticky identity + CTA rail, result-first visual cards. */
export default function LabHomeB() {
  const [active, setActive] = useState<string>('work')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  return (
    <LabFrame title="Direction B · Evidence rail">
      <div className="lab lb">
        <div className="lb-grid">
          <header className="lb-rail">
            <div className="lb-rail-inner">
              <p className="meta lb-avail"><span className="lb-dot" aria-hidden="true" />{identity.status}</p>
              <h1 className="lb-name rise">{identity.name}</h1>
              <p className="lb-role rise rise-2">
                AI/ML engineer at <strong>{identity.employer}</strong>, shipping RAG chatbots, voice agents and
                LLM evaluation pipelines to production since {identity.since}.
              </p>
              <div className="lb-cta rise rise-3">
                <button type="button" className="btn btn-primary"><Calendar size={18} aria-hidden="true" />Book a 30-min intro</button>
                <a className="btn btn-quiet" href="/Subash-Pandey-CV.pdf" download><FileDown size={18} aria-hidden="true" />CV</a>
              </div>
              <nav aria-label="Sections" className="lb-toc">
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
                    <span className="lb-toc-line" aria-hidden="true" />{s.label}
                  </a>
                ))}
                <Link to="/about"><span className="lb-toc-line" aria-hidden="true" />About</Link>
              </nav>
              <p className="lb-social">
                <a href={identity.github} aria-label="GitHub"><Github size={20} /></a>
                <a href={identity.linkedin} aria-label="LinkedIn"><Linkedin size={20} /></a>
                <a href={`mailto:${identity.email}`} aria-label="Email"><Mail size={20} /></a>
                <span className="meta">{identity.location}</span>
              </p>
            </div>
          </header>

          <main id="main-content" className="lb-main">
            <section id="work" aria-labelledby="lb-work-h">
              <h2 id="lb-work-h" className="lb-h2">Selected work</h2>
              <div className="lb-cards">
                {work.map((w, i) => (
                  <article key={w.slug} className={`lb-card ${i === 0 ? 'lb-card--lead' : ''}`}>
                    <Link to={w.href} className="lb-card-link" aria-label={`${w.title}: ${w.hrefLabel.toLowerCase()}`} />
                    <div className="lb-media">
                      <img src={w.image} alt="" loading={i < 2 ? 'eager' : 'lazy'} decoding="async" width={640} height={360} />
                    </div>
                    <div className="lb-body">
                      <header className="lb-card-head">
                        <h3>{w.title}</h3>
                        <span className="meta">{w.kind}</span>
                      </header>
                      {w.result && (
                        <p className="lb-result">
                          <span className="lb-result-value num">{w.result.value}</span>
                          <span className="lb-result-label">{w.result.label}</span>
                        </p>
                      )}
                      <dl className="lb-pbr">
                        <div><dt>Problem</dt><dd>{w.problem}</dd></div>
                        <div><dt>Built</dt><dd>{w.built}</dd></div>
                        {!w.result && <div><dt>Status</dt><dd>{w.resultNote}</dd></div>}
                      </dl>
                      <p className="lb-card-foot meta">
                        <span className="lb-card-cta">{w.hrefLabel} →</span>
                        {w.repo && <a className="link lb-repo" href={w.repo} target="_blank" rel="noopener noreferrer">Source<ArrowUpRight size={12} aria-hidden="true" /></a>}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="production" aria-labelledby="lb-prod-h" className="lb-section">
              <h2 id="lb-prod-h" className="lb-h2">In production at {identity.employer} <span className="meta">{identity.since} – now</span></h2>
              <ul className="lb-prod">
                {production.map((p) => (
                  <li key={p.title}><strong>{p.title}.</strong> {p.detail}</li>
                ))}
              </ul>
              <figure className="lb-quote">
                <blockquote>“{proof.quote}”</blockquote>
                <figcaption className="meta">{proof.author}, {proof.role} · {proof.source}</figcaption>
              </figure>
            </section>

            <section id="writing" aria-labelledby="lb-writing-h" className="lb-section">
              <h2 id="lb-writing-h" className="lb-h2">Writing</h2>
              <ul className="lb-writing">
                {writing.map((p) => (
                  <li key={p.href}><Link to={p.href} className="link">{p.title}</Link><span className="meta num">{p.date}</span></li>
                ))}
              </ul>
              <p className="meta" style={{ marginTop: 12 }}><Link to="/blog" className="link">All posts</Link></p>
            </section>
          </main>
        </div>
      </div>
    </LabFrame>
  )
}
