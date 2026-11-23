import { Link } from 'react-router-dom'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { SiteFooter } from './site/SiteChrome'

type Post = { slug: string; title: string; date: string; summary: string; tags: readonly string[]; image?: string }

function PostCard({ post, lead = false, eager = false }: { post: Post; lead?: boolean; eager?: boolean }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      onClick={() => posthog.capture('blog_post_clicked', { slug: post.slug, placement: 'catalog' })}
      className={`wr-card${lead ? ' wr-card--lead' : ''}`}
    >
      {post.image && (
        <span className="wr-cover">
          <img src={post.image} alt="" width={1200} height={630} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        </span>
      )}
      <span className="wr-body">
        <time className="wr-date">{post.date}</time>
        <span className="wr-title">{post.title}</span>
        <span className="wr-summary">{post.summary}</span>
        <span className="wr-tags">{post.tags.join(' · ')}</span>
      </span>
    </Link>
  )
}

export default function BlogPage() {
  const t = translations.en
  const posts = t.blog.items as readonly Post[]
  const [lead, ...rest] = posts

  usePageSeo({
    title: 'Blog | Subash Pandey',
    description: 'Blog by Subash Pandey. Writing about ML, data science, and things learned along the way.',
    path: '/blog',
  })

  return (
    <main id="main-content" className="site">
      <div className="site-col site-col--wide">
        <header className="site-intro">
          <h1>Writing</h1>
          <p>Long-form write-ups of what I built and measured, including the experiments that failed.</p>
        </header>

        {lead && <PostCard post={lead} lead eager />}
        <div className="wr-grid">
          {rest.map((post, i) => <PostCard key={post.slug} post={post} eager={i < 2} />)}
        </div>
        <p className="ledger-after">Shorter lessons live in <Link className="link" to="/notes">technical notes</Link>.</p>
      </div>
      <SiteFooter placement="footer" width="wide" />
    </main>
  )
}
