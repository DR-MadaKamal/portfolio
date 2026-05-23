import { motion } from 'framer-motion'
import { testimonials as defaultTestimonials } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

export default function Testimonials({ testimonials: editedTestimonials }) {
  const list = editedTestimonials || defaultTestimonials
  const { t } = useLang()

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>{t.testimonials.subtitle}</small>
            {t.testimonials.title}
          </h2>
        </motion.div>
        <div className="testimonials-grid">
          {list.map((item, i) => (
            <motion.div
              key={i} className="testimonial-card"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="testimonial-stars">
                {Array.from({ length: item.rating }).map((_, j) => <i key={j} className="fas fa-star" />)}
              </div>
              <p className="testimonial-text">&ldquo;{item.text}&rdquo;</p>
              <div className="testimonial-author">
                {item.avatar ? <img src={item.avatar} alt={item.name} loading="lazy" /> : <div className="testimonial-avatar">{item.name[0]}</div>}
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
