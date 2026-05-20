import { personalData } from '../data/portfolioData'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      padding: '40px 20px',
      textAlign: 'center',
      borderTop: '1px solid var(--card-border)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <a href={`https://${personalData.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', transition: 'color 0.3s ease' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <i className="fab fa-linkedin-in" />
        </a>
        <a href={`mailto:${personalData.email}`} style={{ color: 'var(--text-muted)', fontSize: '1.1rem', transition: 'color 0.3s ease' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <i className="fas fa-envelope" />
        </a>
        <a href={`tel:${personalData.phone}`} style={{ color: 'var(--text-muted)', fontSize: '1.1rem', transition: 'color 0.3s ease' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <i className="fas fa-phone" />
        </a>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Designed & Built by {personalData.firstName} {personalData.lastName} &copy; {year}
      </p>
    </footer>
  )
}
