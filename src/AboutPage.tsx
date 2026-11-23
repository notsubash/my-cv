import { Link } from 'react-router-dom'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import { CvDownload, SiteFooter } from './site/SiteChrome'

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
    <figure className={portrait ? 'about-portrait' : undefined}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="w-full h-auto rounded-lg border" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

export default function AboutPage() {
  const t = translations.en

  usePageSeo({
    title: 'About | Subash Pandey',
    description: 'About Subash Pandey — AI/ML engineer from Kathmandu. Exeter MSc, GenAI in production, open to remote roles.',
    path: '/about',
  })

  return (
    <main id="main-content" className="site">
      <article className="post about">
        <figure className="about-lead">
          <img src="/UK_stay-800.webp" srcSet="/UK_stay-480.webp 480w, /UK_stay-800.webp 800w, /UK_stay.webp 1200w" sizes="(min-width: 1000px) 46rem, calc(100vw - 2rem)" alt="Subash with Tower Bridge and the Thames behind him in London" width={1200} height={900} fetchPriority="high" decoding="async" />
          <figcaption>A grey day in London, during the MSc years.</figcaption>
        </figure>
        <header>
          <h1>Hello, I’m Subash.</h1>
          <p>An AI/ML engineer from Kathmandu who likes taking ideas past the demo and into something people use.</p>
          <p className="about-actions">
            <CvDownload placement="about" className="btn btn--quiet">Download CV</CvDownload>
            <Link className="link" to="/cv">Full experience</Link>
          </p>
        </header>

        <div className="prose-custom">
          <section>
            <h2>Where I started</h2>
            <p>
              I'm from Kathmandu. Midway through my bachelor's in computing, I was doing data analysis and started messing around with tools like Weka. That was the spark. Watching a model learn from a dataset felt weirdly fun, so I kept going deeper into ML and GenAI.
            </p>
            <p>
              I finished a BSc (Hons) in Computing with <strong>London Metropolitan University</strong> (2:1), then did an MSc in Data Science at the <strong>University of Exeter</strong> (Merit). Somewhere in there, this stopped being a side hobby and became the thing I actually wanted to build for a living.
            </p>
          </section>

          <section>
            <h2>Exeter days</h2>
            <p>
              Studying in the UK was a lot. One month I had five exams, a thesis to submit, and a part-time job so I could cover living costs. It was chaotic, but I look back on it fondly. I learned I can handle a packed calendar and still enjoy the ride.
            </p>
            <p>Graduation day felt great. Worth every late night.</p>
            <StoryPhoto src="/graduation.webp" alt="Subash in graduation gown beside the University of Exeter plaque" caption="Graduation day at Exeter" width={1200} height={911} />
          </section>

          <section>
            <h2>UK years, then home</h2>
            <p>
              Living abroad wasn't only lectures. I got to wander, meet people, and take photos like the one at the top of this page, when London's sky was doing its usual grey thing.
            </p>
            <p>
              Now I'm back in Kathmandu, working remotely. I like problems where automation makes someone's day easier: chat systems, voice features, evaluation, assessment tools, and the product pieces around them. Different projects, same curiosity.
            </p>
          </section>

          <section>
            <h2>How I work</h2>
            <p>
              I enjoy taking an idea past the demo and into something people can actually use. {t.summary.p2}{' '}
              <strong>{t.summary.p2Highlight}</strong>
              {t.summary.p2End}
            </p>
            <dl className="about-skills">
              {t.coreCompetencies.items.map((item) => (
                <div key={item.title}>
                  <dt>{item.title}</dt>
                  <dd>{item.desc}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2>Outside the laptop</h2>
            <p>
              What I treasure most from all of this is the friends and people I met. Shared laughs, shared stress, shared nights out. That stuff stays with you.
            </p>
            <p>
              Away from work I play football and watch a lot of it. Real Madrid is my club. I like travelling whenever I get the chance, and I happily lose an afternoon in a gallery.
            </p>
            <p>
              These two are from a talk I gave at Prime College to bachelor's students. The title was “AI in Nepal: Where We Stand and Where We're Headed.”
            </p>
            <StoryPhoto src="/prime-college-talk.webp" alt="Subash speaking at a Prime College podium, holding a microphone in front of a projected slide" caption="Prime College, mid-talk" width={1200} height={674} />
            <StoryPhoto src="/prime-college-group.webp" alt="Subash with bachelor's students at Prime College after the talk, holding a wooden plaque" caption="After the talk, plaque in hand" width={1200} height={674} />
            <p>
              And this one is after getting soaked in heavy rain. We finally sat down for food and I was just glad to be dry, warm, and about to eat.
            </p>
            <StoryPhoto src="/personal-pic.webp" alt="Subash smiling with arms up at a cafe, ready for a meal after the rain" caption="Post-rain meal energy" width={900} height={1200} portrait />
          </section>

          <section>
            <h2>What I'm looking for</h2>
            <p>
              Remote AI/ML or GenAI roles where I can help build things end to end. I'm based in Kathmandu (UTC+5:45) and keep overlap with US and EU teams.
              The full record is on my <Link to="/cv">experience page</Link>, or <CvDownload placement="about_body">download the CV</CvDownload>.
            </p>
          </section>

        </div>

        <SiteFooter placement="about" />
      </article>
    </main>
  )
}
