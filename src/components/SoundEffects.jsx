import { useEffect, useRef } from 'react'

const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

export default function SoundEffects() {
  const initialized = useRef(false)

  useEffect(() => {
    if (isMobile || initialized.current) return
    initialized.current = true

    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    const playTone = (freq, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    }

    const handler = (e) => {
      const now = Date.now()
      if (now - (handler._last || 0) < 80) return
      handler._last = now
      const target = e.target.closest('a, button, .btn, .project-card, .article-card')
      if (target) playTone(800, 0.12)
    }

    document.addEventListener('mouseover', handler)
    return () => document.removeEventListener('mouseover', handler)
  }, [])

  return null
}
