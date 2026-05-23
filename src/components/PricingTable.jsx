import { motion } from 'framer-motion'
import { pricingPlans as defaultPlans } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

export default function PricingTable({ pricingPlans: editedPlans }) {
  const plans = editedPlans || defaultPlans
  const { t } = useLang()

  return (
    <section id="pricing" className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>{t.pricing.subtitle}</small>
            {t.pricing.title}
          </h2>
        </motion.div>
        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`pricing-card${plan.popular ? ' popular' : ''}`}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {plan.popular && <span className="pricing-badge">{t.pricing.popular}</span>}
              <h3>{plan.name}</h3>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-currency">{plan.currency}</span>
                <span className="pricing-period">{plan.period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((f, j) => <li key={j}><i className="fas fa-check" /> {f}</li>)}
              </ul>
              <a href={`mailto:16491@must.edu.eg`} className={`btn ${plan.popular ? 'btn-solid' : ''}`} style={{ width: '100%', justifyContent: 'center' }}>
                {t.pricing.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
