import { articles } from '../data/portfolioData'

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

const articleStyles = [
  { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: 'fa-brain' },
  { gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: 'fa-capsules' },
  { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: 'fa-play-circle' },
]

export default function Articles() {
  return (
    <section id="articles" className="section">
      <div className="container">
        <h2 className="section-title">
          <small>My Thoughts</small>
          Articles
        </h2>

        <div className="articles-grid">
          {articles.map((a, i) => (
            <div key={i} className="article-card">
              <div style={{
                height: 180,
                background: articleStyles[i]?.gradient || 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', color: 'rgba(255,255,255,0.25)',
              }}>
                <i className={`fas ${articleStyles[i]?.icon || 'fa-file'} article-icon`} />
              </div>
              <div className="article-card-body">
                <h3><a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a></h3>
                <p>{a.description}</p>
                <div className="article-meta">
                  {a.date && `${monthNames[new Date(a.date).getMonth()]} ${new Date(a.date).getDate()}, ${new Date(a.date).getFullYear()} · `}
                  {a.readTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
