import { motion } from 'framer-motion'
import { personalData, skillCategories, experience, education } from '../data/portfolioData'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.06 } },
  viewport: { once: true, margin: '-60px' },
}

const childUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  viewport: { once: true },
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <motion.div {...fadeUp}>
          <h2 className="section-title">
            <small>Get To Know More</small>
            About Me
          </h2>
        </motion.div>

        <motion.div className="about-content" style={{ margin: '0 auto' }} {...fadeUp}>
          <motion.div className="about-stats" style={{ justifyContent: 'center' }} variants={stagger} initial="initial" whileInView="whileInView">
            {[
              { num: '10+', label: 'Years Exp.' },
              { num: '50+', label: 'Projects' },
              { num: '15+', label: 'Clients' },
              { num: '9+', label: 'Brands' },
            ].map((s, i) => (
              <motion.div key={i} className="about-stat" variants={childUp}>
                <div className="about-stat-num">{s.num}</div>
                <div className="about-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.p {...fadeUp}>{personalData.summary}</motion.p>
        </motion.div>

        {/* Skills */}
        <motion.div {...fadeUp} style={{ marginTop: 60 }}>
          <h2 className="section-title">
            <small>My Expertise</small>
            Skills
          </h2>
          <motion.div className="skills-section" variants={stagger} initial="initial" whileInView="whileInView">
            {skillCategories.map((cat, i) => (
              <motion.div key={i} className="skill-card" variants={childUp} whileHover={{ y: -4 }}>
                <div className="skill-card-header">
                  <i className={`fas ${cat.icon}`} />
                  <h3>{cat.category}</h3>
                </div>
                <div className="skill-card-body">
                  {cat.skills.map((s, j) => (
                    <span key={j} className="tag">{s}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Experience */}
        <motion.div {...fadeUp} style={{ marginTop: 80 }}>
          <h2 className="section-title">
            <small>My Journey</small>
            Experience
          </h2>
          <div className="timeline" style={{ maxWidth: 700, margin: '0 auto' }}>
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span className="timeline-dot" />
                <div className="timeline-item-inner">
                  <div className="timeline-item-header">
                    <h3>{exp.role}</h3>
                    <span className="timeline-period">{exp.period}</span>
                  </div>
                  <div className="meta">
                    <i className="fas fa-building" style={{ marginRight: 4, fontSize: '0.7rem' }} />
                    {exp.company}
                    {exp.location ? ` | ${exp.location}` : ''}
                  </div>
                  {exp.highlights.length > 0 && (
                    <ul>
                      {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                    </ul>
                  )}
                  {exp.links && exp.links.length > 0 && (
                    <div className="timeline-links">
                      {exp.links.map((l, j) => (
                        <a key={j} href={l.url} target="_blank" rel="noopener noreferrer">
                          <i className="fas fa-external-link-alt" /> {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                  {exp.media && exp.media.length > 0 && (
                    <details>
                      <summary><i className="fas fa-folder-open" /> Selected work ({exp.media.length})</summary>
                      <div className="timeline-media">
                        {exp.media.map((m, j) => (
                          <div key={j} className="timeline-media-item">
                            <strong style={{ color: 'var(--accent)' }}>{m.title}</strong>
                            {m.description ? ` — ${m.description}` : ''}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div {...fadeUp} style={{ marginTop: 80 }}>
          <h2 className="section-title">
            <small>My Education</small>
            Education
          </h2>
          <div className="timeline" style={{ maxWidth: 700, margin: '0 auto' }}>
            {education.map((edu, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <span className="timeline-dot" />
                <div className="timeline-item-inner">
                  <h3>{edu.degree}</h3>
                  <div className="meta">
                    <i className="fas fa-graduation-cap" style={{ marginRight: 4, fontSize: '0.7rem' }} />
                    {edu.school} — {edu.year}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
