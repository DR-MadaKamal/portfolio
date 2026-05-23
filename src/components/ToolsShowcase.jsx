import { useState } from 'react'
import { motion } from 'framer-motion'
import { tools as defaultTools } from '../data/portfolioData'

export default function ToolsShowcase({ tools: editedTools }) {
  const tools = editedTools || defaultTools
  const cats = [...new Set(tools.map(t => t.category))]
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? tools : tools.filter(t => t.category === filter)

  return (
    <section className="section tools-section">
      <div className="container">
        <motion.h2 className="section-title"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <small>My Stack</small>Tools & Technologies
        </motion.h2>
        <div className="tools-filter">
          <button className={`tab-filter ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          {cats.map(c => (
            <button key={c} className={`tab-filter ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <motion.div className="tools-grid" layout>
          {filtered.map((t, i) => (
            <motion.div key={t.name} className="tool-item"
              layout initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
              <i className={`fas ${t.icon}`} />
              <span>{t.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
