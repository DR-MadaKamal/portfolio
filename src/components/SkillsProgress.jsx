import { useState, useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { skillCategories as defaultSkills } from '../data/portfolioData'

const catColors = ['var(--accent)', '#48c6ef', '#f093fb', '#fa709a']

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.2, delay: i * 0.025, ease: 'easeOut' } }),
}

export default function SkillsProgress({ skillCategories: editedSkills }) {
  const cats = editedSkills || defaultSkills
  const [openSet, setOpenSet] = useState(new Set())
  const [heights, setHeights] = useState({})
  const innerRefs = useRef([])

  useLayoutEffect(() => {
    const h = {}
    cats.forEach((_, i) => {
      if (innerRefs.current[i]) {
        h[i] = innerRefs.current[i].scrollHeight + 8
      }
    })
    if (Object.keys(h).length > 0) setHeights(h)
  }, [cats])

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

            <motion.div className="skills-cat-body"
              layout
              initial={false}
              animate={{ height: isOpen ? (heights[i] || 400) : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.8 }}>
              <div ref={el => innerRefs.current[i] = el} className="skills-cat-inner">
                <ul className="skills-bullets">
                  {c.skills.map((s, j) => (
                    <motion.li key={s} className="skills-bullet"
                      variants={itemVariants}
                      initial="hidden"
                      animate={isOpen ? 'visible' : 'hidden'}
                      custom={j}>
                      <span className="skills-bullet-dot" style={{ background: catColors[i] }} />
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}