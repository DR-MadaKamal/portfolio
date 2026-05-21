import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(true)
  useEffect(() => {
    const val = localStorage.getItem('cookie-consent')
    if (!val) setAccepted(false)
  }, [])

  const accept = () => { localStorage.setItem('cookie-consent', 'true'); setAccepted(true) }
  const decline = () => { localStorage.setItem('cookie-consent', 'false'); setAccepted(true) }

  return (
    <AnimatePresence>
      {!accepted && (
        <motion.div className="cookie-bar"
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}>
          <p>This site uses cookies and tracking tools (Google Analytics, Meta Pixel) to improve your experience. <a href="#privacy" onClick={e => e.preventDefault()}>Learn more</a></p>
          <div className="cookie-actions">
            <button onClick={accept} className="cookie-accept">Accept All</button>
            <button onClick={decline} className="cookie-decline">Decline</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
