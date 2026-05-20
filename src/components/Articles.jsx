import { articles } from '../data/portfolioData'

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

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
              <img src="/portfolio/logo.png" alt={a.title} />
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
