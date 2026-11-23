import { StrictMode, lazy, Suspense, useState, useEffect, useRef, type ReactNode } from 'react'
import { usePageSeo } from './hooks/usePageSeo'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import './styles/prose.css'
import App from './App.tsx'
import GlobalNav from './GlobalNav.tsx'
import { SiteShell } from './site/SiteChrome'
import { BLOG_ENABLED } from './config'
import './posthog'

const loadPrivacyPolicy = () => import('./PrivacyPolicy')
const loadAboutPage = () => import('./AboutPage')
const loadCvPage = () => import('./CvPage')
const loadBlogPage = () => import('./BlogPage')
const loadTechnicalNotesPage = () => import('./TechnicalNotesPage')
const loadOpenSourcePage = () => import('./OpenSourcePage')
const loadBlogLatentParking = () => import('./articles/blog-latent-parking')
const loadBlogRagPipeline = () => import('./articles/blog-rag-pipeline')
const loadBlogSteamGenreNetworks = () => import('./articles/blog-steam-genre-networks')
const loadBlogMLFromScratch = () => import('./articles/blog-ml-from-scratch')
const loadBlogActivityRecognitionPipeline = () => import('./articles/blog-activity-recognition-pipeline')
const loadBlogIdeaWorkbench = () => import('./articles/blog-idea-workbench')
const loadBlogCloudNativeAiPlatform = () => import('./articles/blog-cloud-native-ai-platform')
const loadGavel = () => import('./articles/gavel')
const loadTheUnderlyingCurve = () => import('./articles/the-underlying-curve')
const loadActivityRecognition = () => import('./articles/activity-recognition')
const loadSteamML = () => import('./articles/steam-ml')
const loadWikipediaVoting = () => import('./articles/wikipedia-voting')

const PrivacyPolicy = lazy(loadPrivacyPolicy)
const AboutPage = lazy(loadAboutPage)
const CvPage = lazy(loadCvPage)
const BlogPage = lazy(loadBlogPage)
const TechnicalNotesPage = lazy(loadTechnicalNotesPage)
const OpenSourcePage = lazy(loadOpenSourcePage)
const BlogLatentParking = lazy(loadBlogLatentParking)
const BlogRagPipeline = lazy(loadBlogRagPipeline)
const BlogSteamGenreNetworks = lazy(loadBlogSteamGenreNetworks)
const BlogMLFromScratch = lazy(loadBlogMLFromScratch)
const BlogActivityRecognitionPipeline = lazy(loadBlogActivityRecognitionPipeline)
const BlogIdeaWorkbench = lazy(loadBlogIdeaWorkbench)
const BlogCloudNativeAiPlatform = lazy(loadBlogCloudNativeAiPlatform)
const Gavel = lazy(loadGavel)
const TheUnderlyingCurve = lazy(loadTheUnderlyingCurve)
const ActivityRecognition = lazy(loadActivityRecognition)
const SteamML = lazy(loadSteamML)
const WikipediaVoting = lazy(loadWikipediaVoting)
// Phase 3 design prototypes (redesign/evidence-first). Not prerendered, noindex.
const LabHomeA = lazy(() => import('./lab/LabHomeA'))
const LabHomeB = lazy(() => import('./lab/LabHomeB'))
const LabArticle = lazy(() => import('./lab/LabArticle'))
const LabLogos = lazy(() => import('./lab/LabLogos'))

/** Preload the active route chunk before createRoot so Suspense does not flash null over prerendered HTML. */
const ROUTE_PRELOADERS: Record<string, () => Promise<unknown>> = {
  '/about': loadAboutPage,
  '/cv': loadCvPage,
  '/notes': loadTechnicalNotesPage,
  '/open-source': loadOpenSourcePage,
  '/privacy': loadPrivacyPolicy,
  '/blog': loadBlogPage,
  '/blog/when-a-self-parking-car-cannot-trust-its-imagination': loadBlogLatentParking,
  '/blog/rag-pipeline': loadBlogRagPipeline,
  '/blog/steam-genre-networks': loadBlogSteamGenreNetworks,
  '/blog/ml-from-scratch': loadBlogMLFromScratch,
  '/blog/activity-recognition-pipeline': loadBlogActivityRecognitionPipeline,
  '/blog/building-an-idea-workbench': loadBlogIdeaWorkbench,
  '/blog/building-a-cloud-native-ai-platform': loadBlogCloudNativeAiPlatform,
  '/projects/gavel': loadGavel,
  '/projects/the-underlying-curve': loadTheUnderlyingCurve,
  '/projects/activity-recognition': loadActivityRecognition,
  '/projects/steam-ml': loadSteamML,
  '/projects/wikipedia-voting': loadWikipediaVoting,
}

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { pathname } = location
  const initialPathname = useRef(pathname)
  const [hasNavigated, setHasNavigated] = useState(false)
  const prevPathname = useRef(pathname)
  const homeScrollY = useRef(0)
  const isBackNav = useRef(false)

  useEffect(() => {
    if (pathname !== '/') return
    const onScroll = () => { homeScrollY.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    const prev = prevPathname.current
    const isReturningHome = pathname === '/' && prev !== '/'
    const prevDepth = prev.split('/').filter(Boolean).length
    const currDepth = pathname.split('/').filter(Boolean).length
    isBackNav.current = isReturningHome || (currDepth < prevDepth)

    if (prev === '/' && pathname !== '/') {
      sessionStorage.setItem('home-scroll-y', String(homeScrollY.current))
    }
    prevPathname.current = pathname

    if (pathname !== initialPathname.current) {
      setHasNavigated(true)
    }

    if (location.hash) {
      if (pathname === '/') sessionStorage.removeItem('home-scroll-y')
      const hash = location.hash
      const scroll = () => {
        const el = document.querySelector(hash)
        el?.scrollIntoView({ behavior: 'instant' })
        return el
      }
      const t1 = setTimeout(scroll, 50)
      const t2 = setTimeout(scroll, 300)
      const t3 = setTimeout(() => {
        const el = scroll()
        if (el instanceof HTMLElement) {
          el.classList.add('hash-highlight')
          el.addEventListener('animationend', () => el.classList.remove('hash-highlight'), { once: true })
        }
      }, 800)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    } else if (isReturningHome) {
      const savedY = sessionStorage.getItem('home-scroll-y')
      if (savedY) {
        const y = parseInt(savedY, 10)
        sessionStorage.removeItem('home-scroll-y')
        const restore = () => window.scrollTo({ top: y, left: 0, behavior: 'instant' })
        const t1 = setTimeout(restore, 50)
        const t2 = setTimeout(restore, 300)
        const t3 = setTimeout(restore, 800)
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, location.hash, location.key])

  const showFade = hasNavigated && !isBackNav.current

  return (
    <div key={pathname} style={showFade ? { animation: 'page-fade-in 0.25s ease-out' } : undefined}>
      {children}
    </div>
  )
}

function NotFound() {
  usePageSeo({
    title: '404 — Page not found',
    description: 'The page you are looking for does not exist or has been moved.',
    path: '/404',
    noindex: true,
  })

  return (
    <main id="main-content" className="site">
      <div className="site-col">
        <header className="site-intro">
          <h1>This page doesn’t exist</h1>
          <p>It may have moved when the site was reorganised. Most people are looking for one of these.</p>
        </header>
        <ul className="ledger">
          <li className="ledger-row"><Link to="/#work" className="ledger-link"><span className="ledger-title">Selected work</span></Link></li>
          <li className="ledger-row"><Link to="/cv" className="ledger-link"><span className="ledger-title">Experience and CV</span></Link></li>
          <li className="ledger-row"><Link to="/blog" className="ledger-link"><span className="ledger-title">Writing</span></Link></li>
        </ul>
      </div>
    </main>
  )
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:font-medium focus:shadow-lg"
      >
        Skip to content
      </a>
      <GlobalNav />
      <SiteShell />
      <PageTransition>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cv" element={<CvPage />} />
            {BLOG_ENABLED && <Route path="/blog" element={<BlogPage />} />}
            <Route path="/notes" element={<TechnicalNotesPage />} />
            <Route path="/open-source" element={<OpenSourcePage />} />
            {BLOG_ENABLED && <Route path="/blog/when-a-self-parking-car-cannot-trust-its-imagination" element={<BlogLatentParking />} />}
            {BLOG_ENABLED && <Route path="/blog/rag-pipeline" element={<BlogRagPipeline />} />}
            {BLOG_ENABLED && <Route path="/blog/steam-genre-networks" element={<BlogSteamGenreNetworks />} />}
            {BLOG_ENABLED && <Route path="/blog/ml-from-scratch" element={<BlogMLFromScratch />} />}
            {BLOG_ENABLED && <Route path="/blog/activity-recognition-pipeline" element={<BlogActivityRecognitionPipeline />} />}
            {BLOG_ENABLED && <Route path="/blog/building-an-idea-workbench" element={<BlogIdeaWorkbench />} />}
            {BLOG_ENABLED && <Route path="/blog/building-a-cloud-native-ai-platform" element={<BlogCloudNativeAiPlatform />} />}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/projects/gavel" element={<Gavel />} />
            <Route path="/projects/the-underlying-curve" element={<TheUnderlyingCurve />} />
            <Route path="/projects/activity-recognition" element={<ActivityRecognition />} />
            <Route path="/projects/steam-ml" element={<SteamML />} />
            <Route path="/projects/wikipedia-voting" element={<WikipediaVoting />} />
            <Route path="/lab/a" element={<LabHomeA />} />
            <Route path="/lab/b" element={<LabHomeB />} />
            <Route path="/lab/article" element={<LabArticle />} />
            <Route path="/lab/logos" element={<LabLogos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </StrictMode>
)

async function mount() {
  const preload = ROUTE_PRELOADERS[normalizePath(window.location.pathname)]
  if (preload) {
    try {
      await preload()
    } catch {
      // Render the shell anyway; Suspense will show the fallback.
    }
  }
  // Puppeteer's page.content() serializes a live DOM (adjacent React text
  // nodes merged, computed styles). hydrateRoot cannot match that tree and
  // throws React #418 on every load. createRoot replaces the snapshot.
  createRoot(root).render(app)
}

void mount()
