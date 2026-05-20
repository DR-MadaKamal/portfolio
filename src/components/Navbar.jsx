import { useState, useEffect } from 'react'

const links = [
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const logoHref = '#experience'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href={logoHref} onClick={e => handleClick(e, logoHref)} className="nav-logo">
          <img src="/portfolio/logo.png" alt="MKS" />
        </a>

        <div className="nav-links">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={e => handleClick(e, l.href)} className="nav-link">
              {l.label}
            </a>
          ))}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="nav-mobile-btn">
            <i className={`fas fa-${menuOpen ? 'times' : 'bars'}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={e => handleClick(e, l.href)} className="nav-mobile-link">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
