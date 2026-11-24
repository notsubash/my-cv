import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Briefcase, Calendar, Check, Github, Hammer, Linkedin, Loader2, MessageCircle, Send } from 'lucide-react'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { CalBookButton } from './CalBookButton'
import { person } from './home/home-content'
import { CopyEmail } from './site/CopyEmail'
import { SiteLinks } from './site/SiteChrome'
import { useLocalTime } from './site/useLocalTime'
import './site/contact.css'

type Topic = 'hiring' | 'project' | 'other'
type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; name: string; email: string } | { kind: 'error'; reason: 'rate' | 'send' }

const TOPICS: { id: Topic; label: string; icon: typeof Briefcase; prompt: string }[] = [
  { id: 'hiring', label: 'Hiring', icon: Briefcase, prompt: 'The role, the team, and what you’d want me working on.' },
  { id: 'project', label: 'A project', icon: Hammer, prompt: 'What you’re building, and where it’s stuck.' },
  { id: 'other', label: 'Other', icon: MessageCircle, prompt: 'A question about a write-up, a talk, or anything else.' },
]

// Mirrors the server rules in api/contact.ts (the server stays the source of truth and returns field errors too).
const MESSAGE_MIN = 10
const MESSAGE_MAX = 5000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const now = () => Date.now()

function check(name: string, email: string, message: string): Errors {
  const e: Errors = {}
  if (!name.trim()) e.name = 'Add your name so I know who to reply to.'
  if (!email.trim()) e.email = 'Add an email address so I can reply.'
  else if (!EMAIL_RE.test(email.trim())) e.email = 'That email address doesn’t look complete.'
  if (message.trim().length < MESSAGE_MIN) e.message = 'Add a little more detail: a sentence or two is plenty.'
  else if (message.length > MESSAGE_MAX) e.message = `Keep the message under ${MESSAGE_MAX.toLocaleString('en')} characters.`
  return e
}

function ContactForm() {
  const uid = useId()
  const [topic, setTopic] = useState<Topic>('hiring')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const started = useRef(0)
  const formRef = useRef<HTMLFormElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => { started.current = now() }, [])
  useEffect(() => { if (status.kind === 'sent') doneRef.current?.focus() }, [status.kind])

  const ids = { name: `${uid}-name`, email: `${uid}-email`, message: `${uid}-message`, err: (f: Field) => `${uid}-${f}-err` }
  const prompt = TOPICS.find((t) => t.id === topic)!.prompt

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status.kind === 'sending') return
    const found = check(name, email, message)
    setErrors(found)
    const first = (['name', 'email', 'message'] as const).find((f) => found[f])
    if (first) { document.getElementById(ids[first])?.focus(); return }

    setStatus({ kind: 'sending' })
    const honeypot = (formRef.current?.elements.namedItem('website') as HTMLInputElement | null)?.value ?? ''
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic, name, email, message, website: honeypot, elapsed: now() - started.current }),
      })
      const body = await res.json().catch(() => ({})) as { error?: string; fields?: Errors }
      if (res.ok) {
        posthog.capture('contact_form_submitted', { topic })
        setStatus({ kind: 'sent', name: name.trim().split(/\s+/)[0], email: email.trim() })
        return
      }
      posthog.capture('contact_form_failed', { topic, status: res.status, error: body.error ?? 'unknown' })
      if (res.status === 400 && body.fields) { setErrors(body.fields); setStatus({ kind: 'idle' }); return }
      setStatus({ kind: 'error', reason: res.status === 429 ? 'rate' : 'send' })
    } catch {
      posthog.capture('contact_form_failed', { topic, status: 0, error: 'network' })
      setStatus({ kind: 'error', reason: 'send' })
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="ct-done" role="status">
        <span className="ct-done-mark" aria-hidden="true"><Check size={22} strokeWidth={2.5} /></span>
        <h2 ref={doneRef} tabIndex={-1}>Message sent</h2>
        <p>Thanks, {status.name}. It’s in my inbox, and I’ll reply to <strong>{status.email}</strong>.</p>
        <button type="button" className="link ct-again" onClick={() => {
          setMessage(''); setStatus({ kind: 'idle' }); started.current = now()
        }}>Write another message</button>
      </div>
    )
  }

  const sending = status.kind === 'sending'
  const describe = (f: Field, extra?: string) => [errors[f] ? ids.err(f) : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  return (
    <form ref={formRef} className="ct-form" noValidate onSubmit={onSubmit} aria-busy={sending || undefined}>
      <fieldset className="ct-topics">
        <legend>What’s it about?</legend>
        <div className="ct-seg">
          {TOPICS.map(({ id, label, icon: Icon }) => (
            <label key={id} className="ct-seg-opt">
              <input type="radio" name="topic" value={id} checked={topic === id} onChange={() => setTopic(id)} />
              <span><Icon size={16} aria-hidden="true" />{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="ct-row">
        <div className="ct-field">
          <label htmlFor={ids.name}>Name</label>
          <input id={ids.name} name="name" autoComplete="name" value={name} maxLength={100}
            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((x) => ({ ...x, name: undefined })) }}
            aria-invalid={errors.name ? true : undefined} aria-describedby={describe('name')} />
          {errors.name && <p className="ct-err" id={ids.err('name')}>{errors.name}</p>}
        </div>
        <div className="ct-field">
          <label htmlFor={ids.email}>Email</label>
          <input id={ids.email} name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} value={email} maxLength={200}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((x) => ({ ...x, email: undefined })) }}
            aria-invalid={errors.email ? true : undefined} aria-describedby={describe('email')} />
          {errors.email && <p className="ct-err" id={ids.err('email')}>{errors.email}</p>}
        </div>
      </div>

      <div className="ct-field">
        <label htmlFor={ids.message}>Message</label>
        <textarea id={ids.message} name="message" rows={7} value={message} placeholder={prompt}
          onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors((x) => ({ ...x, message: undefined })) }}
          aria-invalid={errors.message ? true : undefined} aria-describedby={describe('message')} />
        {errors.message && <p className="ct-err" id={ids.err('message')}>{errors.message}</p>}
        {message.length > MESSAGE_MAX * 0.8 && (
          <p className={`ct-count${message.length > MESSAGE_MAX ? ' ct-count--over' : ''}`}>{message.length.toLocaleString('en')} / {MESSAGE_MAX.toLocaleString('en')}</p>
        )}
      </div>

      {/* Honeypot: invisible to people and screen readers, irresistible to form-filling bots. */}
      <div className="ct-hp" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
      </div>

      <div className="ct-submit">
        <button type="submit" className="btn btn--primary" disabled={sending}>
          {sending
            ? <><Loader2 size={17} className="ct-spin" aria-hidden="true" />Sending…</>
            : <><Send size={16} aria-hidden="true" />Send message</>}
        </button>
        <p className="ct-hint">It goes straight to my inbox. I reply from my own email.</p>
      </div>

      {status.kind === 'error' && (
        <div className="ct-fail" role="alert">
          <p>
            {status.reason === 'rate'
              ? 'That’s several messages in a few minutes, so this one was held back. Wait a little and try again, or email me directly.'
              : 'Your message didn’t send. What you wrote is still here: try again, or email me directly.'}
          </p>
          <CopyEmail placement="contact" className="ct-fail-copy" label={`Copy ${person.email}`} />
        </div>
      )}
    </form>
  )
}

export default function ContactPage() {
  usePageSeo({
    title: 'Contact | Subash Pandey',
    description: 'Get in touch with Subash Pandey about AI/ML engineering roles, LLM projects, or anything he has written.',
    path: '/contact',
  })
  const time = useLocalTime(person.timeZone)

  return (
    <main id="main-content" className="site ct">
      <div className="site-col site-col--wide">
        <header className="site-intro">
          <h1>Let’s talk</h1>
          <p>Hiring for a role, scoping a project, or a question about something I wrote. Leave a message, or pick a time to talk.</p>
        </header>

        <div className="ct-grid">
          <ContactForm />

          <aside className="ct-aside" aria-label="Other ways to reach me">
            <section className="ct-block">
              <h2>Rather talk live?</h2>
              <p>Pick a 30-minute slot on my calendar. It opens right here, no account needed.</p>
              <CalBookButton placement="contact" className="btn btn--quiet ct-book">
                <Calendar size={16} aria-hidden="true" />Book a call<ArrowRight size={15} aria-hidden="true" className="ct-book-arrow" />
              </CalBookButton>
            </section>

            <section className="ct-block">
              <h2>Email</h2>
              <p><a className="link" href={`mailto:${person.email}`} onClick={() => posthog.capture('contact_email_clicked', { placement: 'contact' })}>{person.email}</a></p>
              <CopyEmail placement="contact" />
            </section>

            <section className="ct-block">
              <h2>Elsewhere</h2>
              <p className="ct-elsewhere">
                <a className="hm-elsewhere-link" href={person.linkedin} target="_blank" rel="noopener noreferrer"
                  onClick={() => posthog.capture('outbound_link_clicked', { destination: 'linkedin', placement: 'contact' })}>
                  <Linkedin size={15} aria-hidden="true" />LinkedIn
                </a>
                <a className="hm-elsewhere-link" href={person.github} target="_blank" rel="noopener noreferrer"
                  onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'contact' })}>
                  <Github size={15} aria-hidden="true" />GitHub
                </a>
              </p>
            </section>

            <p className="ct-time">
              {time
                ? <>It’s <time className="ct-time-now">{time.label}</time> in Kathmandu ({person.utcOffset}).</>
                : <>I’m in Kathmandu ({person.utcOffset}), working remotely.</>}
            </p>
          </aside>
        </div>
      </div>
      <footer className="site-foot site-foot--wide ct-foot">
        <SiteLinks />
      </footer>
    </main>
  )
}
