import { useState, useEffect, useRef, useCallback } from 'react'
import { SortableList, SortableItem } from './SortableList'

import HeroLive from './Hero'
import AboutLive from './About'
import ClientLogoWall from './ClientLogoWall'
import ProjectsLive from './Projects'
import PortfolioGallery from './PortfolioGallery'
import CaseStudiesLive from './CaseStudies'
import TestimonialsLive from './Testimonials'
import AchievementsLive from './Achievements'
import ServicesTimelineLive from './ServicesTimeline'
import ToolsShowcaseLive from './ToolsShowcase'
import FAQSectionLive from './FAQSection'
import ArticlesLive from './Articles'
import PortfolioDownload from './PortfolioDownload'
import SayHello from './SayHello'
import GoogleMapsEmbed from './GoogleMapsEmbed'
import NewsletterSignup from './NewsletterSignup'

const SECTION_COMPONENTS = {
  hero: HeroLive,
  about: AboutLive,
  logos: ClientLogoWall,
  projects: ProjectsLive,
  'portfolio-gallery': PortfolioGallery,
  'case-studies': CaseStudiesLive,
  testimonials: TestimonialsLive,
  achievements: AchievementsLive,
  process: ServicesTimelineLive,
  tools: ToolsShowcaseLive,
  faq: FAQSectionLive,
  articles: ArticlesLive,
  'portfolio-download': PortfolioDownload,
  contact: SayHello,
  map: GoogleMapsEmbed,
  newsletter: NewsletterSignup,
}

function resolveSectionProps(sectionKey, d) {
  switch (sectionKey) {
    case 'hero': return { personalData: d.personalData, quotes: d.quotes }
    case 'about': return { editedData: d }
    case 'logos': return { clientLogos: d.clientLogos }
    case 'projects': return { projects: d.projects }
    case 'portfolio-gallery': return { works: d.portfolioWorks }
    case 'case-studies': return { caseStudies: d.caseStudies }
    case 'testimonials': return { testimonials: d.testimonials }
    case 'achievements': return { awards: d.awards, certifications: d.certifications }
    case 'process': return { servicesTimeline: d.servicesTimeline }
    case 'tools': return { tools: d.tools }
    case 'faq': return { faq: d.faq }
    case 'articles': return { articles: d.articles, initialArticleIdx: null, onArticleOpened: () => {} }
    case 'portfolio-download': return {}
    case 'contact': return {}
    case 'map': return { location: d.personalData?.location }
    case 'newsletter': return {}
    default: return {}
  }
}

const SECTION_FIELDS = {
  hero: [
    { label: 'Tagline', path: 'personalData.tagline', type: 'textarea' },
    { label: 'Title', path: 'personalData.title', type: 'text' },
    { label: 'Summary', path: 'personalData.heroSummary', type: 'textarea' },
    { label: 'Available for work', path: 'personalData.available', type: 'toggle' },
    { label: 'Phone', path: 'personalData.phone', type: 'text' },
    { label: 'Email', path: 'personalData.email', type: 'text' },
    { label: 'Location', path: 'personalData.location', type: 'text' },
    { label: 'CV URL', path: 'personalData.cvUrl', type: 'text' },
  ],
  about: [
    { label: 'About Summary', path: 'personalData.summary', type: 'textarea' },
  ],
  logos: [],
  projects: [],
  'portfolio-gallery': [],
  'case-studies': [],
  testimonials: [],
  achievements: [],
  process: [],
  tools: [],
  faq: [],
  articles: [],
  'portfolio-download': [],
  contact: [],
  map: [],
  newsletter: [],
}

function setDeep(obj, path, value) {
  const keys = path.split('.')
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]] || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {}
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
}

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
    label: 'Site Sections',
    items: (() => {
      const m = {}
      Object.entries(SECTION_COMPONENTS).forEach(([key]) => {
        const labels = { hero:'Hero', about:'About / Skills', logos:'Client Logos', projects:'Projects', 'portfolio-gallery':'Portfolio Gallery', 'case-studies':'Case Studies', testimonials:'Testimonials', achievements:'Achievements', process:'Services Timeline', tools:'Tools Showcase', faq:'FAQ', articles:'Articles', 'portfolio-download':'Portfolio Download', contact:'Say Hello', map:'Google Map', newsletter:'Newsletter' }
        const icons = { hero:'fa-user', about:'fa-info-circle', logos:'fa-handshake', projects:'fa-code', 'portfolio-gallery':'fa-images', 'case-studies':'fa-briefcase', testimonials:'fa-star', achievements:'fa-trophy', process:'fa-cogs', tools:'fa-tools', faq:'fa-question-circle', articles:'fa-newspaper', 'portfolio-download':'fa-download', contact:'fa-envelope', map:'fa-map-marker-alt', newsletter:'fa-envelope-open-text' }
        m[key] = { icon: icons[key] || 'fa-layer-group', label: labels[key] || key }
      })
      return m
    })()
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
  const [localData, setLocalData] = useState(() => JSON.parse(JSON.stringify(data)))
  const r = useRef(true)
  const [search, setSearch] = useState('')
  const latestRef = useRef({ rows, localData })

  latestRef.current = { rows, localData }

  useEffect(() => {
    if (data && Object.keys(data).length) {
      setLocalData(prev => {
        const merged = JSON.parse(JSON.stringify(data))
        if (prev?.builder?.rows) merged.builder = { rows: prev.builder.rows }
        return merged
      })
    }
  }, [data])

  useEffect(() => {
    document.addEventListener('click', () => setContextMenu(null))
    return () => document.removeEventListener('click', () => setContextMenu(null))
  }, [])

  useEffect(() => {
    if (r.current) { r.current = false; return }
    const timer = setTimeout(() => {
      const { rows: r2, localData: d } = latestRef.current
      const saved = JSON.parse(JSON.stringify(d))
      saved.builder = { rows: r2 }
      if (saved.settings?.sections) {
        const visibles = new Set()
        r2.forEach((row, i) => {
          if (row.type === 'section' && row.sectionKey) {
            if (!saved.settings.sections[row.sectionKey]) saved.settings.sections[row.sectionKey] = {}
            saved.settings.sections[row.sectionKey].visible = true
            saved.settings.sections[row.sectionKey].order = i
            visibles.add(row.sectionKey)
          }
        })
        Object.keys(saved.settings.sections).forEach(k => {
          if (!visibles.has(k)) saved.settings.sections[k].visible = false
        })
      }
      onSave(saved, 'Builder')
    }, 500)
    return () => clearTimeout(timer)
  }, [rows, localData])

  const [contextMenu, setContextMenu] = useState(null)

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

  const allWidgets = Object.entries(WIDGETS).flatMap(([catKey, cat]) => catKey === 'sections' ? [] : Object.entries(cat.items).map(([k, v]) => ({ key: k, ...v, category: cat.label })))
  const filteredWidgets = search ? allWidgets.filter(w => w.label.toLowerCase().includes(search.toLowerCase())) : null

  const isSection = (type) => SECTION_COMPONENTS[type] != null

  const canvasWidth = responsiveMode === 'mobile' ? '480px' : responsiveMode === 'tablet' ? '900px' : 'min(100%, 1400px)'

  function updateSectionField(sectionKey, fieldPath, value) {
    setLocalData(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      setDeep(next, fieldPath, value)
      return next
    })
  }

  function handleSaveNow() {
    const { localData: d } = latestRef.current
    const saved = JSON.parse(JSON.stringify(d))
    saved.builder = { rows }
    if (saved.settings?.sections) {
      const visibles = new Set()
      rows.forEach((row, i) => {
        if (row.type === 'section' && row.sectionKey) {
          if (!saved.settings.sections[row.sectionKey]) saved.settings.sections[row.sectionKey] = {}
          saved.settings.sections[row.sectionKey].visible = true
          saved.settings.sections[row.sectionKey].order = i
          visibles.add(row.sectionKey)
        }
      })
      Object.keys(saved.settings.sections).forEach(k => {
        if (!visibles.has(k)) saved.settings.sections[k].visible = false
      })
    }
    onSave(saved, 'Builder')
  }

  const selectedRow = selected?.rowId ? rows.find(r => r.id === selected.rowId) : null
  const selectedSectionKey = selectedRow?.type === 'section' ? selectedRow.sectionKey : null
  const selectedFields = selectedSectionKey ? (SECTION_FIELDS[selectedSectionKey] || []) : []
  const selectedBlock = selected?.element === 'widget' ? selected?.block : null

  return (
    <div className="elm-overlay" onContextMenu={(e) => { if (e.target.closest('.elm-canvas-wrap')) { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, target: e.target }) } }}>
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
          <span className="elm-status">Auto-saving...</span>
          <button className="elm-save-btn" onClick={handleSaveNow}><i className="fas fa-save"></i> Save</button>
        </div>
      </div>

      <div className="elm-body">
        <div className="elm-panel">
          <div className="elm-panel-tabs">
            <button className={`elm-panel-tab ${leftTab === 'widgets' ? 'active' : ''}`} onClick={() => setLeftTab('widgets')}><i className="fas fa-th"></i> Widgets</button>
            <button className={`elm-panel-tab ${leftTab === 'structure' ? 'active' : ''}`} onClick={() => setLeftTab('structure')}><i className="fas fa-list"></i> Structure</button>
            <button className={`elm-panel-tab ${leftTab === 'settings' ? 'active' : ''}`} onClick={() => setLeftTab('settings')}><i className="fas fa-cog"></i> Settings</button>
          </div>
          <div className="elm-panel-content">
            {leftTab === 'widgets' && (
              <div className="elm-widgets">
                <div className="elm-widgets-search"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search widgets..." /></div>
                {(filteredWidgets ? null : Object.entries(WIDGETS)).map(([catKey, cat]) => {
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
                    <span>{row.type === 'section' ? (WIDGETS.sections.items[row.sectionKey]?.label || row.sectionKey) : `Custom Row ${ri + 1}`}</span>
                    <span className="elm-struct-badge">{row.type === 'section' ? 'Section' : `${row.columns.length} col`}</span>
                  </div>
                ))}
              </div>
            )}
            {leftTab === 'settings' && selectedRow?.type === 'section' && selectedSectionKey && (
              <div className="elm-settings-panel">
                <div className="elm-settings-title">
                  <i className={`fas ${WIDGETS.sections.items[selectedSectionKey]?.icon || 'fa-layer-group'}`}></i>
                  {' '}{WIDGETS.sections.items[selectedSectionKey]?.label || selectedSectionKey}
                </div>
                {selectedFields.length > 0 ? (
                  <div className="elm-settings-section">
                    <div className="elm-settings-heading">Content</div>
                    {selectedFields.map(f => {
                      const val = f.path.split('.').reduce((o, k) => o?.[k], localData)
                      if (f.type === 'toggle') return (
                        <div key={f.path} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                          <label className="elm-settings-label" style={{margin:0}}>{f.label}</label>
                          <input type="checkbox" checked={!!val} onChange={e => updateSectionField(selectedSectionKey, f.path, e.target.checked)} style={{accentColor:'#6cab96'}} />
                        </div>
                      )
                      if (f.type === 'textarea') return (
                        <div key={f.path} style={{marginBottom:8}}>
                          <label className="elm-settings-label">{f.label}</label>
                          <textarea rows={4} className="elm-input elm-textarea" value={val || ''} onChange={e => updateSectionField(selectedSectionKey, f.path, e.target.value)} />
                        </div>
                      )
                      return (
                        <div key={f.path} style={{marginBottom:8}}>
                          <label className="elm-settings-label">{f.label}</label>
                          <input className="elm-input" value={val || ''} onChange={e => updateSectionField(selectedSectionKey, f.path, e.target.value)} />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="elm-settings-section">
                    <p style={{fontSize:'0.75rem',color:'var(--text-dim)',padding:8}}>
                      This section has complex content. Edit items in <strong>Admin &rarr; Content tab</strong>.
                    </p>
                  </div>
                )}
              </div>
            )}
            {leftTab === 'settings' && selected?.element === 'widget' && selectedBlock && (
              <div className="elm-settings-panel">
                <div className="elm-settings-title">{selectedBlock.type} Settings</div>
                <div className="elm-settings-section"><div className="elm-settings-heading">Content</div>
                  {selectedBlock.type === 'text' && <textarea rows={6} value={selectedBlock.content || ''} onChange={e => {
                    const ri = rows.findIndex(r => r.id === selected.rowId)
                    if (ri < 0) return
                    updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { content: e.target.value })
                  }} className="elm-input elm-textarea" />}
                  {selectedBlock.type === 'heading' && (<><select value={selectedBlock.level || 'h2'} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { level: e.target.value })} className="elm-input"><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option></select><input value={selectedBlock.content || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { content: e.target.value })} className="elm-input" placeholder="Heading text" /></>)}
                  {selectedBlock.type === 'image' && (<><input value={selectedBlock.src || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { src: e.target.value })} className="elm-input" placeholder="Image URL" /><input value={selectedBlock.alt || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { alt: e.target.value })} className="elm-input" placeholder="Alt text" /><input value={selectedBlock.caption || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { caption: e.target.value })} className="elm-input" placeholder="Caption" /></>)}
                  {selectedBlock.type === 'button' && (<><input value={selectedBlock.text || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { text: e.target.value })} className="elm-input" placeholder="Button text" /><input value={selectedBlock.url || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { url: e.target.value })} className="elm-input" placeholder="URL (https://...)" /><select value={selectedBlock.style || 'solid'} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { style: e.target.value })} className="elm-input"><option value="solid">Solid</option><option value="outline">Outline</option></select></>)}
                  {selectedBlock.type === 'spacer' && <input type="number" value={selectedBlock.height || 40} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { height: parseInt(e.target.value) || 40 })} className="elm-input" placeholder="Height in px" />}
                  {selectedBlock.type === 'html' && <textarea rows={6} value={selectedBlock.html || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { html: e.target.value })} className="elm-input elm-textarea elm-mono" />}
                  {selectedBlock.type === 'icon' && (<><input value={selectedBlock.icon || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { icon: e.target.value })} className="elm-input" placeholder="fa-star" /><select value={selectedBlock.size || '2x'} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { size: e.target.value })} className="elm-input"><option value="1x">Small</option><option value="2x">Medium</option><option value="3x">Large</option></select><input value={selectedBlock.color || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { color: e.target.value })} className="elm-input" placeholder="#6cab96" /></>)}
                  {selectedBlock.type === 'video' && <input value={selectedBlock.src || ''} onChange={e => updateBlockField(selected.rowId, selected.colId, selectedBlock.id, { src: e.target.value })} className="elm-input" placeholder="Video URL" />}
                </div>
                <div className="elm-settings-section"><div className="elm-settings-heading">Style</div>
                  <label className="elm-settings-label">Background</label><input value={(selectedBlock.styles || {}).background || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { background: e.target.value })} className="elm-input" placeholder="color / gradient / URL" />
                  <label className="elm-settings-label">Text Color</label><input value={(selectedBlock.styles || {}).color || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { color: e.target.value })} className="elm-input" placeholder="#e0e0e0" />
                  <label className="elm-settings-label">Text Align</label><select value={(selectedBlock.styles || {}).textAlign || 'left'} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { textAlign: e.target.value })} className="elm-input"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
                  <label className="elm-settings-label">Border Radius (px)</label><input type="number" value={parseInt((selectedBlock.styles || {}).borderRadius) || 0} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { borderRadius: e.target.value + 'px' })} className="elm-input" />
                  <label className="elm-settings-label">Width</label><input value={(selectedBlock.styles || {}).width || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { width: e.target.value })} className="elm-input" placeholder="auto / 100% / 300px" />
                  <label className="elm-settings-label">Padding</label>
                  <div className="elm-spacing-grid">{['top','right','bottom','left'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'var(--text-dim)'}}>{s[0].toUpperCase()}</label><input type="number" value={parseInt((selectedBlock.styles || {})[s]) || 0} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { [s]: e.target.value + 'px' })} className="elm-input elm-input-sm" /></div>))}</div>
                  <label className="elm-settings-label">Margin</label>
                  <div className="elm-spacing-grid">{['marginTop','marginRight','marginBottom','marginLeft'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'var(--text-dim)'}}>{s.replace('margin','')[0]}</label><input type="number" value={parseInt((selectedBlock.styles || {})[s]) || 0} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { [s]: e.target.value + 'px' })} className="elm-input elm-input-sm" /></div>))}</div>
                </div>
              </div>
            )}
            {leftTab === 'settings' && !selectedRow && !selectedBlock && (
              <div className="elm-settings-panel"><p style={{fontSize:'0.75rem',color:'var(--text-dim)',padding:12}}>Click on a section or widget in the canvas to edit its settings.</p></div>
            )}
            {leftTab === 'settings' && selectedRow?.type === 'custom' && (
              <div className="elm-settings-panel"><p style={{fontSize:'0.75rem',color:'var(--text-dim)',padding:12}}>Select a widget inside this custom row to edit its settings.</p></div>
            )}
          </div>
        </div>

        <div className="elm-canvas-wrap" style={{ justifyContent: responsiveMode !== 'desktop' ? 'center' : 'stretch' }}>
          <div className="elm-canvas" style={{ maxWidth: canvasWidth, width: '100%' }}>
            {rows.length === 0 && (
              <div className="elm-empty-state">
                <i className="fas fa-plus-circle"></i>
                <h3>Start Building Your Page</h3>
                <p>Click a section from the Widgets panel to add it, or drag widgets onto the canvas.</p>
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
                        <button className="elm-tool-btn" onClick={(e) => { e.stopPropagation(); setLeftTab('settings'); setSelected({ rowId: row.id, colId: null, element: 'row' }) }} title="Edit"><i className="fas fa-pen"></i></button>
                        {row.type === 'custom' && <button className="elm-tool-btn" onClick={(e) => { e.stopPropagation(); addColumn(row.id) }} title="Add Column"><i className="fas fa-columns"></i></button>}
                        <button className="elm-tool-btn" onClick={(e) => { e.stopPropagation(); duplicateRow(row.id) }} title="Duplicate"><i className="fas fa-copy"></i></button>
                        <button className="elm-tool-btn elm-tool-btn-del" onClick={(e) => { e.stopPropagation(); removeRow(row.id) }} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>

                      {row.type === 'section' && row.sectionKey && SECTION_COMPONENTS[row.sectionKey] ? (
                        <div className="elm-section-live" onClick={(e) => e.stopPropagation()}>
                          {(() => {
                            const Comp = SECTION_COMPONENTS[row.sectionKey]
                            const props = resolveSectionProps(row.sectionKey, localData)
                            return <Comp {...props} />
                          })()}
                        </div>
                      ) : row.type === 'section' ? (
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
              <i className="fas fa-plus"></i> Add Custom Section
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function WidgetPreview({ block, isSelected }) {
  const s = block.styles || {}
  const wrap = { padding: '6px', transition: 'all 0.2s', ...(s.background ? { background: s.background } : {}), ...(s.color ? { color: s.color } : {}), borderRadius: s.borderRadius || '4px', textAlign: s.textAlign || 'left', ...(s.marginTop ? { marginTop: s.marginTop } : {}), ...(s.marginBottom ? { marginBottom: s.marginBottom } : {}), ...(s.padding ? { padding: s.padding } : {}), ...(s.width ? { width: s.width } : {}) }
  if (block.type === 'text') return <div style={wrap} dangerouslySetInnerHTML={{ __html: block.content || '' }} />
  if (block.type === 'heading') { const Tag = block.level || 'h2'; return <Tag style={wrap}>{block.content || 'Heading'}</Tag> }
  if (block.type === 'image') return <div style={wrap}><img src={block.src} alt={block.alt} style={{ maxWidth: '100%', display: 'block' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += '<span style=\'color:var(--text-dim);font-size:0.75rem\'>Image placeholder</span>' }} />{block.caption && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{block.caption}</p>}</div>
  if (block.type === 'button') return <div style={wrap}><a href={block.url || '#'} className="btn-sm" style={{ display: 'inline-flex', padding: '6px 16px', background: block.style === 'outline' ? 'transparent' : '#6cab96', color: block.style === 'outline' ? '#6cab96' : '#0f0f1a', border: block.style === 'outline' ? '1px solid #6cab96' : 'none', borderRadius: 4, textDecoration: 'none', fontSize: '0.8rem' }}>{block.text || 'Button'}</a></div>
  if (block.type === 'divider') return <div style={wrap}><hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} /></div>
  if (block.type === 'spacer') return <div style={{ ...wrap, height: (block.height || 40) + 'px', background: 'transparent' }} />
  if (block.type === 'video') return <div style={wrap}><i className="fas fa-play-circle" style={{ fontSize: '2rem', color: '#6cab96' }}></i><p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Video: {block.src || 'No URL set'}</p></div>
  if (block.type === 'icon') return <div style={wrap}><i className={`fas ${block.icon || 'fa-star'}`} style={{ fontSize: block.size === '3x' ? '2rem' : block.size === '2x' ? '1.5rem' : '1rem', color: block.color || '#6cab96' }}></i></div>
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
