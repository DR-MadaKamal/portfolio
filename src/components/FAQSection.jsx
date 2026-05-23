import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { faq as defaultFaq } from '../data/portfolioData'

export default function FAQSection({ faq: editedFaq }) {
  const list = editedFaq || defaultFaq
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="section faq-section">
      <div className="container" style={{ maxWidth: 700 }}>
        <motion.h2 className="section-title"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <small>Got Questions?</small>FAQ
        </motion.h2>
        {list.map((item, i) => (
          <motion.div key={i} className={`faq-item ${open === i ? 'open' : ''}`}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
              <span>{item.q}</span>
              <i className={`fas fa-chevron-${open === i ? 'up' : 'down'}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}>
                  <p>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
