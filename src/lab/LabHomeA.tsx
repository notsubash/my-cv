import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Calendar, FileDown } from 'lucide-react'
import { identity, production, work, proof, writing } from './lab-content'
import { LabFrame } from './LabFrame'
import './lab.css'
import './lab-a.css'

/** Direction A — "Ledger". Writing-first single column (P1, P2, P3 from the reference table). */
export default function LabHomeA() {
  return (
    <LabFrame title="Direction A · Ledger">
      <div className="lab la">
        <header className="la-bar" aria-label="Site">
          <Link to="/lab/a" className="la-name">Subash Pandey</Link>
          <nav aria-label="Primary" className="la-nav">
            <a href="#work">Work</a>
            <a href="#writing">Writing</a>
            <Link to="/about">About</Link>
            <a href="/Subash-Pandey-CV.pdf" download>CV</a>
          </nav>
        </header>

        <main id="main-content" className="la-col">
          <section className="la-hero" aria-labelledby="la-intro">
            <h1 id="la-intro" className="la-lede rise">
              I’m Subash, an <span className="mark">AI/ML engineer at {identity.employer}</span>. Since {identity.since} I’ve
              shipped GenAI to production: RAG chatbots, a voice agent, and the{' '}
              <span className="mark">evaluation pipelines</span> that keep them honest.
            </h1>
            <p className="la-sub rise rise-2">
              On the side I build things that measure their own failure modes, like an activity model whose
              macro-F1 drops from <span className="num">0.89</span> to <span className="num">0.29</span> once subject leakage is removed.
            </p>
            <div className="la-cta rise rise-3">
              <button type="button" className="btn btn-primary"><Calendar size={18} aria-hidden="true" />Book a 30-min intro</button>
              <a className="btn btn-quiet" href="/Subash-Pandey-CV.pdf" download><FileDown size={18} aria-hidden="true" />Download CV</a>
              <span className="meta la-status"><span className="la-dot" aria-hidden="true" />{identity.status} · {identity.location}</span>
            </div>
          </section>

          <section id="work" aria-labelledby="la-work-h" className="la-section">
            <div className="la-section-head">
              <h2 id="la-work-h">Selected work</h2>
              <span className="meta">problem → what I built → result</span>
            </div>
            <ol className="la-work">
              {work.map((w) => (
                <li key={w.slug} className="la-row">
                  <Link to={w.href} className="la-row-link">
                    <div className="la-row-main">
                      <p className="meta">{w.kind} · {w.year}</p>
                      <h3>{w.title}<ArrowRight className="la-arrow" size={16} aria-hidden="true" /></h3>
                      <p className="la-problem">{w.problem}</p>
                      <p className="la-built">{w.built}</p>
                    </div>
                    <div className="la-result">
                      {w.result ? (
                        <>
                          <span className="la-result-value num">{w.result.value}</span>
                          <span className="la-result-label">{w.result.label}</span>
                        </>
                      ) : (
                        <span className="la-result-label">{w.resultNote}</span>
                      )}
                    </div>
                  </Link>
                  <p className="meta la-row-foot">
                    <span>{w.hrefLabel}</span>
                    {w.repo && <> · <a className="link" href={w.repo} target="_blank" rel="noopener noreferrer">Source<ArrowUpRight size={12} aria-hidden="true" /></a></>}
                    {w.result && w.resultNote && <> · {w.resultNote}</>}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="la-prod-h" className="la-section">
            <div className="la-section-head">
              <h2 id="la-prod-h">In production at {identity.employer}</h2>
              <span className="meta">{identity.since} – now</span>
            </div>
            <dl className="la-prod">
              {production.map((p) => (
                <div key={p.title}>
                  <dt>{p.title}</dt>
                  <dd>{p.detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          <figure className="la-quote la-section">
            <blockquote>“{proof.quote}”</blockquote>
            <figcaption className="meta">{proof.author}, {proof.role} · {proof.source}</figcaption>
          </figure>

          <section id="writing" aria-labelledby="la-writing-h" className="la-section">
            <div className="la-section-head">
              <h2 id="la-writing-h">Writing</h2>
              <Link to="/blog" className="meta link">All posts</Link>
            </div>
            <ul className="la-writing">
              {writing.map((p) => (
                <li key={p.href}><Link to={p.href} className="link">{p.title}</Link><span className="meta num">{p.date}</span></li>
              ))}
            </ul>
          </section>

          <footer className="la-foot la-section">
            <p className="la-foot-line">If your team needs reliable GenAI shipped end to end, let’s talk.</p>
            <div className="la-cta">
              <button type="button" className="btn btn-primary"><Calendar size={18} aria-hidden="true" />Book a 30-min intro</button>
              <a className="link" href={`mailto:${identity.email}`}>{identity.email}</a>
            </div>
            <p className="meta"><a className="link" href={identity.github}>GitHub</a> · <a className="link" href={identity.linkedin}>LinkedIn</a></p>
          </footer>
        </main>
      </div>
    </LabFrame>
  )
}
