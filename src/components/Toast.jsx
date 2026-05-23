import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' }

export default function Toast() {
  const [items, setItems] = useState([])

  const add = useCallback((e) => {
    const { message, type } = e.detail || {}
    if (!message) return
    const id = Date.now() + Math.random()
    setItems(prev => [...prev, { id, message, type: type || 'info' }])
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  useEffect(() => {
    window.addEventListener('show-toast', add)
    return () => window.removeEventListener('show-toast', add)
  }, [add])

  const remove = (id) => setItems(prev => prev.filter(t => t.id !== id))

  return (
    <div className="toast-container">
      <AnimatePresence>
        {items.map(t => (
          <motion.div key={t.id} className={`toast toast-${t.type}`}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
            <i className={`fas ${icons[t.type] || icons.info}`} />
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => remove(t.id)}>&times;</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
