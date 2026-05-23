import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'
import { showToast } from '../utils/toast'

const FORM_KEY = 'portfolio-contact-submissions'

function saveSubmission(data) {
  try {
    const existing = JSON.parse(localStorage.getItem(FORM_KEY) || '[]')
    existing.unshift({ ...data, timestamp: Date.now(), id: Date.now() })
    localStorage.setItem(FORM_KEY, JSON.stringify(existing.slice(0, 200)))
  } catch {}
}

function validate(field, value) {
  if (field === 'name') return value.trim() ? '' : 'Name is required'
  if (field === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Valid email required'
  if (field === 'message') return value.trim().length >= 10 ? '' : 'At least 10 characters'
  return ''
}

export default function SayHello() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(field, value) }))
  }

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(e => ({ ...e, [field]: validate(field, form[field]) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = { name: validate('name', form.name), email: validate('email', form.email), message: validate('message', form.message) }
    setErrors(errs)
    setTouched({ name: true, email: true, message: true })
    if (errs.name || errs.email || errs.message) return
    saveSubmission({ name: form.name, email: form.email, message: form.message })
    window.location.href = `mailto:16491@must.edu.eg?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}`
    showToast('Message sent! Check your email client.', 'success')
    setForm({ name: '', email: '', message: '' })
    setTouched({})
    setErrors({})
  }

  const inpProps = (field, placeholder, type) => ({
    type: type || 'text', placeholder, value: form[field],
    className: `form-input${errors[field] && touched[field] ? ' form-input-error' : ''}${touched[field] && !errors[field] && form[field] ? ' form-input-valid' : ''}`,
    onChange: e => handleChange(field, e.target.value),
    onBlur: () => handleBlur(field),
  })

  return (
    <section id="contact" className="section sayhello-section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>{t.contact.subtitle}</small>
            {t.contact.title}
          </h2>
        </motion.div>
        <motion.form className="contact-form" onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="form-field">
            <input {...inpProps('name', t.contact.name)} />
            {errors.name && touched.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-field">
            <input {...inpProps('email', t.contact.email, 'email')} />
            {errors.email && touched.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-field">
            <textarea rows={5} {...inpProps('message', t.contact.message)} />
            {errors.message && touched.message && <span className="form-error">{errors.message}</span>}
          </div>
          <button type="submit" className="btn btn-solid ripple-btn" style={{ alignSelf: 'center' }}>
            <i className="fas fa-paper-plane" /> {t.contact.send}
          </button>
        </motion.form>
      </div>
    </section>
  )
}