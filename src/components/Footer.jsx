import { personalData } from '../data/portfolioData'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-social">
        <a href={`https://${personalData.linkedin}`} target="_blank" rel="noopener noreferrer" title="LinkedIn">
          <i className="fab fa-linkedin-in" />
        </a>
        <a href={`mailto:${personalData.email}`} title="Email">
          <i className="fas fa-envelope" />
        </a>
      </div>
      <p>
        &copy; {new Date().getFullYear()} All Rights Reserved.<br />
        Built with <i className="fas fa-heart" style={{ color: 'var(--accent2)' }} /> by{' '}
        <a href={`https://${personalData.linkedin}`} target="_blank" rel="noopener noreferrer">
          {personalData.firstName} {personalData.lastName}
        </a>
      </p>
    </footer>
  )
}
