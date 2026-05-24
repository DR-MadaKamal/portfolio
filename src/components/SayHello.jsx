import { useState, useRef } from 'react'
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
  const [sending, setSending] = useState(false)
  const textRef = useRef(null)

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(field, value) }))
    if (field === 'message' && textRef.current) {
      textRef.current.style.height = 'auto'
      textRef.current.style.height = textRef.current.scrollHeight + 'px'
    }
  }

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(e => ({ ...e, [field]: validate(field, form[field]) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = { name: validate('name', form.name), email: validate('email', form.email), message: validate('message', form.message) }
    setErrors(errs)
    setTouched({ name: true, email: true, message: true })
    if (errs.name || errs.email || errs.message) return
    setSending(true)
    saveSubmission({ name: form.name, email: form.email, message: form.message })
    window.location.href = `mailto:16491@must.edu.eg?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}`
    showToast('Message sent! Check your email client.', 'success')
    setForm({ name: '', email: '', message: '' })
    setTouched({})
    setErrors({})
    setSending(false)
  }

  const fieldProps = (field, placeholder, type) => ({
    type: type || 'text',
    value: form[field],
    onChange: e => handleChange(field, e.target.value),
    onBlur: () => handleBlur(field),
    id: `contact-${field}`,
    className: `contact-input${errors[field] && touched[field] ? ' input-error' : ''}${touched[field] && !errors[field] && form[field] ? ' input-valid' : ''}`,
  })

  const icons = { name: 'fa-user', email: 'fa-envelope', message: 'fa-pen' }

  return (
    <section id="contact" className="section">
      <div className="container">
        <motion.div className="contact-wrap"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <div className="contact-info">
            <span className="contact-badge">Get In Touch</span>
            <h2 className="contact-heading">Let&apos;s work together</h2>
            <p className="contact-desc">
              Have a project, collaboration idea, or just want to say hi? Fill out the form and I&apos;ll get back to you within 24 hours.
            </p>
            <div className="contact-details">
              <div className="contact-detail-item">
                <span className="contact-detail-icon"><i className="fas fa-envelope" /></span>
                <div>
                  <span className="contact-detail-label">Email</span>
                  <span className="contact-detail-value">16491@must.edu.eg</span>
                </div>
              </div>
              <div className="contact-detail-item">
                <span className="contact-detail-icon"><i className="fas fa-phone" /></span>
                <div>
                  <span className="contact-detail-label">Phone</span>
                  <span className="contact-detail-value">+201009852109</span>
                </div>
              </div>
              <div className="contact-detail-item">
                <span className="contact-detail-icon"><i className="fas fa-location-dot" /></span>
                <div>
                  <span className="contact-detail-label">Location</span>
                  <span className="contact-detail-value">Al-Faiyum, Egypt</span>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
            {['name', 'email', 'message'].map(field => (
              <div key={field} className="contact-field">
                <div className={`contact-input-wrap${form[field] ? ' has-value' : ''}${errors[field] && touched[field] ? ' has-error' : ''}`}>
                  <i className={`fas ${icons[field]} contact-input-icon`} />
                  {field === 'message' ? (
                    <textarea ref={textRef} rows={1} {...fieldProps(field, t.contact[field])} />
                  ) : (
                    <input {...fieldProps(field, t.contact[field], field === 'email' ? 'email' : 'text')} />
                  )}
                  <label htmlFor={`contact-${field}`} className="contact-label">
                    {t.contact[field]}
                  </label>
                  <span className="contact-input-border" />
                </div>
                {errors[field] && touched[field] && (
                  <span className="contact-field-error">{errors[field]}</span>
                )}
                {field === 'message' && (
                  <span className="contact-charcount">{form[field].length}/10 min</span>
                )}
              </div>
            ))}
            <motion.button type="submit" className="contact-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={sending}>
              {sending ? (
                <><i className="fas fa-spinner fa-spin" /> Sending...</>
              ) : (
                <><i className="fas fa-paper-plane" /> {t.contact.send}</>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}