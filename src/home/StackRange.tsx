import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import posthog from '../posthog'
import { getTechIcon } from '../tech-icons'
import { range, type RangeRow } from './home-content'
import './stack-range.css'

function Tech({ name }: { name: string }) {
  const icon = getTechIcon(name)
  return (
    <li className="sr-tech" style={icon ? { '--brand': icon.color } as CSSProperties : undefined}>
      {icon?.path && <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" focusable="false"><path d={icon.path} /></svg>}
      {name}
    </li>
  )
}

function RowLink({ row, children }: { row: RangeRow; children: ReactNode }) {
  const onClick = () => posthog.capture('project_link_clicked', { link_type: row.external ? 'external' : 'case_study', project_title: row.project, placement: 'home_range' })
  return row.external
    ? <a className="sr-row" href={row.href} target="_blank" rel="noopener noreferrer" onClick={onClick}>{children}<span className="sr-only"> (opens in a new tab)</span></a>
    : <Link className="sr-row" to={row.href} onClick={onClick}>{children}</Link>
}

/**
 * "The stack is a choice": the claim, proved by the ledger beside it. Each shipped project
 * lists its own stack, so the variety is visible before a word is read. The last line is left
 * open for the visitor's project.
 */
export function StackRange() {
  return (
    <section className="sr" aria-labelledby="sr-claim">
      <div className="sr-head">
        <h2 id="sr-claim" className="sr-claim">
          {range.claim}
        </h2>
        <p className="sr-caption">{range.caption}</p>
      </div>

      <ol className="sr-rows">
        {range.rows.map((row) => (
          <li key={row.project}>
            <RowLink row={row}>
              <span className="sr-project">
                {row.project}
                {row.external
                  ? <ArrowUpRight size={15} className="sr-arrow sr-arrow--out" aria-hidden="true" />
                  : <ArrowRight size={15} className="sr-arrow" aria-hidden="true" />}
              </span>
              <span className="sr-leader" aria-hidden="true" />
              <ul className="sr-stack" aria-label={`Built with ${row.stack.join(', ')}`}>
                {row.stack.map((t) => <Tech key={t} name={t} />)}
              </ul>
            </RowLink>
          </li>
        ))}
        <li>
          <Link className="sr-row sr-row--yours" to="/contact" onClick={() => posthog.capture('contact_cta_clicked', { placement: 'home_range' })}>
            <span className="sr-project">Your project<ArrowRight size={15} className="sr-arrow" aria-hidden="true" /></span>
            <span className="sr-leader" aria-hidden="true" />
            <span className="sr-stack sr-open">
              <span className="sr-slot" aria-hidden="true"><Plus size={14} /></span>
              whatever it needs
            </span>
          </Link>
        </li>
      </ol>
    </section>
  )
}
