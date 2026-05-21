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
          {clientLogos.map((c, i) => {
            const isFeatured = ['Vape City','Flavow Store','Vapsy','Ahmed Samy','Adonis'].includes(c.name)
            const content = (
              <motion.div className={`client-logo-item${isFeatured ? ' featured' : ''}`} title={c.name}
                variants={itemVariants}
                whileHover={{ opacity: 1, scale: isFeatured ? 1.2 : 1.15, y: -4, transition: { duration: 0.25 } }}
                whileTap={{ scale: 0.95 }}>
                <div className="client-logo-glow" />
                <img src={c.src} alt={c.name} loading="lazy" />
              </motion.div>
            )
            return c.link ? (
              <a key={i} href={c.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a>
            ) : (
              <span key={i}>{content}</span>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
