# Production Deployment Guide

Complete guide to taking your portfolio site live.

---

## 1. Buy a Domain

### Recommended Registrars

| Registrar | Why | Price Range |
|-----------|-----|-------------|
| **Namecheap** | Affordable, free WHOIS privacy, easy DNS management | $8–12/yr for .com |
| **Cloudflare Registrar** | At-cost pricing (no markup), fast DNS, DDoS protection | $8–10/yr for .com |
| **Google Domains** (now Squarespace) | Clean UI, integrates with Google services | $12/yr for .com |
| **Porkbun** | Cheapest prices, good UI | $7–9/yr for .com |

### Suggested Domain Names

- `subashpandey.com`
- `subashpandey.dev` (.dev forces HTTPS)
- `subashpandey.ai` (premium, ~$70/yr but relevant to your field)
- `notsubash.dev` (matches your GitHub handle)

### Steps

1. Go to your chosen registrar
2. Search for your desired domain
3. Purchase it (1 year minimum, auto-renew recommended)
4. Keep WHOIS privacy enabled (free on Namecheap/Cloudflare)

---

## 2. Deploy to Vercel (Recommended)

Your project already has `vercel.json` configured and `@vercel/analytics` installed.

### First-Time Setup

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root (follow the prompts)
vercel
```

### Connect GitHub for Auto-Deploy

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **"Add New Project"**
3. Import your `my-cv` GitHub repository
4. Vercel auto-detects Vite — confirm these settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**

Every push to `main` will now auto-deploy.

### Connect Your Custom Domain

1. In Vercel Dashboard → your project → **Settings → Domains**
2. Add your domain (e.g., `subashpandey.com`)
3. Vercel will give you DNS records to add:
   - **Option A (Recommended)**: Point your domain's nameservers to Vercel
   - **Option B**: Add an `A` record (`76.76.21.21`) and a `CNAME` for `www`
4. Go to your registrar's DNS settings and add the records
5. Wait 5–30 minutes for DNS propagation
6. Vercel automatically provisions a free SSL certificate

### DNS Records to Add at Your Registrar

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

---

## 3. Pre-Launch Checklist

### Update Placeholder URLs

Search and replace these in your code:

```
YOUR_DOMAIN → your actual domain (e.g., subashpandey.com)
```

Files to update:

- `index.html` — canonical URL, og:url, JSON-LD
- `public/robots.txt` — sitemap URL
- `vercel.json` — CSP headers if needed

### Update `index.html`

```html
<!-- Replace YOUR_DOMAIN with your actual domain -->
<link rel="canonical" href="https://subashpandey.com/" />
<meta property="og:url" content="https://subashpandey.com/" />
```

### Update `robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://subashpandey.com/sitemap.xml
```

### Contact Form (Optional)

The contact section currently opens email directly via `mailto:`. If you want a form later:

1. Sign up at [Web3Forms](https://web3forms.com) (free, no backend needed)
2. Get your access key
3. Re-enable the `ContactForm` component in `App.tsx`
4. Replace the Formspree URL with Web3Forms endpoint

### Generate Required Assets

Before deploying, ensure these files exist in `public/`:

- `foto-avatar-sm.webp` (192×192 avatar)
- `foto-avatar.webp` (384×384 avatar)
- `og-image.webp` (1200×630 social share image)
- All favicon files (already done)

See the section below on how to create `.webp` files.

---

## 4. Post-Launch Tasks

### Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Verify ownership (DNS TXT record or HTML file)
4. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

### Create a Sitemap

Add a `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://subashpandey.com/</loc>
    <lastmod>2026-04-08</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://subashpandey.com/about</loc>
    <lastmod>2026-04-08</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://subashpandey.com/privacy</loc>
    <lastmod>2026-04-08</lastmod>
    <priority>0.3</priority>
  </url>
</urlset>
```

### Set Up Analytics

Vercel Analytics is already integrated in `main.tsx`. After deploying:

1. Go to Vercel Dashboard → your project → **Analytics**
2. Enable Web Analytics (free tier: 2,500 events/month)
3. Optionally add [Google Analytics 4](https://analytics.google.com) for deeper insights

### Monitor Performance

- [PageSpeed Insights](https://pagespeed.web.google.com/) — aim for 90+ on all metrics
- [GTmetrix](https://gtmetrix.com/) — check load times
- [ahrefs Webmaster Tools](https://ahrefs.com/webmaster-tools) — free SEO monitoring

---

## 5. Creating .webp Image Files

### Method 1: Using `cwebp` (Command Line — Recommended)

```bash
# Install on macOS
brew install webp

# Convert PNG to WebP (quality 80 is a good balance)
cwebp -q 80 public/foto-avatar.png -o public/foto-avatar.webp

# Create the small version (resize to 192px width)
cwebp -q 80 -resize 192 192 public/foto-avatar.png -o public/foto-avatar-sm.webp

# Convert with specific dimensions for OG image
cwebp -q 85 og-image-source.png -o public/og-image.webp
```

### Method 2: Using `sharp` (Node.js)

```bash
# One-time install
npm install -D sharp-cli

# Or use a quick script
node -e "
const sharp = require('sharp');
sharp('public/foto-avatar.png').resize(384, 384).webp({quality: 80}).toFile('public/foto-avatar.webp');
sharp('public/foto-avatar.png').resize(192, 192).webp({quality: 80}).toFile('public/foto-avatar-sm.webp');
"
```

### Method 3: Using `sips` (Built-in macOS)

```bash
# macOS has sips built in, but it doesn't support webp natively
# Use with ImageMagick instead:
brew install imagemagick

# Convert
magick public/foto-avatar.png -resize 384x384 -quality 80 public/foto-avatar.webp
magick public/foto-avatar.png -resize 192x192 -quality 80 public/foto-avatar-sm.webp
```

### Method 4: Online Tools

- [Squoosh.app](https://squoosh.app/) — Google's free image optimizer (drag & drop)
- [CloudConvert](https://cloudconvert.com/png-to-webp) — batch conversion

### Recommended Image Sizes

| File | Dimensions | Quality | Purpose |
|------|-----------|---------|---------|
| `foto-avatar.webp` | 384×384 | 80 | Main avatar (desktop) |
| `foto-avatar-sm.webp` | 192×192 | 80 | Avatar (mobile / small screens) |
| `og-image.webp` | 1200×630 | 85 | Social media share preview |

---

## 6. OG Image Generation

### Prompt for AI Image Generation

Use this prompt with an AI image generator (Midjourney, DALL-E, or similar):

> **"Professional portfolio OG image for an AI/ML Engineer. Dark gradient background transitioning from deep navy (#0a0a1a) to dark purple (#1a0a2e). On the left side, a clean professional headshot placeholder area (circular frame with subtle glow). On the right side, elegant typography: 'Subash Pandey' in large white sans-serif font, 'AI/ML Engineer · GenAI Developer' in a lighter weight below. Subtle tech-themed decorative elements: floating code brackets, neural network nodes, and circuit-like patterns in very low opacity. Accent color highlights in electric blue (#3b82f6) and purple (#8b5cf6). Modern, minimal, professional. 1200×630 pixels."**

### Alternative: Create with Code (Recommended)

Use [Satori](https://github.com/vercel/satori) or [og-image.vercel.app](https://og-image.vercel.app) to generate programmatically:

```bash
# Quick method: use the Vercel OG playground
# Visit: https://og-playground.vercel.app/
```

### Alternative: Use Figma/Canva

1. Create a 1200×630 canvas
2. Dark background (match your site theme)
3. Your photo on the left (circular crop)
4. Name + title on the right
5. Subtle tech elements (code brackets, nodes)
6. Export as PNG, then convert to WebP

---

## 7. Environment & Security

### Environment Variables (if needed later)

For Vercel, add env vars in Dashboard → Settings → Environment Variables:

- `VITE_FORMSPREE_ID` — if you add a contact form
- `VITE_GA_ID` — for Google Analytics

### Security Headers

Already configured in `vercel.json` (CSP, HSTS, X-Frame-Options, etc.). Review and update the CSP `connect-src` if you add external APIs.

---

## Cost Summary

| Item | Cost | Frequency |
|------|------|-----------|
| Domain (.com) | $8–12 | Yearly |
| Vercel Hosting | Free | (Hobby plan) |
| SSL Certificate | Free | (Auto via Vercel) |
| Vercel Analytics | Free | (2,500 events/mo) |
| **Total** | **~$10/year** | |
