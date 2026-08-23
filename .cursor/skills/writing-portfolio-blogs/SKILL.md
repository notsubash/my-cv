---
name: writing-portfolio-blogs
description: Guides evidence-led writing, humanizing, SEO auditing, optimization, and publishing for technical portfolio blogs. Use when creating, revising, auditing, or publishing posts under /blog.
---

# Writing portfolio blogs

## Purpose

Write useful technical posts in Subash Pandey's voice, grounded in work he actually did. Optimize for engineers, AI/ML practitioners, and technical hiring panels without assuming every reader knows the exact stack.

The post must sound like a builder explaining decisions, failures, results, and tradeoffs. It must not sound like a generic content site.

## Start with the repository

Before outlining:

1. Read the relevant project files, results, screenshots, and repository history.
2. Use these posts as the primary voice references:
   - `src/articles/blog-idea-workbench.tsx`
   - `src/articles/blog-cloud-native-ai-platform.tsx`
3. Treat reference posts as voice samples, not rule-complete templates.
4. Identify what is public, what is confidential, and what cannot be verified.
5. Ask a focused question when a missing fact would materially change the post.

Never infer private professional details from adjacent public information. Sanitize screenshots, commands, configuration, customer details, credentials, tokens, internal URLs, and private infrastructure before publication.

## Required workflow

Choose the smallest workflow that matches the request:

- **New post or major rewrite:** Follow every step below, including brief, claim ledger, outline approval, draft approval, and integration.
- **Targeted prose edit or humanization:** Inspect the existing evidence, edit only the requested sections, then compare every factual claim with the original. Do not require a new outline unless the argument changes.
- **SEO audit:** Review search intent, copy, sources, metadata, accessibility, links, and publication wiring. Return findings before rewriting unless the user asked for edits.
- **Publication-only task:** Start from the approved draft and run the integration and publication gates.

### 1. Prepare the brief

Provide:

```markdown
## Content brief
- Working topic:
- Primary reader:
- Reader question:
- Primary search intent:
- First-hand evidence:
- External sources needed:
- Useful takeaway:
- Confidentiality limits:
```

Choose one primary search intent. Do not invent search volume, keyword difficulty, or ranking data.

### 2. Build the claim ledger

Before drafting, list claims that need support:

```markdown
| Claim | Evidence | Source | Confidence | Treatment |
|---|---|---|---|---|
```

Use this source order:

1. Reproducible project artifact or observed result
2. Primary external source
3. Reputable secondary source
4. Explicitly labeled inference

Never invent metrics, incidents, users, quotations, citations, project history, production experience, or causal explanations.

If evidence is missing:

- Remove the claim.
- Narrow it to what was observed.
- Label it as a hypothesis or personal impression.
- Ask the user for evidence when the claim is central.

### 3. Outline before drafting

Create a story-led outline and request approval.

Useful posts often move through:

- Why the work existed
- Constraints and choices
- What was built
- What failed or surprised the author
- Evidence and results
- Tradeoffs, limitations, and next work

Do not force every post into this order or use identical section names.

### 4. Draft prose before TSX

Write the complete prose draft before changing portfolio code. Request draft approval before integration.

Explain an acronym or specialized concept on first use when a technical reader outside the immediate specialty may not know it. Do not dilute the post into a beginner tutorial unless asked.

### 5. Run two editing passes

First, edit for this portfolio's voice using the rules below.

Second, use the project `humanizer` skill for a general anti-AI pass. Preserve technical meaning, uncertainty, and the author's natural tone.

After humanization, compare the result with the approved draft and claim ledger. The pass must not add facts, metrics, anecdotes, quotations, experiences, feelings, or sources.

### 6. Integrate only after approval

After the draft and SEO fields are approved, update the portfolio and verify the production build.

## Voice standard

### Keep

- First person for work the author actually performed
- Specific commands, costs, measurements, errors, screenshots, and configuration choices
- Honest mistakes and failed approaches
- Clear opinions tied to evidence
- Short direct sentences mixed with longer technical explanations
- Sentence-case headings that make a concrete claim
- Explicit limitations and incomplete work
- Motive, decision, result, and tradeoff

Good:

> I knew the pod could not reach Postgres through localhost and still typed it once. Readiness failed while every container looked healthy.

Weak:

> Correct service discovery is crucial for ensuring a robust and seamless cloud-native architecture.

### Avoid

- Generic importance claims
- Promotional adjectives
- Vague authorities such as "experts say"
- Unsupported phrases such as "works well," "high impact," "production-ready," or "made the biggest difference"
- Forced rule-of-three lists
- Repeated "not X, but Y" constructions
- Excessive bold lead-in lists
- Tutorial announcements such as "let's dive in"
- Formulaic sections such as "Challenges and future outlook"
- Canned endings such as "Wrapping up," "Worth trying next," or "feel free to reach out"
- A CTA when the post has no natural next action

Do not merely replace banned phrases. Rewrite the paragraph around a concrete observation.

## SEO standard

Write for the reader first.

### Search intent

- Answer one clear reader question.
- Use the main phrase naturally in the title, introduction, and one useful heading when appropriate.
- Use related terms only where they improve accuracy.
- Do not repeat phrase variants for density.
- Google does not use the meta keywords tag for ranking. Keep the repository's `keywords` field short and descriptive until the code no longer requires it.

### Title and description

- Make the title accurate, specific, and useful without clickbait.
- State what was built, learned, measured, or decided.
- Write a description that explains the post's concrete value.
- Treat common character limits as preview guidance, not ranking formulas.

### Sources and links

- Link libraries, standards, datasets, and research to primary sources where practical.
- Link measurable external claims to evidence.
- Open each cited source and confirm it supports the exact nearby claim.
- Add relevant internal links to a project, case study, technical note, or related post.
- Do not add weak links only to increase link count.
- Test commands and code snippets where practical. Record relevant versions and label pseudocode, abbreviated output, or omitted sections.

### Metadata and accessibility

Confirm:

- Visible title matches the SEO title closely.
- Slug is stable, readable, and accurate.
- Visible publication date agrees with `datePublished` and the blog catalog.
- For a material revision, extend `useBlogSeo` to accept `dateModified` or report that the current helper cannot represent it. Do not silently copy `datePublished`.
- Canonical URL and `BlogPosting` schema use the final slug.
- Social image exists and belongs to this post.
- A visible byline and semantic `<time dateTime>` are present when the template supports them.
- Every informative image has descriptive alt text.
- Figures have captions.
- Tables use a caption and scoped headers.
- Heading IDs are unique.
- The article main element supports the global skip link.

## Portfolio integration checklist

Inspect actual usage before editing. A new post normally affects:

- `src/articles/blog-<topic>.tsx`
- `src/i18n.ts`
- `src/main.tsx`
- `src/articles/registry.ts`
- `scripts/prerender.mjs`
- `public/sitemap.xml`
- Social and article assets under `public/`
- Previous and next navigation

`src/config.ts` controls the whole blog and normally needs no per-post change.

For each post:

1. Add or update `useBlogSeo`.
2. Add the route loader, preloader, and route.
3. Add the blog catalog entry.
4. Add the page title and alternate path.
5. Add the prerender route and sitemap URL.
6. Verify every referenced asset exists.
7. Run `npm run lint`.
8. Run `npm run build`.
9. Inspect `dist/blog/<slug>/index.html` or the final URL. Confirm the expected H1, canonical URL, Open Graph fields, `BlogPosting` JSON-LD, sitemap entry, and assets. A successful build alone is not publication verification.

## Publication gate

Do not call a post publish-ready unless:

- It teaches something specific.
- Observation and interpretation are distinguishable.
- Important claims have inspectable evidence.
- Unsupported claims were removed or labeled.
- It includes honest limitations where relevant.
- It answers the selected reader intent.
- The approved prose was integrated without changing its meaning.
- Dates, metadata, routes, and assets agree.
- Lint and build pass.

## Final response

Report:

1. What was written or changed
2. Primary reader intent
3. Evidence used and claims qualified
4. SEO and internal-link decisions
5. Files updated
6. Verification results
7. Remaining warnings or missing evidence
