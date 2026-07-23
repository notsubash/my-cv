import { StrictMode, lazy, Suspense, useState, useEffect, useRef, type ReactNode } from 'react'
import { usePageSeo } from './hooks/usePageSeo'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.tsx'
import GlobalNav from './GlobalNav.tsx'
import { BLOG_ENABLED } from './config'

const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'))
const AboutPage = lazy(() => import('./AboutPage'))
const BlogPage = lazy(() => import('./BlogPage'))
const TechnicalNotesPage = lazy(() => import('./TechnicalNotesPage'))
const BlogRagPipeline = lazy(() => import('./articles/blog-rag-pipeline'))
const BlogAudioFeatures = lazy(() => import('./articles/blog-audio-features'))
const BlogSteamGenreNetworks = lazy(() => import('./articles/blog-steam-genre-networks'))
const BlogMLFromScratch = lazy(() => import('./articles/blog-ml-from-scratch'))
const BlogActivityRecognitionPipeline = lazy(() => import('./articles/blog-activity-recognition-pipeline'))
const BlogIdeaWorkbench = lazy(() => import('./articles/blog-idea-workbench'))
const Gavel = lazy(() => import('./articles/gavel'))
const ActivityRecognition = lazy(() => import('./articles/activity-recognition'))
const SteamML = lazy(() => import('./articles/steam-ml'))
const WikipediaVoting = lazy(() => import('./articles/wikipedia-voting'))

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-8xl font-display font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
        Page not found
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  )
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <GlobalNav />
      <PageTransition>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<AboutPage />} />
            {BLOG_ENABLED && <Route path="/blog" element={<BlogPage />} />}
            <Route path="/notes" element={<TechnicalNotesPage />} />
            {BLOG_ENABLED && <Route path="/blog/rag-pipeline" element={<BlogRagPipeline />} />}
            {BLOG_ENABLED && <Route path="/blog/audio-feature-extraction" element={<BlogAudioFeatures />} />}
            {BLOG_ENABLED && <Route path="/blog/steam-genre-networks" element={<BlogSteamGenreNetworks />} />}
            {BLOG_ENABLED && <Route path="/blog/ml-from-scratch" element={<BlogMLFromScratch />} />}
            {BLOG_ENABLED && <Route path="/blog/activity-recognition-pipeline" element={<BlogActivityRecognitionPipeline />} />}
            {BLOG_ENABLED && <Route path="/blog/building-an-idea-workbench" element={<BlogIdeaWorkbench />} />}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/projects/gavel" element={<Gavel />} />
            <Route path="/projects/activity-recognition" element={<ActivityRecognition />} />
            <Route path="/projects/steam-ml" element={<SteamML />} />
            <Route path="/projects/wikipedia-voting" element={<WikipediaVoting />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
