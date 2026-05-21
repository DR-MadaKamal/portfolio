import { useState } from 'react'
import { projects } from '../data/portfolioData'
import { motion, AnimatePresence } from 'framer-motion'
import TiltCard from './TiltCard'
import { useLang } from '../context/LangContext'

const container = { initial: {}, animate: { transition: { staggerChildren: 0.08 } } }
const cardAnim = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Projects({ projects: editedProjects }) {
  const { t } = useLang()
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const allProjects = editedProjects || projects
  const allTags = ['All', ...new Set(allProjects.flatMap(p => p.tags))]
  const filtered = filter === 'All' ? allProjects : allProjects.filter(p => p.tags.includes(filter))
  const featured = allProjects[0]

  const toggleExpand = (i) => setExpanded(expanded === i ? null : i)

  return (
    <section id="projects" className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>{t.projects.subtitle}</small>
            {t.projects.title}
          </h2>
        </motion.div>

        {/* Featured */}
        <motion.div className="featured-project" initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
          <div>
            <span className="featured-badge"><i className="fas fa-star" /> {t.projects.featured}</span>
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <div className="project-tags" style={{ marginBottom: 20 }}>
              {featured.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {featured.url && (
                <motion.a href={featured.url} target="_blank" rel="noopener noreferrer"
                  className="btn btn-sm btn-solid" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  {t.projects.live} <i className="fas fa-external-link-alt" />
                </motion.a>
              )}
              <motion.a href="mailto:16491@must.edu.eg" className="btn btn-sm"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <i className="fas fa-envelope" /> {t.projects.inquire}
              </motion.a>
            </div>
          </div>
          <motion.div className="featured-project-img" whileHover={{ scale: 1.02 }}>
            <img src="/portfolio/logo.png" alt={featured.title} loading="lazy" />
          </motion.div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div className="tab-filters" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {allTags.map(tag => (
            <button key={tag} className={`tab-filter${filter === tag ? ' active' : ''}`}
              onClick={() => setFilter(tag)}>{tag}</button>
          ))}
        </motion.div>

        {/* Project grid with tilt + case studies */}
        <motion.div className="projects-grid" variants={container} initial="initial" animate="animate" layout>
          <AnimatePresence mode="popLayout">
            {filtered.slice(1).map((p, i) => (
              <motion.div key={p.title} layout exit={{ opacity: 0, scale: 0.9 }}>
                <TiltCard>
                  <div className="project-card" onClick={() => toggleExpand(i)}
                    style={{ cursor: 'pointer' }}>
                    <div className="project-card-top">
                      <i className="fas fa-folder project-icon" />
                      <div className="project-card-links">
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noopener noreferrer" title="View project"
                            onClick={e => e.stopPropagation()}>
                            <i className="fas fa-external-link-alt" />
                          </a>
                        )}
                      </div>
                    </div>
                    <h3 className="project-card-title">{p.title}</h3>
                    <p className="project-card-desc">{expanded === i && p.challenge ? (
                      <><strong style={{ color: 'var(--accent)' }}>Challenge:</strong> {p.challenge}<br/>
                      <strong style={{ color: 'var(--accent)' }}>Solution:</strong> {p.solution}<br/>
                      <strong style={{ color: 'var(--accent)' }}>Result:</strong> {p.result}</>
                    ) : p.description}</p>
                    <div className="project-tags">
                      {p.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
                    </div>
                    <span className="project-expand-hint" style={{ marginTop: 10, fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      <i className={`fas fa-chevron-${expanded === i ? 'up' : 'down'}`} /> {expanded === i ? 'Show less' : 'Case study'}
                    </span>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
