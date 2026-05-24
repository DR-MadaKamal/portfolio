import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skillCategories as defaultSkills } from '../data/portfolioData'

const skillProgress = {
  'Pharmacy Operations & Inventory Control': 90, 'Team Leadership': 85,
  'Pharmaceutical Knowledge': 95, 'HCPs Targeting': 92,
  'Medical Content Creation & Copywriting': 88, 'Omnichannel Marketing Strategy': 85,
  'Product Launch & Lifecycle Management': 82, 'Market Research & Competitor Analysis': 80,
  'Clinical Data Interpretation': 88, 'Rx & OTC Product Knowledge': 95,
  'Patient Journey Mapping': 85, 'Healthcare Regulatory Compliance': 85,
  'Full-Stack Marketing': 90, 'SEO': 82, 'Social Media Strategy': 88,
  'Budget Allocation': 80, 'Customer Acquisition': 85, 'Website Development': 78,
  'Paid Advertisements': 85, 'Brand Strategy & Identity': 90,
  'Motion Graphics': 88, 'Video Editing': 85, 'UI/Web Development': 78,
  'AI Image Generation & Refinement': 82, 'Cross-Functional Team Leadership': 85,
  'Budget Allocation & ROI Optimization': 85, 'CRM Management & Customer Acquisition': 80,
  'Strategic Planning & Data Analytics': 82,
}

const catColors = ['var(--accent)', '#48c6ef', '#f093fb', '#fa709a']

export default function SkillsProgress({ skillCategories: editedSkills }) {
  const cats = editedSkills || defaultSkills
  const [openSet, setOpenSet] = useState(new Set())

  const toggle = (i) => {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  const catsWithAvg = useMemo(() =>
    cats.map((c, i) => {
      const pcts = c.skills.map(s => skillProgress[s] || 70)
      const avg = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
      return { ...c, avg, color: catColors[i] }
    }), [cats])

  return (
    <div className="skills-grid">
      {catsWithAvg.map((c, i) => {
        const isOpen = openSet.has(i)
        return (
          <div key={i} className={`skills-cat${isOpen ? ' open' : ''}`}>
            <button type="button" className="skills-cat-header"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}>
              <span className="skills-cat-icon" style={{ color: c.color }}>
                <i className={`fas ${c.icon}`} />
              </span>
              <span className="skills-cat-info">
                <span className="skills-cat-name">{c.category}</span>
                <span className="skills-cat-avg">{c.avg}%</span>
              </span>
              <span className="skills-cat-count">{c.skills.length} skills</span>
              <i className={`fas fa-chevron-down skills-chevron${isOpen ? ' open' : ''}`} />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div className="skills-cat-body"
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  <div className="skills-cat-inner">
                    {c.skills.map((s, j) => {
                      const pct = skillProgress[s] || 70
                      return (
                        <div key={s} className="skills-row"
                          style={{ animationDelay: `${j * 35}ms` }}>
                          <div className="skills-row-top">
                            <span className="skills-row-name">{s}</span>
                            <span className="skills-row-pct">{pct}%</span>
                          </div>
                          <div className="skills-row-track">
                            <motion.div className="skills-row-fill"
                              style={{ background: c.color, width: `${pct}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, delay: j * 0.035 }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}