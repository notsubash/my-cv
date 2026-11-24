// About page content.
//
// ── Adding photos to the Instagram grid ────────────────────────────────────
// 1. Put the image in public/about/ (~1000-1200px on the long edge, .webp).
// 2. Add an entry below: { src: '/about/your-file.webp', alt: 'what is in the photo', width, height }
//    `href` is optional; without it the tile opens the full-size image.
//    `wide: true` makes a landscape photo span two columns.
// The grid is three across on desktop. Keep the total cells (wide = 2) a multiple of 3 so rows stay full.

export const INSTAGRAM_HANDLE = '_subash111_'

export type AboutPhoto = {
  src: string
  alt: string
  width: number
  height: number
  href?: string
  wide?: boolean
}

export const photos: AboutPhoto[] = [
  { src: '/graduation.webp', alt: 'Graduation day beside the University of Exeter plaque', width: 1200, height: 911, wide: true },
  { src: '/about/garden-gate-night.webp', alt: 'Leaning against a lantern-lit garden gate at night', width: 960, height: 1280 },
  { src: '/about/boudhanath-stupa-night.webp', alt: 'Looking out at Boudhanath Stupa lit up at night, Kathmandu', width: 960, height: 1280 },
  { src: '/about/bike-pine-forest.webp', alt: 'Sitting on my motorbike on a road through a pine forest', width: 960, height: 1280 },
  { src: '/about/leather-jacket-smile.webp', alt: 'Smiling in a black leather jacket by tall windows', width: 720, height: 1280 },
  { src: '/about/bar-red-wine.webp', alt: 'A glass of red wine at a hotel bar', width: 960, height: 1280 },
  { src: '/about/ridge-above-clouds.webp', alt: 'Resting with friends on a mountain ridge above a sea of clouds', width: 1280, height: 960, wide: true },
  { src: '/personal-pic.webp', alt: 'At a cafe after getting soaked in the rain', width: 900, height: 1200 },
  { src: '/about/misty-ride.webp', alt: 'Riding along a misty hill road lined with marigolds', width: 960, height: 1280 },
  { src: '/about/face-vase.webp', alt: 'A ceramic face vase on a corner shelf', width: 960, height: 1280 },
]
