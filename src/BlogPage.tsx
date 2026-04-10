import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Tag, PenLine } from 'lucide-react'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'

export default function BlogPage() {
  const t = translations.en
  const posts = t.blog.items

  usePageSeo({
    title: 'Blog | Subash Pandey',
    description: 'Blog by Subash Pandey. Writing about ML, data science, and things learned along the way.',
    path: '/blog',
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back home
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <PenLine className="w-5 h-5 text-primary" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              {t.blog.title}
            </h1>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t.blog.subtitle}
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block group"
              >
                <article className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <time>{post.date}</time>
                  </div>
                  <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-primary font-medium inline-flex items-center gap-1 shrink-0 ml-4">
                      {t.blog.readMore}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <PenLine className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{t.blog.noPosts}</p>
          </div>
        )}

      </div>
    </main>
  )
}
