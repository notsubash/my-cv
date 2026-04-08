# Public Assets Guide

All image assets should be placed in the `public/` directory at the project root.

## Required Images

| File | Dimensions | Format | Purpose |
|------|-----------|--------|---------|
| `foto-avatar-sm.webp` | 192×192 | WebP | Hero avatar (small screens) |
| `foto-avatar.webp` | 384×384 | WebP | Hero avatar (large screens), social cards |
| `og-image.webp` | 1200×630 | WebP | Social sharing preview (OG / Twitter) |
| `favicon.ico` | 48×48 multi | ICO | Browser tab icon (multi-resolution) |
| `favicon-32x32.png` | 32×32 | PNG | Favicon (standard) |
| `favicon-16x16.png` | 16×16 | PNG | Favicon (small) |
| `apple-touch-icon.png` | 180×180 | PNG | iOS home screen icon |

## Photo Tips

- **Avatars**: Use a professional headshot with good lighting and a neutral or clean background. Export as WebP for best compression. The small version is used on mobile, the large on desktop and in social card previews.
- **OG Image** (`og-image.webp`): Create a card-style image with your name, title ("AI/ML Engineer"), and a professional photo. Tools like [Canva](https://www.canva.com) or [Figma](https://www.figma.com) work well. This appears when your site is shared on LinkedIn, Twitter, Slack, etc.
- **Favicons**: Generate from a square logo or headshot using [favicon.io](https://favicon.io) or [realfavicongenerator.net](https://realfavicongenerator.net). Upload a 512×512 source and download the generated pack.

## Current Status

Once you drop the files into `public/`, the site will pick them up automatically — no code changes needed. The `<img>` tags and `<link>` tags in `index.html` already reference these filenames.
