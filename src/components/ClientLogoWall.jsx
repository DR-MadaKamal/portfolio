import { motion } from 'framer-motion'
import { clientLogos } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

export default function ClientLogoWall() {
  const { t } = useLang()
  return (
    <section className="section clients-section">
      <div className="container">
        <motion.h2 className="section-title"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <small>{t.about.subtitle}</small>Trusted By
        </motion.h2>
        <motion.div className="client-logos"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {clientLogos.map((c, i) => (
            <div key={i} className="client-logo-item" title={c.name}>
              <img src={c.src} alt={c.name} loading="lazy" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
