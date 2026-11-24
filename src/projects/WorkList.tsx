import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import posthog from '../posthog'
import { work, type WorkItem } from '../home/home-content'
import './projects.css'

type Placement = 'projects'

function ProjectCard({ item, index, placement }: { item: WorkItem; index: number; placement: Placement }) {
  const track = (link_type: string) => posthog.capture('project_link_clicked', {
    link_type, project_title: item.title, position: index + 1, result_shown: Boolean(item.result), placement,
  })
  const featured = index === 0
  return (
    <li className={`pc${featured ? ' pc--feature' : ''}`}>
      <CardLink item={item} onClick={() => track(item.external ? 'external' : 'case_study')}>
        {item.image && (
          <span className={`pc-media${item.imageFit === 'contain' ? ' pc-media--contain' : ''}`}>
            <img src={item.image} alt="" width={1280} height={800} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
          </span>
        )}
        <span className="pc-body">
          <span className="pc-kind">{item.kind}</span>
          <h3 className="pc-title">
            {item.title}
            {item.href && (item.external
              ? <ArrowUpRight className="pc-arrow pc-arrow--out" size={18} aria-hidden="true" />
              : <ArrowRight className="pc-arrow" size={18} aria-hidden="true" />)}
          </h3>
          {item.result && (
            <span className="pc-result">
              <span className="pc-result-value">{item.result.value}</span>
              <span className="pc-result-label">{item.result.label}</span>
            </span>
          )}
          <span className="pc-summary">{item.summary}</span>
          {item.linkLabel && <span className="sr-only">. {item.linkLabel}{item.external ? ' (opens in a new tab)' : ''}</span>}
        </span>
      </CardLink>
      <p className="pc-foot">
        <span className="pc-tags">{item.tags.join(' · ')}</span>
        {item.repo && (
          <a className="link pc-repo" href={item.repo} target="_blank" rel="noopener noreferrer" onClick={() => track('repository')}>
            Code<ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only"> for {item.title} (opens GitHub)</span>
          </a>
        )}
      </p>
    </li>
  )
}

/** Internal case study, external product, or a plain block for confidential work. */
function CardLink({ item, onClick, children }: { item: WorkItem; onClick: () => void; children: ReactNode }) {
  if (!item.href) return <div className="pc-link pc-link--static">{children}</div>
  if (item.external) {
    return <a href={item.href} target="_blank" rel="noopener noreferrer" className="pc-link" onClick={onClick}>{children}</a>
  }
  return <Link to={item.href} className="pc-link" onClick={onClick}>{children}</Link>
}

/** Selected work: the first project as a wide feature, the rest as a two-column grid of image-led cards. */
export function WorkList({ placement }: { placement: Placement }) {
  return (
    <ol className="pc-grid">
      {work.map((item, i) => <ProjectCard key={item.slug} item={item} index={i} placement={placement} />)}
    </ol>
  )
}
