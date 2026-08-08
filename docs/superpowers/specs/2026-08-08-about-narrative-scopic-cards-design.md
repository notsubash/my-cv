# About narrative + Scopic cards redesign

**Date:** 2026-08-08  
**Status:** Approved  
**Surfaces:** `/about`, home Work Experience (Scopic block), home contact footer

## Goal

Give About a distinct narrative job so it stops reprinting the homepage CV. Keep the landing mostly intact, except: move “how I work” off Work Experience onto About, quiet Technical Notes as hire clutter, and flatten the Scopic project cards into one cool accent system (no gold).

## Page jobs

| Surface | Job |
|---------|-----|
| `/` | Persuade + Experience. Artifact → proof → Book. Landing layout stays except the scoped edits below. |
| `/about` | Narrative. Who / how I work / education / one trust signal / Connect. Not a second resume. |
| `/notes` | Archive for deep divers. Route stays. Not a hire CTA. |

## About (`/about`) — option B

### Keep / add (in order)

1. **Header** — avatar, name, role line, location  
2. **Bio** — tighten existing copy; keep Exeter / London Met; one production GenAI paragraph; remove soft filler (“pride in clean code…” style lines) if present  
3. **Availability** — keep current plain-language card (“Open to remote roles · APAC timezone”)  
4. **How I work** — section heading “How I work”; short summary line currently above home competencies (`summary.p2` + highlight + end) plus the six `coreCompetencies` tiles moved from home  
5. **Education** — existing `education.items` list  
6. **One recommendation** — first/only Akash recommendation from `recommendations.items`  
7. **Connect** — Book primary, Email secondary, GitHub/LinkedIn quiet links  

### Remove from About

- Full Experience job list  
- Projects list  
- Certifications  
- Publications  
- LinkedIn post cards  

### Out of scope for About

- New imagery, redesign of visual world, sticky nav changes, breadcrumb pattern changes

## Landing — scoped edits only

### 1. Work Experience preamble

- Delete the competency preamble under `#experience` (summary paragraph + 6-tile grid).  
- Work Experience heading is followed by the “Current” divider / job content.

### 2. Scopic work cards — approach 3

Current: GenAI Chatbot full-width with `gold` accent + side metric tiles (RAG / Qdrant); Voice (`primary`) and Assessment (`accent`) half-width below.

Target:

- **Three equal cards** in one grid: `grid-cols-1 md:grid-cols-3`. No full-width flagship.  
- Accent system: **`primary` and `accent` only**. Remove all `gold` usage on these cards.  
- Assign accents lightly (icon + badge + border tint), not a full warm wash. Fixed pairing: Chatbot `primary`, Voice `primary`, Assessment `accent`.  
- **Remove** Chatbot side metric tiles (`businessOS.metrics`).  
- Preserve titles, descriptions, bullet items, badges, and existing case-study links/CTAs.  
- Do not invent new metrics or claims.

### 3. Technical Notes demotion

- Remove Technical Notes from the “More ways to connect” nav under Let’s talk.  
- Keep `/notes` reachable from the quiet copyright/footer link row (alongside Blog/Privacy).  
- Do not delete the route or `TechnicalNotesPage`.

## Non-goals

- Homepage hero / projects graph / skills section redesign  
- Distilling the rest of the CV dashboard body  
- Blog chrome / double-back cleanup  
- TOC FAB changes  
- Copy rewrites beyond About bio tightening and moving existing competency/summary strings  
- Adding PRODUCT.md / DESIGN.md (optional follow-up via `/impeccable init`)

## Implementation notes

- Prefer editing `AboutPage.tsx`, the Scopic card block in `App.tsx`, and the contact footer in `App.tsx`. Reuse `t.coreCompetencies` / `t.summary` strings; no new i18n keys unless a short About section title is needed (e.g. “How I work”).  
- No shared component extraction required unless it keeps the diff smaller; one About consumer for the tiles is enough.  
- Preserve PostHog click placements where Connect/footer links already fire events.  
- Visual world: preserve incumbent dark cool palette; do not introduce new accent tokens.

## Success criteria

- About no longer lists Experience, Projects, Certs, Pubs, or LinkedIn embeds.  
- Home Work Experience does not open with competency tiles.  
- Scopic block shows three peer cards with no gold and no RAG/Qdrant side tiles.  
- Technical Notes is absent from Let’s talk link row and present in quiet footer links.  
- `/notes` still loads.
