import { motion } from 'framer-motion'
import { personalData as defaultPersonal, skillCategories as defaultSkills, experience as defaultExp, education as defaultEdu } from '../data/portfolioData'
import AnimatedCounter from './AnimatedCounter'
import SkillsProgress from './SkillsProgress'
import { useLang } from '../context/LangContext'

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5 } }
const stagger = { initial: {}, whileInView: { transition: { staggerChildren: 0.06 } }, viewport: { once: true, margin: '-60px' } }
const childUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0, transition: { duration: 0.4 } }, viewport: { once: true } }

export default function About({ editedData }) {
  const personalData = editedData?.personalData || defaultPersonal
  const skillCategories = editedData?.skillCategories || defaultSkills
  const experience = editedData?.experience || defaultExp
  const education = editedData?.education || defaultEdu
  const { t } = useLang()

  return (
    <section id="about" className="section">
      <div className="container">
        <motion.div {...fadeUp}>
          <h2 className="section-title">
            <small>{t.about.subtitle}</small>
            {t.about.title}
          </h2>
        </motion.div>

        <div className="about-education-grid">
          {/* Left — About */}
          <motion.div className="about-card" {...fadeUp}>
            <motion.div className="about-stats" variants={stagger} initial="initial" whileInView="whileInView">
              {[
                { num: 10, suffix: '+', label: 'Years Exp.' },
                { num: 50, suffix: '+', label: 'Projects' },
                { num: 15, suffix: '+', label: 'Clients' },
                { num: 9, suffix: '+', label: 'Brands' },
              ].map((s, i) => (
                <motion.div key={i} className="about-stat" variants={childUp}>
                  <div className="about-stat-num"><AnimatedCounter end={s.num} suffix={s.suffix} duration={2} /></div>
                  <div className="about-stat-label">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
            <motion.p {...fadeUp}>{personalData.summary}</motion.p>
          </motion.div>

          {/* Right — Education */}
          <motion.div className="about-card" {...fadeUp}>
            <h3 className="about-card-title">
              <i className="fas fa-graduation-cap" style={{ color: 'var(--accent)', marginRight: 8 }} />
              {t.about.education}
            </h3>
            {education.map((edu, i) => (
              <motion.div key={i} className="edu-item"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                <div className="edu-icon"><i className="fas fa-university" /></div>
                <div>
                  <h4>{edu.degree}</h4>
                  <p className="edu-school">{edu.school}</p>
                  <span className="timeline-period">{edu.year}</span>
                </div>
              </motion.div>
            ))}
            <hr className="edu-divider" />
            <motion.div className="domain-bridge" {...fadeUp}>
              <div className="domain-side">
                <i className="fas fa-mortar-pestle" />
                <span>Pharmacy</span>
                <small>Clinical precision, HCP insights, regulatory mastery</small>
              </div>
              <div className="domain-connector">
                <span className="domain-plus">+</span>
                <div className="domain-line" />
                <span className="domain-equals">=</span>
              </div>
              <div className="domain-side">
                <i className="fas fa-chart-simple" />
                <span>Marketing</span>
                <small>Brand strategy, performance campaigns, creative direction</small>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Skills with progress bars */}
        <motion.div {...fadeUp} style={{ marginTop: 60 }}>
          <h2 className="section-title" style={{ marginBottom: 32 }}>
            <small>{t.about.expertise}</small>
            {t.about.skills}
          </h2>
          <SkillsProgress />
        </motion.div>

        {/* Experience */}
        <motion.div {...fadeUp} style={{ marginTop: 80 }}>
          <h2 className="section-title">
            <small>{t.experience.subtitle}</small>
            {t.experience.title}
          </h2>
          <div className="timeline" style={{ maxWidth: 700, margin: '0 auto' }}>
            {experience.map((exp, i) => (
              <motion.div key={i} className="timeline-item"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <span className="timeline-dot" />
                <div className="timeline-item-inner">
                  <div className="timeline-item-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {exp.logo ? (
                        <img src={exp.logo} alt={exp.company} loading="lazy"
                          style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain', background: 'var(--bg)', border: '1px solid var(--border)', padding: 4 }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--accent)', fontSize: '1rem' }}>
                          <i className="fas fa-mortar-pestle" />
                        </div>
                      )}
                      <div>
                        <h3>{exp.role}</h3>
                        <div className="meta" style={{ margin: 0 }}>
                          <i className="fas fa-building" style={{ marginRight: 4, fontSize: '0.7rem' }} />
                          {exp.company}
                        </div>
                      </div>
                    </div>
                    <span className="timeline-period">{exp.period}</span>
                  </div>
                  {exp.location && <div className="meta" style={{ marginTop: 2, fontSize: '0.78rem' }}><i className="fas fa-map-marker-alt" style={{ marginRight: 4, fontSize: '0.65rem' }} />{exp.location}</div>}
                  {exp.highlights.length > 0 && (
                    <ul>{exp.highlights.map((h, j) => <li key={j}>{h}</li>)}</ul>
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
                            {m.image && <img src={m.image} alt={m.title} className="media-thumb" loading="lazy" />}
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>{m.title}</strong>
                              {m.description ? ` — ${m.description}` : ''}
                            </div>
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
      </div>
    </section>
  )
}
