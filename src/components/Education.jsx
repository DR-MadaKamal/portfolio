import { useEffect, useRef, useState } from 'react'
import { education, courses, languages } from '../data/portfolioData'

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

function Card({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      padding: '24px',
      borderRadius: '12px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
    }}>
      {children}
    </div>
  )
}

export default function Education() {
  return (
    <section id="education" className="section timeline-section">
      <div className="container">
        <h2 className="section-title">Education & Credentials</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }} className="edu-grid">
          <Card delay={0.1}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--accent)' }}>
              <i className="fas fa-graduation-cap" style={{ marginRight: '8px' }} />
              Education
            </h3>
            {education.map((e, i) => (
              <div key={i}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.degree}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{e.school}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{e.year} | {e.location}</p>
              </div>
            ))}
          </Card>

          <Card delay={0.2}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--accent)' }}>
              <i className="fas fa-language" style={{ marginRight: '8px' }} />
              Languages
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500 }}>{l.language}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{l.level}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ marginTop: '36px' }}>
          <Card delay={0.3}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', color: 'var(--accent)' }}>
              <i className="fas fa-certificate" style={{ marginRight: '8px' }} />
              Courses & Certifications
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
            }}>
              {courses.map((c, i) => (
                <div key={i} style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--primary)',
                  border: '1px solid var(--card-border)',
                }}>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{c.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.provider} • {c.year}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
