import { motion } from 'framer-motion'
import { personalData } from '../data/portfolioData'

export default function SayHello() {
  return (
    <section className="sayhello-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 12 }}>Say Hello</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.95rem' }}>
            I'm always open to new opportunities and collaborations.
          </p>
          <motion.a
            href={`mailto:${personalData.email}`}
            className="btn btn-solid"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <i className="fas fa-envelope" /> {personalData.email}
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
