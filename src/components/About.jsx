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

function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <FadeInSection>
          <h2 className="section-title">About Me</h2>
        </FadeInSection>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
        }} className="about-grid">
          <FadeInSection delay={0.1}>
            <div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
                {personalData.summary}
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                Based in <strong style={{ color: 'var(--text-primary)' }}>{personalData.location}</strong>, I bring over a decade of experience spanning healthcare, creative direction, and digital marketing — helping brands grow through strategic, data-driven campaigns.
              </p>
              <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
                <div>
                  <span style={{ fontSize: '2rem', fontWeight: 700, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10+</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Years Experience</p>
                </div>
                <div>
                  <span style={{ fontSize: '2rem', fontWeight: 700, background: 'var(--gradient-2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>50+</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Projects Delivered</p>
                </div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              margin: '0 auto',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                border: '2px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(100,255,218,0.08), rgba(72,198,239,0.08))',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <img
                  src="/portfolio/photo.png"
                  alt="Mohammed Kamal Shaat"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '14px',
                  }}
                />
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  )
}
