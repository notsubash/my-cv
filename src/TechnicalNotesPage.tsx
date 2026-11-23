import { Link } from 'react-router-dom'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { SiteFooter } from './site/SiteChrome'

type TechnicalNote = {
  title: string
  body: string
  tags: readonly string[]
  relatedBlog?: {
    slug: string
    title: string
  }
}

export default function TechnicalNotesPage() {
  const t = translations.en
  const notes = t.technicalNotes.items as readonly TechnicalNote[]

  usePageSeo({
    title: 'Technical Notes | Subash Pandey',
    description: 'Bite-sized technical notes from real systems work across ML, RAG, and data engineering.',
    path: '/notes',
  })

  return (
    <main id="main-content" className="site">
      <div className="site-col">
        <header className="site-intro">
          <h1>{t.technicalNotes.title}</h1>
          <p>Short lessons from production work, each small enough to read in under a minute.</p>
        </header>

        <ol className="ledger">
          {notes.map((note, i) => (
            <li key={`${note.title}-${i}`} className="ledger-row ledger-row--static">
              <h2 className="ledger-title">{note.title}</h2>
              <p className="ledger-text">{note.body}</p>
              <p className="ledger-tags">
                {note.tags.join(' · ')}
                {note.relatedBlog && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <Link
                      className="link"
                      to={`/blog/${note.relatedBlog.slug}`}
                      onClick={() => posthog.capture('blog_post_clicked', { slug: note.relatedBlog?.slug, placement: 'notes' })}
                    >
                      From: {note.relatedBlog.title}
                    </Link>
                  </>
                )}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <SiteFooter placement="footer" />
    </main>
  )
}
