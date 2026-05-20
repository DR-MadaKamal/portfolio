import { useState, useEffect } from 'react'

const VISITS_KEY = 'portfolio-visits'
const DAILY_KEY = 'portfolio-daily-visits'

export default function AnalyticsDashboard() {
  const [visits, setVisits] = useState(0)
  const [today, setToday] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const total = parseInt(localStorage.getItem(VISITS_KEY) || '0')
    setVisits(total)

    const todayStr = new Date().toDateString()
    const daily = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}')
    setToday(daily[todayStr] || 0)

    const isAdmin = window.location.hash === '#admin' || window.location.search.includes('admin')
    if (isAdmin) setShow(true)
  }, [])

  if (!show) return null

  return (
    <div className="analytics-badge" onClick={() => setShow(false)} title="Site analytics (click to hide)">
      <i className="fas fa-chart-simple" />
      <span>{visits} visits</span>
      <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{today} today</span>
    </div>
  )
}
