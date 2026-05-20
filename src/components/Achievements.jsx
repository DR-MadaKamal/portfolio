import { motion } from 'framer-motion'
import { awards } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

export default function Achievements() {
  const { t } = useLang()

  return (
    <section id="achievements" className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>{t.awards.subtitle}</small>
            {t.awards.title}
          </h2>
        </motion.div>
        <div className="awards-ribbon">
          {awards.map((a, i) => (
            <motion.div
              key={i} className="award-item"
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <i className={`fas ${a.icon}`} />
              <div>
                <strong>{a.title}</strong>
                <span>{a.issuer} &middot; {a.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
