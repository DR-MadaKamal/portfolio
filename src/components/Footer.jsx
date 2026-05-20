import { personalData } from '../data/portfolioData'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-social">
        <a href={`https://${personalData.linkedin}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i className="fab fa-linkedin-in" />
        </a>
        <a href={`mailto:${personalData.email}`} aria-label="Email">
          <i className="fas fa-envelope" />
        </a>
        <a href={`tel:${personalData.phone}`} aria-label="Phone">
          <i className="fas fa-phone" />
        </a>
      </div>
      <p className="footer-credit">
        Designed & Built by {personalData.firstName} {personalData.lastName} &copy; {year}
      </p>
    </footer>
  )
}
