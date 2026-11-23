import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { CvDownload, SiteFooter } from './site/SiteChrome'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, photos } from './about/about-content'
import './site/about.css'

export default function AboutPage() {
  usePageSeo({
    title: 'About | Subash Pandey',
    description: 'About Subash Pandey — AI/ML engineer from Kathmandu. Exeter MSc, GenAI in production, open to remote roles.',
    path: '/about',
  })

  return (
    <main id="main-content" className="site">
      <section className="ab-intro" aria-labelledby="ab-title">
        <figure className="ab-photo">
          <img
            src="/UK_stay-800.webp"
            srcSet="/UK_stay-480.webp 480w, /UK_stay-800.webp 800w, /UK_stay.webp 1200w"
            sizes="(min-width: 900px) 34rem, calc(100vw - 2rem)"
            alt="Subash with Tower Bridge and the Thames behind him in London"
            width={1200}
            height={900}
            fetchPriority="high"
            decoding="async"
          />
        </figure>

        <div className="ab-text">
          <h1 id="ab-title">Hello, I’m Subash.</h1>
          <p>
            I’ve always liked problems where the answer has to be measured, not guessed. That pulled me from data analysis into
            machine learning, and from there into building language-model systems that people rely on every day.
          </p>
          <p>
            At Scopic Software I build and evaluate GenAI features end to end: retrieval and agents with LangGraph, the voice layer
            of an AI receptionist, and the evaluation pipelines that decide what ships. The work I’m proudest of is usually the
            measurement, like proving a cheaper model is the better one, or that an impressive score was leakage.
          </p>
          <p>
            Working with remote, cross-functional teams has taught me to translate business goals into model behaviour, and to scope
            work honestly before it starts.
          </p>
          <p>
            I studied Computing at London Metropolitan University and Data Science at the University of Exeter. I’m currently an
            AI/ML Engineer at Scopic Software, and open to remote roles.
          </p>
          <p>
            When I’m not building, I’m playing or watching football (Real Madrid), travelling, losing an afternoon in a gallery, or
            animating machine-learning ideas for The Underlying Curve.
          </p>
          <p className="ab-cv"><CvDownload placement="about" className="link">View my CV</CvDownload></p>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="ab-insta" aria-labelledby="ab-insta-h">
          <h2 id="ab-insta-h">Instagram</h2>
          <p>
            Instagram is where I share a bit of life outside work.
            {INSTAGRAM_URL && (
              <>
                {' '}Feel free to follow along{' '}
                <a className="link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                  onClick={() => posthog.capture('outbound_link_clicked', { destination: 'instagram', placement: 'about' })}>
                  @{INSTAGRAM_HANDLE}
                </a>.
              </>
            )}
          </p>
          <ul className="ab-grid">
            {photos.map((ph) => (
              <li key={ph.src}>
                <a href={ph.href ?? ph.src} target="_blank" rel="noopener noreferrer" aria-label={`${ph.alt} (opens full size)`}>
                  <img src={ph.src} alt="" loading="lazy" decoding="async" width={600} height={600} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SiteFooter placement="about" width="wide" />
    </main>
  )
}
