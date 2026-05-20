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
    <div ref={ref} className="timeline-card" style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-16px)',
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
      marginBottom: '14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '6px', alignItems: 'flex-start' }}>
        <div>
          <h3 className="timeline-card-title">{exp.role}</h3>
          <p className="timeline-card-sub">{exp.company}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
          <span className="period-badge"><i className="far fa-calendar-alt" /> {exp.period}</span>
          {exp.location && <span className="timeline-card-meta">{exp.location}</span>}
        </div>
      </div>
      {exp.highlights.length > 0 && (
        <ul className="timeline-card-list">
          {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
      {exp.link && (
        <a href={exp.link.url} target="_blank" rel="noopener noreferrer" className="timeline-badge" style={{ marginTop: '8px' }}>
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
    <section id="experience" className="section timeline-section" style={{ background: 'var(--secondary)' }}>
      <div className="container">
        <h2 className="section-title">Experience</h2>

        <div className="tab-filters">
          {['all', ...roles].filter(Boolean).map(role => (
            <button
              key={role}
              onClick={() => setActiveTab(role)}
              className={`tab-filter${activeTab === role ? ' active' : ''}`}
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
