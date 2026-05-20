import { motion } from 'framer-motion'
import { personalData as defaultPersonalData } from '../data/portfolioData'
import QRCode from './QRCode'
import { useLang } from '../context/LangContext'

export default function Footer({ personalData: editedPersonalData }) {
  const data = editedPersonalData || defaultPersonalData
  const { t } = useLang()

  return (
    <motion.footer className="footer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div className="footer-social">
          <motion.a href={`https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" title="LinkedIn"
            whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
            <i className="fab fa-linkedin-in" />
          </motion.a>
          <motion.a href={`mailto:${data.email}`} title="Email"
            whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
            <i className="fas fa-envelope" />
          </motion.a>
          {data.whatsapp && (
            <motion.a href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp"
              whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
              <i className="fab fa-whatsapp" />
            </motion.a>
          )}
        </div>
        <QRCode />
      </div>
      <p style={{ marginTop: 16 }}>
        &copy; {new Date().getFullYear()} {t.footer.rights}<br />
        {t.footer.built} <i className="fas fa-heart" style={{ color: 'var(--accent2)' }} /> {t.footer.by}{' '}
        <a href={`https://${data.linkedin}`} target="_blank" rel="noopener noreferrer">
          {data.firstName} {data.lastName}
        </a>
      </p>
    </motion.footer>
  )
}
