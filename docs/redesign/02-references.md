# Phase 2 — Reference study (live, measured 2026-11-23)

**Method.** Each site was loaded live in headless Chrome (`scripts/audit/reference.mjs`) at 1440 × 900 and
375 × 812, in light, then again with `prefers-color-scheme: dark`. Values come from `getComputedStyle`, not
impressions. **CPL** is a true count: characters on each rendered line of the dominant body paragraph (grouped
by line box), median of full lines. Motion was **recorded as it happened**: `animationstart`, `transitionrun` and
`Element.animate` were hooked before page scripts ran, through load plus one scroll pass. The stylesheet census
lists the declared `transition-duration` and `timing-function` values. Raw data: `references/data.json`.
Screenshots (fold, detail, dark) are in `references/*.webp`, **kept local (gitignored)** because they're third-party content.

**Roster.** All 11 suggested sites were up, and none had changed in a way that made them unfit. Added for ML/AI fit:
**Hamel Husain** (hamel.dev, an ML engineer writing about LLM evals, the closest analogue to your positioning and the only
reference with a business CTA), **Chris Olah** (colah.github.io, ML explainers with math) and **Andrej Karpathy**
(karpathy.github.io, ML long-form with math and code). 14 sites, 24 pages.

**Caveats.** "Dark mode = no MQ" means the site didn't react to the system setting. It may still offer a toggle
(Lilian Weng shows one). A few h2/h3 values on homepages hit decorative headings (Josh Comeau 16 px h2, Rauno 720 px), so
the medians use article pages wherever one exists. Rauno and Karpathy's homepages have no paragraphs long enough to measure.

## Comparison table

| Site | Page | Body font | Body px / lh | CPL 1440 / 375 | h1 / h2 / h3 px | h2 ÷ body | Palette: bg · top text colours (share of characters) | Link in prose | Code block | Math | Motion recorded · declared durations · easing | Dark mode | Filled CTA in fold | Length |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lilian Weng | article | system sans | 16 / 1.6 | **98** / 45 | 28 / 24 / — | 1.50 | #fff · #1f1f1f 60%, #4fb4d7 18% | ink, underline via border | mono 16 · #1c1d21 (dark block) · r8 | MathJax 1.13× | 6 transitions · 0.1–0.8 s · linear | toggle, no system MQ | none | 25 scr |
| Eugene Yan | article | **Literata** (serif) | **19.2 / 1.62** | 81 / 33 | 51 / 29 / 23 | 1.50 | #fff · #131311 97% | ink, **underline** | Inconsolata 12.8 · #f5f4ef · r8 | **KaTeX 1.0×** | 0 events · 1.4 s · ease-in-out | toggle → #302f2c | none | — |
| Eugene Yan | home | Literata | 20.8 / 1.4 | 63 / 37 | — | — | #fff · #62605a 65%, #131311 34% + **yellow highlight on name & key verbs** | ink | — | — | 0 events | toggle | none | 3.9 scr |
| Simon Willison | article | Helvetica Neue | 16 / 1.45 | 82 / 45 | 16 / 22 / 20 | 1.40 | #fdfdfd · #000 80%, #0303bb 19% | blue #0303bb (10.6:1) | mono 13 · transparent · r0 | — | 0 events · 0.1–0.2 s · cb(0,0,.2,1) | **system MQ + toggle** | none | 24 scr |
| Chip Huyen | article | **Lora** (serif) | 16 / 1.5 | **103** / 47 | 42 / 32 / 26 | 2.00 | #fdfdfd · #111 94%, #4d74eb 6% | blue | mono 15 · #eef · r3 | — | 0 events | light only | none | 33 scr |
| Chip Huyen | home | Lora | 16 / 1.5 | 65 / 47 | — | — | #fdfdfd · #111 70%, #4d74eb 20% | blue | — | — | 0 events | light only | none | **1.1 scr** |
| Bartosz Ciechanowski | article | IBM Plex Sans | **19.2 / 1.6** | 80 / 38 | 38 / — / — | — | #f8f8f8 · #444 97% | gold, **underline** | (interactive canvases instead) | — | 0 events · 0.1–0.15 s · ease | light only | none | 37 scr |
| Josh W. Comeau | article | Wotfard | 18 / 1.5 | 78 / 40 | 36 / — / 24 | — | #c5eafc · #0a0c10 80% | ink | mono 16 · tinted panel · **bleeds 64 px past prose** | — | **107 events** (60 anim, 47 trans) · 0.3–0.5 s · cb(.27,.22,.44,1.03) | toggle | none | 41 scr |
| Rauno Freiberg | home | — | — | — | 32 / — / — | — | #ededed · #000 40%, #171717 38% + one yellow disc | — | — | — | 14 animations · 0.25–0.5 s · linear | light only | none | 6.8 scr |
| Emil Kowalski | article | system sans | 16 / **1.65** | 85 / 43 | 16 / 16 / — | 1.00 | #fdfdfc · #21201c 86%, #82827c 4% | ink, **underline** | mono 12 · #fff · r12 | — | 36 events (28 anim, 8 WAAPI) · **0.15–0.4 s · ease-out** | **system MQ** | none | 12.5 scr |
| Paco Coursey | home | Söhne | 16 / **1.75** | 69 / 41 | 16 / 14 / — | — | #fff · #3a3a3a 99% | ink, **underline** | — | — | 16 animations · 0.4–0.6 s · staggered fade | **system MQ** → #1a1a1a | none | 1.6 scr |
| Lee Robinson | home | **Iowan Old Style** (serif) | **17 / 1.6** | 78 / 40 | 42 / 23 / — | 1.36 | #fff · #282828 70%, #676767 30% | grey, **underline** | — | — | 107 animations (Tailwind defaults) · 0.15–0.3 s | **system MQ** → #1b1a19 | none | 1.4 scr |
| Brittany Chiang | home | Inter | 14 / 1.5 | 63 / 44 | 48 / 14 / 16 | — | **#0f172a (dark only)** · #94a3b8 71%, #e2e8f0 14% | light ink | — | — | 126 WAAPI (cursor spotlight) · 0.15–0.3 s · cb(.4,0,.2,1) | dark only | none (sticky left nav) | 4.3 scr |
| Hamel Husain | article | Source Sans Pro | 17 / 1.5 | **109** / 44 | 34 / 28 / 25 | 1.65 | #fff · #343a40 88%, #39729e 4% | blue, **underline** | SFMono 14.9 · transparent | — | 22 transitions · 0.1–0.2 s · ease-in-out | system MQ → #151515 | **1 filled "Subscribe" under bio** | 16 scr |
| Chris Olah | article | Computer Modern Serif | 18 / 1.5 | 89 / 41 | 54 / 27 / — | 1.50 | #fff · #333 95% | grey | — | MathJax 1.0× | 0 events | light only | none | 10.5 scr |
| Andrej Karpathy | article | Helvetica | 16 / 1.5 | **112** / 47 | 36 / 32 / 26 | 2.00 | #fdfdfd · #000 87%, #2a7ae2 links | blue | mono 15 · #eef · r3 | MathJax 1.0× | 0 events | light only | none | 35 scr |
| **Your site (baseline)** | article | Outfit | **14 / 1.625** | **116** / 53 | 36 / 18 / — | **1.29** | #f4f5f6 · #282e33 (muted) majority, blue/teal accents + aurora gradients | blue/teal, **no underline** (1.03:1 vs text in dark) | mono **12** · card · r12 | **KaTeX 1.75×** | home: **8 infinite loops** + Motion entrance | MQ + toggle | 1 filled "Book a 30 min intro" + secondary | home **10.7–14 scr** |

**Medians across the 14 sites (article page where available):** body **16 px** (range 14–19.2), line-height **1.5**
(serif and long-form 1.6–1.65), **CPL 82 @1440** (range 63–112), **43 @375**, **h2 ÷ body 1.50**, **h1 ÷ body 2.00**, code **15 px**.
Recorded interaction transitions cluster at **100–350 ms**, easing *ease-out* / `cubic-bezier(0.4, 0, 0.2, 1)`.

**A finding that disagrees with your budget.** Senior sites don't hold 60–75 CPL: the median is 82, and the ML
writers run widest (Lilian 98, Chip 103, Hamel 109, Karpathy 112). I'll **keep your 60–75 budget** anyway. It's the
typographic norm, the widest references are the ones that read worst in their own screenshots, and the sites
closest to it (Paco 69, Brittany 63, Eugene home 63) are the most polished. Because this goes against the reference
median, the plan says so explicitly instead of claiming it comes from the references.

## Patterns that recur across senior sites (7)

| # | Pattern | Seen on | Fixes Phase 1 problem |
|---|---|---|---|
| P1 | **The hero is one first-person sentence that names role, employer or credential.** No animated portrait, no tagline. | Eugene ("Member of Technical Staff at Anthropic"), Hamel ("20+ years… Airbnb and GitHub"), Lee ("Product at SpaceX… formerly Cursor"), Paco ("Webmaster at Linear"), Rauno ("working with Vercel"), Brittany | **#1** generic hero, **#8** orbit nav |
| P2 | **Real work is visible in the first viewport** as a scannable list (title + one-line summary). Homepages are short: median about 3 screens, Chip Huyen 1.1, Lee 1.4, Paco 1.6. | Eugene, Lee, Paco, Hamel, Chip, Brittany | **#2** work 1.5 screens down, **#10** 11–14 screens |
| P3 | **Near-monochrome ink with one accent.** Ink takes 70–99% of text characters, and the accent is used for links or a single highlight, never for decoration. No gradients on any of the 14. | all 14 | **#9** decorative noise, **#11** muted ≈ foreground |
| P4 | **Prose at 16–19 px, line-height 1.5–1.65.** Serif body on 4 of 14, and on 3 of the 5 ML/math writers (Eugene, Chip, Olah). | Eugene 19.2, Ciechanowski 19.2, Josh 18, Olah 18, Lee/Hamel 17 | **#6** 14 px body |
| P5 | **Links in prose are underlined**, or use a single high-contrast blue (≥ 10:1 on the Simon/Karpathy style). Never a low-contrast colour alone. | Eugene, Ciechanowski, Emil, Paco, Lee, Hamel (underline); Simon, Karpathy (blue) | **#7** link-in-text-block, 1.03:1 |
| P6 | **Motion only serves interaction.** Recorded transitions run 100–350 ms, ease-out. No site runs infinite ambient loops behind content; the richest motion (Josh, Emil, Rauno) responds to the user. | Emil, Simon, Hamel, Paco, Brittany, Lee | **#8, #9** 8 infinite loops |
| P7 | **Math at body size (1.0–1.13×). Code at 13–16 px** on a subtle tint or transparent background, with small radii (0–8 px). | Eugene KaTeX 1.0×, Olah/Karpathy MathJax 1.0×, Lilian 1.13×; code median 15 px | **#6** KaTeX 1.75×, 12 px code |

## Bold moves worth borrowing (3, principles only)

1. **A highlighter on the evidence: Eugene Yan.** Eugene marks his name and the verbs "write / speak / prototypes"
   with a flat highlight stroke instead of colour or weight. *Principle:* use the one accent as a marker on the 2–3 phrases
   a hiring manager must catch in 5 seconds (role + employer, the headline result). This is done my way:
   an underline-height wash in the existing blue, applied only in the hero sentence.
   **Fixes #1.**
2. **A sticky identity rail: Brittany Chiang.** On desktop, name, role, section nav and social links stay fixed on the left
   while work scrolls on the right. *Principle:* keep who-you-are and the booking CTA in view during the whole
   scan, so the 60-second booking never needs a scroll back to the top. Used only in Direction B, light-first rather than dark-only.
   **Fixes #2, #3, #8.**
3. **Figures and code wider than the prose column: Josh W. Comeau.** His code panels bleed 64 px past the text measure.
   *Principle:* keep running text at 60–75 CPL, and let code, wide equations and diagrams use more width so they
   don't wrap or need horizontal scrolling. That also removes most of the 10 `scrollable-region-focusable` violations.
   **Fixes #6, #7.**

Explicitly *not* borrowed: Rauno's oversized-type poster (it hides the work), Brittany's dark-only palette (no
light option for daytime readers), and Josh's playful tinted backgrounds (that's his brand, not a principle).
