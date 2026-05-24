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

function SkillRing({ pct, label, count, icon, color }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const offset = circ - (circ * pct) / 100

  return (
    <svg className="skill-ring-svg" viewBox="0 0 100 100" width="100" height="100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
      <motion.circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        transform="rotate(-90 50 50)" />
      <motion.text x="50" y="42" textAnchor="middle" fill="var(--text)"
        fontSize="18" fontWeight="700"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.6 }}>{pct}%</motion.text>
      <text x="50" y="58" textAnchor="middle" fill="var(--text-dim)" fontSize="8">{count} skills</text>
    </svg>
  )
}

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
    <div className="skills-dashboard">
      <div className="skills-ring-grid">
        {catsWithAvg.map((c, i) => {
          const isOpen = openSet.has(i)
          return (
            <motion.div key={i} className={`skill-ring-card${isOpen ? ' expanded' : ''}`}
              layout transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
              <button type="button" className="skill-ring-trigger"
                onClick={() => toggle(i)}
                aria-label={`${c.category}: ${c.avg}% proficiency. Click to ${isOpen ? 'collapse' : 'expand'} skills.`}>
                <SkillRing pct={c.avg} label={c.category} count={c.skills.length}
                  icon={c.icon} color={c.color} />
                <div className="skill-ring-label">
                  <i className={`fas ${c.icon}`} style={{ color: c.color }} />
                  <span>{c.category}</span>
                  <motion.i className="fas fa-chevron-down skill-ring-chevron"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div className="skill-ring-detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}>
                    <div className="skill-detail-inner"
                      style={{ borderTopColor: c.color }}>
                      {c.skills.map((s, j) => {
                        const pct = skillProgress[s] || 70
                        return (
                          <motion.div className="skill-detail-row" key={s}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.035 }}>
                            <div className="skill-detail-header">
                              <span className="skill-detail-name">{s}</span>
                              <span className="skill-detail-pct">{pct}%</span>
                            </div>
                            <div className="skill-detail-track">
                              <motion.div className="skill-detail-fill"
                                style={{ background: c.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, delay: j * 0.035, ease: 'easeOut' }} />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}