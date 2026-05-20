import { personalData } from '../data/portfolioData'

export default function About() {
  return (
    <aside className="sidebar-card">
      <div className="sidebar-photo">
        <img src="/portfolio/photo.png" alt={personalData.firstName} />
      </div>

      <h2 className="sidebar-name">{personalData.firstName} {personalData.lastName}</h2>
      <p className="sidebar-title">{personalData.title}</p>
      <p className="sidebar-tagline">
        <i className="fas fa-quote-left" /> {personalData.tagline}
      </p>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <p className="sidebar-label"><i className="fas fa-stethoscope" /> Medical Marketing Focus</p>
        {personalData.medicalFocus.map((item, i) => (
          <div key={i} className="sidebar-bullet">
            <span className="sidebar-dot">◆</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        {[
          { icon: 'fa-envelope', text: personalData.email, href: `mailto:${personalData.email}` },
          { icon: 'fa-phone', text: personalData.phone, href: `tel:${personalData.phone}` },
          { icon: 'fa-map-marker-alt', text: personalData.location },
          { icon: 'fa-linkedin-in', text: 'LinkedIn', href: `https://${personalData.linkedin}` },
        ].map((item, i) => (
          <div key={i} className="sidebar-contact-row">
            <i className={`fas ${item.icon}`} />
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer">{item.text}</a>
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-stats">
        <div className="sidebar-stat">
          <span className="sidebar-stat-num gradient-1">10+</span>
          <span className="sidebar-stat-label">Years</span>
        </div>
        <div className="sidebar-stat">
          <span className="sidebar-stat-num gradient-2">50+</span>
          <span className="sidebar-stat-label">Projects</span>
        </div>
      </div>

      <a href={`mailto:${personalData.email}`} className="sidebar-cta">
        <i className="fas fa-paper-plane" /> Hire Me
      </a>
    </aside>
  )
}
