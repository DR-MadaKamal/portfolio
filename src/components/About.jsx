import { personalData, skillCategories, experience, education } from '../data/portfolioData'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">
          <small>Get To Know More</small>
          About Me
        </h2>

        <div className="about-content" style={{ margin: '0 auto' }}>
          <div className="about-stats" style={{ justifyContent: 'center' }}>
            <div className="about-stat">
              <div className="about-stat-num">10+</div>
              <div className="about-stat-label">Years Experience</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">50+</div>
              <div className="about-stat-label">Projects</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">15+</div>
              <div className="about-stat-label">Clients</div>
            </div>
          </div>

          <p>{personalData.summary}</p>

          <div className="skills-grid">
            {skillCategories.flatMap(c => c.skills).map((s, i) => (
              <span key={i} className="tag">{s}</span>
            ))}
          </div>
        </div>

        <h2 className="section-title" style={{ marginTop: '80px' }}>
          <small>My Journey</small>
          Experience
        </h2>

          <div className="timeline" style={{ maxWidth: '650px', margin: '0 auto' }}>
            {experience.map((exp, i) => (
              <div key={i} className="timeline-item">
                <h3>{exp.role}</h3>
                <div className="meta">{exp.company}</div>
                <div className="date">{exp.period}{exp.location ? ` | ${exp.location}` : ''}</div>
                {exp.highlights.length > 0 && (
                  <ul>
                    {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                  </ul>
                )}
                {exp.links && exp.links.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {exp.links.map((l, j) => (
                      <a key={j} href={l.url} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--accent)', fontSize: '0.82rem' }}>
                        <i className="fas fa-external-link-alt" style={{ marginRight: 4 }} />
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
                {exp.media && exp.media.length > 0 && (
                  <details>
                    <summary>
                      <i className="fas fa-folder-open" style={{ marginRight: 4 }} />
                      Selected work ({exp.media.length})
                    </summary>
                    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {exp.media.map((m, j) => (
                        <div key={j} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <strong style={{ color: 'var(--accent)' }}>{m.title}</strong>
                          {m.description ? ` — ${m.description}` : ''}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>

        <h2 className="section-title" style={{ marginTop: '80px' }}>
          <small>My Education</small>
          Education
        </h2>

        <div className="timeline" style={{ maxWidth: '650px', margin: '0 auto' }}>
          {education.map((edu, i) => (
            <div key={i} className="timeline-item">
              <h3>{edu.degree}</h3>
              <div className="meta">{edu.school}</div>
              <div className="date">{edu.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
