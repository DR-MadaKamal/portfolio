import { motion } from 'framer-motion'
import { awards as defaultAwards, certifications as defaultCerts } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

export default function Achievements({ awards: editedAwards, certifications: editedCerts }) {
  const awards = editedAwards || defaultAwards
  const certifications = editedCerts || defaultCerts
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

        <h3 className="section-subtitle" style={{ marginTop: 60, marginBottom: 32 }}>
          <i className="fas fa-certificate" style={{ marginRight: 8, color: 'var(--accent)' }} />
          Licenses &amp; Certifications
        </h3>
        <div className="certs-grid">
          {certifications.map((c, i) => (
            <motion.div
              key={i} className="cert-item"
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
            >
              <i className={`fas ${c.icon}`} />
              <div>
                <strong>{c.title}</strong>
                <span>{c.issuer} &middot; {c.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
