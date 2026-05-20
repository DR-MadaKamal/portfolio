import { useEffect, useRef, useState } from 'react'
import { skillCategories } from '../data/portfolioData'

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
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
      padding: '24px',
      borderRadius: '12px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'rgba(100,255,218,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
          fontSize: '1.1rem',
        }}>
          <i className={`fas ${cat.icon}`} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{cat.category}</h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {cat.skills.map((skill, i) => (
          <span key={i} style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            background: 'rgba(100,255,218,0.06)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--card-border)',
            transition: 'all 0.3s ease',
            cursor: 'default',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(100,255,218,0.12)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(100,255,218,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--card-border)' }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section timeline-section" style={{ background: 'var(--secondary)' }}>
      <div className="container">
        <h2 className="section-title">Skills & Expertise</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {skillCategories.map((cat, i) => <SkillCard key={i} cat={cat} index={i} />)}
        </div>
      </div>
    </section>
  )
}
