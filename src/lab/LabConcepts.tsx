import { type CSSProperties, type ReactNode } from 'react'
import { LabFrame } from './LabFrame'
import { person, profile } from '../home/home-content'
import { ClockFace, ProfileSheet } from '../home/ProfileSheet'
import { getTechIcon } from '../tech-icons'
import { useLocalTime } from '../site/useLocalTime'
import '../site/site.css'
import '../home/home.css'
import './lab-concepts.css'

// Hero headline and profile-sheet concepts, rendered with real content so they can be compared side by side.

function Concept({ id, name, note, children }: { id: string; name: string; note: string; children: ReactNode }) {
  return (
    <section className="lc-concept" aria-labelledby={`lc-${id}`}>
      <header className="lc-label">
        <span className="lc-id">{id}</span>
        <h2 id={`lc-${id}`}>{name}</h2>
        <p>{note}</p>
      </header>
      <div className="lc-stage">{children}</div>
    </section>
  )
}

function StackIcons() {
  return (
    <span className="lc-icons">
      {profile.stack.map((name) => {
        const icon = getTechIcon(name)
        return icon?.path
          ? <svg key={name} viewBox="0 0 24 24" width={18} height={18} aria-label={name} role="img" style={{ '--brand': icon.color } as CSSProperties}><path d={icon.path} /></svg>
          : null
      })}
    </span>
  )
}

export default function LabConcepts() {
  const time = useLocalTime(person.timeZone)
  return (
    <LabFrame title="Hero concepts">
      <main className="site lc">
        <div className="site-col">
          <header className="site-intro">
            <h1>Hero concepts</h1>
            <p>Headline ideas (H) and profile-sheet ideas (P), each with real copy. H0 and P0 are what’s live now.</p>
          </header>

          {/* ── headlines ───────────────────────────────────────── */}
          <Concept id="H0" name="Current: the reviewed sentence" note="One sentence, the pen draws under the two claims.">
            <p className="hm-lede">
              I’m Subash, an AI/ML engineer. I ship <mark className="hm-mark hm-mark--1">LLM systems to production</mark>, and
              I build the <mark className="hm-mark hm-mark--2">evaluations that prove they work</mark>.
            </p>
          </Concept>

          <Concept id="H1" name="Name as the headline" note="Your name set big like a masthead, the role statement underneath at reading size. Most memorable, least wordy.">
            <div className="h1-wrap">
              <p className="h1-name">Subash Pandey<span className="wordmark-dot h1-dot" aria-hidden="true" /></p>
              <p className="h1-role">AI/ML engineer. I ship <span className="pen">LLM systems to production</span> and build the evaluations that prove they work.</p>
            </div>
          </Concept>

          <Concept id="H2" name="Two verbs: Ship. Prove." note="The two halves of the job as giant verbs, each with its proof beside it. Reads like a contents page; strongest for skimmers.">
            <div className="h2-wrap">
              <p className="h2-intro">I’m Subash, an AI/ML engineer.</p>
              <dl className="h2-pairs">
                <div><dt>Ship.</dt><dd>LLM systems to production: RAG, agents, voice, and the backends they run on.</dd></div>
                <div><dt>Prove.</dt><dd>Evaluations that decide what’s ready: golden sets, LLM judges and honest test splits.</dd></div>
              </dl>
            </div>
          </Concept>

          <Concept id="H3" name="Annotated sentence" note="Today’s sentence, with a reviewer’s margin notes pointing at the evidence. Same voice, more proof in the first glance.">
            <div className="h3-wrap">
              <p className="hm-lede h3-lede">
                I’m Subash, an AI/ML engineer. I ship <span className="pen h3-a">LLM systems to production</span>, and
                I build the <span className="pen h3-b">evaluations that prove they work</span>.
              </p>
              <ul className="h3-notes">
                <li><span className="h3-n">1</span>A GenAI sales chatbot, an AI receptionist with a voice layer, an AI interviewer</li>
                <li><span className="h3-n">2</span>A routing model at 88% accuracy vs GPT-4o-mini’s 80%, about 6× cheaper</li>
              </ul>
            </div>
          </Concept>

          <Concept id="H4" name="The work first, the name second" note="Lead with the promise, sign it underneath. Feels like a studio, not a CV.">
            <div className="h4-wrap">
              <p className="h4-claim">LLM systems that <span className="pen">ship</span>, and the evaluations that <span className="pen">prove they work</span>.</p>
              <p className="h4-sign">
                <img src="/foto-avatar-sm.webp" alt="" width={40} height={40} />
                <span><strong>Subash Pandey</strong> · AI/ML engineer · Kathmandu, working remotely</span>
              </p>
            </div>
          </Concept>

          {/* ── profile sheet ───────────────────────────────────── */}
          <Concept id="P0" name="Current: spec panel" note="Six cells with hairlines, each with its own element (icons, clock, status).">
            <ProfileSheet time={time} />
          </Concept>

          <Concept id="P1" name="Ledger rows" note="A quiet two-column table, label left and answer right, ruled like the rest of the site. Densest, most scannable.">
            <dl className="p1">
              <div><dt>Role</dt><dd><strong>{profile.role.title}</strong>, {profile.role.org}</dd></div>
              <div><dt>Focus</dt><dd>{profile.focus.join(' · ')}</dd></div>
              <div><dt>Stack</dt><dd><StackIcons /><span className="p1-names">{profile.stack.join(', ')}</span></dd></div>
              <div><dt>Education</dt><dd>{profile.education.degree}, {profile.education.school}</dd></div>
              <div><dt>Based</dt><dd>{profile.based.city}, {profile.based.mode}{time && <> · <strong className="num">{time.label}</strong> there now</>}</dd></div>
              <div className="p1-open"><dt>Open to</dt><dd><span className="ps-status" aria-hidden="true" />{profile.openTo}</dd></div>
            </dl>
          </Concept>

          <Concept id="P2" name="Availability bar + four facts" note="What a recruiter checks first gets its own strip: open to work, where, what time it is. The rest sits below in four cells.">
            <div className="p2">
              <div className="p2-bar">
                <span className="p2-open"><span className="ps-status" aria-hidden="true" />Open to {profile.openTo[0].toLowerCase() + profile.openTo.slice(1)}</span>
                <span className="p2-time"><ClockFace time={time} /><span><strong className="num">{time?.label ?? person.utcOffset}</strong> in {profile.based.city}, {profile.based.mode}</span></span>
              </div>
              <dl className="p2-grid">
                <div><dt>Role</dt><dd><strong>{profile.role.title}</strong><span>{profile.role.org}</span></dd></div>
                <div><dt>Focus</dt><dd>{profile.focus.join(', ')}</dd></div>
                <div><dt>Stack</dt><dd><StackIcons /></dd></div>
                <div><dt>Education</dt><dd><strong>{profile.education.degree}</strong><span>{profile.education.school}</span></dd></div>
              </dl>
            </div>
          </Concept>

          <Concept id="P3" name="Written as a note" note="The six facts as one readable paragraph with inline marks. The most human; the facts still scan because each is set in weight.">
            <p className="p3">
              Right now I’m an <strong>{profile.role.title}</strong> at <strong>{profile.role.org}</strong>, working on{' '}
              {profile.focus.slice(0, -1).join(', ')} and {profile.focus.at(-1)}. I build with <StackIcons /> and
              studied <strong>{profile.education.degree}</strong> at {profile.education.school}. I’m in <strong>{profile.based.city}</strong>
              {time && <>, where it’s <strong className="num">{time.label}</strong></>}, working remotely, and <span className="pen">open to remote AI/ML engineering roles</span>.
            </p>
          </Concept>
        </div>
      </main>
    </LabFrame>
  )
}
