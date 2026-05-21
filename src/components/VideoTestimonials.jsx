import { motion } from 'framer-motion'
import { testimonials } from '../data/portfolioData'

export default function VideoTestimonials() {
  return (
    <section className="section video-testimonials-section">
      <div className="container">
        <motion.h2 className="section-title"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <small>Video Reviews</small>What They Say
        </motion.h2>
        <div className="video-grid">
          {testimonials.map((t, i) => (
            <motion.div key={i} className="video-testimonial-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="video-testimonial-avatar">
                <i className="fas fa-user-circle" style={{ fontSize: '2.5rem', color: 'var(--accent)' }} />
              </div>
              <p className="video-testimonial-text">"{t.text}"</p>
              <strong className="video-testimonial-name">{t.name}</strong>
              <span className="video-testimonial-role">{t.role}</span>
              <div className="video-testimonial-stars">
                {Array.from({ length: t.rating }, (_, j) => <i key={j} className="fas fa-star" />)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
