import { personalData } from '../data/portfolioData'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div>
          <div className="hero-badge">Pharmacist & Full-Stack Marketer</div>
          <h1>
            Bridging <span>healthcare</span> & <span>marketing</span><br />to drive real impact.
          </h1>
          <p>{personalData.summary}</p>
          <div className="hero-cta">
            <a href={`mailto:${personalData.email}`} className="btn btn-solid">
              <i className="fas fa-paper-plane" /> Hire Me
            </a>
            <a href="#about" className="btn" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <i className="fas fa-user" /> About Me
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-ring" />
          <img src="/portfolio/photo.png" alt={personalData.firstName} />
        </div>
      </div>
    </section>
  )
}
