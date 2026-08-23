---
title: Portfolio blog writing skill
date: 2026-08-23
status: approved design
---

# Portfolio blog writing skill

## Goal

Create a project skill that guides Cursor through researching, outlining, drafting, humanizing, SEO optimizing, and publishing technical portfolio posts.

The skill should preserve the author's evidence-led, first-person voice while preventing generic AI writing. It should optimize primarily for engineers, AI/ML practitioners, and technical hiring panels. Specialized terms should still be explained when a reader outside the immediate domain may not know them.

## Location and invocation

The skill will live at:

`.cursor/skills/writing-portfolio-blogs/`

Its description will auto-trigger it when creating, revising, humanizing, SEO optimizing, or publishing posts under `/blog`.

## Source material

Voice calibration will prioritize:

1. `src/articles/blog-idea-workbench.tsx`
2. `src/articles/blog-cloud-native-ai-platform.tsx`

Older posts remain secondary references. They contain useful structure and subject matter, but the July and August 2026 posts better represent the intended voice.

The existing `.cursor/skills/humanizer/SKILL.md` will provide the general anti-AI pass. The new skill will add portfolio-specific checks.

## Skill structure

```text
.cursor/skills/writing-portfolio-blogs/
├── SKILL.md
├── VOICE.md
├── EVIDENCE.md
├── SEO.md
├── INTEGRATION.md
└── scripts/
    └── validate-blog.mjs
```

### `SKILL.md`

A concise orchestrator containing:

- Trigger conditions
- Required workflow
- Outline and draft approval gates
- Required references for each stage
- Publication completion criteria
- Validator and build commands

### `VOICE.md`

The writing contract:

- Use first person only for work the author performed.
- Prefer decisions, observed failures, measurements, commands, screenshots, and tradeoffs over generic advice.
- Preserve uncertainty and incomplete work.
- Use sentence-case headings that make a useful claim.
- Mix short and long sentences without manufacturing punchiness.
- Explain specialized terms on first use when context does not make them clear.
- End where the argument naturally ends.

Repository-specific warnings will include repeated phrases such as "Wrapping up," "Worth trying next," and "feel free to reach out"; formulaic contrast constructions; bold lead-in lists; unsupported superlatives; and generic recommendations without evidence.

### `EVIDENCE.md`

The evidence contract:

- Create a claim ledger before drafting.
- Map measurable or factual claims to a repository artifact, observed result, or primary external source.
- Prefer primary sources for libraries, standards, datasets, and research.
- Never invent metrics, incidents, user behavior, project history, production experience, citations, or causal explanations.
- Label inference and speculation explicitly.
- Remove or narrow claims that lack support.
- Check whether professional details are public before including them.

### `SEO.md`

The SEO contract:

- Choose one primary reader intent per post.
- Use a small set of natural related terms.
- Do not use the meta keywords field as a writing target.
- Provide an accurate title, slug, description, tags, publication date, modification date, social image, canonical URL, internal links, and `BlogPosting` metadata.
- Use a visible byline and semantic publication date.
- Require descriptive alternative text, captions, accessible tables, and stable heading IDs.
- Treat title and description lengths as editorial warnings, not ranking formulas.
- Do not invent search volume or keyword difficulty.
- If Search Console or keyword data is unavailable, optimize around explicit reader intent and accurate terminology.

### `INTEGRATION.md`

The publishing checklist will name every portfolio location that may need updating:

- Article TSX source
- `src/i18n.ts`
- `src/main.tsx`
- `src/config.ts`
- `src/articles/registry.ts`
- `scripts/prerender.mjs`
- `public/sitemap.xml`
- Social and article assets under `public/`
- Internal blog navigation

The checklist will require verifying actual repository usage rather than updating every file blindly.

### `scripts/validate-blog.mjs`

The script will accept a blog source path or slug. It will perform deterministic checks only.

Failures:

- Referenced image or social image is missing
- Required SEO configuration is absent
- Visible and machine-readable publication dates conflict
- Required route or catalog registration is absent
- Heading IDs are duplicated
- An image lacks alternative text
- A referenced local path does not exist

Warnings:

- Description or title may be weak or unusually long
- Keyword list appears excessive
- A stock ending or unsupported promotional phrase appears
- A figure lacks a caption
- Claims appear measurable but have no nearby source
- Acronym and jargon density is unusually high

The script will print a concise summary and use a nonzero exit status only for failures.

## Authoring workflow

1. Inspect the topic, project files, relevant previous posts, and confidentiality boundaries.
2. Create a brief with the intended reader, primary search intent, reader question, first-hand evidence, external sources, and useful takeaway.
3. Create the claim ledger.
4. Produce a story-led outline. Typical movement is motivation, decisions, implementation, failures, results, and tradeoffs, but the skill will not force identical sections.
5. Ask the user to approve the outline.
6. Write a prose draft before editing TSX.
7. Run the repository voice pass and the general humanizer pass.
8. Ask the user to approve the draft.
9. Prepare the SEO and publishing fields.
10. Integrate the approved post into the portfolio.
11. Run the validator and production build.
12. Report failures and warnings separately.

## Publication threshold

A post is publishable only when it:

- Teaches something specific
- Distinguishes observation from interpretation
- Gives the reader evidence they can inspect
- Includes honest limitations or tradeoffs where relevant
- Answers the selected reader intent
- Passes mechanical publication checks
- Sounds consistent with the author's strongest current posts

## Error handling

- Missing evidence stops or narrows the unsupported claim.
- Missing project details trigger a focused question instead of plausible filler.
- Confidentiality uncertainty blocks the affected material until confirmed.
- Validator failures block publication.
- Validator warnings require review but may be accepted with a stated reason.
- Existing repository defects are reported, not repaired as part of creating this skill.

## Test strategy

Skill creation will follow a baseline and comparison cycle.

Baseline scenarios without the new skill:

1. Create a technical post from project artifacts.
2. Rewrite an older post for stronger SEO and readability.
3. Publish quickly when metrics and citations are incomplete.

The baseline will record generic phrasing, unsupported claims, missed metadata updates, and other observed failures.

The same scenarios will then run with the skill loaded. Success requires:

- An evidence-led brief and claim ledger
- An outline approval gate
- No invented claims or citations
- Voice consistent with the selected reference posts
- Natural keyword use
- Correct publication metadata and assets
- Validator output that catches known date and image defects

After the comparison passes, a final code review will check the skill, references, tests, and validator for clarity, coverage, and unnecessary complexity.

## Out of scope

- Repairing all existing portfolio SEO defects
- Refactoring the blog metadata architecture
- Restoring or deleting the orphaned audio-features post
- Creating a new visual design for social images
- Adding RSS or Atom feeds

These may become separate follow-up tasks.
