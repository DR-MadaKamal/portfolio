import { motion } from 'framer-motion'
import { clientLogos } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { opacity: 0.75, y: 0, scale: 1, transition: { duration: 0.4 } }
}

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
          variants={containerVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
          {clientLogos.map((c, i) => (
            <motion.div key={i} className="client-logo-item" title={c.name}
              variants={itemVariants}
              whileHover={{ opacity: 1, scale: 1.15, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.95 }}>
              <img src={c.src} alt={c.name} loading="lazy" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
