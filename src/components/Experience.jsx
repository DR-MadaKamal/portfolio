import { useEffect, useRef, useState } from 'react'
import { experience } from '../data/portfolioData'

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

function ExpItem({ exp, index }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-30px)',
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
      padding: '24px',
      borderRadius: '12px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      marginBottom: '20px',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{exp.role}</h3>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500 }}>{exp.company}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>{exp.period}</span>
          {exp.location && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{exp.location}</span>}
        </div>
      </div>
      {exp.highlights.length > 0 && (
        <ul style={{ marginTop: '12px', paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
      {exp.link && (
        <a href={exp.link.url} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '12px',
          fontSize: '0.85rem',
          color: 'var(--accent)',
        }}>
          <i className="fas fa-external-link-alt" /> {exp.link.label}
        </a>
      )}
    </div>
  )
}

export default function Experience() {
  const [activeTab, setActiveTab] = useState('all')
  const roles = [...new Set(experience.map(e => {
    if (e.role.includes('Marketing') || e.role.includes('Creative') || e.role.includes('Motion')) return 'Marketing'
    if (e.role.includes('Pharmacy') || e.role.includes('Pharmacist') || e.role.includes('Pharmacy')) return 'Pharmacy'
    return 'Other'
  }))]

  const filtered = activeTab === 'all' ? experience : experience.filter(e => {
    const cat = e.role.includes('Marketing') || e.role.includes('Creative') || e.role.includes('Motion') ? 'Marketing' : 'Pharmacy'
    return cat === activeTab
  })

  return (
    <section id="experience" className="section" style={{ background: 'var(--secondary)' }}>
      <div className="container">
        <h2 className="section-title">Experience</h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {['all', ...roles].filter(Boolean).map(role => (
            <button
              key={role}
              onClick={() => setActiveTab(role)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: activeTab === role ? '2px solid var(--accent)' : '2px solid var(--card-border)',
                background: activeTab === role ? 'rgba(100,255,218,0.1)' : 'transparent',
                color: activeTab === role ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize',
              }}
            >
              {role === 'all' ? 'All' : role}
            </button>
          ))}
        </div>

        {filtered.map((exp, i) => <ExpItem key={i} exp={exp} index={i} />)}
      </div>
    </section>
  )
}
