import { useState, useEffect, useRef, useCallback } from 'react'
import { SortableList, SortableItem } from './SortableList'

let _id = Date.now()
const uid = () => `elm_${_id++}`

const WIDGETS = {
  basic: {
    label: 'Basic',
    items: {
      heading: { icon: 'fa-heading', label: 'Heading', defaults: { level: 'h2', content: 'New Heading' } },
      text: { icon: 'fa-font', label: 'Text Editor', defaults: { content: '<p>Click to edit this text.</p>' } },
      image: { icon: 'fa-image', label: 'Image', defaults: { src: '', alt: 'Image', caption: '' } },
      button: { icon: 'fa-link', label: 'Button', defaults: { text: 'Click Me', url: '#', style: 'solid', size: 'md' } },
      divider: { icon: 'fa-divide', label: 'Divider', defaults: {} },
      spacer: { icon: 'fa-arrows-alt-v', label: 'Spacer', defaults: { height: 40 } },
    }
  },
  media: {
    label: 'Media',
    items: {
      video: { icon: 'fa-video', label: 'Video', defaults: { src: '', caption: '' } },
      icon: { icon: 'fa-star', label: 'Icon', defaults: { icon: 'fa-star', size: '2x', color: '' } },
    }
  },
  layout: {
    label: 'Layout',
    items: {
      columns: { icon: 'fa-columns', label: 'Columns', defaults: { count: 2, gap: 20 } },
      html: { icon: 'fa-code', label: 'HTML', defaults: { html: '<div>Custom HTML content</div>' } },
    }
  },
  sections: {
    label: 'Sections',
    items: {
      hero: { icon: 'fa-user', label: 'Hero Section' },
      about: { icon: 'fa-info-circle', label: 'About Section' },
      projects: { icon: 'fa-code', label: 'Projects Section' },
      articles: { icon: 'fa-newspaper', label: 'Articles Section' },
      testimonials: { icon: 'fa-star', label: 'Testimonials' },
      logos: { icon: 'fa-handshake', label: 'Client Logos' },
      achievements: { icon: 'fa-trophy', label: 'Achievements' },
      process: { icon: 'fa-cogs', label: 'Services Timeline' },
      tools: { icon: 'fa-tools', label: 'Tools Showcase' },
      faq: { icon: 'fa-question-circle', label: 'FAQ' },
      contact: { icon: 'fa-envelope', label: 'Contact' },
      map: { icon: 'fa-map-marker-alt', label: 'Map' },
    }
  }
}

const defaultSectionRow = (key) => ({ id: uid(), type: 'section', sectionKey: key, styles: {} })
const defaultCustomRow = () => ({ id: uid(), type: 'custom', columns: [{ id: uid(), width: 100, blocks: [], styles: {} }], styles: {} })

export default function VisualBuilder({ data, onSave, onExit }) {
  const [rows, setRows] = useState(() => data.builder?.rows?.length ? data.builder.rows : buildDefaultRows(data))
  const [selected, setSelected] = useState(null)
  const [leftTab, setLeftTab] = useState('widgets')
  const [history, setHistory] = useState([JSON.parse(JSON.stringify(data.builder?.rows?.length ? data.builder.rows : buildDefaultRows(data)))])
  const [historyIdx, setHistoryIdx] = useState(0)
  const [responsiveMode, setResponsiveMode] = useState('desktop')
  const [localData, setLocalData] = useState(data)
  const r = useRef(true)
  const searchRef = useRef(null)
  const [search, setSearch] = useState('')
  const [editingInline, setEditingInline] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)

  useEffect(() => { setLocalData(data) }, [data])
  useEffect(() => { document.addEventListener('click', () => setContextMenu(null)); return () => document.removeEventListener('click', () => setContextMenu(null)) }, [])

  useEffect(() => {
    if (r.current) { r.current = false; return }
    const timer = setTimeout(() => onSave({ ...localData, builder: { rows } }, 'Builder'), 500)
    return () => clearTimeout(timer)
  }, [rows])

  const pushHistory = useCallback((newRows) => {
    setRows(newRows)
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIdx + 1)
      const next = [...trimmed, JSON.parse(JSON.stringify(newRows))].slice(-50)
      setHistoryIdx(next.length - 1)
      return next
    })
  }, [historyIdx])

  const undo = () => { if (historyIdx > 0) { const i = historyIdx - 1; setHistoryIdx(i); setRows(JSON.parse(JSON.stringify(history[i]))) } }
  const redo = () => { if (historyIdx < history.length - 1) { const i = historyIdx + 1; setHistoryIdx(i); setRows(JSON.parse(JSON.stringify(history[i]))) } }

  const addSectionRow = (key, idx) => { const arr = [...rows]; arr.splice(idx ?? rows.length, 0, defaultSectionRow(key)); pushHistory(arr) }
  const addCustomRow = (idx) => { const arr = [...rows]; arr.splice(idx ?? rows.length, 0, defaultCustomRow()); pushHistory(arr) }
  const removeRow = (id) => { if (confirm('Delete this section?')) pushHistory(rows.filter(r => r.id !== id)) }
  const duplicateRow = (id) => { const ri = rows.findIndex(r => r.id === id); if (ri < 0) return; const c = JSON.parse(JSON.stringify(rows[ri])); c.id = uid(); const arr = [...rows]; arr.splice(ri + 1, 0, c); pushHistory(arr) }

  const addBlockToCol = (rowId, colId, type) => {
    const cat = Object.values(WIDGETS).find(c => c.items[type])
    const meta = cat?.items[type]
    if (!meta) return
    pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: [...c.blocks, { id: uid(), type, ...JSON.parse(JSON.stringify(meta.defaults || {})), styles: {} }] } : c) } : r))
  }

  const removeBlock = (rowId, colId, blockId) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.filter(b => b.id !== blockId) } : c) } : r))
  const updateBlockField = (rowId, colId, blockId, patch) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.map(b => b.id === blockId ? { ...b, ...patch } : b) } : c) } : r))
  const updateBlockStyle = (rowId, colId, blockId, stylePatch) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.map(b => b.id === blockId ? { ...b, styles: { ...(b.styles || {}), ...stylePatch } } : b) } : c) } : r))
  const duplicateBlock = (rowId, colId, blockId) => { const ri = rows.findIndex(r => r.id === rowId); if (ri < 0) return; const col = rows[ri].columns.find(c => c.id === colId); if (!col) return; const bi = col.blocks.findIndex(b => b.id === blockId); if (bi < 0) return; const dup = { ...JSON.parse(JSON.stringify(col.blocks[bi])), id: uid() }; pushHistory(rows.map((r, i) => i !== ri ? r : { ...r, columns: r.columns.map(c => c.id !== colId ? c : { ...c, blocks: [...c.blocks.slice(0, bi + 1), dup, ...c.blocks.slice(bi + 1)] }) })) }

  const addColumn = (rowId) => pushHistory(rows.map(r => r.id === rowId && r.columns.length < 4 ? { ...r, columns: [...r.columns, { id: uid(), width: 0, blocks: [], styles: {} }].map(c => ({ ...c, width: Math.round(100 / (r.columns.length + 1)) })) } : r))
  const removeColumn = (rowId, colId) => pushHistory(rows.map(r => r.id === rowId && r.columns.length > 1 ? { ...r, columns: r.columns.filter(c => c.id !== colId).map(c => ({ ...c, width: Math.round(100 / (r.columns.length - 1)) })) } : r))

  const allWidgets = Object.values(WIDGETS).flatMap(c => Object.entries(c.items).map(([k, v]) => ({ key: k, ...v, category: c.label })))
  const filteredWidgets = search ? allWidgets.filter(w => w.label.toLowerCase().includes(search.toLowerCase())) : null

  const isSection = (type) => WIDGETS.sections.items[type]

  const canvasWidth = responsiveMode === 'mobile' ? '360px' : responsiveMode === 'tablet' ? '768px' : '100%'

  return (
    <div className="elm-overlay" onContextMenu={(e) => { if (e.target.closest('.elm-canvas')) { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, target: e.target }) } }}>
      <div className="elm-topbar">
        <button className="elm-topbar-btn elm-exit-btn" onClick={onExit}><i className="fas fa-arrow-left"></i> <span>Exit Builder</span></button>
        <div className="elm-topbar-center">
          <div className="elm-topbar-logo"><i className="fas fa-pencil-ruler"></i> Builder</div>
          <div className="elm-topbar-divider"></div>
          <button className="elm-topbar-btn" onClick={undo} disabled={historyIdx <= 0} title="Undo (Ctrl+Z)"><i className="fas fa-undo"></i></button>
          <button className="elm-topbar-btn" onClick={redo} disabled={historyIdx >= history.length - 1} title="Redo (Ctrl+Shift+Z)"><i className="fas fa-redo"></i></button>
          <div className="elm-topbar-divider"></div>
          <div className="elm-responsive">
            <button className={`elm-resp-btn ${responsiveMode === 'desktop' ? 'active' : ''}`} onClick={() => setResponsiveMode('desktop')} title="Desktop"><i className="fas fa-desktop"></i></button>
            <button className={`elm-resp-btn ${responsiveMode === 'tablet' ? 'active' : ''}`} onClick={() => setResponsiveMode('tablet')} title="Tablet"><i className="fas fa-tablet-alt"></i></button>
            <button className={`elm-resp-btn ${responsiveMode === 'mobile' ? 'active' : ''}`} onClick={() => setResponsiveMode('mobile')} title="Mobile"><i className="fas fa-mobile-alt"></i></button>
          </div>
        </div>
        <div className="elm-topbar-right">
          <span className="elm-status" id="elm-status">Saving...</span>
          <button className="elm-save-btn" onClick={() => onSave({ ...localData, builder: { rows } })}><i className="fas fa-save"></i> Save</button>
        </div>
      </div>

      <div className="elm-body">
        <div className={`elm-panel ${leftTab === 'widgets' ? '' : ''}`}>
          <div className="elm-panel-tabs">
            <button className={`elm-panel-tab ${leftTab === 'widgets' ? 'active' : ''}`} onClick={() => setLeftTab('widgets')}><i className="fas fa-th"></i> Widgets</button>
            <button className={`elm-panel-tab ${leftTab === 'structure' ? 'active' : ''}`} onClick={() => setLeftTab('structure')}><i className="fas fa-list"></i> Structure</button>
            <button className={`elm-panel-tab ${leftTab === 'settings' ? 'active' : ''}`} onClick={() => setLeftTab('settings')}><i className="fas fa-cog"></i> Settings</button>
          </div>
          <div className="elm-panel-content">
            {leftTab === 'widgets' && (
              <div className="elm-widgets">
                <div className="elm-widgets-search"><input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search widgets..." /></div>
                {(filteredWidgets || Object.entries(WIDGETS)).map(([catKey, cat]) => {
                  if (filteredWidgets) return null
                  const { label, items } = cat
                  return (
                    <div key={catKey} className="elm-widget-category">
                      <div className="elm-widget-cat-label">{label}</div>
                      <div className="elm-widget-grid">
                        {Object.entries(items).map(([key, meta]) => (
                          <div key={key} className="elm-widget-item" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', key)}
                            onClick={() => {
                              if (isSection(key)) addSectionRow(key, rows.length)
                            }}>
                            <i className={`fas ${meta.icon}`}></i>
                            <span>{meta.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {filteredWidgets && (
                  <div className="elm-widget-grid">
                    {filteredWidgets.map(w => (
                      <div key={w.key} className="elm-widget-item" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', w.key)}>
                        <i className={`fas ${w.icon}`}></i><span>{w.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {leftTab === 'structure' && (
              <div className="elm-structure">
                <div className="elm-structure-title"><i className="fas fa-sitemap"></i> Page Structure</div>
                {rows.length === 0 && <p style={{fontSize:'0.75rem',color:'var(--text-dim)',padding:12}}>No sections yet.</p>}
                {rows.map((row, ri) => (
                  <div key={row.id} className={`elm-struct-item ${selected?.rowId === row.id ? 'active' : ''}`} onClick={() => setSelected({ rowId: row.id, colId: null, element: 'row' })}>
                    <i className={`fas ${row.type === 'section' ? 'fa-layer-group' : 'fa-columns'}`}></i>
                    <span>{row.type === 'section' ? (WIDGETS.sections.items[row.sectionKey]?.label || row.sectionKey) : `Row ${ri + 1}`}</span>
                    <span className="elm-struct-badge">{row.type === 'section' ? 'Section' : `${row.columns.length} col`}</span>
                  </div>
                ))}
              </div>
            )}
            {leftTab === 'settings' && selected?.element !== 'row' && selected?.block && (
              <div className="elm-settings-panel">
                <div className="elm-settings-title">{WIDGETS.basic.items[selected.block.type]?.label || selected.block.type} Settings</div>
                <div className="elm-settings-section"><div className="elm-settings-heading">Content</div>
                  {selected.block.type === 'text' && <textarea rows={6} value={selected.block.content || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { content: e.target.value })} className="elm-input elm-textarea" />}
                  {selected.block.type === 'heading' && (<><select value={selected.block.level || 'h2'} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { level: e.target.value })} className="elm-input"><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option></select><input value={selected.block.content || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { content: e.target.value })} className="elm-input" placeholder="Heading text" /></>)}
                  {selected.block.type === 'image' && (<><input value={selected.block.src || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { src: e.target.value })} className="elm-input" placeholder="Image URL" /><input value={selected.block.alt || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { alt: e.target.value })} className="elm-input" placeholder="Alt text" /><input value={selected.block.caption || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { caption: e.target.value })} className="elm-input" placeholder="Caption" /></>)}
                  {selected.block.type === 'button' && (<><input value={selected.block.text || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { text: e.target.value })} className="elm-input" placeholder="Button text" /><input value={selected.block.url || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { url: e.target.value })} className="elm-input" placeholder="URL (https://...)" /><select value={selected.block.style || 'solid'} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { style: e.target.value })} className="elm-input"><option value="solid">Solid</option><option value="outline">Outline</option></select></>)}
                  {selected.block.type === 'spacer' && <input type="number" value={selected.block.height || 40} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { height: parseInt(e.target.value) || 40 })} className="elm-input" placeholder="Height in px" />}
                  {selected.block.type === 'html' && <textarea rows={6} value={selected.block.html || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selected.block.id, { html: e.target.value })} className="elm-input elm-textarea elm-mono" />}
                </div>
                <div className="elm-settings-section"><div className="elm-settings-heading">Style</div>
                  <label className="elm-settings-label">Background</label><input value={(selected.block.styles || {}).background || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selected.block.id, { background: e.target.value })} className="elm-input" placeholder="color / gradient / URL" />
                  <label className="elm-settings-label">Text Color</label><input value={(selected.block.styles || {}).color || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selected.block.id, { color: e.target.value })} className="elm-input" placeholder="#e0e0e0" />
                  <label className="elm-settings-label">Text Align</label><select value={(selected.block.styles || {}).textAlign || 'left'} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selected.block.id, { textAlign: e.target.value })} className="elm-input"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
                  <label className="elm-settings-label">Border Radius (px)</label><input type="number" value={parseInt((selected.block.styles || {}).borderRadius) || 0} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selected.block.id, { borderRadius: e.target.value + 'px' })} className="elm-input" />
                  <label className="elm-settings-label">Padding</label>
                  <div className="elm-spacing-grid">{['top','right','bottom','left'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'var(--text-dim)'}}>{s[0].toUpperCase()}</label><input type="number" value={parseInt((selected.block.styles || {})[s]) || 0} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selected.block.id, { [s]: e.target.value + 'px' })} className="elm-input elm-input-sm" /></div>))}</div>
                  <label className="elm-settings-label">Margin</label>
                  <div className="elm-spacing-grid">{['marginTop','marginRight','marginBottom','marginLeft'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'var(--text-dim)'}}>{s.replace('margin','')[0]}</label><input type="number" value={parseInt((selected.block.styles || {})[s]) || 0} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selected.block.id, { [s]: e.target.value + 'px' })} className="elm-input elm-input-sm" /></div>))}</div>
                </div>
              </div>
            )}
            {leftTab === 'settings' && (!selected?.block || selected?.element === 'row') && (
              <div className="elm-settings-panel"><p style={{fontSize:'0.75rem',color:'var(--text-dim)',padding:12}}>Click on a widget in the preview to edit its settings.</p></div>
            )}
          </div>
        </div>

        <div className="elm-canvas-wrap" style={{ justifyContent: responsiveMode !== 'desktop' ? 'center' : 'stretch' }}>
          <div className="elm-canvas" style={{ maxWidth: canvasWidth, width: '100%' }}>
            {rows.length === 0 && (
              <div className="elm-empty-state">
                <i className="fas fa-plus-circle"></i>
                <h3>Start Building Your Page</h3>
                <p>Drag widgets from the left panel onto the canvas, or click a section widget to add it.</p>
              </div>
            )}

            <SortableList items={rows} onReorder={(arr) => pushHistory(arr)} getId={r => r.id}>
              {rows.map((row, ri) => (
                <SortableItem key={row.id} id={row.id}>
                  {(listeners) => (
                    <div className={`elm-section ${selected?.rowId === row.id ? 'elm-section-active' : ''}`}
                      onClick={() => setSelected({ rowId: row.id, colId: null, element: 'row' })}
                      onMouseEnter={() => document.getElementById(`section-tools-${row.id}`)?.classList.add('visible')}
                      onMouseLeave={() => document.getElementById(`section-tools-${row.id}`)?.classList.remove('visible')}>
                      <div className="elm-section-handle" {...listeners}><i className="fas fa-grip-vertical"></i></div>
                      <div id={`section-tools-${row.id}`} className="elm-section-tools">
                        <span className="elm-section-badge">{row.type === 'section' ? (WIDGETS.sections.items[row.sectionKey]?.label || row.sectionKey) : 'Custom Row'}</span>
                        {row.type === 'custom' && <button className="elm-tool-btn" onClick={(e) => { e.stopPropagation(); addColumn(row.id) }} title="Add Column"><i className="fas fa-columns"></i></button>}
                        <button className="elm-tool-btn" onClick={(e) => { e.stopPropagation(); duplicateRow(row.id) }} title="Duplicate"><i className="fas fa-copy"></i></button>
                        <button className="elm-tool-btn elm-tool-btn-del" onClick={(e) => { e.stopPropagation(); removeRow(row.id) }} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                      {row.type === 'section' ? (
                        <div className="elm-section-preview">
                          <div className="elm-section-preview-header"><i className={`fas ${WIDGETS.sections.items[row.sectionKey]?.icon || 'fa-layer-group'}`}></i> {WIDGETS.sections.items[row.sectionKey]?.label || row.sectionKey}</div>
                          <div className="elm-section-preview-body">
                            <span className="elm-section-preview-placeholder">Section content rendered on live site</span>
                          </div>
                        </div>
                      ) : (
                        <div className="elm-custom-row">
                          {row.columns.map(col => (
                            <div key={col.id} className={`elm-column ${selected?.colId === col.id ? 'elm-column-active' : ''}`}
                              style={{ flex: col.width / 100, minWidth: 0 }}
                              onClick={(e) => { e.stopPropagation(); setSelected({ rowId: row.id, colId: col.id, element: 'column' }) }}
                              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
                              onDrop={(e) => { const t = e.dataTransfer.getData('text/plain'); if (t && !isSection(t)) addBlockToCol(row.id, col.id, t); else if (t && isSection(t)) addSectionRow(t, ri + 1) }}>
                              <div className="elm-col-resize">
                                <span className="elm-col-width-badge">{col.width}%</span>
                                {row.columns.length > 1 && <button className="elm-col-remove" onClick={(e) => { e.stopPropagation(); removeColumn(row.id, col.id) }}><i className="fas fa-times"></i></button>}
                              </div>
                              {col.blocks.length === 0 && <div className="elm-col-empty">Drop widget here</div>}
                              {col.blocks.map(b => {
                                const isSel = selected?.block?.id === b.id
                                return (
                                  <div key={b.id} className={`elm-widget ${isSel ? 'elm-widget-active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); setSelected({ rowId: row.id, colId: col.id, block: b, element: 'widget' }) }}>
                                    {isSel && <div className="elm-widget-tools"><button className="elm-widget-tool" onClick={(e) => { e.stopPropagation(); duplicateBlock(row.id, col.id, b.id) }} title="Duplicate"><i className="fas fa-copy"></i></button><button className="elm-widget-tool elm-tool-btn-del" onClick={(e) => { e.stopPropagation(); removeBlock(row.id, col.id, b.id) }} title="Delete"><i className="fas fa-trash"></i></button></div>}
                                    <WidgetPreview block={b} isSelected={isSel} />
                                  </div>
                                )
                              })}
                              <div className="elm-add-widget">
                                <select className="elm-add-select" value="" onChange={(e) => { if (e.target.value) { addBlockToCol(row.id, col.id, e.target.value); e.target.value = '' } }}>
                                  <option value="">+ Add Widget</option>
                                  {Object.entries(WIDGETS).filter(([k]) => k !== 'sections').flatMap(([, cat]) => Object.entries(cat.items).map(([k, m]) => <option key={k} value={k}>{m.label}</option>))}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </SortableItem>
              ))}
            </SortableList>

            <button className="elm-add-section" onClick={() => addCustomRow(rows.length)}>
              <i className="fas fa-plus"></i> Add New Section
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function WidgetPreview({ block, isSelected }) {
  const s = block.styles || {}
  const wrap = { padding: '6px', transition: 'all 0.2s', ...(s.background ? { background: s.background } : {}), ...(s.color ? { color: s.color } : {}), borderRadius: s.borderRadius || '4px', textAlign: s.textAlign || 'left', ...(s.marginTop ? { marginTop: s.marginTop } : {}), ...(s.marginBottom ? { marginBottom: s.marginBottom } : {}), ...(s.padding ? { padding: s.padding } : {}) }
  if (block.type === 'text') return <div style={wrap} dangerouslySetInnerHTML={{ __html: block.content || '' }} />
  if (block.type === 'heading') { const Tag = block.level || 'h2'; return <Tag style={wrap}>{block.content || 'Heading'}</Tag> }
  if (block.type === 'image') return <div style={wrap}><img src={block.src} alt={block.alt} style={{ maxWidth: '100%', display: 'block' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += '<span style=\'color:var(--text-dim);font-size:0.75rem\'>Image placeholder</span>' }} />{block.caption && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{block.caption}</p>}</div>
  if (block.type === 'button') return <div style={wrap}><a href={block.url || '#'} className={`btn ${block.style === 'solid' ? 'btn-solid' : ''} btn-sm`} style={{ display: 'inline-flex' }}>{block.text || 'Button'}</a></div>
  if (block.type === 'divider') return <div style={wrap}><hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} /></div>
  if (block.type === 'spacer') return <div style={{ ...wrap, height: (block.height || 40) + 'px', background: 'transparent' }} />
  if (block.type === 'video') return <div style={wrap}><i className="fas fa-play-circle" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i><p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Video: {block.src || 'No URL set'}</p></div>
  if (block.type === 'icon') return <div style={wrap}><i className={`fas ${block.icon || 'fa-star'}`} style={{ fontSize: block.size === '3x' ? '2rem' : block.size === '2x' ? '1.5rem' : '1rem', color: block.color || 'var(--accent)' }}></i></div>
  if (block.type === 'html') return <div style={wrap} dangerouslySetInnerHTML={{ __html: block.html || '' }} />
  return <div style={wrap}>Unknown widget</div>
}

function buildDefaultRows(data) {
  const sections = data.settings?.sections || {}
  return Object.entries(sections)
    .filter(([, s]) => s.visible !== false)
    .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
    .map(([key]) => defaultSectionRow(key))
}
