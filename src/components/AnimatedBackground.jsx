import { useMemo, useEffect, useRef } from 'react'

const bgi = [
  { cls: 'fab fa-facebook-f' }, { cls: 'fab fa-twitter' }, { cls: 'fab fa-instagram' }, { cls: 'fab fa-linkedin-in' }, { cls: 'fab fa-youtube' },
  { cls: 'fas fa-stethoscope' }, { cls: 'fas fa-pills' }, { cls: 'fas fa-tablets' }, { cls: 'fas fa-heartbeat' }, { cls: 'fas fa-flask' },
  { cls: 'fas fa-chart-line' }, { cls: 'fas fa-bullhorn' }, { cls: 'fas fa-palette' }, { cls: 'fas fa-video' }, { cls: 'fas fa-ad' },
  { cls: 'fas fa-camera' }, { cls: 'fas fa-search' }, { cls: 'fas fa-rocket' }, { cls: 'fas fa-medal' }, { cls: 'fas fa-users' },
]

const rand = (min, max) => Math.random() * (max - min) + min

function drawIcon(ctx, type, x, y, s, hue, alpha) {
  const c = `hsla(${hue}, 70%, 65%, ${alpha})`
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 0.12
  switch (type) {
    case 0: // cross (medical)
      ctx.fillRect(-0.3, -1, 0.6, 2)
      ctx.fillRect(-1, -0.3, 2, 0.6)
      break
    case 1: { // heart
      ctx.beginPath(); ctx.moveTo(0, 0.3)
      ctx.bezierCurveTo(-1, -0.4, -1.2, -0.8, -0.5, -1)
      ctx.bezierCurveTo(0, -1.1, 0, -0.6, 0, -0.6)
      ctx.bezierCurveTo(0, -0.6, 0, -1.1, 0.5, -1)
      ctx.bezierCurveTo(1.2, -0.8, 1, -0.4, 0, 0.3)
      ctx.fill()
      break
    }
    case 2: // pill (capsule)
      ctx.beginPath(); ctx.ellipse(0, 0, 0.6, 0.4, 0, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = `hsla(${hue + 30}, 70%, 70%, ${alpha})`
      ctx.fillRect(-0.1, -0.35, 0.2, 0.7)
      break
    case 3: // chart (3 bars)
      for (let i = 0; i < 3; i++) { ctx.fillRect(-0.7 + i * 0.5, -0.3 - i * 0.4, 0.2, 0.3 + i * 0.4) }
      break
    case 4: // play triangle
      ctx.beginPath(); ctx.moveTo(-0.5, -0.6); ctx.lineTo(-0.5, 0.6); ctx.lineTo(0.7, 0); ctx.closePath(); ctx.fill()
      break
    case 5: { // star
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a), Math.sin(a))
      }
      ctx.closePath(); ctx.fill()
      break
    }
    case 6: // target (crosshair)
      ctx.beginPath(); ctx.arc(0, 0, 0.6, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 0.2, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.moveTo(0, -0.8); ctx.lineTo(0, 0.8); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-0.8, 0); ctx.lineTo(0.8, 0); ctx.stroke()
      break
    case 7: // arrow up (growth)
      ctx.beginPath(); ctx.moveTo(0, -0.7); ctx.lineTo(0.5, -0.2); ctx.moveTo(0, -0.7); ctx.lineTo(-0.5, -0.2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-0.5, 0.3); ctx.lineTo(0, 0.7); ctx.lineTo(0.5, 0.3); ctx.stroke()
      break
  }
  ctx.restore()
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 8 : 16

  const items = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const item = bgi[i % bgi.length]
      return {
        cls: item.cls,
        style: {
          '--x': `${rand(1, 95)}%`, '--y': `${rand(1, 93)}%`,
          '--s': `${rand(14, 30)}px`, '--d': `${rand(10, 22)}s`,
          '--delay': `${rand(0, 10)}s`, '--dx': `${rand(-60, 60)}px`,
          '--dy': `${rand(-40, 40)}px`, '--hue': rand(0, 360),
          '--dr': `${rand(0, 360)}deg`,
        }, key: i,
      }
    }), [count])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let mouse = { x: -1000, y: -1000 }
    const particles = Array.from({ length: 75 }, () => ({
      x: rand(0, window.innerWidth), y: rand(0, window.innerHeight),
      vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4),
      s: rand(3.5, 6), hue: rand(150, 210), type: Math.floor(rand(0, 8)),
    }))

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000 }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 280) {
          p.vx += (dx / dist) * 0.03
          p.vy += (dy / dist) * 0.03
          if (dist < 200) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 75%, ${(1 - dist / 200) * 0.28})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
        p.vx *= 0.99; p.vy *= 0.99
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        drawIcon(ctx, p.type, p.x, p.y, p.s, p.hue, 0.42)
        drawIcon(ctx, p.type, p.x, p.y, p.s * 1.8, p.hue, 0.07)
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="bg-particles" />
      <div className="bg-animated-icons">
        {items.map(({ cls, style, key }) => (
          <i key={key} className={cls}
            style={{
              position: 'fixed', left: style['--x'], top: style['--y'],
              fontSize: style['--s'],
              color: `hsla(${style['--hue']}, 65%, 60%, 0.12)`,
              pointerEvents: 'none', zIndex: 0,
              animation: `bgFloat ${style['--d']} ease-in-out ${style['--delay']} infinite`,
              willChange: 'transform',
            }} />
        ))}
      </div>
    </>
  )
}