import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'

export default function SayHello() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setStatus(t.contact.error); return
    }
    window.location.href = `mailto:16491@must.edu.eg?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}`
    setStatus(t.contact.success)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus(''), 3000)
  }

  return (
    <section id="contact" className="section sayhello-section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>{t.contact.subtitle}</small>
            {t.contact.title}
          </h2>
        </motion.div>
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <input type="text" placeholder={t.contact.name} value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} />
          <input type="email" placeholder={t.contact.email} value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
          <textarea rows={5} placeholder={t.contact.message} value={form.message}
            onChange={e => setForm({...form, message: e.target.value})} />
          <button type="submit" className="btn btn-solid" style={{ alignSelf: 'center' }}>
            <i className="fas fa-paper-plane" /> {t.contact.send}
          </button>
          {status && <p className="contact-status">{status}</p>}
        </motion.form>
      </div>
    </section>
  )
}
