# Phase 1 — Audit (baseline, 2026-11-23, branch `redesign/evidence-first`)

Everything below was measured on a fresh production build (`npm run build`, prerendered),
served locally with **all third-party requests blocked** (no PostHog / Cal / Vercel events were sent).

Reproduce:

```bash
npm run build
node scripts/audit/shoot.mjs baseline       # 72 full-page shots: 18 routes × {375,1440} × {light,dark}
node scripts/audit/audit.mjs baseline       # axe, keyboard, motion, typography, fold, lab perf → audit/baseline.json
node scripts/audit/probe-prose.mjs          # true characters-per-line of running text
```

Artifacts: `docs/redesign/screenshots/baseline/` (full page), `docs/redesign/screenshots/baseline-fold/`
(first viewport), `docs/redesign/audit/baseline.json` (raw numbers).

---

## 1. Data I need from you (paste results back)

The events below already exist in the code; the property names are exact.

### PostHog (project → Product analytics), date range **last 90 days**, filter out internal/test users

| # | Insight | Exact setup | What it answers |
|---|---|---|---|
| P1 | **Funnel: landing → case study → booking** | Funnel, ordered, unique users, window 1 day. Step 1 `$pageview` where `$pathname` = `/`. Step 2 `$pageview` where `$pathname` matches regex `^/(projects\|blog)/.+`. Step 3 `consultation_booking_opened`. Step 4 `consultation_booking_completed`. Breakdown `$device_type`. | Does opening a case study lead to a booking? (Note: case studies and posts have **no** booking button today, so step 3 can only happen after returning to `/`, `/about` or the footer.) |
| P2 | **Funnel: landing → booking (direct)** | Step 1 `$pageview` `$pathname` = `/`. Step 2 `consultation_booking_opened`. Step 3 `consultation_booking_completed`. Breakdown on step 2 property `placement` (`hero` / `footer` / `about`). | Which booking button works, and how many people drop between opening and finishing the booking. |
| P3 | **Funnel: landing → CV download** | **Can't be built: the site has no CV download** (no link, no `.pdf` in `public/`, no event). Pull P3b as a proxy instead. | — |
| P3b | Proxy for intent to hire | Trends, unique users: `outbound_link_clicked` where `destination` = `linkedin`, and `contact_email_clicked`, both broken down by `placement`. | How often recruiters leave to look you up on LinkedIn instead. |
| P4 | **Entry pages** | Web analytics → *Paths* tab → **Entry paths** table (visitors, views, bounce rate) + *Sources* tab (**Referring domain**, **Channel type**) + *Devices* (**Device type**). Export or screenshot. | Where hiring managers actually land. If most land on articles, the article template becomes the homepage. |
| P5 | **Scroll depth** | Trends: `$pageleave`, aggregate **property value → median and p75** of `$prev_pageview_max_scroll_percentage`, filter `$prev_pageview_pathname` = `/`, breakdown `$device_type`. Repeat for `$prev_pageview_pathname` matches `^/(projects\|blog)/`. | How far down the 11–14-screen homepage people get. |
| P6 | **Homepage section reach** | Funnel, ordered, window 1 day: `$pageview` (`/`) → `home_section_viewed` `section=projects` → `experience` → `speaking` → `education` → `tech` → `contact`. | Where people drop off on the homepage. |
| P7 | **Article read depth** | Trends: `article_read_depth`, unique users, breakdown `slug` then `depth` (25/50/75/100). Table view. | Whether long posts get read to the end. |
| P8 | **Rage and dead clicks** | Trends: `$rageclick` and `$dead_click`, breakdown `$pathname`, then a table broken down by `$el_text` / `$elements_chain` (top 20). Also **Heatmap** (toolbar) for `/` at mobile and desktop widths: clicks + scroll map, screenshot. | Which elements frustrate people. I suspect the orbiting emoji icons and the non-clickable project images. |
| P9 | **Project card clicks** | Trends: `project_link_clicked`, breakdown `project_title`, second breakdown `link_type`. Table. | Which projects pull attention, and whether people prefer GitHub over the case study. |
| P10 | **Paths from `/`** | Paths insight, page views, start at `/`, depth 4, top 15 paths. | What people actually do after landing. |
| P11 | (Optional) 5 session replays | Replays filtered: first page `/`, duration > 10 s, mobile. Describe or note timestamps. | Qualitative check on the 5-second goal. |

### Vercel Speed Insights → Production, **last 30 days**, P75

- Real Experience Score plus **LCP, INP, CLS, FCP, TTFB**, separately for **Mobile** and **Desktop**.
- The **Routes** table sorted by data points (at least `/`, the top 3 `/blog/*`, and `/projects/*`). Screenshot or CSV.
- If the panel shows the LCP element for `/`, include it.

### Google Search Console, **last 3 months**

- Performance → Search results: **Queries** (top 50: clicks, impressions, CTR, position), **Pages**, **Devices**, **Countries**. Export as CSV.
- Indexing → Pages: the "Why pages aren't indexed" reasons table.
- Experience → Core Web Vitals (mobile): any URL groups marked Poor or Needs improvement.

---

## 2. Heuristic, accessibility and content audit (measured)

### 2.1 What a visitor sees in the first viewport (`/`, light theme)

| | 375 × 812 | 1440 × 900 |
|---|---|---|
| Name (h1) top | 319 px | 433 px |
| Positioning line | "Building production-ready AI systems for real business outcomes." (16 px) | same (20 px) |
| Real positioning ("GenAI products, RAG systems, LLM reliability") | 14 px muted, y 430 | 16 px, y 559 |
| Primary CTA (Book a 30 min intro) | y 503 ✓ in fold | y 643 ✓ in fold |
| First project title | y 1177 (**1.45 screens down**) | y 1364 (**1.5 screens down**) |
| Employer, years, results, proof | **none** | **none** |
| Page navigation | 4 emoji icons orbiting the avatar; labels show **on hover only** | same |

Homepage length: **14.0 screens** on mobile (11,363 px) and **10.7 screens** on desktop (9,623 px).

### 2.2 Accessibility: axe-core 4.10 (WCAG 2.0/2.1/2.2 A+AA + best practice), 18 routes × {1440 light, 1440 dark, 375 light}

| Rule | Impact | Where | Cause |
|---|---|---|---|
| `link-name` | serious | **all 17 inner routes @375** | Mobile breadcrumb "Home" link is an icon with no accessible name |
| `link-in-text-block` | serious | 12 routes (18 links in the latent-parking post) | Links are told apart from text by colour alone. Link vs body text contrast is **2.44:1 in light, 1.03:1 in dark** (needs 3:1 or an underline) |
| `scrollable-region-focusable` | serious | 10 routes @375 (12 in the latent-parking post) | Horizontally scrolling diagrams and code can't be reached by keyboard |
| `color-contrast` | serious | article TOC | 11–12 px TOC text at `muted-foreground/60` = **3.77:1 light / 3.40:1 dark**. The section label at `/50` = 2.89 / 2.76 |
| `skip-link`, `region` | moderate | 5 blog posts + `/privacy` | Skip link target missing on those templates |
| `landmark-one-main` | moderate | `/privacy` | No `<main>` |
| — | — | **`/` and `/about` @1440: clean in both themes** | — |

**Keyboard** (30 Tab presses on `/`): focus is always visible (2 px outline) ✓. But the orbit links are reached in visual order y = 185 → 248 → 389 → 257 → 117 px (jumps around the circle), and the projects grid holds **≥ 19 tab stops** (2–4 links per card) before Experience.

**Reduced motion**: `/` runs **8 infinite animations** (2 aurora blobs, 5 ring rotations, 1 scroll nudge). With `prefers-reduced-motion: reduce`, **all of them stop** ✓. Without it, the four nav targets orbit for good (15 s per loop) and only pause while one is hovered or focused. That's moving content with no pause control (WCAG 2.2.2), and the targets are harder to hit while moving.

**Token contrast** (computed from `index.css`):

| Pair | Light | Dark |
|---|---|---|
| foreground / background | 17.53 | 15.02 |
| muted-foreground / background | **12.55** | 7.14 |
| primary / background | 5.15 | 6.93 |
| primary (link) / muted-foreground (body) | **2.44** | **1.03** |
| border / background | 1.56 | 1.38 |

In light mode, "muted" text (12.55) is almost as dark as the main text (17.53), so secondary text doesn't read as secondary. Dark mode has a real step (15.0 → 7.1). The two themes rank text differently.

**Dead CSS**: `index.css` lifts `.text-sm` to 16 px and `.text-xs` to 14 px inside `@layer base`. Tailwind v4's `utilities` layer outranks `base`, so **neither rule ever applies**. Real sizes: `text-sm` = 14 px and `text-xs` = 12 px. The latent-parking post renders **33,819 characters at 14 px and 5,449 at 12 px**, plus some 11 px and 10 px text.

### 2.3 Long-form reading (latent-parking post, gavel case study)

| Measure | Value | Target |
|---|---|---|
| Body size / line-height | **14 px / 1.625** (`text-sm leading-relaxed`) | ≥ 16 px |
| Body colour | `muted-foreground` (rgb 40 46 51) | — |
| Characters per line (true count) | **116 @1440**, 53 @375 | 60–75 |
| H1 / H2 / body | 36 / **18** / 14 px. H2 is only 1.29× body | clear steps |
| Code | 12 px mono, same width as the prose | ≥ 13–14 px |
| Display math (KaTeX) | 24.5 px = 1.75× body | ~1.1–1.2× body |
| Figure captions | 12 px, centred, 133 CPL | — |
| Shared prose system | **none**: each of 9 article files defines its own `K`, `A`, `Shot` helpers | one template |

### 2.4 Lab performance (mobile 375, Slow-4G-ish 1.6 Mbps / 150 ms RTT, 4× CPU, cold cache, third parties blocked)

| Route | LCP | LCP element | CLS | Transfer |
|---|---|---|---|---|
| `/` | **2,540 ms** (over the 2.5 s budget) | hero tagline `<p>` | 0 | 994 KB |
| latent-parking post | 2,436 ms | h1 | 0 | 1,526 KB |
| `/projects/gavel` | 2,216 ms | intro `<p>` | 0 | 958 KB |

Lab numbers only. Speed Insights field data (§1) decides the ranking.

### 2.5 Nielsen heuristics: homepage and case-study cards

- **#6 Recognition over recall** — the main page navigation is four emoji icons with hover-only labels, so touch users never see what they are. There's no persistent top nav on `/`.
- **#8 Aesthetic and minimalist design** — aurora blobs, a dot grid, a rotating ring, and **animated dashed "dependency lines" between project cards that suggest relationships the projects don't have**. Eight cards each carry 4–10 tech tags. 10.7–14 screens.
- **#4 Consistency** — "case study" links go sometimes to `/projects/*` (CaseStudyLayout) and sometimes to `/blog/*` (article template): two templates for the same job. CTA labels vary: "Read blog post", "Read case study", "View series". There are three card skins (highlight / default / tool) with no stated meaning.
- **#2 Match with the real world** — a section named "Sharing" holds talks, LinkedIn posts, blog previews **and the only recommendation**. "Technical Notes" vs "Blog" isn't explained.
- **#7 Flexibility** — recruiters often need a file for an ATS. There's no CV download.
- **#3 User control** — case studies and blog posts are dead ends for the 60-second goal: **no booking CTA** on any `/projects/*` or `/blog/*` page (`CalBookButton` exists only in the hero, footer and `/about`).

**Content hierarchy, homepage:** order is Hero → 8 Projects → Experience → Sharing (talks, recommendation, LinkedIn, blog) → Education → Certifications → Skills → Tech → Contact. The strongest hiring signal (**production GenAI at Scopic since Oct 2024**) sits *below* eight side projects. The first card leads with a negative result ("learned latent MPC parks 0 of 6 measured seeds"), which is admirable in a post but reads as failure in a 5-second scan. A MERN e-commerce project dilutes the ML positioning.

**Case-study card anatomy, today:** image → title + badge → one dense paragraph (method and result mixed, jargon such as "parking-v0 success diagnostic", "GroupKFold") → tags → CTA + 1–3 links. **There's no problem → what I built → measurable result structure**, and the result, when there is one, is buried mid-sentence.

---

## 3. Ranked problem list

Ranked by expected effect on the two goals (5-second understanding, 60-second booking or case-study open) × confidence in the evidence. Items marked **⟂ analytics** get re-ranked once P1–P10 arrive.

| # | Problem | Evidence | Goal hit |
|---|---|---|---|
| 1 | **Hero states no evidence.** A generic line, no employer, years or result. The real positioning is in 14 px muted text. | Fold inventory §2.1. LCP element is the generic line. | 5 s |
| 2 | **Work is 1.5 screens below the fold**, behind a 176 px avatar and an orbiting ring. | First project title at y 1177 / 1364 §2.1 | 5 s, 60 s ⟂ analytics (P5, P6) |
| 3 | **Case studies and posts are dead ends** (no booking CTA), and two different templates serve as "case study". | Code: `CalBookButton` only in hero, footer, about. Heuristic #3, #4 | 60 s ⟂ P1 |
| 4 | **Cards don't show results.** No problem → built → result. Dense jargon. A negative result leads. Production work sits below side projects. | §2.5 card anatomy, section order | 5 s, 60 s ⟂ P9 |
| 5 | **No CV download**, so the CV funnel can't exist and can't be measured. | grep: no `.pdf` in `public/`, no event | 60 s |
| 6 | **Article body is 14 px at 116 CPL** in muted colour, H2 at only 1.29× body, 12 px code, 1.75× display math. | §2.3, `probe-prose.mjs` | long-form |
| 7 | **Links told apart by colour alone** (1.03:1 in dark), mobile home link unnamed, scroll regions unreachable by keyboard, TOC contrast 3.4–3.8:1. | axe §2.2, 12–17 routes | a11y budget (0 serious) |
| 8 | **Navigation by orbiting emoji** with hover-only labels. It moves forever (no pause control) and the tab order jumps around. | keyboard walk, motion census | 5 s, a11y |
| 9 | **Decorative noise** (aurora, dot grid, ring, animated dependency lines) competes with content, and the lines imply false structure. | 8 infinite animations, heuristic #8 | 5 s |
| 10 | **Homepage is 11–14 screens long** with weakly named sections ("Sharing"). Social proof is buried ~5,000 px down. | page height §2.1, section order | 60 s ⟂ P5, P6 |
| 11 | **Type tokens are inconsistent:** dead `.text-sm`/`.text-xs` overrides, 10–11 px text, light-mode "muted" nearly equal to foreground. | §2.2 | all |
| 12 | **Mobile LCP 2.54 s in the lab** (over budget). The LCP element is the hero text, delayed by Motion's entrance fade. | §2.4 ⟂ Speed Insights | budget |

## 4. Keep list (works today, protect it)

1. **Prerender + hydration-safety checks**, and **CLS 0** on every measured route.
2. **Analytics foundation:** `consultation_booking_opened` with `placement`, `consultation_booking_completed`, `home_section_viewed`, `article_read_depth`, `project_link_clicked`. Enough to build funnels now.
3. **Focus-visible outlines everywhere**, the home skip link, and **every infinite animation stops under reduced motion**.
4. **`/` and `/about` are axe-clean in both themes.** Body/background contrast is 17.5 and 15.0.
5. **Case-study metric tiles** (Gavel: 5 judges · 19 SSE event types · 389 tests · 3 eval tiers). These are the evidence the homepage lacks.
6. **Honest, quantified writing** ("0.89 leaky macro-F1 vs 0.29 GroupKFold"). Specific numbers like these mark senior work.
7. **KaTeX with `htmlAndMathml`** (screen readers can read the math), copy-to-clipboard code with an event, an article TOC with active state, and reading time.
8. **Cal.com opens in-page** (no context switch). Self-hosted fonts.
9. A **real recommendation** from an AI product leader. It's good proof, just in the wrong place.
