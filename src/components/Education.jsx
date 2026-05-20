import { useEffect, useRef, useState } from 'react'
import { education, courses, languages } from '../data/portfolioData'

function SidebarBlock({ title, icon, children }) {
  return (
    <div className="sidebar-section" style={{ marginTop: '12px' }}>
      <p className="sidebar-label"><i className={`fas ${icon}`} /> {title}</p>
      {children}
    </div>
  )
}

function CompactEducation() {
  return (
    <>
      <div className="sidebar-divider" />
      <SidebarBlock title="Education" icon="fa-graduation-cap">
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{e.degree}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>{e.school}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{e.year} | {e.location}</div>
          </div>
        ))}
      </SidebarBlock>

      <SidebarBlock title="Languages" icon="fa-language">
        {languages.map((l, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: '0.72rem' }}>
            <span style={{ fontWeight: 500 }}>{l.language}</span>
            <span style={{ color: 'var(--text-muted)' }}>{l.level}</span>
          </div>
        ))}
      </SidebarBlock>

      <SidebarBlock title="Courses" icon="fa-certificate">
        {courses.slice(0, 5).map((c, i) => (
          <div key={i} style={{ padding: '3px 0', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 500 }}>{c.name}</span>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.62rem' }}>{c.provider} • {c.year}</span>
          </div>
        ))}
        {courses.length > 5 && (
          <div style={{ fontSize: '0.65rem', color: 'var(--accent)', marginTop: '4px' }}>
            +{courses.length - 5} more
          </div>
        )}
      </SidebarBlock>
    </>
  )
}

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
    <div ref={ref} className="timeline-card" style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

export default function Education({ compact }) {
  if (compact) return <CompactEducation />

  return (
    <section id="education" className="section timeline-section">
      <div className="container">
        <h2 className="section-title">Education & Credentials</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="edu-grid">
          <Card delay={0.1}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '14px', color: 'var(--accent)' }}>
              <i className="fas fa-graduation-cap" style={{ marginRight: '8px' }} />
              Education
            </p>
            {education.map((e, i) => (
              <div key={i}>
                <p className="timeline-card-title" style={{ fontSize: '0.95rem' }}>{e.degree}</p>
                <p className="timeline-card-sub" style={{ fontSize: '0.8rem' }}>{e.school}</p>
                <p className="timeline-card-meta">{e.year} | {e.location}</p>
              </div>
            ))}
          </Card>

          <Card delay={0.2}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '14px', color: 'var(--accent)' }}>
              <i className="fas fa-language" style={{ marginRight: '8px' }} />
              Languages
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>{l.language}</span>
                  <span className="timeline-card-meta">{l.level}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ marginTop: '24px' }}>
          <Card delay={0.3}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px', color: 'var(--accent)' }}>
              <i className="fas fa-certificate" style={{ marginRight: '8px' }} />
              Courses & Certifications
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {courses.map((c, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--primary)',
                  border: '1px solid var(--card-border)',
                  transition: 'border-color 0.3s ease',
                }}
                  className="course-item"
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
                >
                  <p style={{ fontWeight: 500, fontSize: '0.82rem' }}>{c.name}</p>
                  <p className="timeline-card-meta">{c.provider} • {c.year}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
