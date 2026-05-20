import { motion } from 'framer-motion'
import { personalData } from '../data/portfolioData'

const container = { animate: { transition: { staggerChildren: 0.12 } } }
const child = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const imgChild = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Hero() {
  return (
    <section id="home" className="hero">
      <motion.div className="container hero-grid" variants={container} initial="initial" animate="animate">
        <div>
          <motion.div className="hero-badge" variants={child}>
            <i className="fas fa-star" style={{ marginRight: 4, fontSize: '0.6rem' }} />
            Pharmacist & Full-Stack Marketer
          </motion.div>

          <motion.h1 variants={child}>
            Bridging <span className="gradient-text">healthcare</span> & <span className="gradient-text">marketing</span><br />
            to drive real impact.
          </motion.h1>

          <motion.p variants={child}>{personalData.summary}</motion.p>

          <motion.div className="hero-cta" variants={child}>
            <motion.a
              href={`mailto:${personalData.email}`}
              className="btn btn-solid"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <i className="fas fa-paper-plane" /> Hire Me
            </motion.a>
            <motion.a
              href="#projects"
              className="btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              <i className="fas fa-code-branch" /> View Projects
            </motion.a>
          </motion.div>
        </div>

        <motion.div className="hero-image" variants={imgChild}>
          <div className="hero-glow" />
          <div className="hero-glow hero-glow-2" />
          <img src="/portfolio/photo.png" alt={personalData.firstName} />
        </motion.div>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
      >
        <i className="fas fa-chevron-down" />
      </motion.div>
    </section>
  )
}
