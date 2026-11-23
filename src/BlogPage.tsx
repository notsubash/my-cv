import { Link } from 'react-router-dom'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { SiteFooter } from './site/SiteChrome'

export default function BlogPage() {
  const t = translations.en
  const posts = t.blog.items

  usePageSeo({
    title: 'Blog | Subash Pandey',
    description: 'Blog by Subash Pandey. Writing about ML, data science, and things learned along the way.',
    path: '/blog',
  })

  return (
    <main id="main-content" className="site">
      <div className="site-col">
        <header className="site-intro">
          <h1>Writing</h1>
          <p>Long-form write-ups of what I built and measured, including the experiments that failed.</p>
        </header>

        <ol className="ledger">
          {posts.map((post, index) => (
            <li key={post.slug} className="ledger-row">
              <Link
                to={`/blog/${post.slug}`}
                onClick={() => posthog.capture('blog_post_clicked', { slug: post.slug, placement: 'catalog' })}
                className="ledger-link ledger-link--media"
              >
                <div className="ledger-main">
                  <p className="ledger-meta"><time>{post.date}</time></p>
                  <h2 className="ledger-title">{post.title}</h2>
                  <p className="ledger-text">{post.summary}</p>
                  <p className="ledger-tags">{post.tags.join(' · ')}</p>
                </div>
                {post.image && (
                  <img
                    className="ledger-thumb"
                    src={post.image}
                    alt=""
                    width={320}
                    height={180}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                )}
              </Link>
            </li>
          ))}
        </ol>
        <p className="ledger-after">Shorter lessons live in <Link className="link" to="/notes">technical notes</Link>.</p>
      </div>
      <SiteFooter placement="footer" />
    </main>
  )
}
