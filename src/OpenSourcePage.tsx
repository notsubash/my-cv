import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, GitMerge, Star } from 'lucide-react'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { formatStars, ossContributions as contributions, ossRepos as repos, parseTitle, prUrl } from './open-source'

const dateFormat = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

function formatDate(isoDate: string) {
  return dateFormat.format(new Date(`${isoDate}T00:00:00Z`))
}

export default function OpenSourcePage() {
  const t = translations.en.openSource

  usePageSeo({
    title: 'Open Source | Subash Pandey',
    description: 'Pull requests Subash Pandey has had merged into open source projects.',
    path: '/open-source',
  })

  const prCount = `${contributions.length} merged pull ${contributions.length === 1 ? 'request' : 'requests'}`
  const repoCount = `${repos.length} ${repos.length === 1 ? 'project' : 'projects'}`

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

        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <GitMerge className="w-5 h-5 text-primary" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">{t.title}</h1>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">{prCount}</span> across {repoCount} I don&apos;t maintain. My own work is in{' '}
            <Link to="/#projects" className="text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary transition-colors">
              projects
            </Link>
            .
          </p>
        </header>

        <div className="space-y-6">
          {repos.map((repo) => {
            const prs = contributions.filter((c) => c.repo === repo.name)
            if (prs.length === 0) return null
            return (
              <section key={repo.name} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
                <div className="p-5 border-b border-border/50">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a
                      href={`https://github.com/${repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'open_source_repo', url: `https://github.com/${repo.name}` })}
                      className="inline-flex items-center gap-1.5 font-display text-lg font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {repo.name}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/8 text-primary/80">{repo.language}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3" aria-hidden="true" />
                      {formatStars(repo.stars)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{repo.description}</p>
                </div>

                <ol className="divide-y divide-border/30">
                  {prs.map((pr) => {
                    const { type, scope, summary } = parseTitle(pr.title)
                    const url = prUrl(pr.repo, pr.number)
                    return (
                      <li key={pr.number} className="p-5 flex gap-3">
                        <GitMerge className="w-4 h-4 text-primary shrink-0 mt-1" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'open_source_pr', url })}
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors leading-snug"
                          >
                            {summary}
                          </a>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                            <span className="font-mono">#{pr.number}</span>
                            {type && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/8 text-primary/80">
                                {scope ? `${type}: ${scope}` : type}
                              </span>
                            )}
                            <time dateTime={pr.mergedAt}>Merged {formatDate(pr.mergedAt)}</time>
                            {pr.related && (
                              <a
                                href={prUrl(pr.repo, pr.related)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                Related: #{pr.related}
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}
