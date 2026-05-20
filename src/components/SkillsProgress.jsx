import { motion } from 'framer-motion'
import { skillCategories } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

const skillProgress = {
  'Pharmacy Operations & Inventory Control': 90,
  'Team Leadership': 85,
  'Pharmaceutical Knowledge': 95,
  'HCPs Targeting': 92,
  'Medical Content Creation & Copywriting': 88,
  'Omnichannel Marketing Strategy': 85,
  'Product Launch & Lifecycle Management': 82,
  'Market Research & Competitor Analysis': 80,
  'Clinical Data Interpretation': 88,
  'Rx & OTC Product Knowledge': 95,
  'Patient Journey Mapping': 85,
  'Healthcare Regulatory Compliance': 85,
  'Full-Stack Marketing': 90,
  'SEO': 82,
  'Social Media Strategy': 88,
  'Budget Allocation': 80,
  'Customer Acquisition': 85,
  'Website Development': 78,
  'Paid Advertisements': 85,
  'Brand Strategy & Identity': 90,
  'Motion Graphics': 88,
  'Video Editing': 85,
  'UI/Web Development': 78,
  'AI Image Generation & Refinement': 82,
  'Cross-Functional Team Leadership': 85,
  'Budget Allocation & ROI Optimization': 85,
  'CRM Management & Customer Acquisition': 80,
  'Strategic Planning & Data Analytics': 82,
}

export default function SkillsProgress() {
  const { t } = useLang()

  return (
    <div className="skills-progress-section">
      <h3 className="about-card-title" style={{ marginBottom: 20 }}>
        <i className="fas fa-chart-bar" style={{ color: 'var(--accent)', marginRight: 8 }} />
        {t.skills}
      </h3>
      {skillCategories.map((cat, i) => (
        <div key={i} className="skill-cat-progress" style={{ marginBottom: 16 }}>
          <p className="skill-cat-label"><i className={`fas ${cat.icon}`} style={{ marginRight: 6, color: 'var(--accent)' }} /> {cat.category}</p>
          {cat.skills.map((s, j) => (
            <div key={j} className="skill-bar-row">
              <span className="skill-bar-name">{s}</span>
              <div className="skill-bar-track">
                <motion.div
                  className="skill-bar-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skillProgress[s] || 70}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: j * 0.05, ease: 'easeOut' }}
                />
              </div>
              <span className="skill-bar-pct">{skillProgress[s] || 70}%</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
