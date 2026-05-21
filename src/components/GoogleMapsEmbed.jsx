import { motion } from 'framer-motion'

export default function GoogleMapsEmbed({ location }) {
  const q = encodeURIComponent(location || 'Egypt')
  return (
    <section className="section map-section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>Location</small>Find Me
          </h2>
          <div className="map-container">
            <iframe
              title="Location"
              src={`https://maps.google.com/maps?q=${q}&output=embed`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
