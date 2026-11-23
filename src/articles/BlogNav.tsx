import { Link, useLocation } from 'react-router-dom'
import { translations } from '../i18n'
import posthog from '../posthog'
import { SiteFooter } from '../site/SiteChrome'

/** End of every post: previous / next, then the booking question (placement "article"). */
export default function BlogNav() {
  const { pathname } = useLocation()
  const posts = translations.en.blog.items
  const currentSlug = pathname.replace('/blog/', '')
  const idx = posts.findIndex(p => p.slug === currentSlug)

  const prev = idx > 0 ? posts[idx - 1] : null
  const next = idx < posts.length - 1 ? posts[idx + 1] : null

  return (
    <>
      {(prev || next) && (
        <nav className="post-nav" aria-label="Blog navigation">
          {prev ? (
            <Link
              to={`/blog/${prev.slug}`}
              onClick={() => posthog.capture('blog_post_clicked', { slug: prev.slug, placement: 'article_nav' })}
              className="post-nav-link"
            >
              <span className="post-nav-dir">← Previous</span>
              <span className="post-nav-title">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link
              to={`/blog/${next.slug}`}
              onClick={() => posthog.capture('blog_post_clicked', { slug: next.slug, placement: 'article_nav' })}
              className="post-nav-link post-nav-link--next"
            >
              <span className="post-nav-dir">Next →</span>
              <span className="post-nav-title">{next.title}</span>
            </Link>
          ) : <span />}
        </nav>
      )}
      <SiteFooter placement="article" />
    </>
  )
}
