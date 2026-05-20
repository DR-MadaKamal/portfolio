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
              <div className="date">{exp.period}</div>
              {exp.highlights.length > 0 && (
                <ul>
                  {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                </ul>
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
