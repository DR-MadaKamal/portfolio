import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { personalData } from '../data/portfolioData'

const links = ['Home', 'About', 'Projects', 'Articles']

export default function Navbar({ activeSection, setActiveSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setActiveSection(id)
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleTheme = () => {
    document.body.classList.toggle('light')
  }

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo('home') }}>
          MK
        </a>

        <div className="nav-links">
          {links.map(l => (
            <button
              key={l}
              className={`nav-link${activeSection === l.toLowerCase() ? ' active' : ''}`}
              onClick={() => scrollTo(l.toLowerCase())}
            >
              {l}
            </button>
          ))}
          <button className="nav-link theme-btn" onClick={toggleTheme} title="Toggle theme">
            <i className="fas fa-moon" />
          </button>
        </div>

        <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          <i className={`fas fa-${mobileOpen ? 'times' : 'bars'}`} />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="nav-mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {links.map(l => (
                <button key={l} className="nav-mobile-link" onClick={() => scrollTo(l.toLowerCase())}>
                  {l}
                </button>
              ))}
              <button className="nav-mobile-link" onClick={() => { toggleTheme(); setMobileOpen(false) }}>
                <i className="fas fa-moon" /> Theme
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
