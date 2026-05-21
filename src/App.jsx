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
import AnimatedBackground from './components/AnimatedBackground'
import AdminPanel from './components/AdminPanel'
import WhatsAppButton from './components/WhatsAppButton'
import CustomCursor from './components/CustomCursor'
import SoundEffects from './components/SoundEffects'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import Footer from './components/Footer'
import { LangProvider } from './context/LangContext'

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

  const sections = editedData?.settings?.sections || {}
  const sec = (key) => sections[key]?.visible !== false

  const sectionMap = [
    { key: 'hero', comp: <Hero personalData={editedData?.personalData} /> },
    { key: 'about', comp: <About editedData={editedData} /> },
    { key: 'projects', comp: <Projects projects={editedData?.projects} /> },
    { key: 'testimonials', comp: <Testimonials /> },
    { key: 'achievements', comp: <Achievements /> },
    { key: 'quote', comp: <QuoteRotator /> },
    { key: 'articles', comp: <Articles articles={editedData?.articles} /> },
    { key: 'contact', comp: <SayHello /> },
  ].filter(s => sec(s.key))
   .sort((a, b) => (sections[a.key]?.order ?? 99) - (sections[b.key]?.order ?? 99))

  return (
    <LangProvider>
      <AnimatedBackground />
      <CustomCursor />
      <SoundEffects />
      <AdminPanel onDataChange={setEditedData} />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        {sectionMap.map(s => <span key={s.key}>{s.comp}</span>)}
      </main>
      <WhatsAppButton />
      <ScrollToTop />
      <AnalyticsDashboard />
      <Footer personalData={editedData?.personalData} />
    </LangProvider>
  )
}

export default App
