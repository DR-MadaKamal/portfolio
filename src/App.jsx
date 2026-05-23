import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Articles from './components/Articles'
import Testimonials from './components/Testimonials'
import Achievements from './components/Achievements'
import QuoteRotator from './components/QuoteRotator'
import SayHello from './components/SayHello'
import ScrollToTop from './components/ScrollToTop'
import ScrollProgressBar from './components/ScrollProgressBar'
import AnimatedBackground from './components/AnimatedBackground'
import AdminPanel from './components/AdminPanel'
import WhatsAppButton from './components/WhatsAppButton'
import CustomCursor from './components/CustomCursor'
import SoundEffects from './components/SoundEffects'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import Footer from './components/Footer'
import ClientLogoWall from './components/ClientLogoWall'
import FAQSection from './components/FAQSection'
import ToolsShowcase from './components/ToolsShowcase'
import ServicesTimeline from './components/ServicesTimeline'
import SearchBar from './components/SearchBar'

import PortfolioDownload from './components/PortfolioDownload'
import CookieConsent from './components/CookieConsent'
import NewsletterSignup from './components/NewsletterSignup'

import ShareButtons from './components/ShareButtons'
import LiveChatWidget from './components/LiveChatWidget'
import GoogleMapsEmbed from './components/GoogleMapsEmbed'
import { LangProvider } from './context/LangContext'
import { personalData } from './data/portfolioData'

const STORAGE_KEY = 'portfolio-admin-data'
const VISITS_KEY = 'portfolio-visits'
const DAILY_KEY = 'portfolio-daily-visits'

function loadSaved() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null }
  catch { return null }
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

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [editedData, setEditedData] = useState(loadSaved)

  useEffect(() => { trackVisit() }, [])

  useEffect(() => {
    if (editedData?.settings?.theme) applyTheme(editedData.settings.theme)
  }, [editedData])

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

  const sectionMap = [
    { key: 'hero', comp: <Hero personalData={d?.personalData} /> },
    { key: 'about', comp: <About editedData={d} /> },

    { key: 'logos', comp: <ClientLogoWall clientLogos={d?.clientLogos} /> },
    { key: 'projects', comp: <Projects projects={d?.projects} /> },
    { key: 'testimonials', comp: <Testimonials testimonials={d?.testimonials} /> },

    { key: 'achievements', comp: <Achievements awards={d?.awards} certifications={d?.certifications} /> },
    { key: 'process', comp: <ServicesTimeline servicesTimeline={d?.servicesTimeline} /> },
    { key: 'quote', comp: <QuoteRotator quotes={d?.quotes} /> },
    { key: 'tools', comp: <ToolsShowcase tools={d?.tools} /> },
    { key: 'faq', comp: <FAQSection faq={d?.faq} /> },
    { key: 'articles', comp: <Articles articles={d?.articles} /> },
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
      <AdminPanel onDataChange={setEditedData} />
      <LiveChatWidget chatCode={tools.chatCode} />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection}
        projects={d?.projects} articles={d?.articles} />
      {tools.cookieConsentEnabled !== false && <CookieConsent />}
      <main id="main-content">
        {sectionMap.map(s => <span key={s.key}>{s.comp}</span>)}
      </main>
      <WhatsAppButton personalData={d?.personalData} />
      <ScrollToTop />
      <AnalyticsDashboard />
      <Footer personalData={d?.personalData} />
      {tools.googleAnalyticsId && (
        <script dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${tools.googleAnalyticsId}');`
        }} />
      )}
      {tools.facebookPixelId && (
        <script dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tools.facebookPixelId}');fbq('track','PageView');`
        }} />
      )}
    </LangProvider>
  )
}

export default App
