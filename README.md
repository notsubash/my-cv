# Subash Pandey — Portfolio

Personal CV / portfolio site built with React, Vite, Tailwind CSS v4, and Motion.

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)

## Tech Stack

- **React 19** + TypeScript
- **Vite 7** (build + dev server)
- **Tailwind CSS v4** (utility-first styling)
- **Motion** (animations)
- **Vercel Analytics** (privacy-friendly)

## Local Development

```bash
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview   # preview production build locally
```

## Deploy

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Framework preset: **Vite**
4. Deploy — done

## Project Structure

```
src/
├── App.tsx              # Main CV — all sections
├── main.tsx             # React Router + lazy loading
├── i18n.ts              # Content / translations
├── index.css            # Theme tokens, fonts, utilities
├── GlobalNav.tsx        # Navigation + theme toggle
├── AboutPage.tsx        # About page
├── PrivacyPolicy.tsx    # Privacy policy
├── tech-icons.ts        # Tech stack SVG icons
└── articles/
    ├── registry.ts      # Page titles + alt paths
    └── use-article-seo.ts  # SEO meta helpers

public/
├── fonts/               # Self-hosted Outfit + Inter (woff2)
├── foto-avatar*.webp    # Avatar images (replace with your own)
├── og-image.webp        # Open Graph image (replace)
└── robots.txt
```

## Customization

- **Content**: Edit `src/i18n.ts` — all text, experience, projects, education, skills
- **Theme colors**: Edit HSL tokens in `src/index.css` (4 mode blocks: root, dark media, .dark, .light)
- **Fonts**: Replace woff2 files in `public/fonts/` and update `@font-face` in `index.css`
- **Avatar**: Replace `public/foto-avatar*.webp` and `public/og-image.webp`
- **Domain**: Search for `YOUR_DOMAIN` in `index.html` and replace with your domain

## License

MIT
