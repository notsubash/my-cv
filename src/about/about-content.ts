// About page content.
//
// ── Adding photos to the Instagram grid ────────────────────────────────────
// 1. Put the image in public/about/ (square-ish crops look best; ~1200px, .webp).
// 2. Add an entry below: { src: '/about/your-file.webp', alt: 'what is in the photo', href: 'https://www.instagram.com/p/…' }
//    `href` is optional; without it the tile opens the full-size image.
// 3. Set INSTAGRAM_HANDLE (without @) and INSTAGRAM_URL so the "follow along" line appears.
// The grid is four across on desktop; the four below are seeded from photos already on the site.

export const INSTAGRAM_HANDLE = '' // e.g. 'subash.pandey'
export const INSTAGRAM_URL = '' // e.g. 'https://www.instagram.com/subash.pandey/'

export type AboutPhoto = { src: string; alt: string; href?: string }

export const photos: AboutPhoto[] = [
  { src: '/graduation.webp', alt: 'Graduation day beside the University of Exeter plaque' },
  { src: '/prime-college-talk.webp', alt: 'Speaking at Prime College, Kathmandu, mid-talk' },
  { src: '/prime-college-group.webp', alt: 'With students at Prime College after the talk' },
  { src: '/personal-pic.webp', alt: 'At a cafe after getting soaked in the rain' },
]
