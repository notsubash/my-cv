import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { person } from './home/home-content'
import { archive, moreWork, practice, repoUrl, type Repo, type RepoLink } from './projects/projects-content'
import { WorkList } from './projects/WorkList'
import { StackRange } from './home/StackRange'
import { SiteFooter } from './site/SiteChrome'

const trackRepo = (repo: Repo, section: string, link_type = 'repository') => posthog.capture('project_link_clicked', {
  link_type, project_title: repo.title, placement: `projects_${section}`,
})

function ExtraLink({ repo, link, section }: { repo: Repo; link: RepoLink; section: string }) {
  const onClick = () => trackRepo(repo, section, link.label.toLowerCase().replace(/\s+/g, '_'))
  return link.internal
    ? <Link className="link" to={link.href} onClick={onClick}>{link.label}</Link>
    : (
      <a className="link" href={link.href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {link.label}<span className="sr-only"> for {repo.title} (opens in a new tab)</span>
      </a>
    )
}

/** Mid-size builds: enough to read a paragraph about, with every place the work lives. */
function RepoList({ repos }: { repos: readonly Repo[] }) {
  return (
    <ul className="pj-repos">
      {repos.map((repo) => (
        <li key={repo.name} className="pj-repo">
          <div className="pj-repo-main">
            <a className="pj-repo-title" href={repoUrl(repo)} target="_blank" rel="noopener noreferrer" onClick={() => trackRepo(repo, 'more')}>
              {repo.title}
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> (opens GitHub)</span>
            </a>
            <p className="pj-repo-desc">{repo.description}</p>
          </div>
          <p className="pj-repo-meta">{repo.language} · {repo.year}</p>
          {repo.links && (
            <p className="pj-repo-links">
              {repo.links.map((l) => <ExtraLink key={l.label} repo={repo} link={l} section="more" />)}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}

/** One line per repo, the year in the margin: practice logs and the archive. */
function RepoIndex({ repos, section }: { repos: readonly Repo[]; section: 'practice' | 'archive' }) {
  return (
    <ol className="pj-index">
      {repos.map((repo) => (
        <li key={repo.name} className="pj-index-row">
          <a className="pj-index-link" href={repoUrl(repo)} target="_blank" rel="noopener noreferrer" onClick={() => trackRepo(repo, section)}>
            <span className="pj-index-year">{repo.year}</span>
            <span className="pj-index-title">
              {repo.title}
              <ArrowUpRight size={14} aria-hidden="true" />
            </span>
            <span className="pj-index-desc">{repo.description}</span>
            <span className="pj-index-lang">{repo.language}</span>
            <span className="sr-only"> (opens GitHub)</span>
          </a>
          {repo.links && (
            <p className="pj-index-extra">
              {repo.links.map((l) => <ExtraLink key={l.label} repo={repo} link={l} section={section} />)}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}

export default function ProjectsPage() {
  usePageSeo({
    title: 'Projects | Subash Pandey',
    description: 'LLM systems, agent tooling, MLOps and ML evaluation work by Subash Pandey, with results, write-ups and code.',
    path: '/projects',
  })

  return (
    <main id="main-content" className="site pj">
      <div className="site-col site-col--wide">
        <header className="site-intro">
          <h1>Projects</h1>
          <p>
            What I’ve built, with the result each one produced. Everything with code is on{' '}
            <a className="link" href={person.github} target="_blank" rel="noopener noreferrer"
              onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'projects_intro' })}>GitHub</a>.
          </p>
        </header>

        <section id="work" aria-labelledby="pj-work-h" className="site-section">
          <div className="site-head">
            <h2 id="pj-work-h">Selected work</h2>
            <p>What it is, and what it achieved</p>
          </div>
          <WorkList placement="projects" />
        </section>

        <section aria-labelledby="pj-more-h" className="site-section">
          <div className="site-head">
            <h2 id="pj-more-h">More from GitHub</h2>
            <p>Smaller builds and earlier work</p>
          </div>
          <RepoList repos={moreWork} />
        </section>

        <section aria-labelledby="pj-practice-h" className="site-section">
          <div className="site-head">
            <h2 id="pj-practice-h">Practice</h2>
            <p>Learning in public</p>
          </div>
          <RepoIndex repos={practice} section="practice" />
        </section>

        <section aria-labelledby="pj-archive-h" className="site-section">
          <div className="site-head">
            <h2 id="pj-archive-h">Archive</h2>
            <p>Older work, kept as it was</p>
          </div>
          <RepoIndex repos={archive} section="archive" />
        </section>

        <p className="ledger-after">
          Pull requests to projects I don’t maintain are on the <Link className="link" to="/open-source">open source</Link> page.
        </p>

        <div className="pj-range">
          <StackRange />
        </div>
      </div>
      <SiteFooter placement="footer" width="wide" />
    </main>
  )
}
