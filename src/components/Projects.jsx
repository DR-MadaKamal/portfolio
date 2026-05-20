import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/portfolioData'

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

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const inView = useInView(ref)

  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
      padding: '28px',
      borderRadius: '12px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ marginBottom: '16px' }}>
        <i className="fas fa-folder" style={{ fontSize: '2rem', color: 'var(--accent)', opacity: 0.6 }} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '10px' }}>
        {project.url ? (
          <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', transition: 'color 0.3s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            {project.title} <i className="fas fa-external-link-alt" style={{ fontSize: '0.8rem', marginLeft: '4px' }} />
          </a>
        ) : project.title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '16px' }}>
        {project.description}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {project.tags.map((tag, i) => (
          <span key={i} style={{
            fontSize: '0.75rem',
            color: 'var(--accent)',
            fontFamily: 'monospace',
          }}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section timeline-section">
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {projects.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}
