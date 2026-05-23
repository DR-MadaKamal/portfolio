import { motion } from 'framer-motion'

export default function RelatedArticles({ current, articles, onOpenArticle }) {
  if (!articles || articles.length < 2) return null
  const related = articles.filter(a => a.title !== current?.title).slice(0, 2)
  if (related.length === 0) return null

  return (
    <div className="related-articles">
      <h3 className="related-title">Related Articles</h3>
      <div className="related-grid">
        {related.map((a, i) => (
          <motion.a key={i} href={`#article-${i}`} className="related-card article-card"
            onClick={(e) => { e.preventDefault(); onOpenArticle?.(a) }}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {a.image && <img src={a.image} alt={a.title} className="related-img" loading="lazy" />}
            <div className="article-card-body">
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <span className="article-meta">{a.readTime} · {a.date}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
