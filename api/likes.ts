/**
 * GET  /api/likes?slug=<post>       → { count, liked }
 * POST /api/likes { slug, liked }   → { count, liked }   (liked: true to like, false to take it back)
 *
 * Storage: Upstash Redis over its REST API (no SDK). One set per post, `likes:<slug>`, whose members are
 * salted SHA-256 hashes of the visitor's IP, so the count is SCARD, a visitor can like a post once,
 * and no raw IP is ever stored. Only posts listed in BLOG_SLUGS below are accepted.
 *
 * Env (Vercel → Storage → Upstash Redis adds the first pair for you):
 *   KV_REST_API_URL / KV_REST_API_TOKEN            or  UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *   LIKES_SALT   optional. Any random string; mixed into the IP hash. Falls back to the token.
 */

/**
 * Posts that can be liked; anything else is refused, so nobody can mint keys for posts that don't exist.
 * Must match translations.en.blog.items in src/i18n.ts: scripts/check-blog-slugs.mjs fails the build if they drift.
 * Kept inline rather than imported so the function has no local imports to resolve on Vercel.
 */
export const BLOG_SLUGS: readonly string[] = [
  'when-a-self-parking-car-cannot-trust-its-imagination',
  'activity-recognition-pipeline',
  'building-a-cloud-native-ai-platform',
  'building-an-idea-workbench',
  'rag-pipeline',
  'steam-genre-networks',
  'ml-from-scratch',
]

const KNOWN = new Set(BLOG_SLUGS)

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
})

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url: url.replace(/\/$/, ''), token } : null
}

/** Runs commands in one round trip; returns each command's result. */
async function redis(cfg: { url: string; token: string }, commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${cfg.token}`, 'content-type': 'application/json' },
    body: JSON.stringify(commands),
  })
  if (!res.ok) throw new Error(`redis ${res.status}`)
  const out = await res.json() as { result?: unknown; error?: string }[]
  return out.map((r) => {
    if (r.error) throw new Error(r.error)
    return r.result
  })
}

async function visitorId(request: Request, salt: string) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}`))
  return Array.from(new Uint8Array(bytes).slice(0, 16), (b) => b.toString(16).padStart(2, '0')).join('')
}

const validSlug = (s: unknown): s is string => typeof s === 'string' && KNOWN.has(s)

// Best effort, per warm instance: caps how fast one IP can toggle.
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 20
const recent = new Map<string, number[]>()
function rateLimited(id: string, now = Date.now()) {
  const hits = (recent.get(id) ?? []).filter((t) => now - t < WINDOW_MS)
  hits.push(now)
  recent.set(id, hits)
  if (recent.size > 5000) recent.clear()
  return hits.length > MAX_PER_WINDOW
}

export async function GET(request: Request): Promise<Response> {
  const slug = new URL(request.url).searchParams.get('slug')
  if (!validSlug(slug)) return json({ error: 'invalid_slug' }, 400)
  const cfg = redisConfig()
  if (!cfg) return json({ error: 'not_configured' }, 503)

  const id = await visitorId(request, process.env.LIKES_SALT || cfg.token)
  try {
    const [count, member] = await redis(cfg, [['SCARD', `likes:${slug}`], ['SISMEMBER', `likes:${slug}`, id]])
    return json({ count: Number(count), liked: Number(member) === 1 })
  } catch (err) {
    console.error('likes_read_failed', err)
    return json({ error: 'unavailable' }, 502)
  }
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (origin && host && new URL(origin).host !== host) return json({ error: 'forbidden' }, 403)
  if (Number(request.headers.get('content-length') ?? 0) > 1_000) return json({ error: 'too_large' }, 413)

  let body: Record<string, unknown>
  try {
    body = await request.json() as Record<string, unknown>
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }
  if (!validSlug(body.slug)) return json({ error: 'invalid_slug' }, 400)
  const liked = body.liked !== false
  const cfg = redisConfig()
  if (!cfg) return json({ error: 'not_configured' }, 503)

  const id = await visitorId(request, process.env.LIKES_SALT || cfg.token)
  if (rateLimited(id)) return json({ error: 'rate_limited' }, 429)

  const key = `likes:${body.slug}`
  try {
    const [, count] = await redis(cfg, [[liked ? 'SADD' : 'SREM', key, id], ['SCARD', key]])
    return json({ count: Number(count), liked })
  } catch (err) {
    console.error('likes_write_failed', err)
    return json({ error: 'unavailable' }, 502)
  }
}
