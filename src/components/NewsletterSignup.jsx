import { useState } from 'react'
import { motion } from 'framer-motion'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email) return
    setDone(true)
    setTimeout(() => { setDone(false); setEmail('') }, 3000)
  }

  return (
    <section className="section newsletter-section">
      <div className="container" style={{ textAlign: 'center', maxWidth: 500 }}>
        <motion.h3 className="newsletter-title"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <i className="fas fa-envelope-open-text" style={{ marginRight: 8, color: 'var(--accent)' }} />
          Stay Updated
        </motion.h3>
        <motion.p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Get the latest articles, tips, and portfolio updates straight to your inbox.
        </motion.p>
        {done ? (
          <motion.p className="newsletter-success"
            initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <i className="fas fa-check-circle" /> Thanks for subscribing!
          </motion.p>
        ) : (
          <form onSubmit={submit} className="newsletter-form">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Your email address" required />
            <button type="submit"><i className="fas fa-arrow-right" /></button>
          </form>
        )}
      </div>
    </section>
  )
}
