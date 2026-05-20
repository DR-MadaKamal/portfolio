import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Articles from './components/Articles'
import Testimonials from './components/Testimonials'
import Achievements from './components/Achievements'
import PricingTable from './components/PricingTable'
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

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [editedData, setEditedData] = useState(loadSaved)

  useEffect(() => { trackVisit() }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id)
      })
    }, { rootMargin: '-40% 0px -55% 0px' })
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <LangProvider>
      <AnimatedBackground />
      <CustomCursor />
      <SoundEffects />
      <AdminPanel onDataChange={setEditedData} />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        <Hero personalData={editedData?.personalData} />
        <About editedData={editedData} />
        <Projects projects={editedData?.projects} />
        <Testimonials />
        <Achievements />
        <PricingTable />
        <QuoteRotator />
        <Articles articles={editedData?.articles} />
        <SayHello />
      </main>
      <WhatsAppButton />
      <ScrollToTop />
      <AnalyticsDashboard />
      <Footer personalData={editedData?.personalData} />
    </LangProvider>
  )
}

export default App
