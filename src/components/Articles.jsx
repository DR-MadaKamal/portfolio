import { useState } from 'react'
import { motion } from 'framer-motion'
import { articles as defaultArticles } from '../data/portfolioData'
import ArticlePage from './ArticlePage'
import { useLang } from '../context/LangContext'

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

const thumbnails = [
  { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: 'fa-brain' },
  { gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: 'fa-capsules' },
  { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: 'fa-play-circle' },
]

const cardAnim = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' }, transition: { duration: 0.5 } }

export default function Articles({ articles: editedArticles }) {
  const articles = editedArticles || defaultArticles
  const { t } = useLang()
  const [articleIdx, setArticleIdx] = useState(null)

  return (
    <section id="articles" className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>{t.articles.subtitle}</small>
            {t.articles.title}
          </h2>
        </motion.div>

        <div className="articles-grid">
          {articles.map((a, i) => (
            <motion.div key={i} className="article-card" {...cardAnim}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => setArticleIdx(i)}
              style={{ cursor: 'pointer' }}>
              {a.image ? (
                <img src={a.image} alt={a.title} className="article-thumb-img" loading="lazy" />
              ) : (
                <div className="article-thumb" style={{ background: thumbnails[i]?.gradient || 'var(--accent)' }}>
                  <i className={`fas ${thumbnails[i]?.icon || 'fa-file'}`} />
                </div>
              )}
              <div className="article-card-body">
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <div className="article-meta">
                  {a.date && `${monthNames[new Date(a.date).getMonth()]} ${new Date(a.date).getDate()}, ${new Date(a.date).getFullYear()} · `}
                  <i className="far fa-clock" style={{ marginRight: 3 }} /> {a.readTime}
                </div>
                <span className="article-read-link">{t.articles.read} <i className="fas fa-arrow-right" /></span>
              </div>
            </motion.div>
          ))}
        </div>

        {articleIdx != null && (
          <ArticlePage articleIdx={articleIdx} onClose={() => setArticleIdx(null)} />
        )}
      </div>
    </section>
  )
}
