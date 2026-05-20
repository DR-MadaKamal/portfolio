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
    <div ref={ref} className="project-card" style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
    }}>
      <div className="project-icon">
        <i className="fas fa-folder-open" />
      </div>
      <h3 className="project-card-title">
        {project.url ? (
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            {project.title} <i className="fas fa-external-link-alt" style={{ fontSize: '0.75rem', marginLeft: '4px' }} />
          </a>
        ) : project.title}
      </h3>
      <p className="project-card-desc">{project.description}</p>
      <div>
        {project.tags.map((tag, i) => (
          <span key={i} className="project-tag">#{tag}</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {projects.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}
