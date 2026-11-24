import { usePageSeo } from './hooks/usePageSeo'
import { CvDownload, SiteFooter } from './site/SiteChrome'
import { INSTAGRAM_HANDLE, photos } from './about/about-content'
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

        <div className="ab-text ab-lead">
          <h1 id="ab-title">Hello, I’m Subash.</h1>
          <p>
            I’m drawn to problems where the answer matters to someone real, and that pull has carried me from data analysis into machine learning and now into language-model systems.
          </p>
        </div>

        <div className="ab-rest">
          <p>
            I’ve learned that the best work starts with honest scoping and a clear picture of what success looks like. Working with remote, cross-functional teams has taught me to translate business goals into model behaviour, and to speak plainly about what’s possible.
          </p>
          <p>
            Away from the keyboard, I follow Real Madrid, travel when I can, ride my bike and spend time with my family. I also create for The Underlying Curve, where I try to make machine learning ideas feel clear and a little fun.
          </p>
          <p className="ab-cv"><CvDownload placement="about" className="link">View my CV</CvDownload></p>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="ab-insta" aria-labelledby="ab-insta-h">
          <h2 id="ab-insta-h">Instagram</h2>
          <p>
            Instagram is where I share some of life’s adventures.
            {INSTAGRAM_HANDLE && (
              <>
                {' '}I’d love to connect with you, so feel free to follow me{' '}
                <strong className="ab-handle">@{INSTAGRAM_HANDLE}</strong>.
              </>
            )}
          </p>
          <ul className="ab-grid">
            {photos.map((ph) => (
              <li key={ph.src} className={ph.wide ? 'is-wide' : undefined}>
                <a href={ph.href ?? ph.src} target="_blank" rel="noopener noreferrer" aria-label={`${ph.alt} (opens full size)`}>
                  <img src={ph.src} alt="" loading="lazy" decoding="async" width={ph.width} height={ph.height} />
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
