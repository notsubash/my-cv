import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, MotionConfig } from 'motion/react'
import { Mail, ExternalLink, Briefcase, GraduationCap, Award, Code, Users, Globe, Zap, Database, Layout, Sparkles, Download, Github, Package, MessageSquare, Receipt, CalendarCheck, FileText, Network, Calendar, Percent, UserCheck, TrendingUp, Timer, ThumbsUp, MessageCircle, Share2, ChevronRight, Bot, Video, BookOpen, MapPin, PenLine } from 'lucide-react'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import { getTechIcon } from './tech-icons'
import { BLOG_ENABLED } from './config'
import { CalBookButton } from './CalBookButton'
import posthog from './posthog'


function LinkedInLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
    </svg>
  )
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    // Keep Motion on initial={false} during prerender so the snapshot stays
    // fully visible and matches the first createRoot commit (no takeover flash).
    if (Reflect.get(window, '__PRERENDER__')) return
    setHydrated(true)
  }, [])
  return hydrated
}

const HOME_BLOG_PREVIEW_COUNT = 3

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

function OtherContributions() {
  const t = translations.en

              const highlights = [
                { icon: <Database className="w-4 h-4 text-primary" />, title: t.experience.santifer.erp.title, desc: t.experience.santifer.erp.desc, metric: t.experience.santifer.erp.metric },
                { icon: <Bot className="w-4 h-4 text-accent" />, title: t.experience.santifer.gpts.title, desc: t.experience.santifer.gpts.desc, metric: t.experience.santifer.gpts.metric },
                { icon: <Timer className="w-4 h-4 text-primary" />, title: t.experience.santifer.reservas.title, desc: t.experience.santifer.reservas.desc, metric: t.experience.santifer.reservas.metric },
                { icon: <Users className="w-4 h-4 text-accent" />, title: t.experience.santifer.crm.title, desc: t.experience.santifer.crm.desc, metric: t.experience.santifer.crm.metric },
                { icon: <Sparkles className="w-4 h-4 text-primary" />, title: t.experience.santifer.genAI.title, desc: t.experience.santifer.genAI.desc, metric: t.experience.santifer.genAI.metric },
              ]
              const [expanded, setExpanded] = useState(false)
              return (
                <div className="rounded-2xl border border-border/70 bg-card/50 overflow-hidden">
                  <button
                    onClick={() => setExpanded(e => !e)}
                    className="w-full flex items-center justify-between min-h-11 px-5 py-3 hover:bg-muted/30 transition-colors"
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
                        <div className="px-5 pb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-background/50 border border-border/50">
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
            
}


function CvPage() {
  const t = translations.en
  usePageSeo({
    title: "Experience & CV | Subash Pandey, AI/ML Engineer",
    description: "Full record: AI/ML engineering roles, production GenAI work, talks, education, certifications and stack.",
    path: "/cv",
  })

  return (
    <MotionConfig reducedMotion="user">
    <main id="main-content" className="min-h-screen bg-background pt-6">
      <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Experience &amp; CV</h1>
        <p className="mt-2 text-muted-foreground">Remote AI/ML engineer. The full record behind the homepage.</p>
      </header>


      {/* Experience */}
      <section id="experience" className="py-10 md:py-16 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 2000px' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-3">
              <SectionIcon>
                <Briefcase className="w-5 h-5 text-primary" />
              </SectionIcon>
              {t.experience.title}
            </h2>
          </AnimatedSection>

          {/* Current divider */}
          <AnimatedSection delay={0.1} className="mb-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border divider-flow" />
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-success shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--success))] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--success))]" />
                </span>
                {t.experience.currentLabel}
              </span>
              <div className="h-px flex-1 bg-border divider-flow" />
            </div>
          </AnimatedSection>

          {/* Scopic Software LLC */}
          <AnimatedSection delay={0.1}>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                  <img src="/scopic_software_logo.webp" alt="Scopic Software" className="w-full h-full object-cover" width={40} height={40} loading="lazy" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{t.experience.santifer.company}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <a href="https://scopicsoftware.com/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-primary transition-colors">scopicsoftware.com</a>
                    <span className="text-border">·</span>
                    <span>{t.experience.santifer.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-primary font-medium mb-1">{t.experience.santifer.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.experience.santifer.period}</p>
              <ul className="text-[13px] leading-relaxed text-muted-foreground space-y-0.5 mb-5">
                {t.experience.santifer.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Trusted By - Tech Stack Logos */}
              <div className="pt-3 border-t border-border/40">
                <p className="text-[11px] text-muted-foreground/60 uppercase tracking-wider mb-3">{t.experience.santifer.trustedBy.label}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 md:gap-x-6">
                  {t.experience.santifer.trustedBy.logos.map((logo, i) => {
                    const techIcon = getTechIcon(logo.name)
                    return (
                      <div key={i} className="flex items-center gap-1.5 hover:opacity-90 transition-opacity duration-200">
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
                        <span className="text-xs font-medium opacity-60 dark:opacity-70">{logo.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Deep dive CTA */}
              {t.experience.santifer.caseStudyUrl && (
                <Link to={t.experience.santifer.caseStudyUrl} className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 group/cta">
                  <span className="inline-flex min-h-11 items-center px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 group-hover/cta:bg-primary/20 group-hover/cta:border-primary/50 transition-colors duration-200">{t.experience.santifer.caseStudyLabel}</span>
                </Link>
              )}
            </div>
          </AnimatedSection>

          {/* Scopic key projects — equal peer cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
            <AnimatedSection delay={0.1}>
              <div className="h-full p-5 rounded-2xl bg-card border border-primary/20 hover:border-primary/35 transition-colors duration-200 group flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <span className="badge px-2.5 py-0.5 bg-primary/10 text-primary text-[11px]">{t.experience.santifer.businessOS.badge}</span>
                </div>
                <h4 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">{t.experience.santifer.businessOS.title}</h4>
                <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{t.experience.santifer.businessOS.desc}</p>
                <ul className="text-[13px] text-muted-foreground space-y-1.5 leading-relaxed">
                  {t.experience.santifer.businessOS.modules.slice(0, 4).map((item, i) => {
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
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">{icons[item.icon]}</span>
                        <span>{item.text}</span>
                      </li>
                    )
                  })}
                </ul>
                {t.experience.santifer.caseStudyUrl && (
                  <Link to={t.experience.santifer.caseStudyUrl} className="inline-flex items-center gap-2 mt-auto pt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 group/cta">
                    <span className="inline-flex min-h-11 items-center px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 group-hover/cta:bg-primary/20 group-hover/cta:border-primary/50 transition-colors duration-200">{t.experience.santifer.businessOS.footer}</span>
                    <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                )}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="h-full p-5 rounded-2xl bg-card border border-primary/20 hover:border-primary/35 transition-colors duration-200 group flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <span className="badge px-2.5 py-0.5 bg-primary/10 text-primary text-[11px]">{t.experience.santifer.jacobo.badge}</span>
                </div>
                <h4 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">{t.experience.santifer.jacobo.title}</h4>
                <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{t.experience.santifer.jacobo.desc}</p>
                <ul className="text-[13px] text-muted-foreground space-y-1.5 leading-relaxed">
                  {t.experience.santifer.jacobo.items.slice(0, 4).map((item, i) => {
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
                    <span className="inline-flex min-h-11 items-center px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 group-hover/cta:bg-primary/20 group-hover/cta:border-primary/50 transition-colors duration-200">{t.experience.santifer.jacobo.soldWith}</span>
                    <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                )}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="h-full p-5 rounded-2xl bg-card border border-accent/30 hover:border-accent/45 transition-colors duration-200 group flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <span className="badge px-2.5 py-0.5 bg-accent/10 text-accent text-[11px]">{t.experience.santifer.webSeo.badge}</span>
                </div>
                <h4 className="font-display text-lg font-bold mb-2 group-hover:text-accent transition-colors">{t.experience.santifer.webSeo.title}</h4>
                <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{t.experience.santifer.webSeo.desc}</p>
                <ul className="text-[13px] text-muted-foreground space-y-1.5 leading-relaxed">
                  {t.experience.santifer.webSeo.items.slice(0, 3).map((item, i) => {
                    const icons: Record<string, React.ReactNode> = {
                      fileText: <FileText className="w-4 h-4" />,
                      image: <Layout className="w-4 h-4" />,
                      trendingUp: <TrendingUp className="w-4 h-4" />,
                      gitBranch: <Network className="w-4 h-4" />,
                    }
                    return (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent mt-0.5 shrink-0">{icons[item.icon]}</span>
                        <span>{item.text}</span>
                      </li>
                    )
                  })}
                </ul>
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
          <AnimatedSection delay={0.25} className="mb-10">
            <OtherContributions />
            </AnimatedSection>

          {/* Previous Experience divider */}
          <AnimatedSection delay={0.1} className="mt-12 mb-8">
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
                    <a href="https://peacenepal.com/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-primary transition-colors">peacenepal.com</a>
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
          <AnimatedSection delay={0.1} className="mt-12">
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
          <AnimatedSection delay={0.1} className="mt-12">
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
          <AnimatedSection delay={0.1} className="mt-12">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                  <img src="/imark-logo.webp" alt="iMark Private Limited" className="w-full h-full object-cover" width={40} height={40} loading="lazy" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{t.experience.imark.company}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <a href="https://www.imarkdigital.com/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-primary transition-colors">imarkdigital.com</a>
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
          <AnimatedSection delay={0.1} className="mt-12">
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

      {/* Sharing — Publications + LinkedIn */}
      <section id="speaking" className="py-12 md:py-20 bg-muted/30" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
                          onClick={() => posthog.capture('publication_link_clicked', { link_type: link.icon, label: link.label })}
                          className="inline-flex min-h-11 items-center gap-1.5 px-3 py-2 rounded-lg bg-accent/10 text-xs text-muted-foreground hover:text-accent hover:bg-accent/20 transition-colors"
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
                      onClick={() => posthog.capture('outbound_link_clicked', { destination: 'linkedin', placement: 'recommendation' })}
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
                        <a href={talk.pdf} download className="inline-flex min-h-11 items-center gap-2 text-xs text-primary hover:underline">
                          <Download className="w-4 h-4" />
                          {t.speaking.slides}
                        </a>
                      )}
                      {talk.materialUrl && (
                        <Link to={talk.materialUrl} className="inline-flex min-h-11 items-center gap-2 text-xs text-primary hover:underline">
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
              {t.linkedinPosts.embeds.map((post: { hook: string; reactions: string; comments: string; url: string; origin: string }, i: number) => (
                <AnimatedSection key={`li-${i}`} delay={0.25 + i * 0.1}>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => posthog.capture('outbound_link_clicked', { destination: 'linkedin', placement: 'linkedin_post', url: post.url, origin: post.origin })}
                    className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-[hsl(var(--linkedin))]/40 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[hsl(var(--linkedin))]/10 flex items-center justify-center shrink-0">
                        <LinkedInLogo className="w-5 h-5 text-[hsl(var(--linkedin))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1.5 font-medium">{post.origin}</p>
                        <p className="text-sm text-foreground leading-relaxed line-clamp-3">{post.hook}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 text-xs text-muted-foreground shrink-0 pl-13 sm:pl-0">
                      <span className="flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="sr-only">Reactions </span>
                        {post.reactions}
                      </span>
                      {post.comments !== '0' && (
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="sr-only">Comments </span>
                          {post.comments}
                        </span>
                      )}
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
                  {t.blog.items.slice(0, HOME_BLOG_PREVIEW_COUNT).map((post: { slug: string; title: string; date: string; summary: string; tags: readonly string[] }, i: number) => (
                    <AnimatedSection key={post.slug} delay={0.35 + i * 0.1}>
                      <Link
                        to={`/blog/${post.slug}`}
                        onClick={() => posthog.capture('blog_post_clicked', { slug: post.slug, placement: 'cv' })}
                        className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/40 hover:shadow-md transition-all group"
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
              {t.blog.items.length > HOME_BLOG_PREVIEW_COUNT && (
                <AnimatedSection delay={0.4}>
                  <div className="text-center mt-4">
                    <Link
                      to="/blog"
                      onClick={() => posthog.capture('blog_catalog_clicked', { placement: 'cv' })}
                      className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-full bg-accent/10 text-foreground font-medium text-sm hover:bg-accent/20 transition-colors"
                    >
                      <PenLine className="w-4 h-4" />
                      {t.blog.viewAll.replace('{count}', String(t.blog.items.length))}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </AnimatedSection>
              )}
            </>
          )}
        </div>
      </section>

      {/* Education & Certifications */}
      <section id="education" className="py-12 md:py-20" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1000px' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
                    ? { href: cert.url, target: '_blank', rel: 'noopener noreferrer' }
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
                  <span key={skill} className="px-3 py-1 rounded-full text-sm bg-accent/10 text-foreground border border-accent/20 hover:bg-accent/20 transition-colors cursor-default">
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
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {t.cta.title}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t.cta.desc}
              </p>
              <span className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/30">
                <MapPin className="w-3 h-3" />
                {t.cta.availability}
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
                <CalBookButton
                  placement="cv"
                  className="inline-flex items-center justify-center gap-2 min-h-11 w-full px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-sm font-medium shadow-lg hover:shadow-xl sm:w-auto"
                >
                  <Calendar className="w-5 h-5" />
                  {t.cta.bookCall}
                </CalBookButton>
                <a
                  href={`mailto:${t.email}`}
                  onClick={() => posthog.capture('contact_email_clicked', { placement: 'footer' })}
                  className="inline-flex items-center justify-center gap-2 min-h-11 w-full px-6 py-3 rounded-xl border border-border hover:border-primary/50 transition-colors duration-200 hover:bg-primary/5 text-sm break-all sm:w-auto sm:break-normal"
                >
                  <Mail className="w-4 h-4" />
                  {t.email}
                </a>
              </div>
              <nav aria-label="More ways to connect" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <a
                  href={t.linkedinPosts.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => posthog.capture('outbound_link_clicked', { destination: 'linkedin', placement: 'footer' })}
                  className="inline-flex items-center gap-1.5 min-h-11 hover:text-foreground transition-colors"
                >
                  <LinkedInLogo className="w-4 h-4" />
                  {t.cta.linkedin}
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/notsubash"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => posthog.capture('outbound_link_clicked', { destination: 'github', placement: 'footer' })}
                  className="inline-flex items-center gap-1.5 min-h-11 hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                {BLOG_ENABLED && (
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-1.5 min-h-11 hover:text-foreground transition-colors"
                  >
                    <PenLine className="w-4 h-4" />
                    Blog
                  </Link>
                )}
              </nav>
            </div>
          </AnimatedSection>

          <p className="mt-12 text-xs text-muted-foreground text-center pb-[env(safe-area-inset-bottom)]">
            &copy; {new Date().getFullYear()} Subash Pandey
            <span className="mx-2 text-border">|</span>
            {BLOG_ENABLED && (
              <>
                <Link to="/blog" className="inline-flex min-h-11 items-center hover:text-primary transition-colors">
                  Blog
                </Link>
                <span className="mx-2 text-border">|</span>
              </>
            )}
            <Link to="/notes" className="inline-flex min-h-11 items-center hover:text-primary transition-colors">
              Technical Notes
            </Link>
            <span className="mx-2 text-border">|</span>
            <Link to="/open-source" className="inline-flex min-h-11 items-center hover:text-primary transition-colors">
              Open Source
            </Link>
            <span className="mx-2 text-border">|</span>
            <Link to="/privacy" className="inline-flex min-h-11 items-center hover:text-primary transition-colors">
              Privacy
            </Link>
          </p>
        </div>
      </footer>

    </main>
    </MotionConfig>
  )
}

export default CvPage