import { projects } from '../data/portfolioData'

export default function Projects() {
  const [featured, ...rest] = projects

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">
          <small>My Work</small>
          Projects
        </h2>

        {featured && (
          <div className="featured-project">
            <div>
              <small style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 500 }}>Featured Project</small>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
              <div className="project-tags">
                {featured.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
              </div>
              {featured.url && (
                <a href={featured.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                  Visit Project <i className="fas fa-external-link-alt" />
                </a>
              )}
            </div>
            <div className="featured-project-img">
              <img src="/portfolio/logo.png" alt={featured.title} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            </div>
          </div>
        )}

        <div className="projects-grid">
          {rest.map((p, i) => (
            <div key={i} className="project-card flex flex-col">
              <i className="fas fa-folder project-icon" style={{ fontSize: '1.6rem', color: 'var(--accent)', opacity: 0.4, marginBottom: 10 }} />
              <h3>
                {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer">{p.title}</a> : p.title}
              </h3>
              <p>{p.description}</p>
              <div className="project-tags">
                {p.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
              </div>
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 'auto' }}>
                  <i className="fas fa-external-link-alt" /> Visit
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
