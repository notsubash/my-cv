/**
 * POST /api/contact: validates a contact-form message and emails it to the site owner via Resend.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  required. https://resend.com/api-keys
 *   CONTACT_TO      required. The inbox that receives messages.
 *   CONTACT_FROM    optional. A sender on a domain verified in Resend, e.g. "Portfolio <contact@subash-pandey.com>".
 *                   Defaults to Resend's test sender, which can only deliver to the Resend account's own email.
 *
 * Spam defences, cheapest first: same-origin check, honeypot field, minimum fill time,
 * a size cap, and a per-instance rate limit. Bots get a quiet 200 so they learn nothing.
 */

export const TOPICS = { hiring: 'Hiring', project: 'A project', other: 'Something else' } as const
type Topic = keyof typeof TOPICS

export type ContactInput = { name: string; email: string; topic: Topic; message: string }
export type FieldErrors = Partial<Record<keyof ContactInput, string>>

export const LIMITS = { name: 100, email: 200, messageMin: 10, messageMax: 5000, minFillMs: 2500 } as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Shared rules; the form mirrors them so the server rarely has to say no. */
export function validate(raw: Record<string, unknown>): { data?: ContactInput; errors?: FieldErrors } {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const name = str(raw.name)
  const email = str(raw.email)
  const message = str(raw.message)
  const topic = (str(raw.topic) in TOPICS ? str(raw.topic) : 'other') as Topic
  const errors: FieldErrors = {}
  if (!name) errors.name = 'Add your name so I know who to reply to.'
  else if (name.length > LIMITS.name) errors.name = `Keep the name under ${LIMITS.name} characters.`
  if (!email) errors.email = 'Add an email address so I can reply.'
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.email = 'That email address doesn’t look complete.'
  if (message.length < LIMITS.messageMin) errors.message = 'Add a little more detail: a sentence or two is plenty.'
  else if (message.length > LIMITS.messageMax) errors.message = `Keep the message under ${LIMITS.messageMax.toLocaleString('en')} characters.`
  return Object.keys(errors).length ? { errors } : { data: { name, email, topic, message } }
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function buildEmail(d: ContactInput, from: string, to: string) {
  const topic = TOPICS[d.topic]
  const text = `${d.message}\n\n— ${d.name} <${d.email}>\nTopic: ${topic}\nSent from the contact form on subash-pandey.com`
  const html = `<div style="font:15px/1.6 system-ui,sans-serif;color:#16181b;max-width:560px">
<p style="margin:0 0 16px;color:#676c75;font-size:13px">${escapeHtml(topic)} · from the contact form</p>
<p style="white-space:pre-wrap;margin:0 0 24px">${escapeHtml(d.message)}</p>
<p style="margin:0;border-top:1px solid #e2e3e5;padding-top:12px">${escapeHtml(d.name)} &lt;<a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a>&gt;</p>
</div>`
  return { from, to: [to], reply_to: d.email, subject: `${topic}: ${d.name.slice(0, 60)}`, text, html }
}

// Best effort: each warm instance remembers recent senders. Enough to blunt a burst from one IP.
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 5
const recent = new Map<string, number[]>()
function rateLimited(ip: string, now = Date.now()) {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  hits.push(now)
  recent.set(ip, hits)
  if (recent.size > 5000) recent.clear()
  return hits.length > MAX_PER_WINDOW
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
})

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (origin && host && new URL(origin).host !== host) return json({ error: 'forbidden' }, 403)

  if (Number(request.headers.get('content-length') ?? 0) > 20_000) return json({ error: 'too_large' }, 413)
  let body: Record<string, unknown>
  try {
    body = await request.json() as Record<string, unknown>
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  // Honeypot filled, or submitted faster than a person can type: accept silently, send nothing.
  if ((typeof body.website === 'string' && body.website.trim()) || Number(body.elapsed ?? 0) < LIMITS.minFillMs) {
    return json({ ok: true })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) return json({ error: 'rate_limited' }, 429)

  const { data, errors } = validate(body)
  if (!data) return json({ error: 'invalid', fields: errors }, 400)

  const key = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO
  if (!key || !to) return json({ error: 'not_configured' }, 503)
  const from = process.env.CONTACT_FROM || 'Portfolio contact <onboarding@resend.dev>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(buildEmail(data, from, to)),
  })
  if (!res.ok) {
    console.error('resend_failed', res.status, await res.text().catch(() => ''))
    return json({ error: 'send_failed' }, 502)
  }
  return json({ ok: true })
}
