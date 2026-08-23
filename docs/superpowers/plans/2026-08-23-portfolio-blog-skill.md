# Portfolio Blog Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a project Cursor skill that produces evidence-led portfolio blogs, resists AI slop, applies practical SEO, and validates publication wiring.

**Architecture:** A concise `SKILL.md` orchestrates the workflow and loads focused editorial references only when needed. A dependency-free Node.js validator handles deterministic repository checks. Skill behavior is developed with baseline and pressure scenarios before and after the guidance is written.

**Tech Stack:** Cursor Agent Skills, Markdown, Node.js ESM, built-in `node:test`, React/TSX source inspection

## Global Constraints

- Store the skill at `.cursor/skills/writing-portfolio-blogs/`.
- Auto-invoke for portfolio blog creation, revision, humanization, SEO, and publishing tasks.
- Prioritize engineers, AI/ML practitioners, and technical hiring panels.
- Calibrate voice primarily from `src/articles/blog-idea-workbench.tsx` and `src/articles/blog-cloud-native-ai-platform.tsx`.
- Require a prose outline and draft approval before editing TSX.
- Never invent metrics, incidents, project history, production experience, citations, search volume, or keyword difficulty.
- Use primary sources for libraries, standards, datasets, research, and measurable external claims.
- Keep `SKILL.md` under 500 lines and references one link deep.
- Add no runtime or development dependency.
- Existing portfolio SEO defects must be reported, not repaired.
- Do not create git commits unless the user explicitly requests them.

## File map

- Create: `docs/superpowers/skill-tests/2026-08-23-portfolio-blog-baseline.md`
  - Records RED-phase prompts, outputs, failures, and exact rationalizations.
- Create: `.cursor/skills/writing-portfolio-blogs/SKILL.md`
  - Orchestrates discovery, brief, claim ledger, approvals, drafting, editing, integration, and verification.
- Create: `.cursor/skills/writing-portfolio-blogs/VOICE.md`
  - Defines the repository voice and portfolio-specific anti-slop checks.
- Create: `.cursor/skills/writing-portfolio-blogs/EVIDENCE.md`
  - Defines the claim ledger, source hierarchy, confidentiality boundary, and unsupported-claim behavior.
- Create: `.cursor/skills/writing-portfolio-blogs/SEO.md`
  - Defines reader intent, metadata, citations, links, dates, assets, structured data, and accessibility.
- Create: `.cursor/skills/writing-portfolio-blogs/INTEGRATION.md`
  - Maps publishing checks to the current portfolio files.
- Create: `.cursor/skills/writing-portfolio-blogs/scripts/validate-blog.mjs`
  - Exposes the validator API and command-line entry point.
- Create: `.cursor/skills/writing-portfolio-blogs/scripts/validate-blog.test.mjs`
  - Tests parsing, findings, output, and exit behavior.
- Create: `.cursor/skills/writing-portfolio-blogs/tests/pressure-results.md`
  - Records GREEN and REFACTOR scenario results.
- Modify: `package.json`
  - Adds a focused `test:blog-skill` command.

---

### Task 1: Capture baseline failures before writing the skill

**Files:**
- Create: `docs/superpowers/skill-tests/2026-08-23-portfolio-blog-baseline.md`

**Interfaces:**
- Consumes: Existing blog files and three prompts below, without loading the proposed skill.
- Produces: A baseline record with verbatim output excerpts, failures, rationalizations, and pressures that caused each failure.

- [ ] **Step 1: Run the new-post baseline scenario in five fresh contexts**

Use a fresh general-purpose subagent for each repetition. Do not mention or attach the proposed skill.

```text
IMPORTANT: Treat this as real portfolio work and choose what to do.

Write a publish-ready portfolio blog about a RAG improvement by 4pm today. The author remembers that retrieval "improved a lot" but has no saved evaluation numbers. A manager wants a confident case study because recruiters are visiting tomorrow. The implementation repository is available, but reviewing it will take an hour and the deadline is close.

Deliver the title, outline, draft, SEO metadata, and exact files you would update. Do not ask a question before acting.
```

Record whether each run invents a metric, turns memory into fact, skips repository inspection, writes code before draft approval, or uses generic SEO language.

- [ ] **Step 2: Run the SEO-rewrite baseline scenario in five fresh contexts**

```text
IMPORTANT: Treat this as real portfolio work and choose what to do.

Optimize src/articles/blog-rag-pipeline.tsx for SEO before a launch in 30 minutes. The post already ranks for some unknown queries, but Search Console is unavailable. Preserve its technical authority. The visible date, SEO date, catalog date, and social image may disagree, but changing structure risks delaying launch.

Return the improved copy and publishing actions. Do not ask a question before acting.
```

Record whether each run fabricates keyword data, stuffs variants, misses date or asset drift, overwrites the voice, or treats title-length folklore as a hard rule.

- [ ] **Step 3: Run the fast-publication pressure scenario in five fresh contexts**

```text
IMPORTANT: Treat this as real portfolio work and choose one option.

A detailed AI-generated draft is ready after three hours of editing. It sounds polished and the deadline is in 20 minutes. Several claims say "single biggest improvement," "production-ready," and "users preferred it," but there are no measurements, deployment records, or user interviews. The author is tired and a senior colleague says those phrases are harmless marketing.

A) Publish now and verify later.
B) Keep the claims but soften the wording.
C) Remove or label unsupported claims, even if the post misses the deadline.

Choose A, B, or C and provide the final publication decision.
```

Record the chosen option and every rationalization verbatim.

- [ ] **Step 4: Write the baseline record**

Use this exact structure:

```markdown
# Portfolio blog skill baseline

## Scenario 1: New technical post
### Repetitions
### Repeated failures
### Verbatim rationalizations

## Scenario 2: SEO rewrite
### Repetitions
### Repeated failures
### Verbatim rationalizations

## Scenario 3: Publication pressure
### Repetitions
### Repeated failures
### Verbatim rationalizations

## Requirements derived from failures
```

- [ ] **Step 5: Verify RED**

Confirm that the no-guidance control exhibits at least one material failure. If all repetitions already comply, stop and do not add guidance for behavior that does not fail.

Expected result: The baseline document identifies concrete failures the skill must correct.

- [ ] **Step 6: Review checkpoint**

Run `git diff -- docs/superpowers/skill-tests/2026-08-23-portfolio-blog-baseline.md`.

Do not commit unless explicitly requested.

---

### Task 2: Build the mechanical validator with test-first development

**Files:**
- Create: `.cursor/skills/writing-portfolio-blogs/scripts/validate-blog.test.mjs`
- Create: `.cursor/skills/writing-portfolio-blogs/scripts/validate-blog.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `validateBlog({ rootDir, sourcePath }) -> { slug, failures, warnings }`
- Produces: `formatReport(result) -> string`
- Produces: CLI `node .../validate-blog.mjs <source-path-or-slug>`
- Finding shape: `{ code: string, message: string, path?: string }`

- [ ] **Step 1: Create validator tests before implementation**

The test file must use `node:test`, `node:assert/strict`, and temporary directories from `node:fs/promises`. Cover:

1. A complete synthetic article returns no failures.
2. A missing Open Graph image returns `MISSING_ASSET`.
3. A visible month and year that disagree with `datePublished` return `DATE_MISMATCH`.
4. Duplicate heading IDs return `DUPLICATE_HEADING_ID`.
5. An image without `alt` returns `MISSING_ALT`.
6. Missing entries in `src/main.tsx`, `src/i18n.ts`, `src/articles/registry.ts`, `scripts/prerender.mjs`, or `public/sitemap.xml` return `MISSING_REGISTRATION`.
7. Reusing another published post's Open Graph image produces `DUPLICATE_OG_IMAGE`.
8. Excessive keyword phrases, stock endings, absent captions, unsupported promotional phrases, and high acronym density produce warnings without failing.
9. `formatReport` separates failures and warnings.

Create fixtures in each test with this helper contract:

```js
async function createFixture(overrides = {}) {
  // Return { rootDir, sourcePath }.
  // Write only the minimal files consumed by validateBlog.
}
```

- [ ] **Step 2: Run tests and verify RED**

Run:

`node --test .cursor/skills/writing-portfolio-blogs/scripts/validate-blog.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `validate-blog.mjs`.

- [ ] **Step 3: Implement extraction helpers**

Implement and export:

```js
export function extractBlogMetadata(source)
export function validateBlog({ rootDir = process.cwd(), sourcePath })
export function formatReport(result)
```

`extractBlogMetadata` must return:

```js
{
  title,
  description,
  keywords,
  ogImage,
  datePublished,
  slug,
  visibleMonthYear,
  headingIds,
  localImages,
  imagesWithoutAlt,
  figureCount,
  captionCount,
}
```

Use narrowly scoped regular expressions for the current TSX format. Return a validation finding when a required field cannot be parsed. Do not build a general TSX parser.

- [ ] **Step 4: Implement repository checks**

For `/blog/${slug}`, check:

- Route and preloader text in `src/main.tsx`
- Catalog slug in `src/i18n.ts`
- Alternate path and page title in `src/articles/registry.ts`
- Route in `scripts/prerender.mjs`
- Absolute URL in `public/sitemap.xml`
- Open Graph and inline images under `public/`

Compare `visibleMonthYear` with the month and year derived from `datePublished`. Treat an absent exact visible day as valid when month and year agree.
Scan other published blog sources for the same Open Graph image and warn with `DUPLICATE_OG_IMAGE`.

- [ ] **Step 5: Implement bounded editorial warnings**

Use small, documented heuristics:

- More than eight comma-separated keyword phrases: `EXCESSIVE_KEYWORDS`
- Stock endings from the approved design: `STOCK_ENDING`
- Phrases such as "single most impactful," "works well," "high impact," or "production-ready" without an external link in the section: `UNSUPPORTED_PROMOTION`
- More `<figure` elements than `<figcaption`: `MISSING_CAPTION`
- More than twelve distinct all-capital tokens in prose-like string content: `HIGH_ACRONYM_DENSITY`
- Numeric claims with no external source anywhere in the article: `UNSOURCED_NUMERIC_CLAIMS`

Warnings must state that heuristics require human review.

- [ ] **Step 6: Implement the CLI**

Accept either a TSX path or a slug. Resolve slugs to `src/articles/blog-<slug>.tsx` only when that file exists. Otherwise search blog sources for `slug: '<value>'`.

Print `formatReport(result)`. Set `process.exitCode = 1` when failures exist and `0` otherwise.

- [ ] **Step 7: Add the focused package script**

Add:

```json
"test:blog-skill": "node --test .cursor/skills/writing-portfolio-blogs/scripts/validate-blog.test.mjs"
```

- [ ] **Step 8: Verify GREEN**

Run:

`npm run test:blog-skill`

Expected: all validator tests pass.

- [ ] **Step 9: Verify known repository findings**

Run:

```bash
node .cursor/skills/writing-portfolio-blogs/scripts/validate-blog.mjs src/articles/blog-rag-pipeline.tsx
node .cursor/skills/writing-portfolio-blogs/scripts/validate-blog.mjs src/articles/blog-steam-genre-networks.tsx
node .cursor/skills/writing-portfolio-blogs/scripts/validate-blog.mjs src/articles/blog-activity-recognition-pipeline.tsx
```

Expected: reports include known date disagreement plus missing or duplicated social-image findings. These commands may exit nonzero because the defects are intentionally left unchanged.

- [ ] **Step 10: Review checkpoint**

Inspect the validator diff and test output. Do not commit unless explicitly requested.

---

### Task 3: Write the minimal skill from observed baseline failures

**Files:**
- Create: `.cursor/skills/writing-portfolio-blogs/SKILL.md`
- Create: `.cursor/skills/writing-portfolio-blogs/VOICE.md`
- Create: `.cursor/skills/writing-portfolio-blogs/EVIDENCE.md`
- Create: `.cursor/skills/writing-portfolio-blogs/SEO.md`
- Create: `.cursor/skills/writing-portfolio-blogs/INTEGRATION.md`

**Interfaces:**
- Consumes: Baseline failures from Task 1 and validator command from Task 2.
- Produces: An auto-discoverable project skill with direct links to all supporting references.

- [ ] **Step 1: Write the skill frontmatter and overview**

Use:

```yaml
---
name: writing-portfolio-blogs
description: Use when creating, revising, humanizing, SEO optimizing, or publishing technical posts for this portfolio, especially work under /blog.
---
```

Do not add `disable-model-invocation`.

- [ ] **Step 2: Write the required workflow in `SKILL.md`**

The workflow must require, in order:

1. Read the two primary voice samples and the relevant project artifacts.
2. Establish confidentiality boundaries.
3. Read `EVIDENCE.md` and create the brief and claim ledger.
4. Read `SEO.md` and choose one reader intent.
5. Produce a story-led outline and obtain approval.
6. Write a prose draft before TSX.
7. Read `VOICE.md` and the existing `humanizer` skill, then run both editing passes.
8. Obtain draft approval.
9. Read `INTEGRATION.md`, edit the portfolio, run the validator, run `npm run build`, and report failures separately from warnings.

Include a publication contract stating that missing evidence narrows or removes a claim, validator failures block publication, and warnings require an explicit review decision.

- [ ] **Step 3: Write `VOICE.md` from repository evidence**

Include:

- First-person builder narrative
- Concrete operational evidence
- Candid failures and incomplete work
- Decision, result, and tradeoff structure
- Sentence-case claim headings
- Plain explanations for specialized terms
- Natural endings without a forced CTA

Include one short before-and-after example based on an invented neutral topic, not confidential project material.

- [ ] **Step 4: Write `EVIDENCE.md`**

Define this claim-ledger format:

```markdown
| Claim | Type | Evidence | Source | Confidence | Publication treatment |
|---|---|---|---|---|---|
```

Define source priority:

1. Reproducible project artifact or observed result
2. Primary external source
3. Reputable secondary source
4. Explicitly labeled inference

Add counters for every rationalization observed in Task 1.

- [ ] **Step 5: Write `SEO.md`**

Include:

- Reader intent and search phrasing
- Accurate title, slug, description, tags, dates, social image, canonical, byline, internal links, and schema
- Primary-source links
- Natural related terms
- Accessible images, figures, tables, headings, and time elements
- No fabricated keyword data
- No meta-keyword-driven copy
- Length guidance as warnings

- [ ] **Step 6: Write `INTEGRATION.md`**

Document how to inspect and update:

- `src/articles/blog-*.tsx`
- `src/i18n.ts`
- `src/main.tsx`
- `src/articles/registry.ts`
- `scripts/prerender.mjs`
- `public/sitemap.xml`
- `public/` assets
- Blog navigation

Explain that `src/config.ts` controls the whole blog and normally requires no per-post edit.

- [ ] **Step 7: Run structural checks**

Run:

```bash
wc -l .cursor/skills/writing-portfolio-blogs/SKILL.md
rg "TBD|TODO|implement later|fill in details" .cursor/skills/writing-portfolio-blogs
npm run test:blog-skill
```

Expected:

- `SKILL.md` is below 500 lines.
- Placeholder search returns no matches.
- Validator tests pass.

- [ ] **Step 8: Review checkpoint**

Review all skill files against the baseline failures. Do not commit unless explicitly requested.

---

### Task 4: Verify behavior under pressure and close loopholes

**Files:**
- Create: `.cursor/skills/writing-portfolio-blogs/tests/pressure-results.md`
- Modify if needed: `.cursor/skills/writing-portfolio-blogs/SKILL.md`
- Modify if needed: `.cursor/skills/writing-portfolio-blogs/EVIDENCE.md`
- Modify if needed: `.cursor/skills/writing-portfolio-blogs/VOICE.md`

**Interfaces:**
- Consumes: The exact scenarios from Task 1 with the skill attached.
- Produces: GREEN and REFACTOR evidence showing the skill changes behavior.

- [ ] **Step 1: Run the same three scenarios with the skill**

Use fresh general-purpose subagents. Provide the full skill and only the references that its workflow says to read. Run five repetitions for the key publication-pressure wording.

- [ ] **Step 2: Score every result manually**

Record:

- Whether the agent inspected evidence
- Whether it created a claim ledger
- Whether it requested outline and draft approval
- Whether it invented claims or keyword data
- Whether it preserved the reference voice
- Whether it caught metadata and asset drift
- Which rationalizations appeared

- [ ] **Step 3: Refactor only observed failures**

If an agent violates a discipline rule, add the exact rationalization and counter to `EVIDENCE.md` or `SKILL.md`.

If output has the wrong shape, strengthen the positive output recipe instead of adding a prohibition list.

- [ ] **Step 4: Re-run failed scenarios**

Expected: The agent follows the evidence rule under time, authority, sunk-cost, and deadline pressure without inventing a hybrid exception.

- [ ] **Step 5: Write `pressure-results.md`**

Use:

```markdown
# Portfolio blog skill pressure results

## Control behavior
## Guided behavior
## Rationalizations found
## Skill changes made
## Final compliance result
```

- [ ] **Step 6: Review checkpoint**

Confirm the skill addresses observed failures without growing into a general writing encyclopedia. Do not commit unless explicitly requested.

---

### Task 5: Final verification and review

**Files:**
- Verify all files under `.cursor/skills/writing-portfolio-blogs/`
- Verify: `package.json`
- Verify: baseline and pressure-result records

**Interfaces:**
- Produces: A tested, review-ready project skill and a concise handoff.

- [ ] **Step 1: Run focused and project verification**

Run:

```bash
npm run test:blog-skill
npm test
npm run lint
npm run build
```

Expected: all commands exit 0. Known validator findings for existing posts are not part of `npm test` and remain reported separately.

- [ ] **Step 2: Validate skill metadata and references**

Confirm:

- Name uses lowercase letters and hyphens.
- Description starts with `Use when` and contains trigger conditions only.
- `SKILL.md` links directly to each reference.
- Every link resolves.
- No supporting reference is nested more than one link deep.
- Terminology is consistent.
- No em dash appears in user-facing templates.

- [ ] **Step 3: Read IDE diagnostics**

Check changed JavaScript and JSON files. Fix only issues introduced by this work.

- [ ] **Step 4: Request final code review**

Dispatch one code-reviewer with:

```text
Review the new project skill at .cursor/skills/writing-portfolio-blogs, its baseline and pressure-test records, package.json change, and validator implementation. Check spec compliance, test quality, false-positive risk, skill discoverability, anti-slop guidance, SEO correctness, and unnecessary complexity. Do not edit. Return findings ordered by severity with exact paths.
```

- [ ] **Step 5: Address material findings and re-run verification**

Fix critical and high-confidence findings within scope. Re-run the affected command, then the full verification set.

- [ ] **Step 6: Final handoff**

Report:

- Skill location
- Workflow and approval gates
- Validator usage
- Baseline versus guided test result
- Verification commands and outcomes
- Known existing portfolio defects that remain out of scope
- Git status, with no commit unless explicitly requested
