import { useEffect, useRef, useState } from 'react'
import { personalData } from '../data/portfolioData'

function useInView(ref) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.unobserve(el) }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
  return inView
}

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref)

  return (
    <section id="contact" className="section timeline-section" style={{ background: 'var(--secondary)' }}>
      <div className="container" ref={ref} style={{
        textAlign: 'center',
        maxWidth: '600px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <h2 className="section-title">Get In Touch</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '36px' }}>
          I'm currently open to freelance opportunities and full-time collaborations.
          Whether you have a project idea or just want to say hello — feel free to reach out!
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '36px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fas fa-envelope" style={{ color: 'var(--accent)', width: '20px' }} />
            <a href={`mailto:${personalData.email}`} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {personalData.email}
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fas fa-phone" style={{ color: 'var(--accent)', width: '20px' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{personalData.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fab fa-linkedin-in" style={{ color: 'var(--accent)', width: '20px' }} />
            <a href={`https://${personalData.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {personalData.linkedin}
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent)', width: '20px' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{personalData.location}</span>
          </div>
        </div>

        <a href={`mailto:${personalData.email}`} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '16px 36px',
          border: '2px solid var(--accent)',
          borderRadius: '8px',
          color: 'var(--accent)',
          fontWeight: 600,
          fontSize: '1rem',
          transition: 'all 0.3s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(100,255,218,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <i className="fas fa-paper-plane" /> Say Hello
        </a>
      </div>
    </section>
  )
}
