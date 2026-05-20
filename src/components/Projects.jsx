import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects as defaultProjects } from '../data/portfolioData'

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
}

const cardAnim = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Projects({ projects: editedProjects }) {
  const projects = editedProjects || defaultProjects
  const [filter, setFilter] = useState('All')
  const allTags = ['All', ...new Set(projects.flatMap(p => p.tags))]
  const filtered = filter === 'All' ? projects : projects.filter(p => p.tags.includes(filter))
  const featured = projects[0]

  return (
    <section id="projects" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">
            <small>My Work</small>
            Featured Projects
          </h2>
        </motion.div>

        {/* Featured */}
        <motion.div
          className="featured-project"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="featured-badge"><i className="fas fa-star" /> Featured</span>
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <div className="project-tags" style={{ marginBottom: 20 }}>
              {featured.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {featured.url && (
                <motion.a
                  href={featured.url} target="_blank" rel="noopener noreferrer"
                  className="btn btn-sm btn-solid"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                >
                  Live Demo <i className="fas fa-external-link-alt" />
                </motion.a>
              )}
              <motion.a
                href={`mailto:16491@must.edu.eg`}
                className="btn btn-sm"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              >
                <i className="fas fa-envelope" /> Inquire
              </motion.a>
            </div>
          </div>
          <motion.div
            className="featured-project-img"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img src="/portfolio/logo.png" alt={featured.title} />
          </motion.div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="tab-filters"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tab-filter${filter === tag ? ' active' : ''}`}
              onClick={() => setFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div
          className="projects-grid"
          variants={container}
          initial="initial"
          animate="animate"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.slice(1).map((p, i) => (
              <motion.div
                key={p.title}
                className="project-card"
                variants={cardAnim}
                layout
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="project-card-top">
                  <i className="fas fa-folder project-icon" />
                  <div className="project-card-links">
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" title="View project">
                        <i className="fas fa-external-link-alt" />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="project-card-title">{p.title}</h3>
                <p className="project-card-desc">{p.description}</p>
                <div className="project-tags">
                  {p.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
