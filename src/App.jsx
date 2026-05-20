import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Articles from './components/Articles'
import SayHello from './components/SayHello'
import ScrollToTop from './components/ScrollToTop'
import AnimatedBackground from './components/AnimatedBackground'
import Footer from './components/Footer'

function App() {
  const [activeSection, setActiveSection] = useState('home')

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
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Articles />
        <SayHello />
      </main>
      <ScrollToTop />
      <Footer />
    </>
  )
}

export default App
