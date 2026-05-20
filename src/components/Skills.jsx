import { useEffect, useRef, useState } from 'react'
import { skillCategories } from '../data/portfolioData'

function CompactSkills() {
  return (
    <>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <p className="sidebar-label"><i className="fas fa-cogs" /> Skills</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {skillCategories.flatMap(cat => cat.skills).map((skill, i) => (
            <span key={i} className="skill-tag" style={{ fontSize: '0.62rem', padding: '3px 8px' }}>{skill}</span>
          ))}
        </div>
      </div>
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

function SkillCard({ cat, index }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <div ref={ref} className="timeline-card" style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'rgba(100,255,218,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent)', fontSize: '0.95rem', flexShrink: 0,
        }}>
          <i className={`fas ${cat.icon}`} />
        </div>
        <h3 className="timeline-card-title">{cat.category}</h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {cat.skills.map((skill, i) => (
          <span key={i} className="skill-tag">{skill}</span>
        ))}
      </div>
    </div>
  )
}

export default function Skills({ compact }) {
  if (compact) return <CompactSkills />

  return (
    <section id="skills" className="section timeline-section" style={{ background: 'var(--secondary)' }}>
      <div className="container">
        <h2 className="section-title">Skills & Expertise</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {skillCategories.map((cat, i) => <SkillCard key={i} cat={cat} index={i} />)}
        </div>
      </div>
    </section>
  )
}
