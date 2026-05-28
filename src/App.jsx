import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSkeleton from './components/LoadingSkeleton'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ScrollToTop from './components/ScrollToTop'
import ScrollProgressBar from './components/ScrollProgressBar'
import AnimatedBackground from './components/AnimatedBackground'
import Toast from './components/Toast'
import AdminPanel from './components/AdminPanel'
import CustomCursor from './components/CustomCursor'
import SoundEffects from './components/SoundEffects'
import PopupRenderer from './components/PopupRenderer'
import ThemeRenderer from './components/ThemeRenderer'

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
import CookieConsent from './components/CookieConsent'
const NewsletterSignup = lazy(() => import('./components/NewsletterSignup'))
import LiveChatWidget from './components/LiveChatWidget'
const GoogleMapsEmbed = lazy(() => import('./components/GoogleMapsEmbed'))
import AnalyticsDashboard from './components/AnalyticsDashboard'
import WhatsAppButton from './components/WhatsAppButton'
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

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [editedData, setEditedData] = useState(loadSaved)
  const [articleHashIdx, setArticleHashIdx] = useState(null)
  const articlesRef = useRef(editedData?.articles || defaultArticles)
  useEffect(() => { articlesRef.current = editedData?.articles || defaultArticles }, [editedData])

  useEffect(() => { trackVisit(); reportWebVitals() }, [])

  function parseArticleHash(hash) {
    const oldMatch = hash.match(/^#article-(\d+)$/)
    if (oldMatch) return parseInt(oldMatch[1])
    const newMatch = hash.match(/^#article\/(.+)$/)
    if (newMatch) {
      const slug = newMatch[1]
      const list = articlesRef.current
      const found = list.findIndex(a => a.slug === slug || slugify(a.title) === slug)
      return found >= 0 ? found : null
    }
    return null
  }

  useEffect(() => {
    setArticleHashIdx(parseArticleHash(window.location.hash))
    const onHashChange = () => {
      setArticleHashIdx(parseArticleHash(window.location.hash))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
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
    { key: 'articles', comp: <Articles articles={d?.articles} initialArticleIdx={articleHashIdx} onArticleOpened={(idx) => { if (idx < 0) setArticleHashIdx(null); else setArticleHashIdx(idx) }} /> },
    { key: 'portfolio-download', comp: <PortfolioDownload /> },
    { key: 'contact', comp: <SayHello /> },
    { key: 'map', comp: <GoogleMapsEmbed location={d?.personalData?.location} /> },
    { key: 'newsletter', comp: tools.newsletterEnabled !== false ? <NewsletterSignup /> : null },
  ].filter(s => s.comp && sec(s.key))
   .sort((a, b) => (sections[a.key]?.order ?? 99) - (sections[b.key]?.order ?? 99))

  return (
    <LangProvider>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <AnimatedBackground />
      <CustomCursor />
      <SoundEffects />
      <ScrollProgressBar />
      <Toast />
      <AdminPanel onDataChange={setEditedData} />
      <LiveChatWidget chatCode={tools.chatCode} />
      {headerTheme ? <ThemeRenderer theme={headerTheme} localData={d} /> : <Navbar activeSection={activeSection} setActiveSection={setActiveSection}
        projects={d?.projects} articles={d?.articles} />}
      {tools.cookieConsentEnabled !== false && <CookieConsent />}
      <main id="main-content">
        {sectionMap.map(s => (
          <ErrorBoundary key={s.key} fallbackMsg={`Section "${s.key}" failed to load.`}>
            <Suspense fallback={<LoadingSkeleton type={s.key === 'articles' ? 'article' : 'card'} count={1} />}>
              {s.comp}
            </Suspense>
          </ErrorBoundary>
        ))}
      </main>
      <WhatsAppButton personalData={d?.personalData} />
      <ScrollToTop />
      <AnalyticsDashboard />
      {footerTheme ? <ThemeRenderer theme={footerTheme} localData={d} /> : <Footer personalData={d?.personalData} />}
      {tools.googleAnalyticsId && (
        <script dangerouslySetInnerHTML={{
          __html: `(self.requestIdleCallback||setTimeout)(function(){var s=document.createElement('script');s.async=!0;s.src='https://www.googletagmanager.com/gtag/js?id=${tools.googleAnalyticsId}';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${tools.googleAnalyticsId}');});`
        }} />
      )}
      <PopupRenderer popups={popups} />
      {tools.facebookPixelId && (
        <script dangerouslySetInnerHTML={{
          __html: `(self.requestIdleCallback||setTimeout)(function(){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tools.facebookPixelId}');fbq('track','PageView');});`
        }} />
      )}
    </LangProvider>
  )
}

export default App