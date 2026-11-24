import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { SiteFooter } from './site/SiteChrome'

type Post = { slug: string; title: string; date: string; summary: string; tags: readonly string[] }

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/** "August 27, 2025" or "August 2026" → sortable key, year, and a short month. Parsed by hand: Safari won't parse "August 2026". */
function parseDate(date: string) {
  const year = Number(date.match(/\d{4}/)?.[0] ?? 0)
  const month = Math.max(0, MONTHS.indexOf(date.slice(0, 3).toLowerCase()))
  return { key: year * 12 + month, year, month: date.slice(0, 3) }
}

export default function BlogPage() {
  const posts = (translations.en.blog.items as readonly Post[])
    .map((p) => ({ ...p, when: parseDate(p.date) }))
    .sort((a, b) => b.when.key - a.when.key)
  const years = [...new Set(posts.map((p) => p.when.year))]

  usePageSeo({
    title: 'Blog | Subash Pandey',
    description: 'Blog by Subash Pandey. Writing about ML, data science, and things learned along the way.',
    path: '/blog',
  })

  return (
    <main id="main-content" className="site">
      <div className="site-col">
        <header className="site-intro">
          <h1>Blog</h1>
          <p>Long-form write-ups of what I built and measured, including the experiments that failed.</p>
        </header>

        <div className="bl">
          {years.map((year) => (
            <section key={year} className="bl-year" aria-labelledby={`bl-${year}`}>
              <h2 id={`bl-${year}`} className="bl-year-label">{year}</h2>
              <ol className="bl-list">
                {posts.filter((p) => p.when.year === year).map((post) => (
                  <li key={post.slug}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="bl-link"
                      onClick={() => posthog.capture('blog_post_clicked', { slug: post.slug, placement: 'catalog' })}
                    >
                      <span className="bl-title">{post.title}<ArrowRight size={16} aria-hidden="true" /></span>
                      <span className="bl-summary">{post.summary}</span>
                      <span className="bl-meta"><time>{post.when.month}</time>{post.tags.length > 0 && <> · {post.tags.slice(0, 3).join(' · ')}</>}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
        <p className="ledger-after">Shorter lessons live in <Link className="link" to="/notes">technical notes</Link>.</p>
      </div>
      <SiteFooter placement="footer" />
    </main>
  )
}
