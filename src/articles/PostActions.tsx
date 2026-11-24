import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import posthog from '../posthog'

const SITE = 'https://www.subash-pandey.com'

type LikeState = { count: number | null; liked: boolean }

/** Like + share row at the end of a blog post. The count loads on the client; the prerendered page shows the button without one. */
export default function PostActions({ slug, title }: { slug: string; title: string }) {
  const [like, setLike] = useState<LikeState>({ count: null, liked: false })
  const [pending, setPending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const url = `${SITE}/blog/${slug}`

  useEffect(() => {
    setCanShare(typeof navigator.share === 'function')
    let cancelled = false
    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { count: number; liked: boolean } | null) => {
        if (!cancelled && d) setLike({ count: d.count, liked: d.liked })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [slug])

  async function toggleLike() {
    if (pending) return
    const prev = like
    const liked = !prev.liked
    // Optimistic: flip now, reconcile with the server's count, roll back on failure.
    setLike({ liked, count: prev.count === null ? null : Math.max(0, prev.count + (liked ? 1 : -1)) })
    setPending(true)
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, liked }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const d = await res.json() as { count: number; liked: boolean }
      setLike({ count: d.count, liked: d.liked })
      if (liked) posthog.capture('blog_post_liked', { slug })
    } catch {
      setLike(prev)
    } finally {
      setPending(false)
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url })
      posthog.capture('blog_post_shared', { slug, channel: 'native' })
    } catch { /* dismissed */ }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      posthog.capture('blog_post_shared', { slug, channel: 'copy' })
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked */ }
  }

  const enc = encodeURIComponent
  const out = (channel: string) => () => posthog.capture('blog_post_shared', { slug, channel })

  return (
    <div className="post-actions">
      <button
        type="button"
        className="post-like"
        aria-pressed={like.liked}
        aria-label={like.liked ? 'Unlike this post' : 'Like this post'}
        onClick={toggleLike}
      >
        <Heart size={18} aria-hidden="true" />
        <span>{like.liked ? 'Liked' : 'Like'}</span>
        <span className="post-like-count" aria-live="polite">{like.count ? like.count.toLocaleString('en') : ''}</span>
      </button>

      <div className="post-share" role="group" aria-label="Share this post">
        <span className="post-share-label">Share</span>
        <button type="button" className="link" onClick={copyLink}>
          <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
        </button>
        <a className="link" href={`https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer" onClick={out('x')}>X</a>
        <a className="link" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" onClick={out('linkedin')}>LinkedIn</a>
        {canShare && <button type="button" className="link" onClick={nativeShare}>More…</button>}
      </div>
    </div>
  )
}
