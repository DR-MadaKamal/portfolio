import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { caseStudies as defaultStudies } from '../data/portfolioData'

export default function CaseStudies({ caseStudies: editedStudies }) {
  const cases = editedStudies || defaultStudies
  const [openId, setOpenId] = useState(null)

  return (
    <section id="case-studies" className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>Proven Results</small>
            Case Studies
          </h2>
        </motion.div>

        <div className="cases-grid">
          {cases.map((cs, i) => {
            const isOpen = openId === cs.id
            return (
              <motion.div key={cs.id} className={`case-card${isOpen ? ' open' : ''}`}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <button type="button" className="case-header"
                  onClick={() => setOpenId(isOpen ? null : cs.id)}
                  aria-expanded={isOpen}>
                  <div className="case-header-top">
                    <span className="case-tag">{cs.industry}</span>
                    <span className="case-role">{cs.role}</span>
                  </div>
                  <h3 className="case-title">{cs.title}</h3>
                  <div className="case-metrics-row">
                    {Object.entries(cs.metrics).map(([key, val]) => (
                      <div key={key} className="case-metric-chip">
                        <span className="case-metric-val">{val}</span>
                        <span className="case-metric-label">{key}</span>
                      </div>
                    ))}
                  </div>
                  <div className="case-header-bottom">
                    <span className="case-client">{cs.client}</span>
                    <i className={`fas fa-chevron-down case-chevron${isOpen ? ' open' : ''}`} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div className="case-body"
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}>
                      <div className="case-body-inner">
                        <div className="case-section">
                          <h4><i className="fas fa-exclamation-triangle" /> The Challenge</h4>
                          <p>{cs.challenge}</p>
                        </div>
                        <div className="case-section">
                          <h4><i className="fas fa-tools" /> The Solution</h4>
                          <p>{cs.solution}</p>
                        </div>
                        <div className="case-section">
                          <h4><i className="fas fa-trophy" /> The Results</h4>
                          <ul className="case-results">
                            {cs.results.map((r, j) => (
                              <motion.li key={j}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.06 }}>
                                <i className="fas fa-check-circle" /> {r}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        {cs.tags && cs.tags.length > 0 && (
                          <div className="case-tags">
                            {cs.tags.map(t => <span key={t} className="tag">{t}</span>)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}