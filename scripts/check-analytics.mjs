/**
 * Guards once-per-session capture, article read-depth buckets, and that
 * PostHog wiring keeps placement / section / catalog events in the source.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const analyticsUrl = pathToFileURL(join(root, 'src/analytics.ts')).href

const { captureOnce, articleScrollPercent, newReadDepths, READ_DEPTHS } = await import(analyticsUrl)

function memoryStorage() {
  const store = new Map()
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => { store.set(key, value) },
  }
}

{
  const storage = memoryStorage()
  let calls = 0
  assert.equal(captureOnce(storage, 'k', () => { calls++ }), true)
  assert.equal(captureOnce(storage, 'k', () => { calls++ }), false)
  assert.equal(calls, 1)
}

{
  const storage = memoryStorage()
  assert.throws(() => {
    captureOnce(storage, 'k', () => { throw new Error('nope') })
  })
  let calls = 0
  assert.equal(captureOnce(storage, 'k', () => { calls++ }), true)
  assert.equal(calls, 1)
}

{
  let calls = 0
  const storage = {
    getItem: () => { throw new Error('blocked') },
    setItem: () => {},
  }
  assert.equal(captureOnce(storage, 'k', () => { calls++ }), true)
  assert.equal(calls, 1)
}

{
  let calls = 0
  const storage = {
    getItem: () => null,
    setItem: () => { throw new Error('quota') },
  }
  assert.equal(captureOnce(storage, 'k', () => { calls++ }), true)
  assert.equal(calls, 1)
}

assert.deepEqual(READ_DEPTHS, [25, 50, 75, 100])
assert.deepEqual(newReadDepths(10, []), [])
assert.deepEqual(newReadDepths(25, []), [25])
assert.deepEqual(newReadDepths(50, [25]), [50])
assert.deepEqual(newReadDepths(100, []), [25, 50, 75, 100])
assert.deepEqual(newReadDepths(100, [25, 50, 75, 100]), [])

assert.equal(articleScrollPercent(0, 1000, 0, 500), 50)
assert.equal(articleScrollPercent(0, 1000, 500, 500), 100)
assert.equal(articleScrollPercent(200, 1000, 0, 200), 0)
assert.equal(articleScrollPercent(0, 1000, 900, 500), 100)
assert.equal(articleScrollPercent(500, 1000, 0, 200), 0)
assert.equal(articleScrollPercent(0, 0, 0, 500), 0)

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

const posthog = read('src/posthog.ts')
assert.match(posthog, /defaults:\s*'2026-08-30'/)
assert.match(posthog, /person_profiles:\s*'identified_only'/)
assert.match(posthog, /capture_pageleave:\s*true/)
assert.match(posthog, /secure_cookie:\s*true/)

const cal = read('src/CalBookButton.tsx')
assert.match(cal, /placement:\s*BookingPlacement/)
assert.match(cal, /consultation_booking_opened',\s*\{\s*placement\s*\}/)
assert.match(cal, /lastBookingPlacement \? \{ placement: lastBookingPlacement \} : \{\}/)

const app = read('src/App.tsx')
assert.match(app, /placement="hero"/)
assert.match(app, /placement="footer"/)
assert.match(app, /home_section_viewed/)
assert.match(app, /captureOnce/)

const about = read('src/AboutPage.tsx')
assert.match(about, /placement="about"/)

assert.match(read('src/BlogPage.tsx'), /blog_post_clicked',\s*\{\s*slug:.*placement:\s*'catalog'/)
assert.match(read('src/TechnicalNotesPage.tsx'), /blog_post_clicked',\s*\{\s*slug:.*placement:\s*'notes'/)
assert.match(read('src/articles/BlogNav.tsx'), /placement:\s*'article_nav'/)
assert.match(read('src/articles/CaseStudyLayout.tsx'), /project_link_clicked/)
assert.match(read('src/articles/CaseStudyLayout.tsx'), /placement:\s*'case_study'/)
assert.match(read('src/articles/useBlogSeo.ts'), /article_read_depth/)
assert.match(read('src/articles/useBlogSeo.ts'), /ResizeObserver/)

console.log('analytics check passed')
