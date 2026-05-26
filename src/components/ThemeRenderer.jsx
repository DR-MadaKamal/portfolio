export default function ThemeRenderer({ theme, localData }) {
  return theme.rows?.map(row => {
    if (row.type === 'section' && row.sectionKey) {
      return <div key={row.id} style={{ marginBottom: 0 }}>{row.sectionKey}</div>
    }
    if (row.columns) {
      return (
        <div key={row.id} style={{ padding: '8px 16px', background: row.styles?.background || 'transparent', color: row.styles?.color || 'inherit', textAlign: row.styles?.textAlign || 'inherit' }}>
          <div style={{ maxWidth: row.styles?.maxWidth || '1200px', margin: '0 auto', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {row.columns.map(col => (
              <div key={col.id} style={{ flex: col.width / 100, minWidth: 0 }}>
                {col.blocks?.map(b => {
                  if (b.type === 'text') return <div key={b.id} dangerouslySetInnerHTML={{ __html: b.content || '' }} style={{ color: '#a0a0b0', fontSize: 13, lineHeight: 1.6 }} />
                  if (b.type === 'heading') { const Tag = b.level || 'h2'; return <Tag key={b.id} style={{ color: '#d5d8e2', margin: '4px 0' }}>{b.content}</Tag> }
                  if (b.type === 'button') return <a key={b.id} href={b.url || '#'} style={{ display: 'inline-flex', padding: '8px 20px', borderRadius: 4, background: b.style === 'outline' ? 'transparent' : '#6cab96', color: b.style === 'outline' ? '#6cab96' : '#0f0f1a', border: b.style === 'outline' ? '1px solid #6cab96' : 'none', textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>{b.text || 'Button'}</a>
                  if (b.type === 'image') return <img key={b.id} src={b.src} alt={b.alt} style={{ maxWidth: '100%', height: 'auto', maxHeight: 50 }} onError={e => { e.target.style.display = 'none' }} />
                  if (b.type === 'icon') return <i key={b.id} className={`fas ${b.icon || 'fa-star'}`} style={{ fontSize: b.size === '3x' ? '1.5rem' : b.size === '2x' ? '1.2rem' : '0.9rem', color: b.color || '#6cab96' }} />
                  if (b.type === 'html') return <div key={b.id} dangerouslySetInnerHTML={{ __html: b.html || '' }} />
                  if (b.type === 'nav-menu') {
                    const links = localData?.projects || []
                    return <nav key={b.id} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {links.slice(0, 4).map((p, i) => <a key={i} href={`#${p.title}`} style={{ color: '#a0a0b0', textDecoration: 'none', fontSize: 13, padding: '4px 8px' }}>{p.title}</a>)}
                    </nav>
                  }
                  return null
                })}
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  })
}
