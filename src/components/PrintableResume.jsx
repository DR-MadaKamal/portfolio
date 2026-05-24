import { personalData, experience, education, skillCategories, certifications } from '../data/portfolioData'

export default function PrintableResume() {
  const d = personalData

  return (
    <section className="section" id="resume">
      <div className="resume-actions">
        <button className="resume-print-btn" onClick={() => window.print()}>
          <i className="fas fa-download" /> Download / Print Resume
        </button>
      </div>

      <div className="resume-page">
        <header className="resume-header">
          <h1>{d.firstName} {d.lastName}</h1>
          <p className="resume-title">{d.title}</p>
          <div className="resume-contact">
            <span><i className="fas fa-envelope" /> {d.email}</span>
            <span><i className="fas fa-phone" /> {d.phone}</span>
            <span><i className="fas fa-map-marker-alt" /> {d.location}</span>
            <span><i className="fab fa-linkedin" /> {d.linkedin}</span>
          </div>
        </header>

        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p>{d.summary}</p>
        </section>

        <section className="resume-section">
          <h2>Experience</h2>
          {(experience || []).map((exp, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-head">
                <h3>{exp.role}</h3>
                <span className="resume-entry-date">{exp.period}</span>
              </div>
              <p className="resume-entry-org">{exp.company} — {exp.location}</p>
              <ul className="resume-entry-details">
                {(exp.highlights || []).map((det, j) => <li key={j}>{det}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Education</h2>
          {(education || []).map((edu, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-head">
                <h3>{edu.degree}</h3>
                <span className="resume-entry-date">{edu.year}</span>
              </div>
              <p className="resume-entry-org">{edu.school} — {edu.location}</p>
              {edu.details && <p className="resume-entry-detail">{edu.details}</p>}
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Skills</h2>
          <div className="resume-skills-grid">
            {skillCategories.map(c => (
              <div key={c.category} className="resume-skills-cat">
                <h3>{c.category}</h3>
                <ul>
                  {c.skills.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h2>Certifications</h2>
          {(certifications || []).map((cert, i) => (
            <div key={i} className="resume-entry">
              <h3>{cert.title}</h3>
              {cert.issuer && <p className="resume-entry-org">{cert.issuer} — {cert.year}</p>}
            </div>
          ))}
        </section>
      </div>
    </section>
  )
}