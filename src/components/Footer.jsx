import { motion } from 'framer-motion'
import { personalData } from '../data/portfolioData'

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer-social">
        <motion.a
          href={`https://${personalData.linkedin}`} target="_blank" rel="noopener noreferrer" title="LinkedIn"
          whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
        >
          <i className="fab fa-linkedin-in" />
        </motion.a>
        <motion.a
          href={`mailto:${personalData.email}`} title="Email"
          whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-envelope" />
        </motion.a>
      </div>
      <p>
        &copy; {new Date().getFullYear()} All Rights Reserved.<br />
        Built with <i className="fas fa-heart" style={{ color: 'var(--accent2)' }} /> by{' '}
        <a href={`https://${personalData.linkedin}`} target="_blank" rel="noopener noreferrer">
          {personalData.firstName} {personalData.lastName}
        </a>
      </p>
    </motion.footer>
  )
}
