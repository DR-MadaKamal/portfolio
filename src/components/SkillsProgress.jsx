import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skillCategories as defaultSkills } from '../data/portfolioData'

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

  return (
    <div className="skills-grid">
      {cats.map((c, i) => {
        const isOpen = openSet.has(i)
        return (
          <div key={i} className={`skills-cat${isOpen ? ' open' : ''}`}>
            <button type="button" className="skills-cat-header"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}>
              <span className="skills-cat-icon" style={{ color: catColors[i] }}>
                <i className={`fas ${c.icon}`} />
              </span>
              <span className="skills-cat-info">
                <span className="skills-cat-name">{c.category}</span>
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
                    <ul className="skills-bullets">
                      {c.skills.map((s, j) => (
                        <motion.li key={s} className="skills-bullet"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.03 }}>
                          <span className="skills-bullet-dot" style={{ background: catColors[i] }} />
                          {s}
                        </motion.li>
                      ))}
                    </ul>
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