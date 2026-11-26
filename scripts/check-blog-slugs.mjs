// The likes API only accepts posts in api/likes.ts. Fail if that list and the blog in src/i18n.ts drift apart.
import assert from 'node:assert/strict'

const { BLOG_SLUGS } = await import('../api/likes.ts')
const { translations } = await import('../src/i18n.ts')

const posts = translations.en.blog.items.map((p) => p.slug).sort()
assert.deepEqual([...BLOG_SLUGS].sort(), posts,
  'api/likes.ts is out of sync with translations.en.blog.items: add or remove the post slug there so likes work for it.')
console.log('check-blog-slugs: ok')
