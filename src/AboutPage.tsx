import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { CvDownload, SiteFooter } from './site/SiteChrome'
import { INSTAGRAM_URL, photos, recentWork, skills, workedWith } from './about/about-content'

export default function AboutPage() {
  usePageSeo({
    title: 'About | Subash Pandey',
    description: 'About Subash Pandey — AI/ML engineer from Kathmandu. Exeter MSc, GenAI in production, open to remote roles.',
    path: '/about',
  })

  return (
    <main id="main-content" className="site">
      <article className="post about">
        <header>
          <h1>Hello, I’m Subash.</h1>
        </header>

        <figure className="about-lead">
          <img
            src="/UK_stay-800.webp"
            srcSet="/UK_stay-480.webp 480w, /UK_stay-800.webp 800w, /UK_stay.webp 1200w"
            sizes="(min-width: 1000px) 46rem, calc(100vw - 2rem)"
            alt="Subash with Tower Bridge and the Thames behind him in London"
            width={1200}
            height={900}
            fetchPriority="high"
            decoding="async"
          />
        </figure>

        <div className="prose-custom about-bio">
          <p>
            I’m an AI/ML engineer from Kathmandu, Nepal. For the past two and a half years I’ve built language-model systems that
            people use every day: a sales chatbot that qualifies leads inside a CRM, the voice layer of an AI receptionist in
            production, and the evaluation pipelines that tell my team whether a change made any of it better.
          </p>
          <p>
            Since October 2024 I’ve worked remotely at Scopic Software. Most weeks are LangGraph, retrieval and evaluation: deciding
            what a model should do, measuring whether it does it, and making it cheaper and faster once it does. My most recent piece
            of work there was a replacement for our GPT-4o-mini routing classifier that beat it on our golden set, 88% against 80% on
            handler accuracy, at roughly a sixth of the cost and under a third of the latency.
          </p>
          <p>
            I didn’t start in machine learning. Halfway through a computing degree I was doing data analysis, opened Weka, and watched
            a model learn from a dataset for the first time. It felt weirdly fun, so I kept going. I finished a BSc in Computing at
            London Metropolitan University, worked as a data analyst in Kathmandu, then went back to the UK for an MSc in Data Science
            at the University of Exeter. One month there I had five exams, a thesis due and a part-time job to cover living costs.
            The thesis mapped 27,000 Steam games into genre communities.
          </p>
          <p>
            The part of the job I care about most is the unglamorous part: honest evaluation splits, tests that fail when they should,
            and write-ups that include the experiments that didn’t work. My activity-recognition rebuild exists because a 0.89 score
            turned out to be leakage. My world-model project is documented mostly through the ways it failed. I would rather ship a
            smaller claim that holds up than a big one that doesn’t.
          </p>
          <p>
            Outside work I play football and watch far too much of it (Real Madrid), travel when I can, and happily lose an afternoon
            in a gallery. I also make <Link to="/projects/the-underlying-curve">The Underlying Curve</Link>, short silent animations
            that explain one machine-learning idea at a time; it reached 100,000 views in its first 40 days. I’ve also spoken to
            bachelor’s students at Prime College, Kathmandu, about where AI in Nepal stands and where it’s headed.
          </p>
          <p>
            I’m open to remote AI/ML engineering roles, and I keep working hours that overlap with Europe and the US. If that sounds
            useful for your team, <Link to="/cv">the full record is here</Link>.
          </p>
        </div>

        <p className="about-actions">
          <CvDownload placement="about" className="btn btn--primary">Download CV</CvDownload>
          <Link className="link" to="/cv">Full experience</Link>
        </p>

        <section className="about-block" aria-labelledby="about-skills">
          <h2 id="about-skills" className="sr-only">Skills and education</h2>
          <dl className="about-lines">
            {skills.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="about-block" aria-labelledby="about-recent">
          <h2 id="about-recent">Recent work.</h2>
          <ul className="about-recent">
            {recentWork.map((w) => (
              <li key={w.title}>
                {w.external ? (
                  <a className="link" href={w.href} target="_blank" rel="noopener noreferrer">{w.title}<ArrowUpRight size={14} aria-hidden="true" /></a>
                ) : (
                  <Link className="link" to={w.href}>{w.title}</Link>
                )}
                <span>{w.note}</span>
              </li>
            ))}
          </ul>
          <p className="about-more"><Link className="link" to="/#work">All selected work</Link></p>
        </section>

        <section className="about-block" aria-labelledby="about-with">
          <h2 id="about-with">Who I’ve worked with.</h2>
          <ul className="about-with">
            {workedWith.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </section>

        {photos.length > 0 && (
          <section className="about-block" aria-labelledby="about-insta">
            <div className="about-insta-head">
              <h2 id="about-insta">On Instagram.</h2>
              {INSTAGRAM_URL && (
                <a className="link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                  onClick={() => posthog.capture('outbound_link_clicked', { destination: 'instagram', placement: 'about' })}>
                  Follow along
                </a>
              )}
            </div>
            <ul className="about-grid">
              {photos.slice(0, 9).map((ph) => (
                <li key={ph.src}>
                  <a href={ph.href ?? ph.src} target="_blank" rel="noopener noreferrer" aria-label={`${ph.alt} (opens full size)`}>
                    <img src={ph.src} alt="" loading="lazy" decoding="async" width={600} height={600} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <SiteFooter placement="about" />
      </article>
    </main>
  )
}
