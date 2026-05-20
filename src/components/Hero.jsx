import { useEffect, useState } from 'react'
import { personalData } from '../data/portfolioData'

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(100,255,218,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,107,107,0.04) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{
        position: 'relative',
        zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <p style={{
          color: 'var(--accent)',
          fontSize: '0.95rem',
          fontWeight: 500,
          marginBottom: '12px',
          letterSpacing: '2px',
        }}>
          Hi, my name is
        </p>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '8px',
        }}>
          {personalData.firstName}{' '}
          <span style={{ background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {personalData.lastName}
          </span>
        </h1>
        <h2 style={{
          fontSize: 'clamp(1.2rem, 3vw, 2rem)',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '24px',
        }}>
          {personalData.title}
        </h2>
        <p style={{
          color: 'var(--accent)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          marginBottom: '20px',
          opacity: 0.8,
        }}>
          <i className="fas fa-quote-left" style={{ marginRight: '8px', opacity: 0.4 }} />
          {personalData.tagline}
        </p>
        <p style={{
          maxWidth: '540px',
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          lineHeight: 1.8,
          marginBottom: '36px',
        }}>
          {personalData.summary}
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="#contact" onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            border: '2px solid var(--accent)',
            borderRadius: '8px',
            color: 'var(--accent)',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(100,255,218,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <i className="fas fa-envelope" /> Get In Touch
          </a>
          <a href="#experience" onClick={e => { e.preventDefault(); document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' }) }} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            border: '2px solid var(--text-muted)',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <i className="fas fa-briefcase" /> See Experience
          </a>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          marginTop: '48px',
          alignItems: 'center',
        }}>
          <a href={`https://${personalData.linkedin}`} target="_blank" rel="noopener noreferrer" style={{
            color: 'var(--text-secondary)',
            fontSize: '1.3rem',
            transition: 'color 0.3s ease, transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <i className="fab fa-linkedin-in" />
          </a>
          <a href={`mailto:${personalData.email}`} style={{
            color: 'var(--text-secondary)',
            fontSize: '1.3rem',
            transition: 'color 0.3s ease, transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <i className="fas fa-envelope" />
          </a>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{personalData.location}</span>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        right: '5%',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 'clamp(6rem, 20vw, 16rem)',
        fontWeight: 900,
        color: 'rgba(100,255,218,0.03)',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        textAlign: 'right',
      }}>
        {personalData.firstName}<br />{personalData.lastName.split(' ')[0]}
      </div>
    </section>
  )
}
