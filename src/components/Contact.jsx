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
        maxWidth: '550px',
        textAlign: 'center',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(15px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Get In Touch</h2>
        <p className="timeline-card-text" style={{ marginBottom: '28px', fontSize: '0.92rem' }}>
          I'm currently open to freelance opportunities and full-time collaborations.
          Whether you have a project idea or just want to say hello — feel free to reach out!
        </p>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: '12px',
          alignItems: 'center', marginBottom: '28px',
          padding: '24px', borderRadius: '12px',
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        }}>
          {[
            { icon: 'fa-envelope', text: personalData.email, href: `mailto:${personalData.email}` },
            { icon: 'fa-phone', text: personalData.phone, href: `tel:${personalData.phone}` },
            { icon: 'fab fa-linkedin-in', text: 'linkedin.com/in/mohammedkamal-shaat', href: `https://${personalData.linkedin}` },
            { icon: 'fas fa-map-marker-alt', text: personalData.location },
          ].map((item, i) => (
            <div key={i} className="sidebar-contact-row" style={{ fontSize: '0.85rem', justifyContent: 'center' }}>
              <i className={item.icon} />
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">{item.text}</a>
              ) : (
                <span>{item.text}</span>
              )}
            </div>
          ))}
        </div>

        <a href={`mailto:${personalData.email}`} className="sidebar-cta" style={{ display: 'inline-flex', width: 'auto', padding: '14px 36px', fontSize: '0.9rem' }}>
          <i className="fas fa-paper-plane" /> Say Hello
        </a>
      </div>
    </section>
  )
}
