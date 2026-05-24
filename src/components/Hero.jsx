import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'

import { personalData, quotes as defaultQuotes } from '../data/portfolioData'
import TypeWriter from './TypeWriter'
import DownloadCV from './DownloadCV'
import MagneticButton from './MagneticButton'
import { useLang } from '../context/LangContext'

const container = { animate: { transition: { staggerChildren: 0.12 } } }
const child = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } } }
const imgChild = { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 18, delay: 0.3 } } }

export default function Hero({ personalData: editedPersonalData, quotes: editedQuotes }) {
  const data = editedPersonalData || personalData
  const quotes = (editedQuotes && editedQuotes.length > 0) ? editedQuotes : defaultQuotes
  const { t } = useLang()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const { scrollY } = useScroll()
  const imgY = useTransform(scrollY, [0, 500], [0, isMobile ? 0 : -40])
  const glowY = useTransform(scrollY, [0, 500], [0, isMobile ? 0 : -70])

  const [qIdx, setQIdx] = useState(0)
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    if (quotes.length > 0) setQIdx(dayOfYear % quotes.length)
  }, [quotes.length])
  const quote = quotes[qIdx]

  return (
    <section id="home" className="hero">
      <motion.div className="container hero-grid" variants={container} initial="initial" animate="animate">
        <div>
          <motion.div className="hero-badge" variants={child}>
            <i className="fas fa-star" style={{ marginRight: 4, fontSize: '0.6rem' }} />
            {t.hero.badge}
          </motion.div>

          <motion.h1 variants={child}>
            Bridging <span className="gradient-text">healthcare</span> & <span className="gradient-text">marketing</span><br />
            to drive real impact.
          </motion.h1>

          <motion.p variants={child} style={{ fontSize: '1.1rem', color: 'var(--accent)', fontFamily: 'monospace' }}>
            &gt; <TypeWriter />
          </motion.p>

          <motion.p variants={child}>{data.heroSummary || data.summary}</motion.p>

          <motion.div className="hero-cta" variants={child}>
            <MagneticButton as={motion.a} href={`mailto:${data.email}`} className="btn btn-solid"
              whileTap={{ scale: 0.97 }}>
              <i className="fas fa-paper-plane" /> {t.hero.hire}
            </MagneticButton>
            <MagneticButton as={motion.a} href="#projects" className="btn"
              onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <i className="fas fa-code-branch" /> {t.hero.view}
            </MagneticButton>
            <DownloadCV />
          </motion.div>

          {data.available && (
            <motion.div className="available-badge" variants={child}>
              <span className="available-dot" /> {t.available}
            </motion.div>
          )}
        </div>

        <motion.div className="hero-right" variants={imgChild}>
          <motion.div className="hero-image" style={{ y: imgY }}>
            <motion.div className="hero-glow" style={{ y: glowY }} />
            <motion.div className="hero-glow hero-glow-2" style={{ y: glowY }} />
            <div className="hero-image-frame"><img src="/portfolio/photo.png" alt={data.firstName} fetchpriority="high" /></div>
          </div>
          {quote && (
            <div className="hero-quote">
              <p className="hero-quote-icon">&ldquo;</p>
              <blockquote className="hero-quote-text">{quote.text}</blockquote>
              <p className="hero-quote-author">&mdash; {quote.author}</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      <motion.div className="scroll-indicator"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}>
        <i className="fas fa-chevron-down" />
      </motion.div>
    </section>
  )
}
