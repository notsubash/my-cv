import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import BlogNav from './BlogNav'
import BlogToc from './BlogToc'
import { BufferSequence, BuildTimeline, GapWeek, HarnessGrid, Screenshot } from './lastcall-visuals'
import { useBlogSeo, useReadingTime } from './useBlogSeo'

const TITLE = 'Building Lastcall: Catching Scheduled Posts Before They Go Stale'
const DESCRIPTION =
  "Joe Birch's Pokémon cards kept selling before their Buffer posts went out. How I built Lastcall in 17 days on the Buffer API to catch stale links in scheduled posts, and why it only acts when it can show proof."
const YOUTUBE_VIDEO_ID = '4-PQBvqACec'

const JOE_POST = 'https://buffer.com/resources/pokemon-cards/'
const QAJOBS_POST = 'https://buffer.com/resources/we-built-a-custom-workflow-with-the-buffer-api-and-tripled-our-x-impressions/'
const CONTEST = 'https://buffer.com/api/commit'
const API_REFERENCE = 'https://developers.buffer.com/reference.html'
const API_AUTH = 'https://developers.buffer.com/guides/authentication.html'
const API_LIMITS = 'https://developers.buffer.com/guides/api-limits.html'

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-display text-lg font-semibold text-foreground mb-3">
      {children}
    </h2>
  )
}

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-primary hover:underline">
      {children}
    </a>
  )
}

function DemoVideo() {
  return (
    <figure>
      <div className="aspect-video rounded-xl overflow-hidden border border-border bg-card">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`}
          title="Lastcall demo: a product sells out, the post is held, the product returns, the post is restored"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <figcaption>
        Under two minutes with Lastcall: a tee sells out, its post is held, the tee comes back, and the post returns to the queue.
      </figcaption>
    </figure>
  )
}

export default function BlogLastcall() {
  useBlogSeo({
    title: TITLE,
    description: DESCRIPTION,
    keywords: 'stale links in scheduled posts, Buffer API app, sold out product posts, Buffer Commit, Lastcall',
    ogImage: '/og-blog-lastcall.webp',
    datePublished: '2026-11-24',
    slug: 'building-lastcall',
  })
  const { articleRef, readingTimeRef } = useReadingTime()

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <BlogToc articleRef={articleRef} />
      <article ref={articleRef} className="post">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span>By Subash Pandey</span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime="2026-11-24">November 2026</time>
            </span>
            <span className="text-border">·</span>
            <span ref={readingTimeRef}>9 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            {TITLE}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            A Buffer engineer's Pokémon cards kept selling before their posts went out. I spent 17 days building the
            fix: an app that checks the links in your scheduled posts and holds the ones that point at something
            that's gone.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['TypeScript', 'Hono', 'SQLite', 'Buffer API'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <figure className="mb-8">
          <img
            src="/blog/lastcall/banner.webp"
            alt="Lastcall's queue view: four scheduled posts with their times and links. Two are Fresh, a job post is Stale because the job closed, and a hoodie post is lifted out of the queue as Held because the hoodie sold out."
            className="w-full h-auto rounded-xl border border-border"
            width={1600}
            height={800}
            loading="eager"
          />
        </figure>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          Try it: <A href="https://lastcall.subash-pandey.com">lastcall.subash-pandey.com</A>. I built Lastcall on the
          Buffer API for <A href={CONTEST}>Buffer Commit</A>, Buffer's build contest, between October 28 and November
          13, 2026. Winners are announced on December 7.
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom">
          <section>
            <p>
              In June, Joe Birch, a senior engineer at Buffer, <A href={JOE_POST}>wrote about a side project</A>. He
              had more than 1,000 spare Pokémon cards to sell, so he built a Mac app that lists each card in his online
              store and queues a post about it through Buffer. Near the end, he admits one problem he hadn't solved:
            </p>
            <blockquote>
              <p>
                "Some cards have started selling before their scheduled posts go out, which means a post can point
                to a card that's no longer available."
              </p>
            </blockquote>
            <p>
              He was thinking about a script that watches his stock and finds the matching Buffer post, "but there are
              some complexities there I haven't worked out yet."
            </p>
            <p>
              He wasn't the only one. A week earlier, the founder of QualityAssuranceJobs.com{' '}
              <A href={QAJOBS_POST}>wrote on the same blog</A> that about 42% of people clicking through from their
              social posts had been landing on expired or closed job listings.
            </p>
            <p>
              Both stories describe the same gap. You write a post on Monday about something that's true on Monday.
              By Friday, when it publishes, the shirt has sold out or the job has closed. The post goes out anyway.
              Watch the Wednesday column below: that's where the two weeks split.
            </p>
            <GapWeek />
            <p>
              Lastcall closes that gap. It connects to your Buffer account and checks the links in your scheduled
              posts. When a link goes bad, it emails you, or it holds the post by moving it back to your drafts. When
              the link comes back, it puts the post back in the queue, at its original time when it can.
            </p>
            <DemoVideo />
          </section>

          <section>
            <H2 id="taking-it-on">Taking it on</H2>
            <p>
              Buffer opened its <A href={CONTEST}>Buffer Commit</A> contest at the end of October: 17 days to build
              something useful on the Buffer API, signed in through Buffer, working with real posts. Joe was one of
              its three judges, and I knew that when I chose his problem. It felt like the right size: small enough
              to finish and annoying enough that people would want it fixed.
            </p>
            <p>
              I wrote no app code on the first day. The whole idea rested on one question: can an app take a
              scheduled post out of Buffer's queue and later put it back exactly as it was? If not, there was no
              product. So I made a throwaway Bluesky account, scheduled some test posts, and tried it by hand.
            </p>
            <p>
              My first edit failed. <A href={API_REFERENCE}>Buffer's API reference</A> says a field you leave out of an edit stays as it was, so I
              sent only the change I wanted: "move this to drafts". Buffer rejected it with "Post must have either text
              or media". Every edit has to carry the post's text, even when the text isn't changing. Once I sent the
              text back with each edit, moving a post to drafts worked, sending it back to its original time worked,
              and an image on the post survived the round trip. That one rule ended up shaping the whole app, and
              I'll come back to it.
            </p>
            <p>
              Then I built in the order that would prove the idea fastest. Instead of finishing each piece before
              starting the next, I pushed one real post through the whole chain first: sign in, read the queue,
              check one link, decide, hold, restore. It was rough, but on day three it worked end to end on a live
              server, three days ahead of my plan. From then on I always had a working app, and each day made it
              deeper.
            </p>
            <BuildTimeline />
            <p>
              Judges needed something they could break, so I also built a demo shop: a made-up brand with a T-shirt,
              a gig, a job opening and a cap. The bar at the bottom of each item is the control. Press "Mark sold
              out", and Lastcall checks every post that links there straight away.
            </p>
            <Screenshot
              src="/blog/lastcall/demo-shop.webp"
              alt="The Lastcall demo shop's product page for the Lastcall Tee, marked In stock, with a demo control bar at the bottom that says anyone can change this and a pink Mark sold out button."
              caption="The live demo shop. Anyone can sell out the tee, and the shop resets every hour."
              width={1400}
              height={1180}
            />
            <p>
              I built Lastcall with Claude Code, with two review agents watching the work. One read every change that
              touched Buffer, sign-ins or the decision rules. The other checked each stage against real test results
              before I moved on, and it didn't accept a claim in a commit message as proof of anything.
            </p>
          </section>

          <section>
            <H2 id="worst-mistake">The worst thing Lastcall can do</H2>
            <p>
              The quick version of this app is easy: fetch each link, look for the words "sold out", and pull the
              post. I didn't build that version, because of what happens when it's wrong.
            </p>
            <p>
              If Lastcall misses a sold-out page, you're no worse off than before you found it. If it holds a post
              for a product that's still in stock, it has quietly cancelled your launch, and you may only notice when
              launch day is quiet. The two mistakes aren't equal, so I gave Lastcall one rule above the rest: only
              hold a post when you can show the proof. When it can't read a page, it says "Can't check" and leaves the
              post alone.
            </p>
          </section>

          <section>
            <H2 id="trust-the-shop">Trust the shop, not the page</H2>
            <p>
              Before writing any checks, I opened real pages by hand: 16 Shopify product pages from 9 stores, plus job
              boards, event pages and videos. The store's own data feed (the product data a shop publishes for apps to
              read) was right every time it answered. As far as
              I can tell, the quick version would have gone wrong on two of those pages. One store's page carried an "out of stock" tag
              while its own feed said the product was in stock. Another listed a product as sold out in some versions
              and available in others.
            </p>
            <p>
              So Lastcall ranks its clues instead of trusting whichever one shouts loudest, and the first clue that
              can answer decides.
            </p>
            <p>
              Every decision comes with its proof. Open a stale post and Lastcall shows the sentence it based the
              call on: which source it read, what that source said, and when.
            </p>
            <Screenshot
              src="/blog/lastcall/evidence.webp"
              alt="A stale post in the Lastcall timeline with its evidence open. The post links to shop.example.com/kenya and is marked Stale: sold out. The evidence says the shop's product feed said available=false at 12:00 UTC on 7 November. Beside it: It publishes in 2 hours unless you hold it, and a Hold post button."
              caption="A stale post with its evidence open, from Lastcall's preview build with sample data."
              width={1400}
              height={655}
            />
            <p>
              That's also why I kept AI out of the decision. With fixed rules, the explanation is the rule that fired.
              With a model, I'd be guessing at why it decided.
            </p>
          </section>

          <section>
            <H2 id="look-twice">Look twice before you act</H2>
            <p>
              Some clues are weaker than others. A page that answers "not found" might be gone for good, or the site
              might be having a bad minute. So a missing page only makes Lastcall suspicious, and nothing happens to
              the post until a second look ten minutes later agrees. The third preset above shows it: set the page to
              "Not found" and the verdict is Checking, not Stale.
            </p>
            <p>
              A review agent caught my worst idea here. I had treated a job that vanished from a company's job list as
              closed. It pointed out that a company can hide a job from its list and keep it open to anyone with the
              link. Now a job only counts as closed when its own page is gone, and it gets the same second look.
            </p>
            <p>
              The way back is just as careful. A post held because the shop said "sold out" returns only when the shop
              says "in stock" on two checks, five minutes apart. A page that loads isn't enough, because a sold-out
              page loads just fine.
            </p>
          </section>

          <section>
            <H2 id="buffer-api">How Lastcall works with Buffer</H2>
            <p>
              Buffer stays in charge of your posts. Lastcall never publishes anything and never rewrites a post on its
              own. Mostly, it moves posts between your queue and your drafts. If a post is held, you can ask it to swap
              the dead link for a new one, and it checks the new link first.
            </p>
            <p>
              You start by clicking "Sign in with Buffer" and approving four permissions: read your account, read your
              posts, create and manage your posts, and stay signed in. After that, Lastcall talks to two kinds of places. It asks Buffer what's
              scheduled, and it asks the shops and job boards whether those things still exist.
            </p>
            <BufferSequence />
            <p>
              Buffer's API speaks GraphQL, which lets one request ask for several things at once, so one read brings
              back 50 scheduled posts along with your channels. Lastcall reads the next 30 days of your queue. Buffer
              can't tell an app when something changes, so Lastcall asks again every three hours. Checking a link
              doesn't use Buffer at all, so links are checked more often, and every five minutes in the last 20
              minutes before a post goes out.
            </p>
            <p>
              A hold is the day-one lesson in practice: read the post, then send its text straight back with the
              change. If you've edited the post since the last check, Lastcall checks the link again first. In Buffer,
              the held tag shows why a post moved.
            </p>
            <p>
              Sign-in has its own trap. <A href={API_AUTH}>Buffer's refresh tokens work once</A>, and sending a used one
              again cancels every token for that sign-in, so the user has to sign in again. Two background jobs
              refreshing at the same moment would do exactly that. So only one part of Lastcall may refresh a user's
              token, and everything else waits for its answer.
            </p>
            <p>
              <A href={API_LIMITS}>Buffer gives each app one allowance of requests</A>, shared by every user, judges
              included. A careless app could use it up for everyone, so every request goes through one gate that
              counts it, and Lastcall can't send a publish request at all. The whole demo, from signing in to deleting
              the sample post, takes 8 requests.
            </p>
          </section>

          <section>
            <H2 id="real-links">Testing it on 150 real links</H2>
            <p>
              Careful rules can still be wrong, so I built a test that runs Lastcall against the real web. It gathers
              150 live product and job links whose true status it can look up, runs each one through Lastcall, and
              compares the answers. In the grid below, each square is one link. The filled squares are the ones
              Lastcall would act on.
            </p>
            <HarnessGrid />
            <p>
              Every link Lastcall called stale was stale. It caught 59 of the 62 stale links, and the three it missed
              were job pages still waiting for their second look. That's the price of looking twice, and I'm happy to
              pay it.
            </p>
            <p>
              The same test decides whether Lastcall may act on its own. It runs every night on the server, and if a
              run ever finds one wrong "stale", Lastcall stops holding posts by itself and only emails you until the
              next clean run.
            </p>
            <p>
              The test has limits. Most of its links come from Shopify and WooCommerce stores, where Lastcall reads the
              store's own feed, so it mostly tests the easiest path. Its three closed jobs are made-up links, not real
              jobs that closed.
            </p>
            <p>
              It also missed the one real bug I've found so far. In production, two Allbirds links sat at "Can't
              check" for 11 days. Both products had been removed, and their pages redirected to a collection page.
              Lastcall has a rule for exactly that, but the collection page was too big for Lastcall to read, so it
              threw away the whole answer, redirect included. It failed the safe way, since "Can't check"
              never moves a post. I fixed it on November 23, after the contest closed. The test couldn't have caught
              it: it picks products from each store's own product list, and a removed product isn't on that list.
            </p>
          </section>

          <section>
            <H2 id="still-open">What's still open</H2>
            <p>
              Lastcall has no real users yet. Every number in this post comes from my tests and my own runs on a
              throwaway account.
            </p>
            <p>
              Some sites stay out of reach. Amazon forbids automated checks, and Etsy and Kickstarter block them, so
              their links show "Can't check". Joe's own setup would be split: his store runs on WooCommerce, which
              Lastcall can read when the store leaves its public product data switched on, but his eBay listings would
              show "Can't check".
            </p>
            <p>
              The second look has a cost too. A page that disappears less than ten minutes before its post goes out
              will still publish.
            </p>
            <p>
              Joe wrote that there were complexities he hadn't worked out. Most of them came down to one question: how
              sure do you need to be before you stop someone's post? In Lastcall, that answer is a short list of rules,
              kept apart from the code that reads pages. The Allbirds fix changed how pages are read. The rules didn't
              change.
            </p>
          </section>
        </div>

        <BlogNav />
      </article>
    </main>
  )
}
