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
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s)
  ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 0.12; ctx.lineCap = 'round'
  switch (type) {
    case 0: // medical cross (stethoscope/heartbeat)
      ctx.fillRect(-0.3, -1, 0.6, 2)
      ctx.fillRect(-1, -0.3, 2, 0.6)
      break
    case 1: // capsule / pills (pharmacy)
      ctx.beginPath(); ctx.ellipse(0, 0, 0.65, 0.35, 0, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = `hsla(${hue + 30}, 70%, 75%, ${alpha})`
      ctx.fillRect(-0.12, -0.3, 0.24, 0.6)
      break
    case 2: // camera (Instagram)
      ctx.beginPath(); ctx.roundRect(-0.7, -0.55, 1.4, 1.1, 0.2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 0.35, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 0.12, 0, Math.PI * 2); ctx.fill()
      ctx.fillRect(0.35, -0.45, 0.15, 0.15)
      break
    case 3: // play button (YouTube)
      ctx.beginPath(); ctx.roundRect(-0.7, -0.5, 1.4, 1, 0.2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-0.25, -0.35); ctx.lineTo(-0.25, 0.35); ctx.lineTo(0.45, 0); ctx.closePath(); ctx.fill()
      break
    case 4: // 'f' (Facebook)
      ctx.beginPath(); ctx.roundRect(-0.6, -0.7, 1.2, 1.4, 0.25); ctx.stroke()
      ctx.fillRect(0.05, -0.7, 0.1, 1.4)
      ctx.fillRect(-0.3, -0.2, 0.6, 0.1)
      break
    case 5: // chart / graph (analytics, ads platforms)
      for (let i = 0; i < 3; i++) { ctx.fillRect(-0.7 + i * 0.5, 0.1 - i * 0.35, 0.18, 0.1 + i * 0.35) }
      ctx.fillRect(-0.8, 0.25, 1.6, 0.08)
      break
    case 6: // speech bubble (social / messaging)
      ctx.beginPath(); ctx.roundRect(-0.55, -0.5, 1.1, 0.9, 0.15); ctx.fill()
      ctx.beginPath(); ctx.moveTo(-0.1, 0.4); ctx.lineTo(-0.1, 0.7); ctx.lineTo(0.25, 0.4); ctx.fill()
      ctx.fillStyle = `hsla(${hue}, 60%, 20%, ${alpha})`
      ctx.fillRect(-0.4, -0.25, 0.8, 0.06); ctx.fillRect(-0.4, -0.08, 0.6, 0.06); ctx.fillRect(-0.4, 0.09, 0.7, 0.06)
      break
    case 7: // magnifying glass (search / SEO)
      ctx.beginPath(); ctx.arc(-0.1, -0.1, 0.45, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0.25, 0.25); ctx.lineTo(0.6, 0.6); ctx.stroke()
      break
    case 8: // X / Twitter bird
      ctx.lineWidth = 0.18
      ctx.beginPath(); ctx.moveTo(-0.55, -0.55); ctx.lineTo(0.55, 0.55); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0.55, -0.55); ctx.lineTo(-0.55, 0.55); ctx.stroke()
      break
    case 9: // bullhorn / announcement (ads)
      ctx.fillRect(-0.2, -0.7, 0.8, 0.6)
      ctx.beginPath(); ctx.moveTo(0.6, -0.2); ctx.lineTo(0.9, -0.4); ctx.lineTo(0.9, 0.2); ctx.lineTo(0.6, 0.1); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.arc(-0.2, -0.1, 0.25, -0.5, 0.5); ctx.lineWidth = 0.15; ctx.stroke()
      break
  }
  ctx.restore()
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (r > w / 2) r = w / 2; if (r > h / 2) r = h / 2
    this.moveTo(x + r, y); this.lineTo(x + w - r, y); this.quadraticCurveTo(x + w, y, x + w, y + r)
    this.lineTo(x + w, y + h - r); this.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    this.lineTo(x + r, y + h); this.quadraticCurveTo(x, y + h, x, y + h - r)
    this.lineTo(x, y + r); this.quadraticCurveTo(x, y, x + r, y)
  }
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
      s: rand(3.5, 6), hue: rand(150, 210), type: Math.floor(rand(0, 10)),
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