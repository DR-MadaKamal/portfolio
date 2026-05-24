import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageToggle from './LanguageToggle'
import SearchBar from './SearchBar'
import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar({ activeSection, setActiveSection, projects, articles }) {
  const { t } = useLang()
  const { theme, toggle: toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const scrollTo = (id) => {
    setActiveSection(id)
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const links = [t.nav.home, t.nav.about, t.nav.projects, t.nav.articles]
  const ids = ['home', 'about', 'projects', 'articles']

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo('home') }}>
          MK
        </a>

        <div className="nav-links">
          {links.map((l, i) => (
            <button key={i} className={`nav-link${activeSection === ids[i] ? ' active' : ''}`}
              onClick={() => scrollTo(ids[i])}>{l}</button>
          ))}
          <SearchBar articles={articles} projects={projects} />
          <LanguageToggle />
          <button className="nav-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`} />
          </button>
        </div>

        <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <i className={`fas fa-${mobileOpen ? 'times' : 'bars'}`} />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="nav-mobile-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}>
              <motion.div className="nav-mobile-sheet"
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                onClick={(e) => e.stopPropagation()}>
                <div className="nav-mobile-handle" />
                {links.map((l, i) => (
                  <motion.button key={i} className={`nav-mobile-link${activeSection === ids[i] ? ' active' : ''}`}
                    onClick={() => scrollTo(ids[i])}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <span className="nav-mobile-dot" />
                    {l}
                  </motion.button>
                ))}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <LanguageToggle />
                  <button className="nav-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                    <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}