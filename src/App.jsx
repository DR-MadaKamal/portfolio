import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'
import ScrollProgress from './components/ScrollProgress'

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : ''
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <>
      <ScrollProgress />
      <ThemeToggle theme={theme} toggle={toggleTheme} />
      <Navbar />
      <main>
        <div className="split-layout">
          <div className="split-sidebar">
            <About />
            <Education compact />
            <Skills compact />
          </div>
          <div className="split-main">
            <div className="timeline-line" />
            <Experience />
            <Projects />
            <Contact />
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}

export default App
