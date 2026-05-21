import { motion } from 'framer-motion'
import { marketingServices } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function MarketingServices() {
  const { t } = useLang()
  return (
    <section className="section services-section">
      <div className="container">
        <motion.h2 className="section-title"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <small>{t.services.subtitle}</small>{t.services.title}
        </motion.h2>
        <motion.div className="services-grid"
          variants={containerVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
          {marketingServices.map((s, i) => (
            <motion.div key={i} className="service-card" variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}>
              <div className="service-icon"><i className={`fas ${s.icon}`} /></div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div style={{ textAlign: 'center', marginTop: 40 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <a href="mailto:16491@must.edu.eg" className="btn btn-solid">{t.services.cta}</a>
        </motion.div>
      </div>
    </section>
  )
}