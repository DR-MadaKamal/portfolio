import { useState, useEffect } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const el = document.querySelector('.article-page-content')
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const current = -rect.top
      setProgress(total > 0 ? Math.min(Math.max(current / total * 100, 0), 100) : 100)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div className="reading-progress" style={{ width: `${progress}%` }} />
}
