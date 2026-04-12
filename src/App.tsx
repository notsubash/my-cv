import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, ExternalLink, Briefcase, GraduationCap, Award, Code, Users, Globe, Zap, Database, Layout, BadgeCheck, FolderGit2, Sparkles, Download, Github, Package, MessageSquare, Receipt, CalendarCheck, FileText, GitBranch, GitFork, Star, Network, Calendar, Percent, UserCheck, Image, TrendingUp, Timer, ThumbsUp, MessageCircle, Share2, ChevronRight, List, Bot, Video, BookOpen, MapPin, PenLine } from 'lucide-react'
import { translations, seo } from './i18n'
import { useHomeSeo } from './articles/use-article-seo'
import { getTechIcon } from './tech-icons'
import { BLOG_ENABLED } from './config'


function LinkedInLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
    </svg>
  )
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return { ref: setRef, isInView }
}


const HOME_TOC_SECTIONS = [
  { id: 'experience', en: 'Experience' },
  { id: 'projects', en: 'Projects' },
  { id: 'speaking', en: 'Sharing' },
  { id: 'education', en: 'Education' },
  { id: 'tech', en: 'Skills & Stack' },
  { id: 'contact', en: 'Contact' },
] as const

function HomeToc() {
  const [hasRevealed, setHasRevealed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState('')
  const [tocOpen, setTocOpen] = useState(false)

  // Show when #experience top reaches viewport, hide when user scrolls above it
  useEffect(() => {
    const check = () => {
      const trigger = document.getElementById('experience')
      if (!trigger) return
      const show = trigger.getBoundingClientRect().top <= 100
      setVisible(show)
      if (show && !hasRevealed) setHasRevealed(true)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [hasRevealed])

  // Track active section — last section whose top has scrolled past 40% of viewport
  // At page bottom, force last section as active
  useEffect(() => {
    if (!hasRevealed) return
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50
      if (atBottom) {
        setActiveId(HOME_TOC_SECTIONS[HOME_TOC_SECTIONS.length - 1].id)
        return
      }
      const threshold = window.innerHeight * 0.4
      let current = ''
      for (const s of HOME_TOC_SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= threshold) current = s.id
      }
      if (current) setActiveId(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [hasRevealed])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setTocOpen(false)
    const isLast = id === HOME_TOC_SECTIONS[HOME_TOC_SECTIONS.length - 1].id
    const top = isLast
      ? document.documentElement.scrollHeight - window.innerHeight
      : el.getBoundingClientRect().top + window.scrollY - 96
    requestAnimationFrame(() => { window.scrollTo({ top, behavior: 'instant' }) })
  }, [])

  const activeIdx = HOME_TOC_SECTIONS.findIndex(s => s.id === activeId)

  const lastIdx = HOME_TOC_SECTIONS.length - 1
  // Progress as fraction between first and last dot (0 to 1)
  const progressFrac = activeIdx >= 0 ? activeIdx / lastIdx : 0

  const tocNav = (
    <nav aria-label="Table of contents" className="relative">
      {/* Vertical track — spans from first dot center to last dot center */}
      <div className="absolute left-[5.5px] top-[14px] w-px bg-border" style={{ height: 'calc(100% - 28px)' }} />
      {/* Animated progress fill */}
      <motion.div
        className="absolute left-[5.5px] top-[14px] w-px bg-primary origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progressFrac }}
        style={{ height: 'calc(100% - 28px)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      <ul className="relative space-y-1">
        {HOME_TOC_SECTIONS.map((section, i) => {
          const isActive = activeId === section.id
          const isPast = i <= activeIdx
          return (
            <li key={section.id} className="flex items-center gap-3">
              <motion.span
                className={`relative z-10 w-3 h-3 rounded-full border-2 shrink-0 transition-colors duration-300 ${
                  isActive ? 'border-primary bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]'
                  : isPast ? 'border-primary/50 bg-card'
                  : 'border-border bg-card'
                }`}
                animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <button
                onClick={() => scrollTo(section.id)}
                className={`text-left text-[13px] tracking-wide py-1 transition-all duration-300 ${
                  isActive ? 'text-primary font-semibold translate-x-0.5'
                  : isPast ? 'text-foreground/70'
                  : 'text-muted-foreground/60 hover:text-foreground/80'
                }`}
              >
                {section.en}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop: sticky sidebar */}
          <motion.div
            initial={hasRevealed ? { opacity: 0, x: -12 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden 2xl:block fixed top-24 left-[max(1rem,calc(50%-46rem))] w-48 max-h-[calc(100vh-8rem)] overflow-visible z-30"
          >
            {tocNav}
          </motion.div>

          {/* Mobile / narrow desktop: floating button + drawer */}
          <motion.button
            initial={hasRevealed ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => setTocOpen(o => !o)}
            className="2xl:hidden fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            aria-label="Toggle table of contents"
          >
            <List className="w-5 h-5" />
          </motion.button>
          {tocOpen && (
            <>
              <div className="2xl:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={() => setTocOpen(false)} />
              <div className="2xl:hidden fixed bottom-20 right-6 z-50 w-64 max-h-[70vh] overflow-y-auto bg-card border border-border rounded-xl shadow-xl p-4">
                {tocNav}
              </div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [detected, setDetected] = useState(false)
  const hydrated = useHydrated()
  const wasAboveFold = useRef(false)

  useEffect(() => {
    if (!ref) return

    // IntersectionObserver instead of getBoundingClientRect (avoids forced reflow).
    // First callback fires immediately for visible elements → above-fold detection.
    let firstCallback = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (firstCallback) {
          firstCallback = false
          if (entry.isIntersecting) wasAboveFold.current = true
          setDetected(true)
        }
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref])

  return (
    <motion.div
      ref={setRef}
      initial={false}
      animate={
        !hydrated || !detected
          ? false  // Pre-hydration / pre-detection: preserve SSR DOM state
          : isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 }
      }
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionIcon({ children, accent = false }: { children: React.ReactNode, accent?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -90 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, duration: 0.5 }}
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ? 'bg-accent/10' : 'bg-primary/10'}`}
    >
      {children}
    </motion.div>
  )
}

/* Dead code removed — parseHighlights through StorySection */

function CertLogo({ logo }: { logo: string }) {
  const logos: Record<string, React.ReactNode> = {
    anthropic: (
      <svg viewBox="0 0 92.2 65" className="w-6 h-6" fill="currentColor" aria-hidden="true">
        <path d="M66.5,0H52.4l25.7,65h14.1L66.5,0z M25.7,0L0,65h14.4l5.3-13.6h26.9L51.8,65h14.4L40.5,0C40.5,0,25.7,0,25.7,0z M24.3,39.3l8.8-22.8l8.8,22.8H24.3z"/>
      </svg>
    ),
    airtable: (
      <svg viewBox="0 0 200 170" className="w-6 h-6" aria-hidden="true">
        <path fill="#FCB400" d="M90.039 12.368 24.079 39.66c-3.667 1.519-3.63 6.729.062 8.192l66.235 26.266a24.58 24.58 0 0 0 18.12 0l66.236-26.266c3.69-1.463 3.729-6.673.062-8.192l-65.96-27.292a24.58 24.58 0 0 0-18.795 0"/>
        <path fill="#18BFFF" d="M105.312 88.46v65.617c0 3.12 3.147 5.258 6.048 4.108l73.806-28.648a4.42 4.42 0 0 0 2.79-4.108V59.813c0-3.121-3.147-5.258-6.048-4.108l-73.806 28.648a4.42 4.42 0 0 0-2.79 4.108"/>
        <path fill="#F82B60" d="m88.078 91.846-21.904 10.576-2.224 1.075-46.238 22.155c-2.93 1.414-6.672-.722-6.672-3.978V60.088c0-1.178.604-2.195 1.414-2.96a5 5 0 0 1 1.12-.84c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
        <path fill="#8B8B8B" d="m88.078 91.846-21.904 10.576-53.72-45.295a5 5 0 0 1 1.12-.839c1.104-.663 2.68-.84 4.02-.31L87.71 83.76c3.564 1.414 3.844 6.408.368 8.087"/>
      </svg>
    ),
    make: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="make-fill-0" x1="1.5" x2="12" y1="19.5" y2="0">
            <stop stopColor="#F0F"/><stop offset=".17" stopColor="#E90CF9"/><stop offset=".54" stopColor="#C023ED"/><stop offset="1" stopColor="#B02DE9"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="make-fill-1" x1="0" x2="24" y1="24" y2="0">
            <stop stopColor="#B02DE9"/><stop offset="1" stopColor="#6D00CC"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="make-fill-2" x1="0" x2="24" y1="24" y2="0">
            <stop stopColor="#F0F"/><stop offset=".3" stopColor="#B02DE9"/><stop offset="1" stopColor="#6021C3"/>
          </linearGradient>
        </defs>
        <path d="M6.989 4.036L.062 17.818a.577.577 0 00.257.774l3.733 1.876a.577.577 0 00.775-.256L11.753 6.43a.577.577 0 00-.257-.775L7.763 3.78a.575.575 0 00-.774.257z" fill="url(#make-fill-0)"/>
        <path d="M19.245 3.832h4.179c.318 0 .577.26.577.577v15.425a.578.578 0 01-.577.578h-4.179a.578.578 0 01-.577-.578V4.41c0-.318.259-.577.577-.577z" fill="url(#make-fill-1)"/>
        <path d="M12.815 4.085L9.85 19.108a.576.576 0 00.453.677l4.095.826c.314.063.62-.14.681-.454l2.964-15.022a.577.577 0 00-.453-.677l-4.096-.827a.577.577 0 00-.68.454z" fill="url(#make-fill-2)"/>
      </svg>
    ),
    udemy: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#A435F0" aria-hidden="true">
        <path d="M12 0L5.81 3.573v3.574l6.189-3.574 6.191 3.574V3.573zM5.81 10.148v8.144c0 1.85.589 3.243 1.741 4.234S10.104 24 11.973 24s3.269-.482 4.448-1.474c1.152-.991 1.741-2.384 1.741-4.234v-8.144l-3.573 2.053v5.58c0 .589-.214 1.071-.615 1.474-.4.376-.91.589-1.527.589-.616 0-1.126-.213-1.527-.589-.401-.376-.615-.885-.615-1.474v-5.58z"/>
      </svg>
    ),
    greatlearning: (
      <img
        src="/great_learning.svg"
        alt=""
        className="w-6 h-6 object-contain"
        width={24}
        height={24}
        loading="lazy"
      />
    ),
  }
  return logos[logo] || null
}

function App() {
  const t = translations.en
  const hydrated = useHydrated()

  useHomeSeo({ title: seo.en.title, description: seo.en.description })

  return (
    <main className="min-h-screen bg-background bg-[length:24px_24px] [background-image:radial-gradient(circle,hsl(var(--dot-grid))_1px,transparent_1px)]">
      {/* Skip navigation — accessible keyboard shortcut */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:font-medium focus:shadow-lg"
      >
        Skip to content
      </a>

      <HomeToc />

      {/* Hero Section */}
      <header id="main-content" className="relative overflow-hidden">
        {/* Aurora background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-20%] left-[10%] w-[500px] h-[400px] rounded-full blur-[100px] opacity-50"
            style={{ background: 'linear-gradient(135deg, hsl(var(--gradient-from) / 0.3), hsl(var(--accent) / 0.15))', animation: 'hero-aurora 8s ease-in-out infinite' }}
          />
          <div
            className="absolute bottom-[-10%] right-[5%] w-[450px] h-[350px] rounded-full blur-[100px] opacity-40"
            style={{ background: 'linear-gradient(225deg, hsl(var(--accent) / 0.25), hsl(var(--gradient-from) / 0.1))', animation: 'hero-aurora 11s ease-in-out infinite reverse' }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-14 md:pt-28 md:pb-20">
          <div className="flex flex-col items-center text-center">
            {/* Photo with animated SVG ring */}
            <motion.div
              initial={hydrated ? { opacity: 0, scale: 0.85 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-8"
            >
              <div className="relative w-32 h-32 md:w-36 md:h-36">
                {/* Orbital ring — pushed out from the photo like a planetary orbit */}
                <svg
                  className="absolute inset-[-24px] w-[calc(100%+48px)] h-[calc(100%+48px)]"
                  viewBox="0 0 200 200"
                  style={{ animation: 'hero-ring-rotate 25s linear infinite' }}
                >
                  <defs>
                    <linearGradient id="hero-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--gradient-from))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="100" cy="100" r="92"
                    fill="none"
                    stroke="url(#hero-ring-grad)"
                    strokeWidth="1.5"
                    strokeDasharray="578"
                    strokeLinecap="round"
                    style={{ animation: 'hero-ring-draw 2s ease-out forwards' }}
                  />
                  <circle
                    cx="100" cy="100" r="92"
                    fill="none"
                    stroke="url(#hero-ring-grad)"
                    strokeWidth="0.8"
                    strokeDasharray="6 14"
                    opacity="0.3"
                  />
                </svg>
                {/* Orbiting globe — container rotates, globe counter-rotates to stay upright */}
                <div
                  className="absolute inset-[-24px] w-[calc(100%+48px)] h-[calc(100%+48px)] pointer-events-none"
                  style={{ animation: 'hero-ring-rotate 15s linear infinite' }}
                >
                  <img
                    src="/globe.svg"
                    alt=""
                    className="absolute top-[4%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 drop-shadow-[0_0_6px_hsl(var(--gradient-from)/0.5)]"
                    width={24}
                    height={24}
                    style={{ animation: 'hero-ring-rotate 15s linear infinite reverse' }}
                  />
                </div>
                {/* Photo */}
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-background shadow-xl">
                  <img src="/foto-avatar-sm.webp" srcSet="/foto-avatar-sm.webp 192w, /foto-avatar.webp 384w" sizes="144px" alt="Subash Pandey" className="w-full h-full object-cover" width={192} height={192} fetchPriority="high" />
                </div>
              </div>
            </motion.div>

            {/* Name line */}
            <motion.p
              initial={hydrated ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-muted-foreground mb-3"
            >
              {t.greeting}{' '}
              <Link to="/about" className="font-semibold bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--accent))] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                @subash
              </Link>
            </motion.p>

            {/* Headline with flowing gradient */}
            <motion.h1
              initial={hydrated ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
              style={{
                backgroundImage: 'linear-gradient(90deg, hsl(var(--foreground)) 0%, hsl(var(--gradient-from)) 30%, hsl(var(--accent)) 50%, hsl(var(--gradient-from)) 70%, hsl(var(--foreground)) 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                animation: hydrated ? 'hero-text-shimmer 6s linear infinite' : 'none',
              }}
            >
                {t.role}
            </motion.h1>

            {/* Brief summary */}
            <motion.p
              initial={hydrated ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-sm md:text-base text-muted-foreground max-w-lg mt-4 leading-relaxed"
            >
              {t.summary.p1} <span className="text-foreground font-medium">{t.summary.p1Highlight}</span>.
            </motion.p>

            {/* Role tags - staggered */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
                {t.greetingRoles.map((role, i) => (
                <motion.span
                    key={role}
                  initial={hydrated ? { opacity: 0, y: 10, scale: 0.9 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.45 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20 bg-primary/5 text-foreground backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 transition-colors duration-200"
                  >
                    {role}
                </motion.span>
                ))}
              </div>

            {/* CTA row */}
              <motion.div
              initial={hydrated ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
              >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t.cta.availability}
                </span>
              <a
                href={`mailto:${t.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Mail className="w-3 h-3" />
                {t.email}
              </a>
                {BLOG_ENABLED && (
                <Link to="/blog" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors">
                    <PenLine className="w-3 h-3" />
                    Blog
                  </Link>
                )}
            </motion.div>
          </div>
        </div>

        {/* Gradient fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </header>

      {/* Experience */}
      <section id="experience" className="py-12 md:py-20 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 2000px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
              <SectionIcon>
                <Briefcase className="w-5 h-5 text-primary" />
              </SectionIcon>
              {t.experience.title}
            </h2>
          </AnimatedSection>

          {/* Preámbulo: Cómo trabajo + Competencias */}
          <AnimatedSection delay={0.1}>
            <div className="mb-12 p-6 rounded-2xl bg-card/50">
              <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-6">
                {t.summary.p2} <span className="text-foreground font-medium">{t.summary.p2Highlight}</span>{t.summary.p2End}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                {t.coreCompetencies.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 sm:p-4 rounded-xl bg-background/50 border border-border hover:border-accent/30 transition-colors group"
                  >
                    <div className="flex items-center sm:items-start gap-2 sm:mb-1 sm:min-h-[2.5rem]">
                      <Zap className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-sm font-semibold group-hover:text-accent transition-colors leading-tight">{item.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6 hidden sm:block">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Current divider */}
          <AnimatedSection delay={0.1} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border divider-flow" />
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-emerald-400 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                {t.experience.currentLabel}
              </span>
              <div className="h-px flex-1 bg-border divider-flow" />
            </div>
          </AnimatedSection>

          {/* Scopic Software LLC */}
          <AnimatedSection delay={0.1}>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                  <img src="/scopic_software_logo.webp" alt="Scopic Software" className="w-full h-full object-cover" width={40} height={40} loading="lazy" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.santifer.company}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <a href="https://scopicsoftware.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">scopicsoftware.com</a>
                    <span className="text-border">·</span>
                    <span>{t.experience.santifer.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-primary font-medium mb-1">{t.experience.santifer.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.santifer.period}</p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-6">
                {t.experience.santifer.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Trusted By - Tech Stack Logos */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-4">{t.experience.santifer.trustedBy.label}</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:gap-x-8">
                  {t.experience.santifer.trustedBy.logos.map((logo, i) => {
                    const techIcon = getTechIcon(logo.name)
                    return (
                      <div key={i} className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-200">
                        {'src' in logo && logo.src ? (
                          <img src={logo.src} alt={logo.name} className="h-5 w-auto shrink-0 invert opacity-60 hover:opacity-80 dark:invert-0 dark:opacity-70 dark:hover:opacity-90" loading="lazy" width={20} height={20} />
                        ) : techIcon ? (
                          techIcon.src ? (
                            <img src={techIcon.src} alt="" className="w-5 h-5 shrink-0 object-contain opacity-70" width={20} height={20} loading="lazy" />
                          ) : techIcon.path ? (
                            <svg viewBox="0 0 24 24" fill={techIcon.color} className="w-5 h-5 shrink-0 opacity-70" aria-hidden="true">
                              <path d={techIcon.path} />
                            </svg>
                          ) : null
                        ) : null}
                        <span className="text-sm font-medium opacity-60 dark:opacity-70">{logo.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Deep dive CTA */}
              {t.experience.santifer.caseStudyUrl && (
                <Link to={t.experience.santifer.caseStudyUrl} className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 group/cta">
                  <span className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 group-hover/cta:bg-primary/20 group-hover/cta:border-primary/50 transition-colors duration-200">{t.experience.santifer.caseStudyLabel}</span>
                </Link>
              )}
            </div>
          </AnimatedSection>

          {/* Business OS - Full Width Hero Card */}
          <AnimatedSection delay={0.1} className="mb-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 hover:border-gold/50 transition-colors duration-200 group">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                      <Bot className="w-6 h-6 text-gold" />
                    </div>
                    <span className="badge px-3 py-1 bg-gold/20 text-gold">GenAI · LangGraph</span>
                  </div>
                  <h4 className="font-display text-2xl font-bold mb-4">{t.experience.santifer.businessOS.title}</h4>
                  <p className="text-muted-foreground mb-6">{t.experience.santifer.businessOS.desc}</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {t.experience.santifer.businessOS.modules.map((item, i) => {
                      const icons: Record<string, React.ReactNode> = {
                        database: <Database className="w-4 h-4" />,
                        users: <Users className="w-4 h-4" />,
                        layout: <Layout className="w-4 h-4" />,
                        package: <Package className="w-4 h-4" />,
                        messageSquare: <MessageSquare className="w-4 h-4" />,
                        receipt: <Receipt className="w-4 h-4" />,
                        calendarCheck: <CalendarCheck className="w-4 h-4" />
                      }
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-gold mt-0.5">{icons[item.icon]}</span>
                          <span>{item.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                  {t.experience.santifer.caseStudyUrl && (
                    <Link to={t.experience.santifer.caseStudyUrl} className="inline-flex items-center gap-2 mt-auto pt-6 text-sm font-medium text-gold hover:text-gold/80 transition-colors duration-200 group/cta">
                      <span className="px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 group-hover/cta:bg-gold/20 group-hover/cta:border-gold/50 transition-colors duration-200">{t.experience.santifer.businessOS.footer}</span>
                      <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-3 lg:flex lg:flex-col gap-2 lg:gap-3 mt-4 lg:mt-0">
                  {t.experience.santifer.businessOS.metrics.map((metric, i) => (
                    <div key={i} className="text-center p-2 lg:p-4 rounded-xl bg-background/50 border border-gold/20">
                      <div className="font-display text-lg lg:text-2xl font-bold text-gold">{metric.value}</div>
                      <div className="text-[10px] lg:text-xs text-muted-foreground leading-tight">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Key Projects */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <AnimatedSection delay={0.15}>
              <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-colors duration-200 group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <span className="badge px-3 py-1 bg-primary/10 text-primary">{t.experience.santifer.jacobo.badge}</span>
                </div>
                <h4 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">{t.experience.santifer.jacobo.title}</h4>
                <p className="text-muted-foreground text-sm mb-4">{t.experience.santifer.jacobo.desc}</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {t.experience.santifer.jacobo.items.map((item, i) => {
                    const icons: Record<string, React.ReactNode> = {
                      network: <Network className="w-4 h-4" />,
                      calendar: <Calendar className="w-4 h-4" />,
                      percent: <Percent className="w-4 h-4" />,
                      package: <Package className="w-4 h-4" />,
                      userCheck: <UserCheck className="w-4 h-4" />
                    }
                    return (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">{icons[item.icon]}</span>
                        <span>{item.text}</span>
                      </li>
                    )
                  })}
                </ul>
                {t.experience.santifer.jacobo.caseStudyUrl && t.experience.santifer.jacobo.soldWith && (
                  <Link to={t.experience.santifer.jacobo.caseStudyUrl} className="inline-flex items-center gap-2 mt-auto pt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 group/cta">
                    <span className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 group-hover/cta:bg-primary/20 group-hover/cta:border-primary/50 transition-colors duration-200">{t.experience.santifer.jacobo.soldWith}</span>
                    <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 hover:border-accent/40 transition-colors duration-200 group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Layout className="w-6 h-6 text-accent" />
                  </div>
                  <span className="badge px-3 py-1 bg-accent/10 text-accent">{t.experience.santifer.webSeo.badge}</span>
                </div>
                <h4 className="font-display text-xl font-bold mb-2 group-hover:text-accent transition-colors">{t.experience.santifer.webSeo.title}</h4>
                <p className="text-muted-foreground text-sm mb-4">{t.experience.santifer.webSeo.desc}</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {t.experience.santifer.webSeo.items.map((item, i) => {
                    const icons: Record<string, React.ReactNode> = {
                      fileText: <FileText className="w-4 h-4" />,
                      image: <Image className="w-4 h-4" />,
                      trendingUp: <TrendingUp className="w-4 h-4" />,
                      gitBranch: <GitBranch className="w-4 h-4" />,
                    }
                    return (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent mt-0.5 shrink-0">{icons[item.icon]}</span>
                        <span>{item.text}</span>
                      </li>
                    )
                  })}
                </ul>
                {t.experience.santifer.webSeo.caseStudyUrl && t.experience.santifer.webSeo.codeAvailable && (
                  <Link to={t.experience.santifer.webSeo.caseStudyUrl} className="inline-flex items-center gap-2 mt-auto pt-4 text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 group/cta">
                    <span className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 group-hover/cta:bg-accent/20 group-hover/cta:border-accent/50 transition-colors duration-200">{t.experience.santifer.webSeo.codeAvailable}</span>
                    <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                )}
              </div>
            </AnimatedSection>
          </div>

            {t.experience.santifer.exit && (
            <AnimatedSection delay={0.25} className="mb-8">
                <div className="h-full p-5 rounded-2xl bg-gradient-to-r from-success/10 to-success/5 border border-success/30 hover:border-success/50 transition-colors duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-success" />
                    <span className="font-display font-bold text-success">{t.experience.santifer.exit}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.experience.santifer.exitDesc}</p>
                </div>
              </AnimatedSection>
            )}

          {/* Other highlights - compact strip */}
          <AnimatedSection delay={0.25} className="mb-12">
            {(() => {
              const highlights = [
                { icon: <Database className="w-4 h-4 text-primary" />, title: t.experience.santifer.erp.title, desc: t.experience.santifer.erp.desc, metric: t.experience.santifer.erp.metric },
                { icon: <Bot className="w-4 h-4 text-accent" />, title: t.experience.santifer.gpts.title, desc: t.experience.santifer.gpts.desc, metric: t.experience.santifer.gpts.metric },
                { icon: <Timer className="w-4 h-4 text-primary" />, title: t.experience.santifer.reservas.title, desc: t.experience.santifer.reservas.desc, metric: t.experience.santifer.reservas.metric },
                { icon: <Users className="w-4 h-4 text-accent" />, title: t.experience.santifer.crm.title, desc: t.experience.santifer.crm.desc, metric: t.experience.santifer.crm.metric },
                { icon: <Sparkles className="w-4 h-4 text-primary" />, title: t.experience.santifer.genAI.title, desc: t.experience.santifer.genAI.desc, metric: t.experience.santifer.genAI.metric },
              ]
              const [expanded, setExpanded] = useState(false)
              return (
                <div className="rounded-2xl border border-border bg-card/50 overflow-hidden">
                  <button
                    onClick={() => setExpanded(e => !e)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-sm font-medium text-muted-foreground">Other contributions at {t.experience.santifer.company}</span>
                    <motion.span
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="px-6 pb-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                              <span className="mt-0.5 shrink-0">{h.icon}</span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium leading-tight">{h.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{h.desc}</p>
                </div>
              </div>
                          ))}
                </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
              )
            })()}
            </AnimatedSection>

          {/* Previous Experience divider */}
          <AnimatedSection delay={0.1} className="mt-16 mb-10">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border divider-flow" />
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground shrink-0">{t.experience.previousLabel}</span>
              <div className="h-px flex-1 bg-border divider-flow" />
            </div>
          </AnimatedSection>

          {/* Peace Nepal Dot Com */}
          <AnimatedSection delay={0.1}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                  <img src="/peace_nepal_dot_com_logo.webp" alt="Peace Nepal Dot Com" className="w-full h-full object-cover" width={40} height={40} loading="lazy" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.lico.company}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <a href="https://peacenepal.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">peacenepal.com</a>
                    <span className="text-border">·</span>
                    <span>{t.experience.lico.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-accent font-medium mb-1">{t.experience.lico.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.lico.period}</p>
              <p className="text-muted-foreground">{t.experience.lico.desc}</p>
              {t.experience.lico.testimonial.quote && (
                <blockquote className="mt-4 pl-4 border-l-2 border-accent/50 italic text-sm text-muted-foreground">
                  <p>"{t.experience.lico.testimonial.quote}"</p>
                  <footer className="mt-1 text-xs not-italic">— {t.experience.lico.testimonial.author}, {t.experience.lico.testimonial.role}</footer>
                </blockquote>
              )}
            </div>
          </AnimatedSection>

          {/* Icebrkr AI Solutions */}
          <AnimatedSection delay={0.1} className="mt-16">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.everis.company}</h3>
                </div>
              </div>
              <p className="text-primary font-medium mb-1">{t.experience.everis.role}</p>
              <p className="text-sm text-muted-foreground mb-2">{t.experience.everis.period}</p>
              <p className="text-muted-foreground">{t.experience.everis.desc}</p>
              {t.experience.everis.testimonial.quote && (
                <blockquote className="mt-4 pl-4 border-l-2 border-primary/50 italic text-sm text-muted-foreground">
                  <p>"{t.experience.everis.testimonial.quote}"</p>
                  <footer className="mt-1 text-xs not-italic">— {t.experience.everis.testimonial.author}, {t.experience.everis.testimonial.role}</footer>
                </blockquote>
              )}
            </div>
          </AnimatedSection>

          {/* Contentio Lab */}
          <AnimatedSection delay={0.1} className="mt-16">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-accent/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.contentio.company}</h3>
                  <span className="text-xs text-muted-foreground">{t.experience.contentio.location}</span>
                </div>
              </div>
              <p className="text-accent font-medium mb-1">{t.experience.contentio.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.contentio.period}</p>
              <p className="text-muted-foreground">{t.experience.contentio.desc}</p>
            </div>
          </AnimatedSection>

          {/* iMark Private Limited */}
          <AnimatedSection delay={0.1} className="mt-16">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                  <img src="/imark-logo.webp" alt="iMark Private Limited" className="w-full h-full object-cover" width={40} height={40} loading="lazy" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.imark.company}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <a href="https://www.imarkdigital.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">imarkdigital.com</a>
                    <span className="text-border">·</span>
                    <span>{t.experience.imark.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-primary font-medium mb-1">{t.experience.imark.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.imark.period}</p>
              <p className="text-muted-foreground">{t.experience.imark.desc}</p>
            </div>
          </AnimatedSection>

          {/* Budhanilkantha Education Services */}
          <AnimatedSection delay={0.1} className="mt-16">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                  <img src="/budhanilkantha_education_services_logo.webp" alt="Budhanilkantha Education Services" className="w-full h-full object-cover" width={40} height={40} loading="lazy" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.tutor.company}</h3>
                  <span className="text-xs text-muted-foreground">{t.experience.tutor.location}</span>
                </div>
              </div>
              <p className="text-accent font-medium mb-1">{t.experience.tutor.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.tutor.period}</p>
              <p className="text-muted-foreground">{t.experience.tutor.desc}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects & Claude Code */}
      <section id="projects" className="py-12 md:py-20" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1500px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-2xl font-semibold flex items-center gap-3">
                <SectionIcon>
                  <FolderGit2 className="w-5 h-5 text-primary" />
                </SectionIcon>
                {t.projects.title}
              </h2>
              <a
                href={`https://${t.projects.githubLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {t.projects.githubLink.split('/').pop()}
              </a>
            </div>
          </AnimatedSection>

          {/* Projects Grid with Dependency Lines */}
          {(() => {
            // Tipo para proyecto
            type ProjectLink = { label: string; url: string; icon: string }
            type Project = {
              title: string
              badge: string
              badgeBuilding: string
              desc: string
              tech: readonly string[]
              link: string
              links?: readonly ProjectLink[]
              isDependency?: boolean
              dependencyRole?: string
              caseStudyUrl?: string
              caseStudyLabel?: string
              stars?: string
              forks?: string
            }

            const allProjects = t.projects.items as readonly Project[]
            const proj0 = allProjects[0]!
            const proj1 = allProjects[1]!
            const proj2 = allProjects[2]!
            const proj3 = allProjects[3]!
            const proj4 = allProjects[4]!

            // Helper para parsear **bold** a elementos con estilo
            const parseBold = (text: string): React.ReactNode[] => {
              return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="text-tool font-semibold">{part}</strong> : part
              )
            }

            const containerRef = useRef<HTMLDivElement>(null)
            const cardRefs = {
              p0: useRef<HTMLDivElement>(null),
              p1: useRef<HTMLDivElement>(null),
              p2: useRef<HTMLDivElement>(null),
              p3: useRef<HTMLDivElement>(null),
              p4: useRef<HTMLDivElement>(null),
            }

            // Hook para calcular líneas de conexión SVG
            const [lines, setLines] = useState<string[]>([])
            const { ref: visibilityRef, isInView: isVisible } = useInView(0.1)

            useEffect(() => {
              if (!isVisible || !containerRef.current) return

              const calculate = () => {
                const container = containerRef.current!.getBoundingClientRect()
                const isMobile = window.innerWidth < 768 // Tailwind md breakpoint

                type Edge = 'top' | 'bottom' | 'left' | 'right'
                const getPoint = (ref: React.RefObject<HTMLDivElement | null>, edge: Edge, ratio = 0.5) => {
                  const rect = ref.current?.getBoundingClientRect()
                  if (!rect) return null
                  const x = rect.left - container.left
                  const y = rect.top - container.top
                  switch (edge) {
                    case 'top': return { x: x + rect.width * ratio, y }
                    case 'bottom': return { x: x + rect.width * ratio, y: y + rect.height }
                    case 'left': return { x, y: y + rect.height * ratio }
                    case 'right': return { x: x + rect.width, y: y + rect.height * ratio }
                  }
                }

                // Definir conexiones según el grafo
                type Connection = {
                  from: React.RefObject<HTMLDivElement | null>
                  fromEdge: Edge
                  fromRatio?: number
                  to: React.RefObject<HTMLDivElement | null>
                  toEdge: Edge
                  toRatio?: number
                }

                const connections: Connection[] = isMobile ? [
                  { from: cardRefs.p0, fromEdge: 'bottom', to: cardRefs.p1, toEdge: 'top' },
                  { from: cardRefs.p1, fromEdge: 'bottom', to: cardRefs.p2, toEdge: 'top' },
                  { from: cardRefs.p2, fromEdge: 'bottom', to: cardRefs.p3, toEdge: 'top' },
                  { from: cardRefs.p3, fromEdge: 'bottom', to: cardRefs.p4, toEdge: 'top' },
                ] : [
                  { from: cardRefs.p0, fromEdge: 'right', to: cardRefs.p1, toEdge: 'left' },
                  { from: cardRefs.p0, fromEdge: 'bottom', to: cardRefs.p2, toEdge: 'top' },
                  { from: cardRefs.p1, fromEdge: 'bottom', to: cardRefs.p3, toEdge: 'top' },
                  { from: cardRefs.p2, fromEdge: 'right', to: cardRefs.p3, toEdge: 'left' },
                  { from: cardRefs.p2, fromEdge: 'bottom', to: cardRefs.p4, toEdge: 'top', toRatio: 0.25 },
                  { from: cardRefs.p3, fromEdge: 'bottom', to: cardRefs.p4, toEdge: 'top', toRatio: 0.75 },
                ]

                const paths = connections.map(conn => {
                  const start = getPoint(conn.from, conn.fromEdge, conn.fromRatio ?? 0.5)
                  const end = getPoint(conn.to, conn.toEdge, conn.toRatio ?? 0.5)
                  if (!start || !end) return ''

                  // Móvil: líneas rectas simples | Desktop: curvas Bézier
                  if (isMobile) {
                    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
                  }

                  // Determinar si es conexión horizontal o vertical
                  const isHorizontal = conn.fromEdge === 'left' || conn.fromEdge === 'right'
                  if (isHorizontal) {
                    // Curva Bézier horizontal
                    const midX = (start.x + end.x) / 2
                    return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`
                  } else {
                    // Curva Bézier vertical
                    const midY = (start.y + end.y) / 2
                    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`
                  }
                }).filter(Boolean)

                setLines(paths)
              }

              // Delay para dar tiempo a las animaciones de entrada (AnimatedSection ~0.6s)
              const initialTimeout = setTimeout(calculate, 700)

              // Debounce para resize
              let resizeTimeout: ReturnType<typeof setTimeout>
              const debouncedCalc = () => {
                clearTimeout(resizeTimeout)
                resizeTimeout = setTimeout(calculate, 100)
              }
              window.addEventListener('resize', debouncedCalc)
              return () => {
                window.removeEventListener('resize', debouncedCalc)
                clearTimeout(initialTimeout)
                clearTimeout(resizeTimeout)
              }
            }, [isVisible])

            // Componente de tarjeta de proyecto
            const ProjectCard = ({ project, variant = 'default', cardRef }: {
              project: Project,
              variant?: 'default' | 'highlight' | 'tool' | 'tool-static',
              cardRef?: React.RefObject<HTMLDivElement | null> | ((el: HTMLDivElement | null) => void)
            }) => {
              const isHighlight = variant === 'highlight'
              const isTool = variant === 'tool' || variant === 'tool-static'
              const hasHover = variant !== 'tool-static'

              return (
                <div
                  ref={cardRef}
                  className={`h-full p-6 rounded-2xl transition-colors duration-200 flex flex-col ${hasHover ? 'group' : ''} ${
                    isHighlight
                      ? 'bg-gradient-to-br from-accent/5 to-transparent border-2 border-accent/50 hover:border-accent/70'
                      : isTool
                      ? `bg-card border border-tool/30 ${hasHover ? 'hover:border-tool/50' : ''}`
                      : 'bg-card border border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`font-display text-xl font-bold transition-colors ${
                      isTool ? 'group-hover:text-tool' : 'group-hover:text-primary'
                    }`}>{project.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`badge px-2 py-0.5 ${
                        isTool
                          ? 'bg-tool/10 text-tool'
                          : isHighlight
                          ? 'bg-accent/10 text-accent'
                          : 'bg-primary/10 text-primary'
                      }`}>{project.badge}</span>
                      {project.badgeBuilding && (
                        <span className="badge px-2 py-0.5 bg-success/5 text-success flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot"></span>
                          {project.badgeBuilding}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {parseBold(project.desc)}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className={`px-2 py-1 rounded-md text-xs ${
                        isTool
                          ? 'bg-tool/10 text-tool'
                          : 'bg-muted text-muted-foreground'
                      }`}>{tech}</span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    {project.caseStudyUrl && (
                      <Link
                        to={project.caseStudyUrl}
                        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 group/cta"
                      >
                        <span className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 group-hover/cta:bg-accent/20 group-hover/cta:border-accent/50 transition-colors duration-200">{project.caseStudyLabel}</span>
                        <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
                      </Link>
                    )}
                    {project.links && project.links.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {project.links.map((pl, li) => {
                          const plIcons: Record<string, React.ReactNode> = {
                            github: <Github className="w-3.5 h-3.5" />,
                            fileText: <FileText className="w-3.5 h-3.5" />,
                            video: <Video className="w-3.5 h-3.5" />,
                          }
                          return (
                            <a
                              key={li}
                              href={pl.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                isTool
                                  ? 'bg-tool/10 text-tool hover:bg-tool/20'
                                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                              }`}
                            >
                              {plIcons[pl.icon] || <ExternalLink className="w-3.5 h-3.5" />}
                              {pl.label}
                            </a>
                          )
                        })}
                        {project.stars && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="w-3.5 h-3.5 text-yellow-500" />
                            {project.stars}
                          </span>
                        )}
                        {project.forks && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <GitFork className="w-3.5 h-3.5" />
                            {project.forks}
                          </span>
                        )}
                      </div>
                    ) : project.link ? (
                      <div className="flex items-center gap-3">
                        <a
                          href={`https://${project.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 text-xs ${
                            isTool ? 'text-tool hover:text-tool' : 'text-primary'
                          } hover:underline`}
                        >
                          {project.link.includes('github.com') ? (
                            <>
                              <Github className="w-4 h-4" />
                              {t.projects.viewCode}
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4" aria-hidden="true" />
                              {t.projects.viewPrototype}
                            </>
                          )}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            }


            return (
              <div ref={(el) => { containerRef.current = el; visibilityRef(el) }} className="mb-12 relative">
                {/* SVG de conexiones - absoluto, z-0 para quedar detrás */}
                <svg
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 0, overflow: 'visible' }}
                >
                  {lines.map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      className="dependency-line"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4 4"
                      style={{
                        opacity: isVisible ? 0.6 : 0,
                        transition: `opacity 0.6s ease-out ${i * 0.1}s`
                      }}
                    />
                  ))}
                </svg>

                {/* Row 1 */}
                <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
                  <AnimatedSection delay={0.1}>
                    <ProjectCard project={proj0} variant="highlight" cardRef={cardRefs.p0} />
                  </AnimatedSection>
                  <AnimatedSection delay={0.15}>
                    <ProjectCard project={proj1} variant="highlight" cardRef={cardRefs.p1} />
                  </AnimatedSection>
                </div>

                {/* Row 2 */}
                <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
                  <AnimatedSection delay={0.2}>
                    <ProjectCard project={proj2} cardRef={cardRefs.p2} />
                  </AnimatedSection>
                  <AnimatedSection delay={0.25}>
                    <ProjectCard project={proj3} cardRef={cardRefs.p3} />
                  </AnimatedSection>
                </div>

                {/* Row 3 */}
                <div className="relative z-10">
                  <AnimatedSection delay={0.3}>
                    <ProjectCard project={proj4} cardRef={cardRefs.p4} />
                  </AnimatedSection>
                </div>
              </div>
            )
          })()}

          {/* Claude Code Power User */}
          <AnimatedSection delay={0.3}>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display font-bold">{t.claudeCode.title}</h3>
                    <span className="badge px-2 py-0.5 bg-accent/10 text-accent">{t.claudeCode.badge}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.claudeCode.desc}</p>
                  {t.claudeCode.highlights && (
                    <ul className="mt-3 space-y-1.5">
                      {(t.claudeCode.highlights as readonly string[]).map((h: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-accent mt-0.5 shrink-0">›</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {t.claudeCode.certs && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {t.claudeCode.certs.map((cert: { title: string; url: string }, i: number) => (
                        <a
                          key={i}
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-xs text-muted-foreground hover:text-accent hover:bg-accent/20 transition-colors"
                        >
                          <BadgeCheck className="w-3.5 h-3.5" />
                          {cert.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sharing — Publications + LinkedIn */}
      <section id="speaking" className="py-12 md:py-20 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
              <SectionIcon>
                <Share2 className="w-5 h-5 text-primary" />
              </SectionIcon>
              {t.speaking.title}
            </h2>
          </AnimatedSection>

          {/* Publications */}
          <AnimatedSection delay={0.1}>
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              {t.publications.title}
            </h3>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {t.publications.items.map((pub, i) => (
              <AnimatedSection key={i} delay={0.15 + i * 0.1}>
                <div className="p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-colors duration-200 group h-full flex flex-col card-hover">
                  <span className="text-xs text-accent font-medium">{pub.year} · {pub.org}</span>
                  <h4 className="font-display font-bold mt-2 group-hover:text-accent transition-colors">{pub.title}</h4>
                  <p className="text-sm text-muted-foreground mt-2 flex-1">{pub.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pub.links.map((link, j) => {
                      const linkIcons: Record<string, React.ReactNode> = {
                        fileText: <FileText className="w-3.5 h-3.5" />,
                        video: <Video className="w-3.5 h-3.5" />,
                        github: <Github className="w-3.5 h-3.5" />,
                      }
                      return (
                        <a
                          key={j}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-xs text-muted-foreground hover:text-accent hover:bg-accent/20 transition-colors"
                        >
                          {linkIcons[link.icon] || <ExternalLink className="w-3.5 h-3.5" />}
                          {link.label}
                        </a>
                      )
                    })}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Recommendations */}
          {t.recommendations.items.length > 0 && (
            <>
              <AnimatedSection delay={0.15} className="mt-10 mb-4">
                <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-primary" />
                  {t.recommendations.title}
                </h3>
              </AnimatedSection>
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {t.recommendations.items.map((rec: { quote: string; author: string; role: string; date: string; source: string; url?: string; avatar?: string }, i: number) => (
                  <AnimatedSection key={i} delay={0.2 + i * 0.1}>
                    <a
                      href={rec.url || 'https://www.linkedin.com/in/notsubash/details/recommendations/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group h-full"
                    >
                      <blockquote className="p-4 rounded-xl bg-primary/5 border border-primary/10 group-hover:border-[hsl(var(--linkedin)/0.3)] transition-colors h-full flex flex-col">
                        <p className="text-sm text-muted-foreground italic mb-4 flex-1">"{rec.quote}"</p>
                        <footer className="flex items-center gap-3">
                          {rec.avatar ? (
                            <picture>
                              <source srcSet={rec.avatar.replace(/\.[^.]+$/, '.webp')} type="image/webp" />
                              <img
                                alt={rec.author}
                                className="w-10 h-10 rounded-full object-cover shrink-0"
                                src={rec.avatar}
                                width={40}
                                height={40}
                                loading="lazy"
                                decoding="async"
                              />
                            </picture>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[hsl(var(--linkedin)/0.15)] flex items-center justify-center shrink-0 text-[hsl(var(--linkedin))] text-sm font-semibold">
                              {rec.author.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-foreground block">{rec.author}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{rec.role}</span>
                          </div>
                          <LinkedInLogo className="w-4 h-4 text-[hsl(var(--linkedin))] shrink-0" />
                        </footer>
                      </blockquote>
                    </a>
                  </AnimatedSection>
                ))}
              </div>
            </>
          )}

          {/* Teaching / Speaking cards */}
          {t.speaking.items.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {t.speaking.items.map((talk: { year: string; event: string; eventUrl: string; title: string; desc: string; pdf: string; featured?: boolean; materialUrl?: string; materialLabel?: string }, i: number) => (
                <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                  <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors duration-200 group h-full flex flex-col">
                    <span className="text-xs text-primary font-medium">
                      {talk.year} · {talk.eventUrl ? (
                        <a href={talk.eventUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {talk.event} <ExternalLink className="w-3 h-3 inline" aria-hidden="true" />
                        </a>
                      ) : talk.event}
                    </span>
                    <h3 className="font-display font-bold mt-2 group-hover:text-primary transition-colors">{talk.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 flex-1">{talk.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {talk.pdf && (
                        <a href={talk.pdf} download className="inline-flex items-center gap-2 text-xs text-primary hover:underline">
                          <Download className="w-4 h-4" />
                          {t.speaking.slides}
                        </a>
                      )}
                      {talk.materialUrl && (
                        <Link to={talk.materialUrl} className="inline-flex items-center gap-2 text-xs text-primary hover:underline">
                          <FileText className="w-4 h-4" />
                          {talk.materialLabel || 'Material'}
                        </Link>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Separator */}
          <div className="my-10 border-t border-border/40" />

          {/* LinkedIn Posts */}
          <AnimatedSection delay={0.2}>
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <LinkedInLogo className="w-5 h-5" />
              LinkedIn Posts
            </h3>
          </AnimatedSection>
          {t.linkedinPosts.embeds.length > 0 ? (
            <div className="grid gap-4">
              {t.linkedinPosts.embeds.map((post: { hook: string; reactions: string; comments: string; url: string }, i: number) => (
                <AnimatedSection key={`li-${i}`} delay={0.25 + i * 0.1}>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-card border border-border/50 border-l-4 border-l-[hsl(var(--linkedin))] hover:border-border hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[hsl(var(--linkedin))]/10 flex items-center justify-center shrink-0">
                        <LinkedInLogo className="w-5 h-5 text-[hsl(var(--linkedin))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1.5 font-medium">LinkedIn · Reposted</p>
                        <p className="text-sm text-foreground leading-relaxed line-clamp-3">{post.hook}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 text-xs text-muted-foreground shrink-0 pl-13 sm:pl-0">
                      <span className="flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {post.reactions}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {post.comments}
                      </span>
                      <span className="ml-auto sm:ml-0 text-[hsl(var(--linkedin))] group-hover:underline flex items-center gap-1 transition-colors font-medium">
                        {t.linkedinPosts.cta}
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection delay={0.25}>
              <div className="p-8 rounded-2xl bg-card border border-dashed border-border/60 text-center">
                <LinkedInLogo className="w-8 h-8 text-[hsl(var(--linkedin))] mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">{t.linkedinPosts.emptyState}</p>
                <a
                  href={t.linkedinPosts.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[hsl(var(--linkedin))]/10 text-[hsl(var(--linkedin))] font-medium text-sm hover:bg-[hsl(var(--linkedin))]/20 transition-colors"
                >
                  <LinkedInLogo className="w-4 h-4" />
                  Follow on LinkedIn
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </AnimatedSection>
          )}

          {BLOG_ENABLED && (
            <>
              {/* Separator */}
              <div className="my-10 border-t border-border/40" />

              {/* Blog */}
              <AnimatedSection delay={0.3}>
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-accent" />
                  {t.blog.title}
                </h3>
              </AnimatedSection>
              {t.blog.items.length > 0 ? (
                <div className="grid gap-4 mb-4">
                  {t.blog.items.map((post: { slug: string; title: string; date: string; summary: string; tags: readonly string[] }, i: number) => (
                    <AnimatedSection key={post.slug} delay={0.35 + i * 0.1}>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-card border border-border/50 border-l-4 border-l-accent hover:border-border hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <PenLine className="w-5 h-5 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1.5 font-medium">{post.date}</p>
                            <p className="text-sm font-semibold text-foreground leading-relaxed group-hover:text-accent transition-colors">{post.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.summary}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-accent font-medium shrink-0 pl-13 sm:pl-0 group-hover:underline gap-1">
                          {t.blog.readMore}
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    </AnimatedSection>
                  ))}
                </div>
              ) : (
                <AnimatedSection delay={0.35}>
                  <div className="p-6 rounded-2xl bg-card border border-dashed border-border/60 text-center">
                    <PenLine className="w-8 h-8 text-accent/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">{t.blog.noPosts}</p>
                  </div>
                </AnimatedSection>
              )}
              <AnimatedSection delay={0.4}>
                <div className="text-center mt-4">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 text-accent font-medium text-sm hover:bg-accent/20 transition-colors"
                  >
                    <PenLine className="w-4 h-4" />
                    All posts
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>

      {/* Technical Notes */}
      <section id="notes" className="py-12 md:py-20 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-2 flex items-center gap-3">
              <SectionIcon>
                <Zap className="w-5 h-5 text-primary" />
              </SectionIcon>
              {t.technicalNotes.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-8">{t.technicalNotes.subtitle}</p>
          </AnimatedSection>

          {(() => {
            const INITIAL_NOTES = 3
            const [showAllNotes, setShowAllNotes] = useState(false)
            const visibleNotes = showAllNotes ? t.technicalNotes.items : t.technicalNotes.items.slice(0, INITIAL_NOTES)
            const hasMore = t.technicalNotes.items.length > INITIAL_NOTES

            return (
              <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleNotes.map((note: { title: string; body: string; tags: readonly string[] }, i: number) => (
                    <AnimatedSection key={i} delay={0.1 + i * 0.06}>
                <div className="h-full p-5 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Code className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug">{note.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{note.body}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/30">
                    {note.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/8 text-primary/80">{tag}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
                {hasMore && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setShowAllNotes(s => !s)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-muted-foreground border border-border hover:border-primary/40 hover:text-primary bg-card transition-colors duration-200"
                    >
                      {showAllNotes ? 'Show less' : `Show ${t.technicalNotes.items.length - INITIAL_NOTES} more`}
                      <motion.span
                        animate={{ rotate: showAllNotes ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      </motion.span>
                    </button>
                  </div>
                )}
              </>
            )
          })()}
        </div>
      </section>

      {/* Education & Certifications */}
      <section id="education" className="py-12 md:py-20" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1000px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <AnimatedSection>
                <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
                  <SectionIcon>
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </SectionIcon>
                  {t.education.title}
                </h2>
              </AnimatedSection>

              <div className="space-y-4">
                {t.education.items.map((item, i) => (
                  <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                    <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors duration-200 group card-hover">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs text-primary font-medium">{item.year} · {item.org}</span>
                          <h3 className="font-display font-semibold mt-1 group-hover:text-primary transition-colors">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}

              </div>
            </div>

            {/* Certifications */}
            <div>
              <AnimatedSection>
                <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
                  <SectionIcon accent>
                    <Award className="w-5 h-5 text-accent" />
                  </SectionIcon>
                  {t.certifications.title}
                </h2>
              </AnimatedSection>

              <div className="space-y-1 rounded-xl overflow-hidden border border-border">
                {t.certifications.items.map((cert, i) => {
                  const isAlt = i % 2 === 1
                  const Wrapper = cert.url ? 'a' : 'div'
                  const wrapperProps = cert.url
                    ? { href: cert.url, target: '_blank', rel: 'noopener noreferrer nofollow' }
                    : {}
                  return (
                  <AnimatedSection key={i} delay={0.1 + i * 0.05}>
                    <Wrapper
                      {...wrapperProps}
                      className={`flex items-center gap-4 p-4 hover:border-accent/30 transition-colors duration-200 group ${cert.url ? 'cursor-pointer' : ''} ${isAlt ? 'bg-muted/40' : 'bg-card'}`}
                    >
                      <span className="text-sm font-mono text-accent font-medium">{cert.year}</span>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-accent transition-colors">{cert.title}</p>
                        <p className="text-sm text-muted-foreground">{cert.org}</p>
                      </div>
                      <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                        <CertLogo logo={cert.logo} />
                      </div>
                    </Wrapper>
                  </AnimatedSection>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="tech" className="py-12 md:py-20 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-12 flex items-center gap-3">
              <SectionIcon>
                <Code className="w-5 h-5 text-primary" />
              </SectionIcon>
              {t.skills.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">
            <AnimatedSection delay={0.1}>
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                {t.skills.languages}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>{t.skills.spanish}</span>
                  <span className="text-sm text-primary font-medium">{t.skills.native}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t.skills.english}</span>
                  <span className="text-sm text-muted-foreground">{t.skills.professional}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t.skills.hindi}</span>
                  <span className="text-sm text-muted-foreground">{t.skills.hindiLevel}</span>
                </div>
              </div>

              <h3 className="font-display font-semibold mb-4 mt-8">{t.skills.soft}</h3>
              <div className="flex flex-wrap gap-2">
                {t.skills.softSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="md:col-span-3">
              <h3 className="font-display font-semibold mb-4">{t.techStack.title}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {t.techStack.categories.map((cat, catIdx) => (
                  <div key={cat.name} className="p-4 rounded-xl bg-card border border-border card-hover">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">{cat.name}</span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {cat.items.map((item, itemIdx) => {
                        const icon = getTechIcon(item)
                        return (
                          <motion.span
                            key={item}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.3, delay: catIdx * 0.08 + itemIdx * 0.03 }}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-muted text-foreground"
                          >
                            {icon && (
                              icon.src ? (
                                <img src={icon.src} alt="" className="w-3.5 h-3.5 shrink-0 object-contain" width={14} height={14} loading="lazy" />
                              ) : icon.path ? (
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill={icon.color} aria-hidden="true">
                                  <path d={icon.path} />
                                </svg>
                              ) : null
                            )}
                            {item}
                          </motion.span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer CTA + Contact Form */}
      <footer id="contact" className="relative py-12 md:py-20">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--background)) 25%, hsl(var(--background)) 75%, transparent 100%)',
        }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {t.cta.title}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t.cta.desc}
              </p>
              <span className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MapPin className="w-3 h-3" />
                {t.cta.availability}
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${t.email}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5" />
                {t.email}
              </a>
                <a
                  href={t.linkedinPosts.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-[hsl(var(--linkedin))]/50 transition-colors duration-200 hover:bg-[hsl(var(--linkedin))]/5 text-sm"
                >
                  <LinkedInLogo className="w-4 h-4" />
                  {t.cta.linkedin}
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/notsubash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-colors duration-200 hover:bg-primary/5 text-sm"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                {BLOG_ENABLED && (
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-accent/50 transition-colors duration-200 hover:bg-accent/5 text-sm"
                  >
                    <PenLine className="w-4 h-4" />
                    Blog
                  </Link>
                )}
              </div>
          </AnimatedSection>

          <p className="mt-12 text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Subash Pandey
            <span className="mx-2 text-border">|</span>
            {BLOG_ENABLED && (
              <>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
                <span className="mx-2 text-border">|</span>
              </>
            )}
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
          </p>
        </div>
      </footer>

    </main>
  )
}

export default App
