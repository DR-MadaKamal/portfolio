import { personalData } from '../data/portfolioData'

export default function SayHello() {
  return (
    <section className="section-sm" style={{ textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 12 }}>Say Hello</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.95rem' }}>
          I'm always open to new opportunities and collaborations.
        </p>
        <a href={`mailto:${personalData.email}`} className="btn btn-solid">
          <i className="fas fa-envelope" /> {personalData.email}
        </a>
      </div>
    </section>
  )
}
