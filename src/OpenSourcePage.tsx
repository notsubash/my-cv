import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { formatStars, ossContributions as contributions, ossRepos as repos, parseTitle, prUrl } from './open-source'
import { SiteFooter } from './site/SiteChrome'

export default function OpenSourcePage() {
  usePageSeo({
    title: 'Open Source | Subash Pandey',
    description: 'Pull requests Subash Pandey has had merged into open source projects.',
    path: '/open-source',
  })

  const prCount = `${contributions.length} merged pull ${contributions.length === 1 ? 'request' : 'requests'}`
  const repoCount = `${repos.length} ${repos.length === 1 ? 'project' : 'projects'}`

  return (
    <main id="main-content" className="site">
      <div className="site-col">
        <header className="site-intro">
          <h1>Open source</h1>
          <p>
            <span className="mark-static">{prCount}</span> across {repoCount} I don’t maintain. My own work is on the{' '}
            <Link className="link" to="/#work">homepage</Link>.
          </p>
        </header>

        {repos.map((repo) => {
          const prs = contributions.filter((c) => c.repo === repo.name)
          const repoUrl = `https://github.com/${repo.name}`
          return (
            <section key={repo.name} className="site-section oss-repo" aria-labelledby={`oss-${repo.name}`}>
              <div className="site-head">
                <h2 id={`oss-${repo.name}`}>
                  <a
                    className="link"
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'open_source_repo', url: repoUrl })}
                  >
                    {repo.name}
                  </a>
                </h2>
                <p>{repo.language} · {formatStars(repo.stars)} stars</p>
              </div>
              <p className="oss-desc">{repo.description}</p>
              <ol className="ledger">
                {prs.map((pr) => {
                  const { type, scope, summary } = parseTitle(pr.title)
                  const url = prUrl(pr.repo, pr.number)
                  return (
                    <li key={pr.number} className="ledger-row ledger-row--static oss-pr">
                      <p className="ledger-meta num">#{pr.number}</p>
                      <div>
                        <a
                          className="ledger-title oss-pr-link"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'open_source_pr', url })}
                        >
                          {summary}
                          <ArrowUpRight size={15} aria-hidden="true" />
                          <span className="sr-only"> (pull request #{pr.number}, opens GitHub)</span>
                        </a>
                        {(type || pr.related) && (
                          <p className="ledger-tags">
                            {type && <>{type}{scope ? `: ${scope}` : ''}</>}
                            {pr.related && (
                              <>
                                {type && <span aria-hidden="true"> · </span>}
                                <a className="link" href={prUrl(pr.repo, pr.related)} target="_blank" rel="noopener noreferrer">related #{pr.related}</a>
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>
      <SiteFooter placement="footer" />
    </main>
  )
}
