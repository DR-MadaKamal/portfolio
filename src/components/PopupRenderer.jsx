import { useState, useEffect } from 'react'

function matchesCondition(condition) {
  if (!condition?.rule || condition.rule === 'entire_site') return true
  if (condition.rule === 'home_page') return window.location.pathname === '/' || window.location.pathname === '/index.html'
  return true
}

export default function PopupRenderer({ popups }) {
  const [openPopups, setOpenPopups] = useState([])
  const [triggered, setTriggered] = useState(new Set())

  useEffect(() => {
    popups?.forEach(p => {
      if (triggered.has(p.id)) return
      const tr = p.trigger || {}
      if (tr.type === 'onload') { setOpenPopups(prev => [...prev, p.id]); setTriggered(prev => new Set(prev).add(p.id)) }
      if (tr.type === 'timer') { const t = setTimeout(() => { setOpenPopups(prev => [...prev, p.id]); setTriggered(prev => new Set(prev).add(p.id)) }, (parseInt(tr.value) || 3) * 1000); return () => clearTimeout(t) }
      if (tr.type === 'scroll') { const handler = () => { const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100; if (pct >= (parseInt(tr.value) || 50)) { setOpenPopups(prev => prev.includes(p.id) ? prev : [...prev, p.id]); setTriggered(prev => new Set(prev).add(p.id)) } }; window.addEventListener('scroll', handler, { once: true }); return () => window.removeEventListener('scroll', handler) }
      if (tr.type === 'exit') { const handler = (e) => { if (e.clientY <= 0) { setOpenPopups(prev => prev.includes(p.id) ? prev : [...prev, p.id]); setTriggered(prev => new Set(prev).add(p.id)) } }; document.addEventListener('mouseleave', handler, { once: true }); return () => document.removeEventListener('mouseleave', handler) }
      if (tr.type === 'click' && tr.value) { const el = document.querySelector(tr.value); if (el) { el.addEventListener('click', () => { setOpenPopups(prev => [...prev, p.id]); setTriggered(prev => new Set(prev).add(p.id)) }); return () => el.removeEventListener('click', () => {}) } }
    })
  }, [popups])

  const closePopup = (id) => setOpenPopups(prev => prev.filter(x => x !== id))

  return openPopups.map(id => {
    const p = popups?.find(x => x.id === id)
    if (!p) return null
    const sz = p.settings?.width || 'auto'
    const anim = p.settings?.animation || 'fade'
    const widthMap = { auto: 'auto', small: '400px', medium: '600px', large: '900px', full: '100%' }
    return (
      <div key={id} className={`popup-overlay popup-anim-${anim}`} onClick={() => closePopup(id)}
        style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}>
        <div className="popup-content" onClick={e => e.stopPropagation()}
          style={{ background: '#1a1a2e', border: '1px solid #2a2a44', borderRadius: 8, padding: 24, maxWidth: widthMap[sz] || '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          {p.settings?.closeBtn !== false && <button onClick={() => closePopup(id)}
            style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer', fontFamily: 'inherit' }}>&times;</button>}
          {p.name && <div style={{ fontSize: 10, fontWeight: 700, color: '#6cab96', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>{p.name}</div>}
          {p.rows?.map((row, ri) => {
            if (row.type === 'section' && row.sectionKey) {
              return <div key={row.id} style={{ marginBottom: 12 }}>{row.sectionKey} section</div>
            }
            if (row.columns) {
              return <div key={row.id} className="elm-custom-row" style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                {row.columns.map(col => (
                  <div key={col.id} style={{ flex: col.width / 100, minWidth: 0 }}>
                    {col.blocks?.map(b => {
                      if (b.type === 'text') return <div key={b.id} dangerouslySetInnerHTML={{ __html: b.content || '' }} style={{ color: '#a0a0b0', fontSize: 13, lineHeight: 1.6 }} />
                      if (b.type === 'heading') { const Tag = b.level || 'h2'; return <Tag key={b.id} style={{ color: '#d5d8e2', margin: '8px 0' }}>{b.content}</Tag> }
                      if (b.type === 'button') return <a key={b.id} href={b.url || '#'} style={{ display: 'inline-flex', padding: '8px 20px', borderRadius: 4, background: b.style === 'outline' ? 'transparent' : '#6cab96', color: b.style === 'outline' ? '#6cab96' : '#0f0f1a', border: b.style === 'outline' ? '1px solid #6cab96' : 'none', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>{b.text || 'Button'}</a>
                      if (b.type === 'image') return <img key={b.id} src={b.src} alt={b.alt} style={{ maxWidth: '100%', borderRadius: 4 }} onError={e => { e.target.style.display = 'none' }} />
                      return null
                    })}
                  </div>
                ))}
              </div>
            }
            return null
          })}
        </div>
      </div>
    )
  })
}
