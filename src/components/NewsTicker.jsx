import { motion } from 'framer-motion'
import { newsItems } from '../data/portfolioData'

export default function NewsTicker() {
  return (
    <div className="news-ticker">
      <span className="news-ticker-label"><i className="fas fa-bolt" /> Latest</span>
      <div className="news-ticker-track">
        <motion.div className="news-ticker-inner"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
          {[...newsItems, ...newsItems].map((item, i) => (
            <span key={i} className="news-ticker-item">
              <span className="news-ticker-date">{item.date}</span>
              {item.text}
              <span className="news-ticker-sep">•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
