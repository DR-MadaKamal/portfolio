import { motion } from 'framer-motion'

export default function PortfolioDownload() {
  return (
    <section className="section download-section">
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: 12 }}>
            <i className="fas fa-file-pdf" style={{ color: 'var(--accent2)', marginRight: 8 }} />
            Download My Full Portfolio
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20, maxWidth: 480, margin: '0 auto 20px' }}>
            Get the complete portfolio with case studies, client work, and detailed project breakdowns in a single PDF document.
          </p>
          <motion.a href="/portfolio/portfolio.pdf" download className="btn btn-solid"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <i className="fas fa-download" /> Download PDF
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
