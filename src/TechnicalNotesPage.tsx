import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Code, Zap } from 'lucide-react'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'

const PAGE_SIZE = 6
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
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(notes.length / PAGE_SIZE))

  const pageNotes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return notes.slice(start, start + PAGE_SIZE)
  }, [notes, page])

  usePageSeo({
    title: 'Technical Notes | Subash Pandey',
    description: 'Bite-sized technical notes from real systems work across ML, RAG, and data engineering.',
    path: '/notes',
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back home
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              {t.technicalNotes.title}
            </h1>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t.technicalNotes.subtitle}
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageNotes.map((note, i) => (
            <article key={`${note.title}-${i}`} className="h-full p-5 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-md transition-all flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Code className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground leading-snug">{note.title}</h2>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{note.body}</p>
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/30">
                {note.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/8 text-primary/80">{tag}</span>
                ))}
              </div>
              {note.relatedBlog && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <Link
                    to={`/blog/${note.relatedBlog.slug}`}
                    className="inline-flex items-center gap-1.5 text-[11px] text-accent hover:text-accent/80 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Related article: {note.relatedBlog.title}
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm border border-border text-muted-foreground hover:text-primary hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, idx) => {
              const nextPage = idx + 1
              const active = nextPage === page
              return (
                <button
                  key={nextPage}
                  type="button"
                  onClick={() => setPage(nextPage)}
                  className={`w-9 h-9 rounded-lg text-sm border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:text-primary hover:border-primary/40'
                  }`}
                >
                  {nextPage}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm border border-border text-muted-foreground hover:text-primary hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
