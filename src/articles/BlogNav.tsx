import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { translations } from '../i18n'

export default function BlogNav() {
  const { pathname } = useLocation()
  const posts = translations.en.blog.items
  const currentSlug = pathname.replace('/blog/', '')
  const idx = posts.findIndex(p => p.slug === currentSlug)

  const prev = idx > 0 ? posts[idx - 1] : null
  const next = idx < posts.length - 1 ? posts[idx + 1] : null

  if (!prev && !next) return null

  return (
    <nav className="mt-14 pt-8 border-t border-border" aria-label="Blog navigation">
      <div className="flex items-stretch gap-4">
        {prev ? (
          <Link
            to={`/blog/${prev.slug}`}
            className="flex-1 group p-4 rounded-xl border border-border hover:border-primary/30 transition-colors text-left"
          >
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1.5">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              Previous
            </span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {prev.title}
            </span>
          </Link>
        ) : <div className="flex-1" />}

        {next ? (
          <Link
            to={`/blog/${next.slug}`}
            className="flex-1 group p-4 rounded-xl border border-border hover:border-primary/30 transition-colors text-right"
          >
            <span className="text-xs text-muted-foreground flex items-center justify-end gap-1 mb-1.5">
              Next
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {next.title}
            </span>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </nav>
  )
}
