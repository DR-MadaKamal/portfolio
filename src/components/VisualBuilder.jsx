import { useState, useEffect, useRef, useCallback } from 'react'
import { SortableList, SortableItem } from './SortableList'

let _id = Date.now()
const uid = () => `vb_${_id++}`

const TYPES = {
  text: { icon: 'fa-font', label: 'Text', defaults: { content: '<p>Edit this text</p>' } },
  heading: { icon: 'fa-heading', label: 'Heading', defaults: { level: 'h2', content: 'New Heading' } },
  image: { icon: 'fa-image', label: 'Image', defaults: { src: '/portfolio/photo.png', alt: '', caption: '' } },
  button: { icon: 'fa-link', label: 'Button', defaults: { text: 'Click Me', url: '#', style: 'solid' } },
  spacer: { icon: 'fa-arrows-alt-v', label: 'Spacer', defaults: { height: 40 } },
  divider: { icon: 'fa-divide', label: 'Divider', defaults: {} },
  html: { icon: 'fa-code', label: 'HTML', defaults: { html: '<div>Custom HTML</div>' } },
  columns: { icon: 'fa-columns', label: 'Columns', defaults: { count: 2, gap: 20 } },
}

const SECTION_KEYS = [
  { key: 'hero', icon: 'fa-user', label: 'Hero' },
  { key: 'about', icon: 'fa-info-circle', label: 'About' },
  { key: 'logos', icon: 'fa-handshake', label: 'Client Logos' },
  { key: 'projects', icon: 'fa-code', label: 'Projects' },
  { key: 'articles', icon: 'fa-newspaper', label: 'Articles' },
  { key: 'testimonials', icon: 'fa-star', label: 'Testimonials' },
  { key: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
  { key: 'process', icon: 'fa-cogs', label: 'Services Timeline' },
  { key: 'tools', icon: 'fa-tools', label: 'Tools' },
  { key: 'faq', icon: 'fa-question-circle', label: 'FAQ' },
  { key: 'contact', icon: 'fa-envelope', label: 'Contact' },
  { key: 'map', icon: 'fa-map-marker-alt', label: 'Map' },
]

const defaultRow = () => ({ id: uid(), type: 'row', columns: [{ id: uid(), width: 100, blocks: [], styles: {} }], styles: {} })

export default function VisualBuilder({ data, onSave }) {
  const [rows, setRows] = useState(() => data.builder?.rows?.length ? data.builder.rows : buildDefaultRows(data))
  const [selected, setSelected] = useState(null)
  const [editingBlock, setEditingBlock] = useState(null)
  const [history, setHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [showPalette, setShowPalette] = useState(false)
  const [showAddRow, setShowAddRow] = useState(null)
  const [localData, setLocalData] = useState(data)
  const r = useRef(true)

  useEffect(() => { setLocalData(data) }, [data])

  useEffect(() => {
    if (r.current) { r.current = false; return }
    const timer = setTimeout(() => {
      onSave({ ...localData, builder: { rows } }, 'Visual Builder')
    }, 800)
    return () => clearTimeout(timer)
  }, [rows, localData.personalData?.firstName])

  const pushHistory = useCallback((newRows) => {
    setRows(newRows)
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIdx + 1)
      const next = [...trimmed, JSON.parse(JSON.stringify(newRows))].slice(-30)
      setHistoryIdx(next.length - 1)
      return next
    })
  }, [historyIdx])

  const undo = () => { if (historyIdx > 0) { setHistoryIdx(i => i - 1); setRows(JSON.parse(JSON.stringify(history[historyIdx - 1]))) } }
  const redo = () => { if (historyIdx < history.length - 1) { setHistoryIdx(i => i + 1); setRows(JSON.parse(JSON.stringify(history[historyIdx + 1]))) } }

  const addRow = (type, idx) => {
    const newRows = [...rows]
    const insertAt = idx ?? rows.length
    if (type === 'custom') {
      newRows.splice(insertAt, 0, defaultRow())
    }
    pushHistory(newRows)
  }

  const removeRow = (id) => { if (confirm('Remove this row?')) pushHistory(rows.filter(r => r.id !== id)) }

  const updateColWidth = (rowId, colId, width) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, width } : c) } : r))

  const addBlockToCol = (rowId, colId, type) => {
    const meta = TYPES[type] || { defaults: { content: '' } }
    pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: [...c.blocks, { id: uid(), type, ...JSON.parse(JSON.stringify(meta.defaults)), styles: {} }] } : c) } : r))
  }

  const removeBlock = (rowId, colId, blockId) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.filter(b => b.id !== blockId) } : c) } : r))

  const updateBlock = (rowId, colId, blockId, patch) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.map(b => b.id === blockId ? { ...b, ...patch } : b) } : c) } : r))

  const moveBlock = (rowId, colId, fromIdx, toIdx) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: (arr => { const a = [...arr]; const [m] = a.splice(fromIdx, 1); a.splice(toIdx, 0, m); return a })(c.blocks) } : c) } : r))

  const addColumn = (rowId) => pushHistory(rows.map(r => r.id === rowId && r.columns.length < 4 ? { ...r, columns: [...r.columns, { id: uid(), width: Math.round(100 / (r.columns.length + 1)), blocks: [], styles: {} }].map(c => ({ ...c, width: Math.round(100 / (r.columns.length + 1)) })) } : r))

  const removeColumn = (rowId, colId) => pushHistory(rows.map(r => r.id === rowId && r.columns.length > 1 ? { ...r, columns: r.columns.filter(c => c.id !== colId).map(c => ({ ...c, width: Math.round(100 / (r.columns.length - 1)) })) } : r))

  const renderStylePanel = () => {
    if (!selected || !selected.block) return null
    const b = selected.block
    return (
      <div className="vb-style-panel">
        <div className="vb-sp-title">Block Settings</div>
        <div className="vb-sp-section">
          <div className="vb-sp-label">Content</div>
          {b.type === 'text' && <textarea rows={4} value={b.content || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { content: e.target.value })} style={{width:'100%',padding:'6px 8px',borderRadius:4,border:'1px solid var(--border)',background:'var(--bg)',color:'var(--text)',fontSize:'0.8rem',fontFamily:'inherit'}} />}
          {b.type === 'heading' && (<><select value={b.level || 'h2'} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { level: e.target.value })} style={{width:'100%',padding:'6px',marginBottom:6,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg)',color:'var(--text)'}}><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option></select><input value={b.content || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { content: e.target.value })} style={{width:'100%',padding:'6px 8px',borderRadius:4,border:'1px solid var(--border)',background:'var(--bg)',color:'var(--text)'}} /></>)}
          {b.type === 'image' && (<><div className="admin-field"><label>Image URL</label><input value={b.src || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { src: e.target.value })} /></div><div className="admin-field"><label>Alt Text</label><input value={b.alt || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { alt: e.target.value })} /></div><div className="admin-field"><label>Caption</label><input value={b.caption || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { caption: e.target.value })} /></div></>)}
          {b.type === 'button' && (<><div className="admin-field"><label>Button Text</label><input value={b.text || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { text: e.target.value })} /></div><div className="admin-field"><label>URL</label><input value={b.url || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { url: e.target.value })} /></div></>)}
          {b.type === 'spacer' && <div className="admin-field"><label>Height (px)</label><input type="number" value={b.height || 40} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { height: parseInt(e.target.value) || 40 })} /></div>}
          {b.type === 'html' && <textarea rows={6} value={b.html || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { html: e.target.value })} style={{width:'100%',padding:'6px 8px',borderRadius:4,border:'1px solid var(--border)',background:'var(--bg)',color:'var(--text)',fontSize:'0.75rem',fontFamily:'monospace'}} />}
        </div>
        <div className="vb-sp-section">
          <div className="vb-sp-label">Style</div>
          {['padding','margin'].forEach(prop => (
            <div key={prop} className="vb-sp-row"><span className="vb-sp-row-label">{prop}</span>
              {['top','right','bottom','left'].map(side => (<input key={side} type="number" value={parseInt((b.styles || {})[`${prop}${side.charAt(0).toUpperCase() + side.slice(1)}`]) || 0} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { styles: { ...(b.styles || {}), [`${prop}${side.charAt(0).toUpperCase() + side.slice(1)}`]: e.target.value + 'px' } })} placeholder={side[0]} style={{width:36,padding:'2px 4px',fontSize:'0.7rem',textAlign:'center',borderRadius:3,border:'1px solid var(--border)',background:'var(--bg)',color:'var(--text)'}} />))}
            </div>
          ))}
          <div className="admin-field"><label>Background</label><input value={(b.styles || {}).background || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { styles: { ...(b.styles || {}), background: e.target.value } })} placeholder="color / gradient / url" /></div>
          <div className="admin-field"><label>Text Color</label><input value={(b.styles || {}).color || ''} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { styles: { ...(b.styles || {}), color: e.target.value } })} placeholder="#e0e0e0" /></div>
          <div className="admin-field"><label>Text Align</label><select value={(b.styles || {}).textAlign || 'left'} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { styles: { ...(b.styles || {}), textAlign: e.target.value } })} style={{width:'100%',padding:'4px',borderRadius:4,border:'1px solid var(--border)',background:'var(--bg)',color:'var(--text)'}}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
          <div className="admin-field"><label>Border Radius</label><input type="number" value={parseInt((b.styles || {}).borderRadius) || 0} onChange={e => updateBlock(selected.rowId, selected.colId, b.id, { styles: { ...(b.styles || {}), borderRadius: e.target.value + 'px' } })} placeholder="0" /></div>
        </div>
      </div>
    )
  }

  const renderBlockOnCanvas = (block, rowId, colId) => {
    const isSelected = selected?.block?.id === block.id
    const click = (e) => { e.stopPropagation(); setSelected({ rowId, colId, block }); setEditingBlock(isSelected ? null : block.id) }
    const s = { ...block.styles }
    const wrapStyle = { position: 'relative', cursor: 'pointer', outline: isSelected ? '2px solid var(--accent)' : '1px solid transparent', outlineOffset: 1, borderRadius: 4, padding: '4px', transition: 'outline 0.15s', ...(s.background ? { background: s.background } : {}), ...(s.color ? { color: s.color } : {}), ...(s.padding ? { padding: s.padding } : {}), ...(s.margin ? { margin: s.margin } : {}), ...(s.borderRadius ? { borderRadius: s.borderRadius } : {}), textAlign: s.textAlign || 'left' }

    const el = (() => {
      if (block.type === 'text') return <div style={wrapStyle} onClick={click} dangerouslySetInnerHTML={{ __html: block.content || '' }} />
      if (block.type === 'heading') {
        const Tag = block.level || 'h2'
        return <Tag style={wrapStyle} onClick={click}>{block.content || 'Heading'}</Tag>
      }
      if (block.type === 'image') return <div style={wrapStyle} onClick={click}><img src={block.src} alt={block.alt || ''} style={{maxWidth:'100%',display:'block',borderRadius: s.borderRadius || 0}} onError={e => e.target.style.display='none'} />{block.caption && <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:4}}>{block.caption}</p>}</div>
      if (block.type === 'button') return <div style={wrapStyle} onClick={click}><a href={block.url || '#'} className={`btn ${block.btnStyle === 'solid' ? 'btn-solid' : ''} btn-sm`} style={{display:'inline-flex',cursor:'pointer'}}>{block.text || 'Button'}</a></div>
      if (block.type === 'spacer') return <div style={{...wrapStyle, height: (block.height || 40), background: 'transparent', outline: isSelected ? '2px dashed var(--border)' : '1px dashed transparent'}} onClick={click} />
      if (block.type === 'divider') return <div style={wrapStyle} onClick={click}><hr style={{border:'none',borderTop:'1px solid var(--border)',margin:0}} /></div>
      if (block.type === 'html') return <div style={wrapStyle} onClick={click} dangerouslySetInnerHTML={{ __html: block.html || '' }} />
      return <div style={wrapStyle} onClick={click}>Unknown block: {block.type}</div>
    })()

    return (
      <div key={block.id} style={{position:'relative'}}>
        {el}
        {isSelected && (
          <div style={{position:'absolute',top:-22,right:0,display:'flex',gap:2,zIndex:10}}>
            <button className="pb-btn pb-btn-del" onClick={(e) => { e.stopPropagation(); removeBlock(rowId, colId, block.id) }} style={{width:20,height:20,fontSize:'0.6rem',background:'var(--bg-alt)',border:'1px solid var(--border)',borderRadius:3}}><i className="fas fa-trash"></i></button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="vb-layout">
      <div className="vb-toolbar">
        <div className="vb-toolbar-left">
          <i className="fas fa-pencil-ruler" style={{marginRight:8}}></i>
          <strong>Visual Builder</strong>
          <span style={{fontSize:'0.7rem',color:'var(--text-dim)',marginLeft:10}}>Drag &middot; Click to edit &middot; Add rows &amp; columns</span>
        </div>
        <div className="vb-toolbar-right">
          <button className="vb-tb-btn" onClick={undo} disabled={historyIdx <= 0} title="Undo"><i className="fas fa-undo"></i></button>
          <button className="vb-tb-btn" onClick={redo} disabled={historyIdx >= history.length - 1} title="Redo"><i className="fas fa-redo"></i></button>
          <button className="vb-tb-btn" onClick={() => setShowPalette(!showPalette)} title="Block Palette"><i className="fas fa-cubes"></i> Blocks</button>
          <button className="admin-add-btn" style={{padding:'4px 14px',fontSize:'0.78rem'}} onClick={() => onSave({ ...localData, builder: { rows } })}><i className="fas fa-save" style={{marginRight:4}}></i> Save</button>
        </div>
      </div>

      <div className="vb-body">
        {showPalette && (
          <div className="vb-palette">
            <div className="vb-palette-title"><i className="fas fa-cubes"></i> Block Palette</div>
            <div className="vb-palette-section"><div className="vb-palette-heading">Sections</div>
              {SECTION_KEYS.map(sk => (
                <div key={sk.key} className="vb-palette-item" onClick={() => { setShowAddRow({ type: 'section', key: sk.key }); setShowPalette(false) }}>
                  <i className={`fas ${sk.icon}`}></i><span>{sk.label}</span>
                </div>
              ))}
            </div>
            <div className="vb-palette-section"><div className="vb-palette-heading">Blocks</div>
              {Object.entries(TYPES).map(([key, meta]) => (
                <div key={key} className="vb-palette-item" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', key)}>
                  <i className={`fas ${meta.icon}`}></i><span>{meta.label}</span>
                </div>
              ))}
            </div>
            <div className="vb-palette-section"><div className="vb-palette-heading">Layout</div>
              <div className="vb-palette-item" onClick={() => { addRow('custom', rows.length); setShowPalette(false) }}>
                <i className="fas fa-plus-circle"></i><span>Add Row</span>
              </div>
            </div>
          </div>
        )}

        <div className="vb-canvas">
          {rows.length === 0 && (
            <div className="vb-empty-state">
              <i className="fas fa-hand-pointer"></i>
              <p>Your page is empty. Start by clicking the <strong>Blocks</strong> button to add sections, or click <strong>+ Add Row</strong> below.</p>
            </div>
          )}

          {rows.map((row, ri) => (
            <div key={row.id} className={`vb-row ${selected?.rowId === row.id ? 'vb-row-selected' : ''}`}
              onClick={() => setSelected({ rowId: row.id, colId: null, block: null })}
              style={row.styles?.background ? { background: row.styles.background } : {}}>
              <div className="vb-row-toolbar">
                <span className="vb-row-badge">Row {ri + 1}</span>
                {row.columns.length < 4 && <button className="vb-row-btn" onClick={(e) => { e.stopPropagation(); addColumn(row.id) }} title="Add column"><i className="fas fa-columns"></i> +Col</button>}
                <button className="vb-row-btn" onClick={(e) => { e.stopPropagation(); removeRow(row.id) }} title="Remove row"><i className="fas fa-trash"></i></button>
              </div>
              <div className="vb-columns" style={{ display: 'flex', gap: 8 }}>
                {row.columns.map((col, ci) => (
                  <div key={col.id} className={`vb-col ${selected?.colId === col.id ? 'vb-col-selected' : ''}`}
                    style={{ flex: col.width / 100, minWidth: 0 }}
                    onClick={(e) => { e.stopPropagation(); setSelected({ rowId: row.id, colId: col.id, block: null }) }}
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
                    onDrop={(e) => { const type = e.dataTransfer.getData('text/plain'); if (type && TYPES[type]) { addBlockToCol(row.id, col.id, type) } }}>
                    <div className="vb-col-header"><span className="vb-col-width">{col.width}%</span>
                      {row.columns.length > 1 && <button className="vb-row-btn" onClick={(e) => { e.stopPropagation(); removeColumn(row.id, col.id) }} title="Remove column" style={{width:18,height:18,fontSize:'0.55rem'}}><i className="fas fa-times"></i></button>}
                    </div>
                    {col.blocks.length === 0 && <div className="vb-col-empty">Drop blocks here</div>}
                    {col.blocks.map(b => renderBlockOnCanvas(b, row.id, col.id))}
                    <div style={{textAlign:'center',padding:'4px 0'}}>
                      <select className="vb-add-block-select" value="" onChange={(e) => { if (e.target.value) { addBlockToCol(row.id, col.id, e.target.value); e.target.value = '' } }}>
                        <option value="">+ Add Block</option>
                        {Object.entries(TYPES).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button className="vb-add-row-btn" onClick={() => addRow('custom', rows.length)}>
            <i className="fas fa-plus"></i> Add Row
          </button>
        </div>

        {selected?.block && (
          <div className="vb-settings" onClick={(e) => e.stopPropagation()}>
            {renderStylePanel()}
          </div>
        )}
      </div>
    </div>
  )
}

function buildDefaultRows(data) {
  const sections = data.settings?.sections || {}
  return Object.entries(sections)
    .filter(([, s]) => s.visible !== false)
    .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
    .map(([key]) => ({ id: uid(), type: 'section', sectionKey: key, styles: {} }))
}
