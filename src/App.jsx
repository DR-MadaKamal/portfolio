import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Articles from './components/Articles'
import SayHello from './components/SayHello'
import ScrollToTop from './components/ScrollToTop'
import AnimatedBackground from './components/AnimatedBackground'
import AdminPanel from './components/AdminPanel'
import Footer from './components/Footer'

const STORAGE_KEY = 'portfolio-admin-data'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [editedData, setEditedData] = useState(loadSaved)

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved === 'light') document.body.classList.add('light')
  }, [])

  useEffect(() => {
    const isLight = document.body.classList.contains('light')
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark')
  })

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
    <>
      <AnimatedBackground />
      <AdminPanel onDataChange={setEditedData} />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        <Hero personalData={editedData?.personalData} />
        <About editedData={editedData} />
        <Projects projects={editedData?.projects} />
        <Articles articles={editedData?.articles} />
        <SayHello />
      </main>
      <ScrollToTop />
      <Footer personalData={editedData?.personalData} />
    </>
  )
}

export default App
