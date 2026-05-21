import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageToggle from './LanguageToggle'
import SearchBar from './SearchBar'
import { useLang } from '../context/LangContext'
import { projects as defaultProjects, articles as defaultArticles } from '../data/portfolioData'

export default function Navbar({ activeSection, setActiveSection }) {
  const { t } = useLang()
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
          <SearchBar articles={defaultArticles} projects={defaultProjects} />
          <LanguageToggle />
        </div>

        <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          <i className={`fas fa-${mobileOpen ? 'times' : 'bars'}`} />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="nav-mobile-menu" initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {links.map((l, i) => (
                <button key={i} className="nav-mobile-link" onClick={() => scrollTo(ids[i])}>{l}</button>
              ))}
              <div className="nav-mobile-link" style={{ justifyContent: 'center' }}>
                <LanguageToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
