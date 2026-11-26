// Contract tests for api/likes.ts. Upstash is replaced by an in-memory Redis behind a fake fetch.
import assert from 'node:assert/strict'

const { GET, POST } = await import('../api/likes.ts')

const sets = new Map()
let redisDown = false
globalThis.fetch = async (url, init) => {
  assert.equal(url, 'https://redis.test/pipeline')
  assert.equal(init.headers.authorization, 'Bearer tok')
  if (redisDown) return new Response('down', { status: 500 })
  const run = ([cmd, key, member]) => {
    const s = sets.get(key) ?? new Set(); sets.set(key, s)
    if (cmd === 'SCARD') return s.size
    if (cmd === 'SISMEMBER') return s.has(member) ? 1 : 0
    if (cmd === 'SADD') { const had = s.has(member); s.add(member); return had ? 0 : 1 }
    if (cmd === 'SREM') return s.delete(member) ? 1 : 0
    throw new Error(`unexpected ${cmd}`)
  }
  return Response.json(JSON.parse(init.body).map((c) => ({ result: run(c) })))
}

const base = 'https://www.subash-pandey.com/api/likes'
const hdr = (ip) => ({ origin: 'https://www.subash-pandey.com', host: 'www.subash-pandey.com', 'x-forwarded-for': ip, 'content-type': 'application/json' })
const get = async (slug, ip = '1.1.1.1') => { const r = await GET(new Request(`${base}?slug=${slug}`, { headers: hdr(ip) })); return { status: r.status, body: await r.json() } }
const post = async (body, ip = '1.1.1.1', extra = {}) => {
  const r = await POST(new Request(base, { method: 'POST', headers: { ...hdr(ip), ...extra }, body: JSON.stringify(body) }))
  return { status: r.status, body: await r.json() }
}

// Not configured: refuse loudly rather than pretend a like was saved.
assert.deepEqual(await post({ slug: 'rag-pipeline', liked: true }), { status: 503, body: { error: 'not_configured' } })

process.env.KV_REST_API_URL = 'https://redis.test/'
process.env.KV_REST_API_TOKEN = 'tok'

// Fresh post: zero, not liked.
assert.deepEqual(await get('rag-pipeline'), { status: 200, body: { count: 0, liked: false } })

// A like counts once per visitor, however many times they press it.
assert.deepEqual((await post({ slug: 'rag-pipeline', liked: true })).body, { count: 1, liked: true })
assert.deepEqual((await post({ slug: 'rag-pipeline', liked: true })).body, { count: 1, liked: true })
assert.deepEqual(await get('rag-pipeline'), { status: 200, body: { count: 1, liked: true } })

// A second visitor adds to the count and sees their own state.
assert.deepEqual((await post({ slug: 'rag-pipeline', liked: true }, '2.2.2.2')).body, { count: 2, liked: true })
assert.deepEqual((await get('rag-pipeline', '3.3.3.3')).body, { count: 2, liked: false })

// Unlike takes only your own like back; unliking twice doesn't go below what others gave.
assert.deepEqual((await post({ slug: 'rag-pipeline', liked: false })).body, { count: 1, liked: false })
assert.deepEqual((await post({ slug: 'rag-pipeline', liked: false })).body, { count: 1, liked: false })

// Posts are counted separately.
assert.deepEqual((await get('ml-from-scratch')).body, { count: 0, liked: false })

// No raw IP is stored.
for (const s of sets.values()) for (const m of s) assert.ok(!m.includes('2.2.2.2') && /^[0-9a-f]{32}$/.test(m))

// Bad input and cross-origin posts are refused.
assert.equal((await get('../etc')).status, 400)
assert.equal((await get('')).status, 400)
assert.equal((await post({ slug: 'Rag Pipeline' })).status, 400)
// Well-formed but not a real post: refused, so junk keys can't pile up in Redis.
assert.equal((await post({ slug: 'not-a-real-post', liked: true })).status, 400)
assert.equal((await get('not-a-real-post')).status, 400)
assert.equal((await post({ slug: 'rag-pipeline' }, '4.4.4.4', { origin: 'https://evil.example' })).status, 403)

// Redis down: a clean 502, not a crash.
redisDown = true
assert.deepEqual(await get('rag-pipeline'), { status: 502, body: { error: 'unavailable' } })
redisDown = false

// One visitor hammering the button is throttled.
let last
for (let i = 0; i < 25; i++) last = await post({ slug: 'steam-genre-networks', liked: i % 2 === 0 }, '9.9.9.9')
assert.equal(last.status, 429)

console.log('check-likes: ok')
