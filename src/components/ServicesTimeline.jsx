import { motion } from 'framer-motion'
import { servicesTimeline } from '../data/portfolioData'

export default function ServicesTimeline() {
  return (
    <section className="section services-timeline-section">
      <div className="container">
        <motion.h2 className="section-title"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <small>How I Work</small>My Process
        </motion.h2>
        <div className="services-timeline">
          {servicesTimeline.map((s, i) => (
            <motion.div key={i} className="st-item"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}>
              <div className="st-number">{s.step}</div>
              <div className="st-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
