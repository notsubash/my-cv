import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Tag, PenLine } from 'lucide-react'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'

export default function BlogPage() {
  const t = translations.en
  const posts = t.blog.items

  usePageSeo({
    title: 'Blog | Subash Pandey',
    description: 'Blog by Subash Pandey. Writing about ML, data science, and things learned along the way.',
    path: '/blog',
  })

  return (
    <main id="main-content" className="min-h-screen bg-background">
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
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                onClick={() => posthog.capture('blog_post_clicked', { slug: post.slug, placement: 'catalog' })}
                className="block group rounded-xl"
              >
                <article className="rounded-xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start">
                    <div className="w-full shrink-0 sm:w-[42%] sm:p-5 sm:pr-0">
                      <div className="aspect-[16/9] overflow-hidden bg-muted sm:rounded-lg sm:ring-1 sm:ring-border">
                        <img
                          src={post.image}
                          alt=""
                          width={1200}
                          height={630}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          fetchPriority={index === 0 ? 'high' : undefined}
                          className="h-full w-full object-cover object-center transform-gpu backface-hidden motion-safe:transition-transform motion-safe:duration-[1200ms] motion-safe:ease-out motion-safe:will-change-transform motion-safe:group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col p-5">
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <time>{post.date}</time>
                      </div>
                      <h2 className="mb-2 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>
                      <p className="mb-3 text-sm text-muted-foreground">
                        {post.summary}
                      </p>
                      <div className="mt-auto flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              <Tag className="w-3 h-3" aria-hidden="true" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                          {t.blog.readMore}
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
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
