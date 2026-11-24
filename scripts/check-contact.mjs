// Contract tests for api/contact.ts. Resend is replaced by a recording fetch, so no network and no key.
import assert from 'node:assert/strict'

const { POST, validate } = await import('../api/contact.ts')

let sent = []
let resendStatus = 200
globalThis.fetch = async (url, init) => {
  sent.push({ url, body: JSON.parse(init.body), auth: init.headers.authorization })
  return new Response(resendStatus === 200 ? '{"id":"x"}' : 'boom', { status: resendStatus })
}

let ip = 0
const good = { name: 'Ada Recruiter', email: 'ada@example.com', topic: 'hiring', message: 'We have a role on our ML platform team.', website: '', elapsed: 9000 }
function req(body, headers = {}) {
  ip += 1 // a fresh sender per request, so the rate limiter only bites where a test means it to
  return new Request('https://www.subash-pandey.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://www.subash-pandey.com', host: 'www.subash-pandey.com', 'x-forwarded-for': `10.0.0.${ip}`, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}
const call = async (body, headers) => { const r = await POST(req(body, headers)); return { status: r.status, body: await r.json() } }

// Not configured: a real message is refused loudly, so a missing key can't pass for success.
delete process.env.RESEND_API_KEY; delete process.env.CONTACT_TO
assert.deepEqual(await call(good), { status: 503, body: { error: 'not_configured' } })

process.env.RESEND_API_KEY = 'test_key'
process.env.CONTACT_TO = 'owner@example.com'

// Happy path: one email to the owner, reply-to the sender, the message intact and HTML-escaped.
sent = []
assert.deepEqual(await call({ ...good, message: 'Role <b>ML</b> & evals, remote.' }), { status: 200, body: { ok: true } })
assert.equal(sent.length, 1)
assert.equal(sent[0].url, 'https://api.resend.com/emails')
assert.equal(sent[0].auth, 'Bearer test_key')
assert.deepEqual(sent[0].body.to, ['owner@example.com'])
assert.equal(sent[0].body.reply_to, 'ada@example.com')
assert.equal(sent[0].body.subject, 'Hiring: Ada Recruiter')
assert.match(sent[0].body.text, /Role <b>ML<\/b> & evals, remote\./)
assert.match(sent[0].body.html, /Role &lt;b&gt;ML&lt;\/b&gt; &amp; evals/)
assert.doesNotMatch(sent[0].body.html, /<b>ML/)

// Bots: honeypot or an instant submit get a quiet 200 and nothing is sent.
sent = []
assert.deepEqual(await call({ ...good, website: 'http://spam.example' }), { status: 200, body: { ok: true } })
assert.deepEqual(await call({ ...good, elapsed: 300 }), { status: 200, body: { ok: true } })
assert.deepEqual(await call({ ...good, elapsed: undefined }), { status: 200, body: { ok: true } })
assert.equal(sent.length, 0)

// Validation: field-level errors the form can show, nothing sent.
const bad = await call({ ...good, name: ' ', email: 'ada@', message: 'hi' })
assert.equal(bad.status, 400)
assert.deepEqual(Object.keys(bad.body.fields).sort(), ['email', 'message', 'name'])
assert.equal(sent.length, 0)
assert.equal((await call('{not json')).status, 400)
assert.equal(validate({ ...good, topic: 'nonsense' }).data.topic, 'other')
assert.equal(validate({ ...good, message: 'x'.repeat(5001) }).errors.message.includes('5,000'), true)

// Cross-site posts are refused.
assert.equal((await call(good, { origin: 'https://evil.example' })).status, 403)

// Resend failing surfaces as 502, so the form shows its error state instead of a false "sent".
resendStatus = 500
assert.deepEqual(await call(good), { status: 502, body: { error: 'send_failed' } })
resendStatus = 200

// Rate limit: the sixth message from one address inside the window is refused.
const statuses = []
for (let i = 0; i < 6; i++) statuses.push((await POST(new Request('https://www.subash-pandey.com/api/contact', {
  method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.9.9.9' }, body: JSON.stringify(good),
}))).status)
assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429])

console.log('contact api check passed')
