import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSkeleton from './components/LoadingSkeleton'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

const About = lazy(() => import('./components/About'))
const Projects = lazy(() => import('./components/Projects'))
const Articles = lazy(() => import('./components/Articles'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const Achievements = lazy(() => import('./components/Achievements'))
const SayHello = lazy(() => import('./components/SayHello'))
const Footer = lazy(() => import('./components/Footer'))
const ClientLogoWall = lazy(() => import('./components/ClientLogoWall'))
const FAQSection = lazy(() => import('./components/FAQSection'))
const ToolsShowcase = lazy(() => import('./components/ToolsShowcase'))
const ServicesTimeline = lazy(() => import('./components/ServicesTimeline'))
const CaseStudies = lazy(() => import('./components/CaseStudies'))
const PortfolioGallery = lazy(() => import('./components/PortfolioGallery'))
const PortfolioDownload = lazy(() => import('./components/PortfolioDownload'))
const NewsletterSignup = lazy(() => import('./components/NewsletterSignup'))
const GoogleMapsEmbed = lazy(() => import('./components/GoogleMapsEmbed'))
const ScrollToTop = lazy(() => import('./components/ScrollToTop'))
const ScrollProgressBar = lazy(() => import('./components/ScrollProgressBar'))
const AnimatedBackground = lazy(() => import('./components/AnimatedBackground'))
const Toast = lazy(() => import('./components/Toast'))
const AdminPanel = lazy(() => import('./components/AdminPanel'))
const CustomCursor = lazy(() => import('./components/CustomCursor'))
const SoundEffects = lazy(() => import('./components/SoundEffects'))
const PopupRenderer = lazy(() => import('./components/PopupRenderer'))
const ThemeRenderer = lazy(() => import('./components/ThemeRenderer'))
const CookieConsent = lazy(() => import('./components/CookieConsent'))
const LiveChatWidget = lazy(() => import('./components/LiveChatWidget'))
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'))
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton'))
import { LangProvider } from './context/LangContext'
import { personalData as defaultPersonalData, experience as defaultExperience, skillCategories as defaultSkills, education as defaultEducation, awards as defaultAwards, certifications as defaultCerts, projects as defaultProjects, articles as defaultArticles, testimonials as defaultTestimonials, quotes as defaultQuotes, tools as defaultToolsData, clientLogos as defaultLogos, servicesTimeline as defaultTimeline, faq as defaultFaq, courses as defaultCourses, portfolioWorks as defaultWorks, pricingPlans as defaultPricing, caseStudies as defaultCaseStudies, languagesList as defaultLanguages, businessHours as defaultHours } from './data/portfolioData'
import { slugify } from './utils/slugify'
import { reportWebVitals } from './utils/webVitals'

const STORAGE_KEY = 'portfolio-admin-data'
const VISITS_KEY = 'portfolio-visits'
const DAILY_KEY = 'portfolio-daily-visits'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    return {
      personalData: { ...defaultPersonalData, ...(saved.personalData || {}) },
      experience: saved.experience || defaultExperience,
      skillCategories: saved.skillCategories || defaultSkills,
      education: saved.education || defaultEducation,
      awards: saved.awards || defaultAwards,
      certifications: saved.certifications || defaultCerts,
      projects: saved.projects || defaultProjects,
      articles: saved.articles || defaultArticles,
      testimonials: saved.testimonials || defaultTestimonials,
      quotes: saved.quotes || defaultQuotes,
      tools: saved.tools || defaultToolsData,
      clientLogos: saved.clientLogos || defaultLogos,
      servicesTimeline: saved.servicesTimeline || defaultTimeline,
      faq: saved.faq || defaultFaq,
      courses: saved.courses || defaultCourses,
      portfolioWorks: saved.portfolioWorks || defaultWorks,
      pricingPlans: saved.pricingPlans || defaultPricing,
      caseStudies: saved.caseStudies || defaultCaseStudies,
      languagesList: saved.languagesList || defaultLanguages,
      businessHours: saved.businessHours || defaultHours,
      settings: saved.settings,
      customSections: saved.customSections || [],
      customPages: saved.customPages || [],
      sectionDesign: saved.sectionDesign || {},
      builder: saved.builder,
    }
  } catch { return null }
}

function trackVisit() {
  try {
    const total = parseInt(localStorage.getItem(VISITS_KEY) || '0')
    localStorage.setItem(VISITS_KEY, String(total + 1))
    const todayStr = new Date().toDateString()
    const daily = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}')
    daily[todayStr] = (daily[todayStr] || 0) + 1
    localStorage.setItem(DAILY_KEY, JSON.stringify(daily))
  } catch {}
}

function applyTheme(theme) {
  if (!theme) return
  const root = document.documentElement
  const map = { accent:'--accent', accent2:'--accent2', bg:'--bg', bgAlt:'--bg-alt', text:'--text', textSecondary:'--text-secondary', textDim:'--text-dim', textMuted:'--text-muted', border:'--border' }
  Object.entries(map).forEach(([key, cssVar]) => {
    if (theme[key]) root.style.setProperty(cssVar, theme[key])
  })
}

function renderSearchConsoleMeta(metaContent) {
  if (!metaContent) return
  let el = document.querySelector('meta[name="google-site-verification"]')
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', 'google-site-verification'); document.head.appendChild(el) }
  el.setAttribute('content', metaContent)
}

const BASE_PATH = '/portfolio'

function parseArticlePath(pathname) {
  const p = pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) : pathname
  const cleaned = p.replace(/\/+$/, '')
  const match = cleaned.match(/^\/article\/([^/]+)$/)
  if (match) {
    const slug = match[1]
    const list = articlesRef.current
    const found = list.findIndex(a => a.slug === slug || slugify(a.title) === slug)
    return found >= 0 ? found : null
  }
  return null
}

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [editedData, setEditedData] = useState(loadSaved)
  const [articlePathIdx, setArticlePathIdx] = useState(null)
  const articlesRef = useRef(editedData?.articles || defaultArticles)
  useEffect(() => { articlesRef.current = editedData?.articles || defaultArticles }, [editedData])

  useEffect(() => { trackVisit(); reportWebVitals() }, [])

  useEffect(() => {
    setArticlePathIdx(parseArticlePath(window.location.pathname))
    const onPopState = () => {
      setArticlePathIdx(parseArticlePath(window.location.pathname))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id)
      })
    }, { rootMargin: '-40% 0px -55% 0px' })
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const d = editedData
  const sections = d?.settings?.sections || {}
  const tools = d?.settings?.tools || {}
  const sec = (key) => sections[key]?.visible !== false
  const themes = d?.builder?.themes || {}
  const headerTheme = themes.header?.rows?.length ? themes.header : null
  const footerTheme = themes.footer?.rows?.length ? themes.footer : null
  const popups = d?.builder?.popups || []

  const sectionMap = [
    { key: 'hero', comp: <Hero personalData={d?.personalData} quotes={d?.quotes} /> },
    { key: 'about', comp: <About editedData={d} /> },

    { key: 'logos', comp: <ClientLogoWall clientLogos={d?.clientLogos} /> },
    { key: 'projects', comp: <Projects projects={d?.projects} /> },
    { key: 'portfolio-gallery', comp: <PortfolioGallery works={d?.portfolioWorks} /> },
    { key: 'case-studies', comp: <CaseStudies caseStudies={d?.caseStudies} /> },
    { key: 'testimonials', comp: <Testimonials testimonials={d?.testimonials} /> },

    { key: 'achievements', comp: <Achievements awards={d?.awards} certifications={d?.certifications} /> },
    { key: 'process', comp: <ServicesTimeline servicesTimeline={d?.servicesTimeline} /> },
    { key: 'tools', comp: <ToolsShowcase tools={d?.tools} /> },
    { key: 'faq', comp: <FAQSection faq={d?.faq} /> },
    { key: 'articles', comp: <Articles articles={d?.articles} initialArticleIdx={articlePathIdx} onArticleOpened={(idx) => { if (idx < 0) setArticlePathIdx(null); else setArticlePathIdx(idx) }} /> },
    { key: 'portfolio-download', comp: <PortfolioDownload /> },
    { key: 'contact', comp: <SayHello /> },
    { key: 'map', comp: <GoogleMapsEmbed location={d?.personalData?.location} /> },
    { key: 'newsletter', comp: tools.newsletterEnabled !== false ? <NewsletterSignup /> : null },
  ].filter(s => s.comp && sec(s.key))
   .sort((a, b) => (sections[a.key]?.order ?? 99) - (sections[b.key]?.order ?? 99))

  return (
    <LangProvider>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Suspense fallback={null}><AnimatedBackground /></Suspense>
      <Suspense fallback={null}><CustomCursor /></Suspense>
      <Suspense fallback={null}><SoundEffects /></Suspense>
      <Suspense fallback={null}><ScrollProgressBar /></Suspense>
      <Suspense fallback={null}><Toast /></Suspense>
      <Suspense fallback={null}><AdminPanel onDataChange={setEditedData} /></Suspense>
      <Suspense fallback={null}><LiveChatWidget chatCode={tools.chatCode} /></Suspense>
      {headerTheme ? <Suspense fallback={null}><ThemeRenderer theme={headerTheme} localData={d} /></Suspense> : <Navbar activeSection={activeSection} setActiveSection={setActiveSection}
        projects={d?.projects} articles={d?.articles} />}
      {tools.cookieConsentEnabled !== false && <Suspense fallback={null}><CookieConsent /></Suspense>}
      <main id="main-content">
        {sectionMap.map(s => (
          <ErrorBoundary key={s.key} fallbackMsg={`Section "${s.key}" failed to load.`}>
            <Suspense fallback={<LoadingSkeleton type={s.key === 'articles' ? 'article' : 'card'} count={1} />}>
              {s.comp}
            </Suspense>
          </ErrorBoundary>
        ))}
      </main>
      <Suspense fallback={null}><WhatsAppButton personalData={d?.personalData} /></Suspense>
      <Suspense fallback={null}><ScrollToTop /></Suspense>
      <Suspense fallback={null}><AnalyticsDashboard /></Suspense>
      {footerTheme ? <Suspense fallback={null}><ThemeRenderer theme={footerTheme} localData={d} /></Suspense> : <Footer personalData={d?.personalData} />}
      {tools.googleAnalyticsId && (
        <script dangerouslySetInnerHTML={{
          __html: `(self.requestIdleCallback||setTimeout)(function(){var s=document.createElement('script');s.async=!0;s.src='https://www.googletagmanager.com/gtag/js?id=${tools.googleAnalyticsId}';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${tools.googleAnalyticsId}');});`
        }} />
      )}
      <Suspense fallback={null}><PopupRenderer popups={popups} /></Suspense>
      {tools.facebookPixelId && (
        <script dangerouslySetInnerHTML={{
          __html: `(self.requestIdleCallback||setTimeout)(function(){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tools.facebookPixelId}');fbq('track','PageView');});`
        }} />
      )}
    </LangProvider>
  )
}

export default App