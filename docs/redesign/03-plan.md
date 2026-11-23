# Phase 3 — UX and UI plan

Prototypes (real pages, real content, proposed tokens). Run `npm run dev` and open:

| URL | What |
|---|---|
| `/lab/a` | **Direction A, "Ledger"**: writing-first single column, serif hero sentence, result-first work rows |
| `/lab/b` | **Direction B, "Evidence rail"**: sticky identity and CTA rail (desktop), visual result-first cards |
| `/lab/article` | **Article template**: a real excerpt of the latent-parking post re-set (KaTeX, code, figure, TOC) |

These routes are lazy-loaded, `noindex`, not prerendered, and not in the sitemap. A switcher pill sits at the bottom.
Screenshots (not committed): `MSYS_NO_PATHCONV=1 node scripts/audit/shoot.mjs lab --route /lab/a,/lab/b,/lab/article`.
Budgets measured on the prototypes (`scripts/audit/probe-lab.mjs`):

| Page | Running-text CPL @1440 / @375 | axe (light + dark, both widths) | Length @1440 / @375 |
|---|---|---|---|
| Current `/` | 67 (cards) · 116 article / 53 | 0 on `/`; 4 serious rules site-wide | 10.7 / 14.0 screens |
| `/lab/a` | **73** / 46 | **clean** | **3.2** / 5.1 |
| `/lab/b` | **73** / 40 | **clean** | **3.9** / 6.9 |
| `/lab/article` | **73** / 36 | **clean** | (excerpt) |

---

## 1. Information architecture and hierarchy

**Homepage order (both directions):** identity sentence + CTA → **Selected work** (in the first viewport) →
**In production at Scopic** → **one recommendation** → **Writing** → contact.
*Cut from the homepage, not deleted:* Education, Certifications, Skills, Tech stack and talks move to `/about`. The
MERN e-commerce project moves to `/open-source` or GitHub. Reason: P2 (homepages median about 3 screens) and problems #2, #4, #10.

**Navigation:** a persistent text nav (Work · Writing · About · CV) replaces the orbiting emoji (P1, problem #8). In B
it's the rail's scroll-spy list on desktop. The floating theme toggle stays as it is.

**Case-study card = problem → what I built → result.** The result is a large tabular number with a plain-language label
("0.89 → 0.29 macro-F1 once subject leakage is removed"). Order is by hiring signal: Gavel (multi-agent LLM) →
Activity Recognition (evaluation rigour) → Cloud-native platform (MLOps) → Latent Parking (negative result, framed as
a finding) → Steam → Underlying Curve. One link target per card (the case study), plus a secondary "Source". That cuts the
current 19+ homepage tab stops in Projects to 11 (problem #7).

**Every case study and post ends with the booking CTA** (`placement: "case_study"` / `"article"`) and a "Next case study"
link (problem #3). One template serves both: case studies become the article template with a metric strip under the header.

**CV:** a "Download CV" control in the hero and nav (problem #5). ⚠ This needs a current PDF at `public/Subash-Pandey-CV.pdf`.
The repo only holds `April-2026-CV.pdf` at the root. I haven't published it because it's personal data you should check first.

### Directions compared

| | A · Ledger | B · Evidence rail |
|---|---|---|
| Hero | One serif sentence, highlighter on "AI/ML engineer at Scopic Software" and "evaluation pipelines" (bold move 1, Eugene Yan) | Name + one-sentence role in sans; rail stays in view (bold move 2, Brittany Chiang) |
| Work | Dense text rows, result number right-aligned | Cards with thumbnail, result number, problem / built rows |
| Booking CTA | Hero and footer | **Always visible** in the rail on desktop; hero and footer on mobile |
| Feel | Editorial, writer-engineer (Eugene, Lee, Paco) | Portfolio, visual evidence (Brittany, Hamel) |
| Risk | Less visual. Relies on copy quality | More to maintain (images). Rail is desktop-only |
| First viewport @1440 | sentence, CTA, status, **first project** | name, role, CTA, nav, **first project with image and result** |

## 2. Design system (tokens: `docs/redesign/theme.proposed.css`, prototypes use `src/lab/lab.css`)

| Token | Value | Why (cite) |
|---|---|---|
| Type ratio | **1.25** (major third) | Reference medians: **h2 ÷ body 1.50, h1 ÷ body 2.00**. A 1.25 scale gives 1.56 and 1.95. The current h2 is 1.29× body (problem #6). |
| Prose size / leading | **17 px / 1.6**, serif | Reference body median 16, long-form 16–19.2 (Eugene 19.2, Ciechanowski 19.2, Josh 18, Lee/Hamel 17). Leading 1.6 matches Lilian, Ciechanowski and Lee (1.6), Eugene 1.62, Emil 1.65. **Serif** for prose: Eugene, Chip, Olah and Lee do it, and KaTeX's math font is a serif, so a serif body stops equations looking pasted in. Uses system serifs, so no new font download (keeps LCP). |
| UI size | 16 px Outfit (kept) | Continuity with the brand. Outfit stays for headings, UI and the homepage. |
| Measure | **55ch** → measured **67–75 CPL** on all real posts (the 66ch prototype value read 80–90 on real paragraphs and was corrected in Phase 4) | Your 60–75 budget. Deliberately tighter than the reference median of 82 (see 02-references "A finding that disagrees with your budget"). `ch` keeps it right whichever serif renders. |
| Floor | **13 px** (`--text-meta`) | Removes the 10/11/12 px text and the dead `.text-sm` / `.text-xs` overrides (problem #11). |
| Code | 14 px mono, line-height 1.65, `code` tint, r8, **wide track** | References: code median 15 px, tint or transparent, radius 0–8. Wide track from bold move 3 (Josh Comeau). The current 12 px is the smallest in the set. |
| Math | display 1.12×, inline 1.05× | References 1.0–1.13× (Eugene, Olah, Karpathy, Lilian). The current display is 1.75×. |
| Spacing | 4 px base, 8 px rhythm; prose blocks 1.6em (one line-height) | Rhythm tied to leading, so vertical gaps line up with lines of text. |
| Colour | Ink #16181b / ink-2 #464b53 / ink-3 #676c75 / one accent #0b6a99 (dark: #ebecee / #b3b8bf / #8b9099 / #6cc4f5) | P3: references are near-monochrome, ink takes 70–99% of characters, one accent. Accent kept from the current primary for continuity. **Contrast (computed):** light 17.2 / 8.5 / 5.1 / 5.7, dark 15.8 / 9.3 / 5.8 / 9.6. ink-2 is a real step down from ink in both themes, which fixes light "muted" at 12.55 ≈ foreground. |
| Links | Underlined in prose (1px, accent at 55%, offset 0.2em) | P5. Fixes `link-in-text-block` (link vs text was 1.03:1 in dark). Accent vs ink is 2.99 / 1.64, so the underline carries the meaning. |
| Radii | 4 / 8 / 12 | Reference code radii 0–12 (median about 3–8). Fewer, smaller radii than today's 12–16 px cards. |
| Shadows | **none on cards**, one `--shadow-pop` for overlays | No reference uses card shadows. They separate with 1 px rules. |
| Motion | 120 / 180 / 260 ms; `ease-out (0.22,1,0.36,1)`, `standard (0.4,0,0.2,1)` | P6: recorded interaction transitions cluster at 100–350 ms. Emil and Brittany use (0.4,0,0.2,1) and ease-out. The ease-out curve is already in your code (kept). |

## 3. Motion spec

| What | Why | Timing | Reduced motion |
|---|---|---|---|
| Hero block: one 6 px rise + fade, 3 lines staggered 60 ms | Tells the eye where to start. CSS keyframes, so the prerender snapshot is the end state (no hydration flash, no LCP delay from Motion) | 260 ms, ease-out | none (static) |
| Link underline and colour on hover | Shows the link responds | 120 ms, standard | instant |
| Work row arrow nudges 3 px; card image scales 1.015 | Shows which row or card will open | 180 / 260 ms, ease-out | none |
| Button press scale 0.98 | Tactile press confirmation | 120 ms, ease-out | none |
| TOC / rail active indicator (line width 24 → 48 px, border colour) | Orientation while scrolling | 180 ms, ease-out | instant |
| **Removed:** aurora blobs, rotating orbit, scroll nudge, dashed "dependency" lines, shimmer, Motion entrances on every section | Ambient loops that don't respond to the user (P6). WCAG 2.2.2. Problems #8, #9. They also delay LCP (problem #12). | — | — |

Global rule: `prefers-reduced-motion: reduce` → transitions 0.01 ms, animations off (in `lab.css`).

## 4. Five-second test (run with 5 people per variant: current site, A, B)

**Recruit:** 5 people per variant (15 total, or the same 5 with variants in rotated order and a 1-day gap). Ideally hiring
managers or senior engineers who've hired ML engineers. Otherwise any engineer.

**Setup:** a 1440 × 900 laptop, light theme, page loaded and scrolled to the top. Show the page for **exactly 5 seconds**, then hide it.

**Script (read verbatim):**
> "I'm going to show you a personal website for 5 seconds. Imagine you're hiring for an ML/AI engineering role
> and this was linked from an application. Look at it naturally. Afterwards I'll ask a few quick questions; there are no wrong answers."

**Questions (in this order, write answers verbatim):**
1. "What does this person do?" → **pass** if it mentions *AI/ML engineer* (or GenAI/LLM) **and** at least one of: production, Scopic, evaluation, RAG.
2. "Where do they work, or what kind of work have they shipped?" → pass if Scopic **or** any named project or result.
3. "If you wanted to talk to them, what would you click?" → pass if *book / intro / call* (or the CV, for the CV goal).
4. "Name one thing you remember." (free recall: count specific nouns or numbers)
5. "On a 1–5 scale, how senior does this person seem?" (compare means across variants)

**Second task (60-second goal), same people, page visible:** "You have one minute. Find evidence they can ship ML to
production, then either book a call or open the project that convinced you." Record time to first meaningful click
and which element.

**Pass criterion (Definition of Done):** ≥ 4 of 5 pass Q1 **and** Q3 on the chosen direction. Report per-question pass counts
in a 3 × 5 grid (variant × question).

## 5. Analytics plan for new CTAs (Phase 4)

| Event | Properties | Fires on |
|---|---|---|
| `consultation_booking_opened` (existing) | `placement`: new values **`nav`**, **`rail`**, **`case_study`**, **`article`** (union type `BookingPlacement` extended) | every Book button |
| `cv_downloaded` (**new**) | `placement`: `hero` / `nav` / `rail` / `about` | CV link click |
| `project_link_clicked` (existing) | add `position` (1-based index), `result_shown` (bool) | work row or card |
| `case_study_next_clicked` (**new**) | `from_slug`, `to_slug` | "Next case study" link |

`scripts/check-analytics.mjs` gets matching assertions, as it does today for `placement`. Dashboard after launch: P1, P2, P3
(now buildable) and P5 as a 3-week before/after comparison with a launch-date annotation.

## 6. Content gaps (I can't fix these without you)

1. **No production metrics.** Scopic work has no numbers (hallucination-rate change, latency, users or volume). One NDA-safe
   number would turn the "In production" block into evidence. This is the highest-value copy change.
2. **CV PDF** for `public/` (see §1).
3. **Hero copy** in both directions is my proposal, built only from facts in `i18n.ts`. Please check the wording, especially
   A's second line about measuring failure modes.
4. Underlying Curve has no measurable result (follower count, views?). It currently shows "Ongoing Instagram series".

## 7. Phase 4 order (after you pick A or B)

1. Tokens into `index.css @theme`. Delete the dead overrides, unused theme profiles and infinite animations. Run the full axe and screenshot sweep.
2. Homepage in the chosen direction, keeping `home_section_viewed` (section ids change, so the funnel is updated).
3. Case-study layout = article template + metric strip + end CTA.
4. Article template applied to all 8 posts. Shared `Prose`, `Figure`, `Code`, `Display` components replace the 9 per-file helper copies.
5. About, Blog index, Notes, Open Source, Privacy (skip-link target, `<main>`).
6. After each step: `npm test`, `npm run build` (prerender + hydration checks), `scripts/audit/audit.mjs after`, `shoot.mjs after`.
