# LastCall blog post: draft for approval

Status (2026-11-24): SUPERSEDED. The published text is `src/articles/blog-lastcall.tsx`, rewritten as a story
(Joe Birch's Pokémon cards → what LastCall does → what went wrong), with no code and about half the length.
The brief and claim ledger below still back its numbers. Added sources for the rewrite:
- Joe Birch, "I Had 1,000+ Pokémon Cards to Sell…", buffer.com/resources/pokemon-cards/, 2026-06-15 (quotes verified; store is WooCommerce, also lists on eBay)
- Anthony Franco (QualityAssuranceJobs.com), buffer.com/resources/we-built-a-custom-workflow-with-the-buffer-api-and-tripled-our-x-impressions/, 2026-06-08 ("about 42% … expired or closed job listings")

## Editorial audit (2026-11-24, applied to blog-lastcall.tsx)

Reader: engineers who build on the Buffer API, starting with Buffer's own team before winners are announced (Dec 7).

Claims added or corrected, with primary sources:

| Claim in post | Source |
|---|---|
| Buffer Commit: build window Oct 28 to Nov 13, 2026; three judges incl. Joe Birch; usefulness, craft, creativity; winners Dec 7 | buffer.com/api/commit, buffer.com/api/commit/terms |
| I knew Joe was a judge when I chose the problem | LastCall `plans/LASTCALL-REQUIREMENTS.md` §1–2 (2026-10-28) |
| Submitted on the last day | LastCall `docs/qa/2026-11-13-submission-runbook.md` E4, tag v1.0.0 |
| Four permissions | LastCall `src/auth/oauth.ts:9`; developers.buffer.com/guides/authentication.html (scopes) |
| Words change only via Quick Swap on a held post, after the new link checks Fresh | LastCall ADR-0009 |
| Restore goes to the next free slot if the original time is under 10 minutes away | ADR-0009 step 2 (FR-F3) |
| One read returns 50 posts; sync reads 30 days ahead | `src/buffer/documents.ts:7` PAGE_SIZE, `src/sync/sync.ts:29` |
| Links checked at least every 15 min within 2 days, every 5 min in the last 20 min | v1.0.0 `src/scheduler/checkJob.ts:27-30`; commit ab59c75 |
| Refresh tokens single-use; reuse revokes all tokens for the grant | developers.buffer.com/guides/authentication.html; ADR-0003 |
| 100 requests per 15 min plus 10 per authorised user, per app client | developers.buffer.com/guides/api-limits.html; ADR-0005 |
| Judge demo = 8 requests (in tests; live rehearsal count not recorded) | `judgePath.test.tsx`; G4 P4-03 |
| Allbirds: 11 days at Can't check, 2 MB cap, fixed Nov 23; `decide.ts` untouched | commit 4ed052b (files: fetcher.ts, gather.ts + tests) |
| "Three days ahead of plan" | roadmap Nov 2 tracer vs commit 4ec70c6 on Oct 30 |
| Amazon terms / Etsy, Kickstarter 403 | decision log 1.2; requirements §14 rows 617–618 |
| "The quick version would have gone wrong on two pages" | Inference from the probe table; labelled "as far as I can tell" |

Name: "Lastcall" (matches the app, repo and video).

## Content brief

- Working topic: how LastCall decides when it is allowed to hold someone's scheduled post
- Primary reader: engineers building software that takes an automatic action based on third-party pages or APIs
- Reader question: how do you build an automated "stop this" decision that is never wrong in the expensive direction, and how do you know it isn't?
- Primary search intent: how to detect sold-out or closed links in scheduled social posts (stale link checking)
- First-hand evidence: LastCall repo (ADRs 0001, 0003, 0004, 0005, 0006), `src/core/verdict/decide.ts`, harness reports 2026-10-30 / 11-05 / 11-09, probe table in the spec, commit 4ed052b, decision log, test run on 2026-11-24
- External sources needed: Buffer API docs, schema.org Offer availability, Shopify product JSON (links only)
- Useful takeaway: rank sources and let the first rule decide instead of blending; make the costly verdict wait for stronger evidence; gate the automatic action on a measured precision number, and say what that number cannot see
- Confidentiality limits: the repo is private, so no source link. Leave out the server IP, app client ID, email, `.env` contents and operator account. Don't claim users, customers or contest results.

## Claim ledger

| Claim | Evidence | Confidence | Treatment |
|---|---|---|---|
| Built Oct 28 to Nov 13, 2026 for Buffer Commit | git log first commit 2026-10-28; QA-submission PR #12 merged 2026-11-13 | High | State |
| Hold = Buffer draft via one `editPost`, restore puts it back at its original time | ADR-0001, run 2 | High | State |
| An edit without `text` fails with "Post must have either text or media" though the reference says omitted fields are kept | ADR-0001, run 1 | High | State as observed |
| Probe: 16 Shopify pages over 9 stores; feed answered on 12, 12 of 12 matched | Spec probe table | High | State |
| JSON-LD on 11 of 16, all correct; one ProductGroup had InStock and OutOfStock | Spec probe table | High | State |
| One store's meta said out of stock while its feed said in stock | Spec probe table, ADR-0004 | High | State |
| `decide` is 95 lines, rules in order, first match wins, no model or scores | `decide.ts` (wc -l = 95, includes two helpers) | High | Say "under 100 lines" |
| Tier-3 gone/moved needs a second sighting 10 minutes later | `decide.ts` CONFIRM_AFTER_MS | High | State |
| A job missing from an ATS list was first tier 1, changed to tier 3 after the safety review | Decision log 5.4 | High | State |
| Restore strength must match the hold's tier | ADR-0006 | High | State |
| Harness 2026-11-09: 150 URLs, 100% Stale precision, 95.2% recall, p50 5.1 s, p95 21.9 s | report-2026-11-09.md/json | High | State |
| The 3 missed Stales are the 3 closed-job URLs, all at Checking | report JSON | High | State |
| The closed-job URLs are made-up IDs (1234567890, all-zeros UUID) | `harness/corpus.ts` CLOSED_JOBS | High | State |
| 95 Shopify + 28 Woo rows; all 59 caught Stales came from platform feeds | report JSON counts | High | State |
| Truth comes from `products.json` / Woo Store API; checker reads `<handle>.js` | `corpus.ts`, ADR-0004 | High | State as a limitation |
| Auto-hold is allowed only while the newest report shows 100% precision; nightly run | ADR-0004 gate, README cron | High | State |
| Two Allbirds links sat at Can't check for 11 days; 2 MB cap dropped status and final URL | Commit 4ed052b message | High | State |
| Removed products can't appear in the corpus because it samples `products.json` | `truthFromProductsJson` reads only listed products | High | State, label the link to the bug as my reading |
| Refresh tokens are single-use; reuse revokes every token for the grant; no documented grace window | ADR-0003, Q1 still open | High | State; note Buffer hasn't answered |
| Rate limit is per app client, shared by every user: 100 + 10 per user per 15 min | ADR-0005 (Buffer's Discord, Oct 27), headers observed 110/525/15100 for 1 user (Q11) | High | State with source |
| Judge path = 8 requests (sign in 2, sample 1, hold 2, back in stock 0, restore 2, delete 1) | G4, `judgePath.test.tsx` | High | State |
| No webhooks; sync every 3 hours | ADR-0005, ADR-0007 | High | State |
| 1,775 tests, 72 files, about 4 seconds, no network | `npx vitest run`, 2026-11-24 | High | State (homepage says 1,773; update it) |
| No customers or usage numbers | PRODUCT.md | High | State as a limitation |
| A page that dies under 10 minutes before posting time can still publish | My reading of rule 6 | Medium | Label as inference |

## Outline

1. Opening: the sold-out tee, what LastCall does, the one-line thesis
2. A wrong hold costs more than a missed one
3. The sources disagreed, so I ranked them (probe, tiers, `decide`)
4. The weaker the evidence, the longer the wait (ten-minute rule, jobs, restore strength)
5. A harness decides whether LastCall may act alone (numbers, gate, what it can't see)
6. The bug the corpus couldn't contain (Allbirds, 11 days)
7. Buffer's API pushed back in three places (text, tokens, shared rate limit)
8. What I haven't proven

---

## Draft

**Title:** Building LastCall: Holding a Scheduled Post Only When the Evidence Says So

**SEO description:** How I built LastCall, a Buffer app that holds scheduled posts whose links have gone stale. Ranked evidence instead of a model, a 150-URL harness that gates automatic holds, and a production bug the harness couldn't see.

**Slug:** `building-lastcall`

**Tags:** TypeScript, Hono, SQLite, Buffer GraphQL API, OAuth PKCE

---

Say you schedule a post on Tuesday for a T-shirt, and the shirt sells out on Monday. The post goes out anyway. Everyone who taps it lands on a sold-out page, and nothing in your queue knew it would happen.

LastCall is the app I built for that gap. I wrote it on the Buffer API for the Buffer Commit contest, between October 28 and November 13, 2026. It reads your scheduled posts and checks the links in them. When a product sells out, a job closes or a page disappears, it tells you, or it holds the post as a Buffer draft. When the link comes back, it puts the post back at its original time.

I built it with Claude Code. Two review agents sat in the loop. A safety reviewer read every change that touched Buffer calls, tokens, the verdict rules or the fetcher, and reported findings without editing anything. A gate auditor checked each phase's acceptance criteria against test results and reports before I moved on, and it treated a claim in a commit message as no evidence at all.

A hold takes one API call. The hard part was deciding when LastCall is allowed to make that call.

## A wrong hold costs more than a missed one

LastCall can be wrong in two directions. If it misses a sold-out page, you're no worse off than before you installed it. If it holds a post whose product is still in stock, it has pulled your launch post on a guess, and you find out when the launch is quiet.

My spec ranked the second failure as the worst one, and most of the design follows from that ranking. I measure Stale precision first: of the links LastCall calls Stale, how many turn out to be stale. I accept lower recall to keep that number at 100%. When LastCall can't read a page, it says "Can't check", and Can't check never moves a post.

## The sources disagreed, so I ranked them

Before writing a checker, I probed real pages by hand: 16 Shopify product pages across 9 stores, plus Greenhouse, Lever and Ashby job pages, Eventbrite events, a Gumroad product and some YouTube videos. Shopify's per-product feed (`/products/<handle>.js`) answered on 12 of the 16 pages and matched the truth on all 12, sold-out items included. [Schema.org](https://schema.org/Offer) JSON-LD, the structured data many shops embed for search engines, was on 11 pages and correct on all of them.

Two results changed the design. One store's `product:availability` meta tag said out of stock while its feed said in stock. And one page's JSON-LD described a product group that listed both InStock and OutOfStock variants. A shirt that's sold out in small and in stock in large is not sold out.

If I averaged those signals into a score, a wrong meta tag would sometimes outvote a correct feed. So I ranked the sources by how much I trust them:

| Tier | Source | Can it make a post Stale? |
|---|---|---|
| 1 | The platform's own feed or API: Shopify `.js`, the WooCommerce Store API, the job boards' public APIs, YouTube oEmbed | Yes |
| 2 | Schema.org JSON-LD on the page | Yes, if every block agrees |
| 3 | HTTP status and redirects | Yes, after a second sighting |
| 4 | Meta tags and "sold out" text | Never |

Checkers only gather evidence. Each one returns what it read, from which source, and when, and none of them returns a verdict. A separate function, `decide`, walks the rules in order, and the first one that matches wins:

```ts
// Rules 1 and 2: the platform says.
const platformStale = tier(1).find(isStale);
if (platformStale) {
  return { verdict: 'stale', reason: reasonOf(platformStale), tierUsed: 1, conflicts: conflicts(1, saysAvailable) };
}
const platformAvailable = tier(1).find((e) => e.says === 'available');
if (platformAvailable) {
  return { verdict: 'fresh', reason: platformAvailable.detail, tierUsed: 1, conflicts: conflicts(1, isStale) };
}

// Rules 3–5: structured data. Disagreement is Can't check, never Stale.
const dataStale = tier(2).find(isStale);
const dataAvailable = tier(2).find((e) => e.says === 'available');
if (dataStale && dataAvailable) {
  return { verdict: 'cant_check', reason: 'structured data disagrees', tierUsed: null, conflicts: [] };
}
```

*Excerpt from `src/core/verdict/decide.ts`; rules 6 to 8 omitted.*

The whole file is under 100 lines, with no model, scores or weights. I kept a model out of it because every Stale verdict has to show its evidence: the email and the app both say which source decided, what it said, and when LastCall read it. A rule can point at its input. When a lower tier disagrees with the deciding one, `decide` records the conflict next to the verdict, and it still doesn't let the lower tier win.

Tier 4 never decides anything, because of that one store's meta tag.

## The weaker the evidence, the longer the wait

A platform feed that says "sold out" acts at once. A 404 doesn't. A product page that returns 404, or redirects to a collection page, first shows as Checking, and it only turns Stale if a second check at least ten minutes later sees the same thing. I didn't want one bad response from a site to pull a post.

I got this wrong once for jobs. My first version read a job that was missing from a board's public list as a tier-1 "job closed". The safety reviewer pointed out that companies can leave a job off the list and keep it open to anyone with the link, so absence from the list proves nothing. Now a missing job counts only if its own page is gone or moved, and that's a tier-3 sighting, so closed jobs wait ten minutes like any other 404.

Restores mirror holds. A post held because the feed said "sold out" can't come back because the page loads, since a page can load while the product is still sold out. It needs Fresh evidence from tier 1 or 2 on two checks at least five minutes apart. A post held for a 404 can come back on a plain HTTP 200, because a status code was what took it out of the queue.

## A harness decides whether LastCall may act alone

Rules that look careful can still be wrong, so I built an accuracy harness. It builds a corpus of real public URLs whose truth it can read from a public source, runs every one through the real fetcher, checkers and `decide`, and writes a report.

The run on November 9 covered 150 URLs:

| Measure | Result |
|---|---|
| Stale precision | 100% (no false Stale) |
| Stale recall | 95.2% (59 of 62) |
| Latency, median | 5.1 s |
| Latency, 95th percentile | 21.9 s |

The latency comes mostly from politeness. The fetcher waits 5 seconds between requests to the same host, and it always sends a User-Agent that names LastCall.

All three missed Stales are the same case. They're the closed-job URLs, and each one ended the run at Checking, because the harness checks every URL once and a 404 needs a second sighting. The ten-minute rule cost me those three. I'd make that trade again.

The harness also acts as a gate. Automatic holds are switched on only while the newest report shows 100% Stale precision. A cron job on the server rebuilds the corpus and reruns the harness every night, since stock changes daily. If a run drops below 100%, LastCall keeps marking posts Stale and emailing you, but it stops holding them on its own until the number recovers.

The harness also has limits, and I should be clear about them. 95 of the 150 URLs are Shopify products and 28 are WooCommerce. Their truth comes from Shopify's `products.json` and the WooCommerce Store API, which are close relatives of the feeds the tier-1 checkers read. Every one of the 59 Stales it caught was a tier-1 feed answer. So the harness tests that the pipeline doesn't get talked out of a correct feed by other tiers, by redirects or by bot walls. It says very little about Stale verdicts from JSON-LD alone. And the three "closed jobs" aren't real closed jobs: they're IDs like `1234567890` that never existed.

## The bug the corpus couldn't contain

In production, two Allbirds links sat at Can't check for 11 days. Both products had been removed, and their pages answered with a 301 to `/collections/mens`. LastCall has a rule for exactly that case: a product URL that redirects to a listing page has moved. The rule never ran.

The fetcher caps page bodies at 2 MB, and the Allbirds collection page is bigger than that. When a body went over the cap, the fetcher returned an `oversized` error and dropped everything, including the status code and the URL the redirects ended on. The HTTP tier never saw the move.

The fix keeps the status and final URL of an oversized page and still throws the body away. The HTTP tier uses them only when they say gone or moved. Any other oversized page stays Can't check, because nothing on it was read. The regression test reads like the bug report:

```ts
it('§8.5-6 a removed product redirected to an oversized listing page is moved, not Can\'t check', async () => {
  // ...
  // Tier 3 needs a second sighting: the first check is Checking, never Stale.
  expect(decide(evidence, undefined, NOW).verdict).toBe('checking');
});
```

The failure was the safe kind. Can't check never acts, so no post was held by mistake, and LastCall said plainly that it couldn't read those two links. It said so for 11 days, though, and nothing in my tests or my harness caught it.

The reason is in how the corpus is built. The harness samples products from each store's `products.json`, and a removed product isn't in `products.json`. So a removed product redirected to a large page could never appear in it. That's my reading of why the harness missed it. The general point I took away is that a corpus built from what a platform lists will never contain what the platform has stopped listing.

## Buffer's API pushed back in three places

Three things I learned from real calls, not from the reference, shaped the code more than any design document.

**Every edit has to resend the text.** A hold is one `editPost` with `saveToDraft: true` and a `held:` tag added. The reference says omitted fields are kept, but every edit I sent without `text` failed with `InvalidInputError: Post must have either text or media`. So LastCall reads the post just before it edits, and sends the text it just read. That leaves a window of about a second in which your own edit in Buffer could be overwritten. To narrow it, LastCall compares the text with the version it checked, and if they differ, it checks again before acting. Images survived text-only holds and restores in my tests, so LastCall never sends assets or metadata.

**Refresh tokens are single-use.** Buffer rotates refresh tokens, and reusing a spent one revokes every token for that sign-in. I found no documented grace period, and it's still an open question in my notes. A plain "refresh on 401" in each caller would eventually lock a user out when two jobs refreshed at once. So one token owner per grant is the only code that can refresh. Callers waiting on the same grant share one refresh, a database lease covers a second process, and the new token pair is committed with a version check before anything uses it. If a refresh request times out after it was sent, LastCall never resends the old token. It uses the current access token until it expires, then asks you to sign in again. The tests run against a mock token server that enforces the same rotation rules.

**The rate limit is shared.** Buffer's limit is counted per app client, and every user and every judge spends from the same pool. The numbers Buffer gave in its Discord were 100 requests plus 10 per user every 15 minutes, and the `RateLimit` headers I observed matched that formula. Buffer has no webhooks either, so LastCall has to poll. Every Buffer request goes through one gateway that writes a ledger row before sending, batches reads with GraphQL aliases, and refuses `shareNow` and `shareNext`, because LastCall must never publish anything. Scheduled syncs run every 3 hours. The full judge path costs 8 requests: 2 to sign in, 1 to create a sample post, 2 to hold it, 0 when the product comes back, 2 to restore and 1 to delete.

None of the 1,775 tests send a real Buffer request. They run against an injected `fetch`, in-memory SQLite and recorded response shapes, and the suite finishes in about four seconds. The scripts that do touch the real API print their request count, so I can compare it with Buffer's usage counter.

## What I haven't proven

LastCall has no users yet. Every number in this post comes from the harness, the test suite or my own runs on a throwaway channel.

The harness proves the tier-1 path on Shopify and WooCommerce. JSON-LD Stales, events and videos are covered by unit tests, but they aren't measured against live pages at any scale. Etsy, Amazon and Kickstarter answer Can't check on purpose: they either block automated checks or their terms forbid them, and I didn't want to work around that.

The ten-minute rule has a cost I haven't measured. By the rules as written, a page that starts returning 404 less than ten minutes before its post goes out will publish anyway. I chose that over holding a post on one bad response, but it's a real gap.

LastCall also assumes one app container. The token lease would cover a second process, but freeze progress and the demo shop's rate limit live in memory, and I haven't run two instances.

What I'd keep is the split between evidence and decision. When the Allbirds bug turned up, the fix touched the fetcher and the function that gathers HTTP evidence, plus their tests. `decide.ts` didn't change, so the rules that decide whether a post gets held were never in question.

---

## Editing passes

### Pass 1: portfolio voice (writing-portfolio-blogs)

- Headings are sentence case and each makes a claim.
- First person only for work done in the repo.
- Removed a "Lessons learned" style ending and the CTA.
- Every number traces to a ledger row.

### Pass 2: humanizer + stop-slop + anti-slop-writing

What still read as AI after the first draft, and what I changed:

- Two "not X, it's Y" turns ("The work wasn't the call, it was..."; "This isn't a scoring problem, it's a ranking problem"). Rewritten as plain statements.
- A three-beat closing line that sounded like a pull quote. Replaced with what changed in the code when the bug was fixed.
- "Crucially" and "fundamentally" in the tier section. Cut.
- Em dashes: none kept. stop-slop bans them and anti-slop-writing allows one earned pair. I followed the stricter rule, which matches the humanizer note on em dash overuse.
- The Buffer section uses three bold lead-ins. I kept them, because they're three separate API behaviours a reader will scan for. The prose under each has a full explanation, not a fragment.
- Checked that no pass added a fact that isn't in the ledger.

## Decisions (2026-11-24)

1. Mention Claude Code and the two review agents: yes (intro paragraph, jobs section).
2. Embed the demo video: https://www.youtube.com/watch?v=4-PQBvqACec
3. Homepage test count updated to 1,775.
