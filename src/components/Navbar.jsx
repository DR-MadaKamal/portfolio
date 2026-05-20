import { useState, useEffect } from 'react'
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

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo('home') }}>
          MK
        </a>

        <div className="nav-links">
          {links.map(l => (
            <button key={l} className={`nav-link${activeSection === l.toLowerCase() ? ' active' : ''}`} onClick={() => scrollTo(l.toLowerCase())}>
              {l}
            </button>
          ))}
          <button className="theme-btn nav-link" onClick={() => document.body.classList.toggle('light')} title="Toggle theme">
            <i className="fas fa-moon" />
          </button>
        </div>

        <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          <i className={`fas fa-${mobileOpen ? 'times' : 'bars'}`} />
        </button>

        {mobileOpen && (
          <div className="nav-mobile-menu">
            {links.map(l => (
              <button key={l} className="nav-mobile-link" onClick={() => scrollTo(l.toLowerCase())}>
                {l}
              </button>
            ))}
            <button className="nav-mobile-link" onClick={() => { document.body.classList.toggle('light'); setMobileOpen(false) }}>
              <i className="fas fa-moon" /> Theme
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
