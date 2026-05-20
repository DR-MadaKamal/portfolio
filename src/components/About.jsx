import { personalData } from '../data/portfolioData'

export default function About() {
  return (
    <aside style={{
      position: 'sticky',
      top: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '40px 24px',
      borderRadius: '16px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
    }}>
      <div style={{
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        border: '3px solid var(--accent)',
        overflow: 'hidden',
        marginBottom: '20px',
        flexShrink: 0,
      }}>
        <img
          src="/portfolio/photo.png"
          alt={personalData.firstName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '4px' }}>
        {personalData.firstName} {personalData.lastName}
      </h2>
      <p style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>
        {personalData.title}
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic', marginBottom: '16px' }}>
        <i className="fas fa-quote-left" style={{ marginRight: '4px', opacity: 0.5 }} />
        {personalData.tagline}
      </p>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '16px' }}>
        {personalData.summary}
      </p>

      <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
        <p style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <i className="fas fa-stethoscope" style={{ marginRight: '6px' }} />Medical Marketing Focus
        </p>
        {personalData.medicalFocus.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', padding: '3px 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent)', fontSize: '0.5rem', marginTop: '6px' }}>◆</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', borderTop: '1px solid var(--card-border)', paddingTop: '20px', marginBottom: '16px' }}>
        {[
          { icon: 'fa-envelope', text: personalData.email, href: `mailto:${personalData.email}` },
          { icon: 'fa-phone', text: personalData.phone, href: `tel:${personalData.phone}` },
          { icon: 'fa-map-marker-alt', text: personalData.location },
          { icon: 'fa-linkedin-in', text: 'LinkedIn', href: `https://${personalData.linkedin}` },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', fontSize: '0.82rem' }}>
            <i className={`fas ${item.icon}`} style={{ color: 'var(--accent)', width: '16px', fontSize: '0.75rem' }} />
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                {item.text}
              </a>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>{item.text}</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '20px' }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10+</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Years</div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--gradient-2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>50+</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Projects</div>
        </div>
      </div>
    </aside>
  )
}
