import type { CSSProperties } from 'react'
import { Briefcase, Crosshair, GraduationCap, Layers, MapPin } from 'lucide-react'
import { getTechIcon } from '../tech-icons'
import { person, profile } from './home-content'

export type LocalTime = { label: string; h: number; m: number }

/** A small watch face set to Kathmandu time. Hands only appear once the client knows the time. */
export function ClockFace({ time, size = 40 }: { time: LocalTime | null; size?: number }) {
  const hour = time ? ((time.h % 12) + time.m / 60) * 30 : 0
  const minute = time ? time.m * 6 : 0
  return (
    <svg className="ps-face" viewBox="-20 -20 40 40" width={size} height={size} aria-hidden="true" focusable="false">
      <circle r="18.5" className="ps-face-rim" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} y1={-15.5} y2={i % 3 === 0 ? -12.5 : -14} className="ps-face-tick" transform={`rotate(${i * 30})`} />
      ))}
      {time && (
        <>
          <line y1={2.5} y2={-8.5} className="ps-face-hour" transform={`rotate(${hour})`} />
          <line y1={3} y2={-13} className="ps-face-min" transform={`rotate(${minute})`} />
        </>
      )}
      <circle r="1.6" className="ps-face-pin" />
    </svg>
  )
}

/** The recruiter checklist as a spec sheet: one panel, five cells, each answering a screening question. */
export function ProfileSheet({ time }: { time: LocalTime | null }) {
  const { role, focus, stack, education, based } = profile
  return (
    <dl className="ps" aria-label="Profile at a glance">
      <div className="ps-cell ps-role">
        <dt><Briefcase size={14} aria-hidden="true" />Role</dt>
        <dd>
          <span className="ps-main">{role.title}</span>
          <span className="ps-sub">{role.org}</span>
        </dd>
      </div>

      <div className="ps-cell ps-focus">
        <dt><Crosshair size={14} aria-hidden="true" />Focus</dt>
        <dd>
          <ul className="ps-focus-list">
            {focus.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </dd>
      </div>

      <div className="ps-cell ps-stack">
        <dt><Layers size={14} aria-hidden="true" />Stack</dt>
        <dd>
          <ul className="ps-icons">
            {stack.map((name) => {
              const icon = getTechIcon(name)
              return (
                <li key={name} title={name} style={icon ? { '--brand': icon.color } as CSSProperties : undefined}>
                  {icon?.path
                    ? <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" focusable="false"><path d={icon.path} /></svg>
                    : <span className="ps-icon-fallback" aria-hidden="true">{name.slice(0, 2)}</span>}
                  <span className="sr-only">{name}</span>
                </li>
              )
            })}
          </ul>
        </dd>
      </div>

      <div className="ps-cell ps-edu">
        <dt><GraduationCap size={14} aria-hidden="true" />Education</dt>
        <dd>
          <span className="ps-main">{education.degree}</span>
          <span className="ps-sub">{education.school}</span>
        </dd>
      </div>

      <div className="ps-cell ps-based">
        <dt><MapPin size={14} aria-hidden="true" />Based</dt>
        <dd>
          <span className="ps-clock">
            <ClockFace time={time} />
            <span>
              <span className="ps-main ps-time">{time ? <time>{time.label}</time> : person.utcOffset}</span>
              <span className="ps-sub">
                {time ? `in ${based.city} · ${person.utcOffset}` : based.city} · {based.mode}
              </span>
            </span>
          </span>
        </dd>
      </div>
    </dl>
  )
}

/**
 * The same checklist as quiet ledger rows: label left, answer right, ruled like the rest of the site.
 * Swap <ProfileLedger> for <ProfileSheet> in App.tsx to go back to the panel.
 */
export function ProfileLedger({ time }: { time: LocalTime | null }) {
  const { focus, stack, based } = profile
  return (
    <dl className="pl" aria-label="Profile at a glance">
      <div>
        <dt>Focus</dt>
        <dd>
          <ul className="pl-focus">{focus.map((f) => <li key={f}>{f}</li>)}</ul>
        </dd>
      </div>
      <div>
        <dt>Stack</dt>
        <dd>
          <ul className="ps-icons pl-icons">
            {stack.map((name) => {
              const icon = getTechIcon(name)
              return (
                <li key={name} title={name} style={icon ? { '--brand': icon.color } as CSSProperties : undefined}>
                  {icon?.path
                    ? <svg viewBox="0 0 24 24" width={19} height={19} aria-hidden="true" focusable="false"><path d={icon.path} /></svg>
                    : <span className="ps-icon-fallback" aria-hidden="true">{name.slice(0, 2)}</span>}
                  <span className="sr-only">{name}</span>
                </li>
              )
            })}
          </ul>
        </dd>
      </div>
      <div>
        <dt>Based</dt>
        <dd className="pl-based">
          <ClockFace time={time} size={22} />
          {time && <><strong className="pl-time"><time>{time.label}</time></strong> in </>}
          {based.city}<span className="pl-sep" aria-hidden="true">·</span>{person.utcOffset}<span className="pl-sep" aria-hidden="true">·</span>{based.mode}
        </dd>
      </div>
    </dl>
  )
}
