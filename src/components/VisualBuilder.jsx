import { useState, useEffect, useRef, useCallback, createElement } from 'react'
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
  hero: HeroLive, about: AboutLive, logos: ClientLogoWall,
  projects: ProjectsLive, 'portfolio-gallery': PortfolioGallery,
  'case-studies': CaseStudiesLive, testimonials: TestimonialsLive,
  achievements: AchievementsLive, process: ServicesTimelineLive,
  tools: ToolsShowcaseLive, faq: FAQSectionLive, articles: ArticlesLive,
  'portfolio-download': PortfolioDownload, contact: SayHello,
  map: GoogleMapsEmbed, newsletter: NewsletterSignup,
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

const SECTION_DATA_PATHS = {
  hero: [{ path: 'personalData', label: 'Personal Info' }, { path: 'quotes', label: 'Quotes' }],
  about: [{ path: 'personalData.summary', label: 'About Summary' }, { path: 'skillCategories', label: 'Skills' }, { path: 'experience', label: 'Experience' }, { path: 'education', label: 'Education' }, { path: 'languagesList', label: 'Languages' }],
  logos: [{ path: 'clientLogos', label: 'Client Logos' }],
  projects: [{ path: 'projects', label: 'Projects' }],
  'portfolio-gallery': [{ path: 'portfolioWorks', label: 'Works' }],
  'case-studies': [{ path: 'caseStudies', label: 'Case Studies' }],
  testimonials: [{ path: 'testimonials', label: 'Testimonials' }],
  achievements: [{ path: 'awards', label: 'Awards' }, { path: 'certifications', label: 'Certifications' }],
  process: [{ path: 'servicesTimeline', label: 'Services Timeline' }],
  tools: [{ path: 'tools', label: 'Tools' }],
  faq: [{ path: 'faq', label: 'FAQ' }],
  articles: [{ path: 'articles', label: 'Articles' }],
  'portfolio-download': [],
  contact: [],
  map: [{ path: 'personalData.location', label: 'Location' }],
  newsletter: [],
}

const SECTION_LABELS = {
  hero: 'Hero', about: 'About / Skills', logos: 'Client Logos', projects: 'Projects',
  'portfolio-gallery': 'Portfolio Gallery', 'case-studies': 'Case Studies',
  testimonials: 'Testimonials', achievements: 'Achievements', process: 'Services Timeline',
  tools: 'Tools Showcase', faq: 'FAQ', articles: 'Articles',
  'portfolio-download': 'CV Download', contact: 'Say Hello', map: 'Google Map', newsletter: 'Newsletter',
}

const SECTION_ICONS = {
  hero: 'fa-user', about: 'fa-info-circle', logos: 'fa-handshake', projects: 'fa-code',
  'portfolio-gallery': 'fa-images', 'case-studies': 'fa-briefcase', testimonials: 'fa-star',
  achievements: 'fa-trophy', process: 'fa-cogs', tools: 'fa-tools', faq: 'fa-question-circle',
  articles: 'fa-newspaper', 'portfolio-download': 'fa-download', contact: 'fa-envelope',
  map: 'fa-map-marker-alt', newsletter: 'fa-envelope-open-text',
}

const EDITABLE_TAGS = new Set(['h1','h2','h3','h4','h5','h6','p','span','a','li','blockquote','figcaption','td','th','label','strong','em','b','i','u','small','sub','sup'])

function setDeep(obj, path, value) {
  const keys = path.split('.')
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]] || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {}
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
}

function getDeep(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj)
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
      Object.keys(SECTION_COMPONENTS).forEach(key => {
        m[key] = { icon: SECTION_ICONS[key] || 'fa-layer-group', label: SECTION_LABELS[key] || key }
      })
      return m
    })()
  }
}

const defaultSectionRow = (key) => ({ id: uid(), type: 'section', sectionKey: key, styles: {}, inlineHTML: null, inlineStyles: {} })
const defaultCustomRow = () => ({ id: uid(), type: 'custom', columns: [{ id: uid(), width: 100, blocks: [], styles: {} }], styles: {} })

export default function VisualBuilder({ data, onSave, onExit }) {
  const [rows, setRows] = useState(() => data.builder?.rows?.length ? data.builder.rows : buildDefaultRows(data))
  const [selected, setSelected] = useState(null)
  const [leftTab, setLeftTab] = useState('widgets')
  const [history, setHistory] = useState([JSON.parse(JSON.stringify(data.builder?.rows?.length ? data.builder.rows : buildDefaultRows(data)))])
  const [historyIdx, setHistoryIdx] = useState(0)
  const [responsiveMode, setResponsiveMode] = useState('desktop')
  const [localData, setLocalData] = useState(() => JSON.parse(JSON.stringify(data)))
  const [search, setSearch] = useState('')
  const [editPane, setEditPane] = useState('content')
  const [inlineEl, setInlineEl] = useState(null)
  const [hoveredEl, setHoveredEl] = useState(null)
  const [hoverPos, setHoverPos] = useState(null)
  const [selEl, setSelEl] = useState(null)
  const r = useRef(true)
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
            saved.settings.sections[row.sectionKey].visible = row.hidden !== true
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
  const toggleSectionVisibility = (id) => { setRows(prev => prev.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r)) }

  const addBlockToCol = (rowId, colId, type) => {
    const cat = Object.values(WIDGETS).find(c => c.items[type])
    const meta = cat?.items[type]
    if (!meta) return
    pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: [...c.blocks, { id: uid(), type, ...JSON.parse(JSON.stringify(meta.defaults || {})), styles: {} }] } : c) } : r))
  }

  const removeBlock = (rowId, colId, blockId) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.filter(b => b.id !== blockId) } : c) } : r))
  const updateBlockStyle = (rowId, colId, blockId, stylePatch) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.map(b => b.id === blockId ? { ...b, styles: { ...(b.styles || {}), ...stylePatch } } : b) } : c) } : r))
  const duplicateBlock = (rowId, colId, blockId) => { const ri = rows.findIndex(r => r.id === rowId); if (ri < 0) return; const col = rows[ri].columns.find(c => c.id === colId); if (!col) return; const bi = col.blocks.findIndex(b => b.id === blockId); if (bi < 0) return; const dup = { ...JSON.parse(JSON.stringify(col.blocks[bi])), id: uid() }; pushHistory(rows.map((r, i) => i !== ri ? r : { ...r, columns: r.columns.map(c => c.id !== colId ? c : { ...c, blocks: [...c.blocks.slice(0, bi + 1), dup, ...c.blocks.slice(bi + 1)] }) })) }
  const addColumn = (rowId) => pushHistory(rows.map(r => r.id === rowId && r.columns.length < 4 ? { ...r, columns: [...r.columns, { id: uid(), width: 0, blocks: [], styles: {} }].map(c => ({ ...c, width: Math.round(100 / (r.columns.length + 1)) })) } : r))
  const removeColumn = (rowId, colId) => pushHistory(rows.map(r => r.id === rowId && r.columns.length > 1 ? { ...r, columns: r.columns.filter(c => c.id !== colId).map(c => ({ ...c, width: Math.round(100 / (r.columns.length - 1)) })) } : r))
  const updateRowStyle = (rowId, stylePatch) => { setRows(prev => prev.map(r => r.id === rowId ? { ...r, styles: { ...(r.styles || {}), ...stylePatch } } : r)) }

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
    saved.builder = { rows: latestRef.current.rows }
    if (saved.settings?.sections) {
      const visibles = new Set()
      latestRef.current.rows.forEach((row, i) => {
        if (row.type === 'section' && row.sectionKey) {
          if (!saved.settings.sections[row.sectionKey]) saved.settings.sections[row.sectionKey] = {}
          saved.settings.sections[row.sectionKey].visible = row.hidden !== true
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

  function startInlineEdit(rowId) {
    const row = rows.find(r => r.id === rowId)
    if (!row || row.type !== 'section') return
    const sectionEl = document.getElementById(`sec-${rowId}`)
    if (!sectionEl) return
    const contentEl = sectionEl.querySelector('.elm-section-live-inner')
    if (!contentEl) return
    setInlineEl(rowId)
    contentEl.contentEditable = true
    contentEl.focus()
  }

  function stopInlineEdit(rowId, save) {
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    const sectionEl = document.getElementById(`sec-${rowId}`)
    if (!sectionEl) return
    const contentEl = sectionEl.querySelector('.elm-section-live-inner')
    if (!contentEl) return
    contentEl.contentEditable = false
    setInlineEl(null)
    setSelEl(null)
    if (save) {
      const html = contentEl.innerHTML
      setRows(prev => prev.map(r => r.id === rowId ? { ...r, inlineHTML: html } : r))
    }
  }

  function handleElPointer(e, rowId, callback) {
    const sectionEl = document.getElementById(`sec-${rowId}`)
    if (!sectionEl) return
    const overlay = sectionEl.querySelector('.elm-el-overlay')
    if (!overlay) return callback(null)
    const highlight = sectionEl.querySelector('.elm-el-highlight')
    overlay.style.pointerEvents = 'none'
    const target = document.elementFromPoint(e.clientX, e.clientY)
    overlay.style.pointerEvents = 'auto'
    if (!target) return callback(null)
    const isEditable = EDITABLE_TAGS.has(target.tagName?.toLowerCase()) || target.closest('[contenteditable]')
    const isSectionInner = target.closest('.elm-section-live-inner')
    if (!isEditable || !isSectionInner) return callback(null)
    callback(target)
  }

  function handleElHover(e, rowId) {
    handleElPointer(e, rowId, (target) => {
      if (!target || inlineEl) { setHoveredEl(null); setHoverPos(null); return }
      const rect = target.getBoundingClientRect()
      const sectionEl = document.getElementById(`sec-${rowId}`)
      if (!sectionEl) return
      const containerRect = sectionEl.getBoundingClientRect()
      setHoveredEl({ el: target, rowId, tag: target.tagName.toLowerCase() })
      setHoverPos({
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height,
      })
    })
  }

  function handleElClick(e, rowId) {
    if (inlineEl) return
    handleElPointer(e, rowId, (target) => {
      if (!target) { setSelEl(null); setSelected(prev => prev ? { rowId: prev.rowId, colId: null, element: 'row' } : null); return }
      e.stopPropagation()
      const rect = target.getBoundingClientRect()
      const sectionEl = document.getElementById(`sec-${rowId}`)
      if (!sectionEl) return
      const containerRect = sectionEl.getBoundingClientRect()
      const computed = getComputedStyle(target)
      setSelEl({
        el: target,
        rowId,
        tag: target.tagName.toLowerCase(),
        text: (target.textContent || '').trim().slice(0, 80),
        styles: {
          color: computed.color,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          textAlign: computed.textAlign,
          background: computed.background,
          fontFamily: computed.fontFamily,
        },
        rect: {
          top: rect.top - containerRect.top,
          left: rect.left - containerRect.left,
          width: rect.width,
          height: rect.height,
        }
      })
      setSelected({ rowId, colId: null, element: 'row' })
      setLeftTab('settings')
      setEditPane('element')
    })
  }

  function handleElDblClick(e, rowId) {
    handleElPointer(e, rowId, (target) => {
      if (!target || inlineEl) return
      e.stopPropagation()
      target.contentEditable = true
      target.focus()
      setInlineEl({ el: target, rowId })
      setSelEl(null)
      const range = document.createRange()
      range.selectNodeContents(target)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    })
  }

  function applyElStyle(styleProp, value) {
    if (!selEl?.el) return
    selEl.el.style[styleProp] = value
    setSelEl(prev => prev ? { ...prev, styles: { ...prev.styles, [styleProp]: value } } : null)
    const row = rows.find(r => r.id === selEl.rowId)
    if (!row) return
    const selector = buildSelector(selEl.el)
    setRows(prev => prev.map(r => r.id === selEl.rowId ? {
      ...r,
      inlineStyles: { ...(r.inlineStyles || {}), [selector]: { ...((r.inlineStyles || {})[selector] || {}), [styleProp]: value } }
    } : r))
  }

  function buildSelector(el) {
    if (!el || el === document.body || el === document) return ''
    if (el.id) return '#' + el.id
    let path = []
    let current = el
    while (current && current !== document.body && current !== document) {
      const tag = current.tagName?.toLowerCase() || ''
      let nth = 1
      let sibling = current.previousElementSibling
      while (sibling) { if (sibling.tagName?.toLowerCase() === tag) nth++; sibling = sibling.previousElementSibling }
      const nthStr = nth > 1 ? `:nth-of-type(${nth})` : ''
      path.unshift(tag + nthStr)
      current = current.parentElement
      if (current?.classList?.contains('elm-section-live-inner')) break
    }
    return path.join(' > ')
  }

  const allWidgets = Object.entries(WIDGETS).flatMap(([catKey, cat]) => catKey === 'sections' ? [] : Object.entries(cat.items).map(([k, v]) => ({ key: k, ...v, category: cat.label })))
  const filteredWidgets = search ? allWidgets.filter(w => w.label.toLowerCase().includes(search.toLowerCase())) : null
  const isSection = (type) => SECTION_COMPONENTS[type] != null
  const canvasWidth = responsiveMode === 'mobile' ? '480px' : responsiveMode === 'tablet' ? '900px' : 'min(100%, 1400px)'

  const selectedRow = selected?.rowId ? rows.find(r => r.id === selected.rowId) : null
  const selectedSectionKey = selectedRow?.type === 'section' ? selectedRow.sectionKey : null
  const selectedDataPaths = selectedSectionKey ? (SECTION_DATA_PATHS[selectedSectionKey] || []) : []
  const selectedBlock = selected?.element === 'widget' ? selected?.block : null

  return (
    <div className="elm-overlay" onKeyDown={(e) => {
      if (e.key === 'Escape' && inlineEl) { stopInlineEdit(inlineEl.rowId, false) }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveNow() }
      if (e.key === 'Delete' && selEl && selEl.el && selEl.el.parentNode) {
        const rowId = selEl.rowId
        const el = selEl.el
        setSelEl(null)
        el.remove()
        setRows(prev => prev.map(r => r.id === rowId ? { ...r, inlineHTML: document.getElementById(`sec-${rowId}`)?.querySelector('.elm-section-live-inner')?.innerHTML || r.inlineHTML } : r))
      }
    }} tabIndex={0}>
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
          <button className="elm-save-btn" onClick={handleSaveNow}><i className="fas fa-save"></i> Save &amp; Exit</button>
        </div>
      </div>

      <div className="elm-body">
        <div className="elm-panel">
          <div className="elm-panel-tabs">
            <button className={`elm-panel-tab ${leftTab === 'widgets' ? 'active' : ''}`} onClick={() => setLeftTab('widgets')}><i className="fas fa-th"></i> Add</button>
            <button className={`elm-panel-tab ${leftTab === 'structure' ? 'active' : ''}`} onClick={() => setLeftTab('structure')}><i className="fas fa-list"></i> Structure</button>
            <button className={`elm-panel-tab ${leftTab === 'settings' ? 'active' : ''}`} onClick={() => { setLeftTab('settings'); setEditPane('content') }}><i className="fas fa-cog"></i> Settings</button>
          </div>
          <div className="elm-panel-content">
            {leftTab === 'widgets' && (
              <div className="elm-widgets">
                <div className="elm-widgets-search"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search widgets & sections..." /></div>
                {search ? (
                  <div className="elm-widget-grid">
                    {Object.entries(WIDGETS).flatMap(([catKey, cat]) => Object.entries(cat.items).map(([k, v]) => ({ key: k, ...v, category: cat.label })))
                      .filter(w => w.label.toLowerCase().includes(search.toLowerCase()))
                      .map(w => (
                        <div key={w.key} className="elm-widget-item" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', w.key)}
                          onClick={() => { if (isSection(w.key)) addSectionRow(w.key, rows.length) }}>
                          <i className={`fas ${w.icon}`}></i><span>{w.label}</span>
                        </div>
                      ))}
                  </div>
                ) : Object.entries(WIDGETS).map(([catKey, cat]) => (
                  <div key={catKey} className="elm-widget-category">
                    <div className="elm-widget-cat-label">{cat.label}</div>
                    <div className="elm-widget-grid">
                      {Object.entries(cat.items).map(([key, meta]) => (
                        <div key={key} className="elm-widget-item" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', key)}
                          onClick={() => { if (isSection(key)) addSectionRow(key, rows.length) }}>
                          <i className={`fas ${meta.icon}`}></i>
                          <span>{meta.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {leftTab === 'structure' && (
              <div className="elm-structure">
                <div className="elm-structure-title"><i className="fas fa-sitemap"></i> Page Structure</div>
                {rows.length === 0 && <p style={{fontSize:'0.75rem',color:'#666',padding:12}}>No sections yet.</p>}
                {rows.map((row, ri) => (
                  <div key={row.id} className={`elm-struct-item ${selected?.rowId === row.id ? 'active' : ''}`}
                    onClick={() => setSelected({ rowId: row.id, colId: null, element: 'row' })}
                    style={{opacity: row.hidden ? 0.4 : 1}}>
                    <i className={`fas ${row.type === 'section' ? 'fa-layer-group' : 'fa-columns'}`}></i>
                    <span>{row.type === 'section' ? (SECTION_LABELS[row.sectionKey] || row.sectionKey) : `Custom Row ${ri + 1}`}</span>
                    <span className="elm-struct-badge">{row.hidden ? 'hidden' : row.type === 'section' ? 'section' : `${row.columns.length} col`}</span>
                  </div>
                ))}
              </div>
            )}
            {leftTab === 'settings' && selectedRow?.type === 'section' && selectedSectionKey && (
              <div className="elm-settings-panel">
                <div className="elm-settings-title">
                  <i className={`fas ${SECTION_ICONS[selectedSectionKey] || 'fa-layer-group'}`}></i>
                  {' '}{SECTION_LABELS[selectedSectionKey] || selectedSectionKey}
                </div>
                <div style={{display:'flex',gap:4,marginBottom:12,borderBottom:'1px solid #2a2a44'}}>
                  {['content','style','advanced','element'].filter(t => t !== 'element' || selEl).map(t => (
                    <button key={t} onClick={() => setEditPane(t)}
                      style={{padding:'6px 12px',border:'none',background:'transparent',color: editPane === t ? '#6cab96' : '#666',cursor:'pointer',fontSize:'11px',fontWeight:600,textTransform:'uppercase',borderBottom: editPane === t ? '2px solid #6cab96' : '2px solid transparent',fontFamily:'inherit'}}>
                      {t === 'element' ? `Element (${selEl?.tag || ''})` : t}
                    </button>
                  ))}
                </div>
                {editPane === 'element' && selEl && (
                  <div className="elm-settings-section">
                    <div className="elm-settings-heading">&lt;{selEl.tag}&gt; {selEl.text}</div>
                    <label className="elm-settings-label">Color</label>
                    <input value={selEl.styles?.color || ''} onChange={e => applyElStyle('color', e.target.value)} className="elm-input" placeholder="#d5d8e2" />
                    <label className="elm-settings-label">Font Size</label>
                    <input value={selEl.styles?.fontSize || ''} onChange={e => applyElStyle('fontSize', e.target.value)} className="elm-input" placeholder="1rem / 16px" />
                    <label className="elm-settings-label">Font Weight</label>
                    <select value={selEl.styles?.fontWeight || ''} onChange={e => applyElStyle('fontWeight', e.target.value)} className="elm-input">
                      <option value="">Default</option><option value="300">Light</option><option value="400">Regular</option><option value="600">Semi Bold</option><option value="700">Bold</option><option value="900">Black</option>
                    </select>
                    <label className="elm-settings-label">Font Family</label>
                    <input value={selEl.styles?.fontFamily || ''} onChange={e => applyElStyle('fontFamily', e.target.value)} className="elm-input" placeholder="'Inter', sans-serif" />
                    <label className="elm-settings-label">Text Align</label>
                    <select value={selEl.styles?.textAlign || ''} onChange={e => applyElStyle('textAlign', e.target.value)} className="elm-input">
                      <option value="">Default</option><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                    </select>
                    <label className="elm-settings-label">Background</label>
                    <input value={selEl.styles?.background || ''} onChange={e => applyElStyle('background', e.target.value)} className="elm-input" placeholder="transparent / #1e1e36" />
                    <label className="elm-settings-label">Padding (px)</label>
                    <div className="elm-spacing-grid">{['paddingTop','paddingRight','paddingBottom','paddingLeft'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s.replace('padding','')[0]}</label><input type="number" value={parseInt(selEl.styles?.[s]) || 0} onChange={e => applyElStyle(s, e.target.value + 'px')} className="elm-input elm-input-sm" /></div>))}</div>
                    <label className="elm-settings-label">Margin (px)</label>
                    <div className="elm-spacing-grid">{['marginTop','marginRight','marginBottom','marginLeft'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s.replace('margin','')[0]}</label><input type="number" value={parseInt(selEl.styles?.[s]) || 0} onChange={e => applyElStyle(s, e.target.value + 'px')} className="elm-input elm-input-sm" /></div>))}</div>
                    <div style={{marginTop:12,display:'flex',gap:6}}>
                      <button className="elm-tool-btn elm-tool-btn-del" onClick={() => { if (selEl.el && selEl.el.parentNode) { const rid = selEl.rowId; selEl.el.remove(); setSelEl(null); setRows(prev => prev.map(r => r.id === rid ? { ...r, inlineHTML: document.getElementById(`sec-${rid}`)?.querySelector('.elm-section-live-inner')?.innerHTML || r.inlineHTML } : r)) } }}><i className="fas fa-trash"></i> Delete Element</button>
                      <button className="elm-tool-btn" onClick={() => { if (selEl.el) { const clone = selEl.el.cloneNode(true); selEl.el.parentNode?.insertBefore(clone, selEl.el.nextSibling); clone.contentEditable = true; clone.focus(); } }}><i className="fas fa-copy"></i> Duplicate</button>
                    </div>
                  </div>
                )}
                {editPane === 'content' && (
                  <div className="elm-settings-section">
                    <div className="elm-settings-heading">Section Content</div>
                    <div style={{display:'flex',gap:6,marginBottom:10}}>
                      {!inlineEl && <button className="elm-tool-btn" style={{background:'#6cab96',color:'#0f0f1a',padding:'4px 10px',borderRadius:3,fontSize:11}} onClick={() => startInlineEdit(selectedRow.id)}><i className="fas fa-pen"></i> Edit Inline</button>}
                      {inlineEl === selectedRow.id && <><button className="elm-tool-btn" style={{background:'#6cab96',color:'#0f0f1a',padding:'4px 10px',borderRadius:3,fontSize:11}} onClick={() => stopInlineEdit(selectedRow.id, true)}><i className="fas fa-check"></i> Save Edits</button><button className="elm-tool-btn elm-tool-btn-del" style={{padding:'4px 10px',borderRadius:3,fontSize:11}} onClick={() => stopInlineEdit(selectedRow.id, false)}><i className="fas fa-times"></i> Cancel</button></>}
                      {selectedRow.inlineHTML && !inlineEl && <button className="elm-tool-btn" style={{padding:'4px 10px',borderRadius:3,fontSize:11}} onClick={() => { if (confirm('Reset inline edits? This cannot be undone.')) setRows(prev => prev.map(r => r.id === selectedRow.id ? { ...r, inlineHTML: null, inlineStyles: {} } : r)) }}><i className="fas fa-undo-alt"></i> Reset Inline</button>}
                    </div>
                    {selectedDataPaths.length > 0 ? selectedDataPaths.map(({ path, label }) => {
                      const data = getDeep(localData, path)
                      if (data === undefined || data === null) return null
                      return (
                        <div key={path} style={{marginBottom:16}}>
                          <label className="elm-settings-label" style={{fontWeight:700,marginBottom:6}}>{label}</label>
                          <FieldEditor data={data} path={path} onUpdate={(fp, val) => updateSectionField(selectedSectionKey, fp, val)} depth={0} />
                        </div>
                      )
                    }) : (
                      <p style={{fontSize:'0.75rem',color:'#666',padding:8}}>This section has no editable content fields.</p>
                    )}
                  </div>
                )}
                {editPane === 'style' && (
                  <div className="elm-settings-section">
                    <div className="elm-settings-heading">Section Style</div>
                    <label className="elm-settings-label">Background Color</label>
                    <input value={(selectedRow.styles || {}).background || ''} onChange={e => updateRowStyle(selectedRow.id, { background: e.target.value })} className="elm-input" placeholder="#1e1e36 / transparent" />
                    <label className="elm-settings-label">Text Color</label>
                    <input value={(selectedRow.styles || {}).color || ''} onChange={e => updateRowStyle(selectedRow.id, { color: e.target.value })} className="elm-input" placeholder="#d5d8e2" />
                    <label className="elm-settings-label">Text Align</label>
                    <select value={(selectedRow.styles || {}).textAlign || ''} onChange={e => updateRowStyle(selectedRow.id, { textAlign: e.target.value })} className="elm-input"><option value="">Default</option><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
                    <label className="elm-settings-label">Max Width</label>
                    <input value={(selectedRow.styles || {}).maxWidth || ''} onChange={e => updateRowStyle(selectedRow.id, { maxWidth: e.target.value })} className="elm-input" placeholder="1200px / 100% / auto" />
                    <label className="elm-settings-label">Padding</label>
                    <div className="elm-spacing-grid">{['top','right','bottom','left'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s[0].toUpperCase()}</label><input type="number" value={parseInt((selectedRow.styles || {})[s]) || 0} onChange={e => updateRowStyle(selectedRow.id, { [s]: e.target.value + 'px' })} className="elm-input elm-input-sm" /></div>))}</div>
                    <label className="elm-settings-label">Margin</label>
                    <div className="elm-spacing-grid">{['marginTop','marginRight','marginBottom','marginLeft'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s.replace('margin','')[0]}</label><input type="number" value={parseInt((selectedRow.styles || {})[s]) || 0} onChange={e => updateRowStyle(selectedRow.id, { [s]: e.target.value + 'px' })} className="elm-input elm-input-sm" /></div>))}</div>
                    <label className="elm-settings-label">Border Radius</label>
                    <input type="number" value={parseInt((selectedRow.styles || {}).borderRadius) || 0} onChange={e => updateRowStyle(selectedRow.id, { borderRadius: e.target.value + 'px' })} className="elm-input" />
                    <label className="elm-settings-label">Box Shadow</label>
                    <input value={(selectedRow.styles || {}).boxShadow || ''} onChange={e => updateRowStyle(selectedRow.id, { boxShadow: e.target.value })} className="elm-input" placeholder="0 4px 20px rgba(0,0,0,0.3)" />
                    <label className="elm-settings-label">Border</label>
                    <input value={(selectedRow.styles || {}).border || ''} onChange={e => updateRowStyle(selectedRow.id, { border: e.target.value })} className="elm-input" placeholder="1px solid #2a2a44" />
                  </div>
                )}
                {editPane === 'advanced' && (
                  <div className="elm-settings-section">
                    <div className="elm-settings-heading">Advanced</div>
                    <label className="elm-settings-label">CSS Class</label>
                    <input value={(selectedRow.styles || {}).cssClass || ''} onChange={e => updateRowStyle(selectedRow.id, { cssClass: e.target.value })} className="elm-input elm-mono" placeholder="my-custom-class" />
                    <label className="elm-settings-label">CSS ID</label>
                    <input value={(selectedRow.styles || {}).cssId || ''} onChange={e => updateRowStyle(selectedRow.id, { cssId: e.target.value })} className="elm-input elm-mono" placeholder="my-section" />
                    <label className="elm-settings-label">HTML Tag</label>
                    <select value={(selectedRow.styles || {}).htmlTag || 'section'} onChange={e => updateRowStyle(selectedRow.id, { htmlTag: e.target.value })} className="elm-input"><option value="section">section</option><option value="div">div</option><option value="article">article</option><option value="header">header</option><option value="aside">aside</option></select>
                    <label className="elm-settings-label">Custom CSS</label>
                    <textarea rows={5} value={(selectedRow.styles || {}).customCSS || ''} onChange={e => updateRowStyle(selectedRow.id, { customCSS: e.target.value })} className="elm-input elm-textarea elm-mono" placeholder=".my-class { color: red; }" />
                  </div>
                )}
              </div>
            )}
            {leftTab === 'settings' && selected?.element === 'widget' && selectedBlock && (
              <div className="elm-settings-panel">
                <div className="elm-settings-title">{selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1)} Settings</div>
                <div style={{display:'flex',gap:4,marginBottom:12,borderBottom:'1px solid #2a2a44'}}>
                  {['content','style','advanced'].map(t => (
                    <button key={t} onClick={() => setEditPane(t)}
                      style={{padding:'6px 12px',border:'none',background:'transparent',color: editPane === t ? '#6cab96' : '#666',cursor:'pointer',fontSize:'11px',fontWeight:600,textTransform:'uppercase',borderBottom: editPane === t ? '2px solid #6cab96' : '2px solid transparent',fontFamily:'inherit'}}>
                      {t}
                    </button>
                  ))}
                </div>
                {editPane === 'content' && (
                  <div className="elm-settings-section"><div className="elm-settings-heading">Content</div>
                    <WidgetContentFields block={selectedBlock} rowId={selected.rowId} colId={selected.colId} onUpdate={(patch) => {
                      setRows(prev => prev.map(r => r.id === selected.rowId ? { ...r, columns: r.columns.map(c => c.id === selected.colId ? { ...c, blocks: c.blocks.map(b => b.id === selectedBlock.id ? { ...b, ...patch } : b) } : c) } : r))
                    }} />
                  </div>
                )}
                {editPane === 'style' && (
                  <div className="elm-settings-section"><div className="elm-settings-heading">Style</div>
                    <label className="elm-settings-label">Background</label><input value={(selectedBlock.styles || {}).background || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { background: e.target.value })} className="elm-input" />
                    <label className="elm-settings-label">Text Color</label><input value={(selectedBlock.styles || {}).color || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { color: e.target.value })} className="elm-input" />
                    <label className="elm-settings-label">Text Align</label><select value={(selectedBlock.styles || {}).textAlign || 'left'} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { textAlign: e.target.value })} className="elm-input"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
                    <label className="elm-settings-label">Font Size</label><input value={(selectedBlock.styles || {}).fontSize || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { fontSize: e.target.value })} className="elm-input" />
                    <label className="elm-settings-label">Font Weight</label><select value={(selectedBlock.styles || {}).fontWeight || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { fontWeight: e.target.value })} className="elm-input"><option value="">Default</option><option value="300">Light</option><option value="400">Regular</option><option value="600">Semi Bold</option><option value="700">Bold</option><option value="900">Black</option></select>
                    <label className="elm-settings-label">Border Radius</label><input type="number" value={parseInt((selectedBlock.styles || {}).borderRadius) || 0} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { borderRadius: e.target.value + 'px' })} className="elm-input" />
                    <label className="elm-settings-label">Width</label><input value={(selectedBlock.styles || {}).width || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { width: e.target.value })} className="elm-input" />
                    <label className="elm-settings-label">Min Height</label><input value={(selectedBlock.styles || {}).minHeight || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { minHeight: e.target.value })} className="elm-input" />
                    <label className="elm-settings-label">Padding</label>
                    <div className="elm-spacing-grid">{['top','right','bottom','left'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s[0].toUpperCase()}</label><input type="number" value={parseInt((selectedBlock.styles || {})[s]) || 0} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { [s]: e.target.value + 'px' })} className="elm-input elm-input-sm" /></div>))}</div>
                    <label className="elm-settings-label">Margin</label>
                    <div className="elm-spacing-grid">{['marginTop','marginRight','marginBottom','marginLeft'].map(s => (<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s.replace('margin','')[0]}</label><input type="number" value={parseInt((selectedBlock.styles || {})[s]) || 0} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { [s]: e.target.value + 'px' })} className="elm-input elm-input-sm" /></div>))}</div>
                    <label className="elm-settings-label">Box Shadow</label><input value={(selectedBlock.styles || {}).boxShadow || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { boxShadow: e.target.value })} className="elm-input" />
                  </div>
                )}
                {editPane === 'advanced' && (
                  <div className="elm-settings-section"><div className="elm-settings-heading">Advanced</div>
                    <label className="elm-settings-label">CSS Class</label><input value={(selectedBlock.styles || {}).cssClass || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { cssClass: e.target.value })} className="elm-input elm-mono" />
                    <label className="elm-settings-label">CSS ID</label><input value={(selectedBlock.styles || {}).cssId || ''} onChange={e => updateBlockStyle(selected.rowId, selected.colId, selectedBlock.id, { cssId: e.target.value })} className="elm-input elm-mono" />
                  </div>
                )}
              </div>
            )}
            {leftTab === 'settings' && !selectedRow && !selectedBlock && (
              <div className="elm-settings-panel"><p style={{fontSize:'0.75rem',color:'#666',padding:12}}>Click on a section or widget in the canvas to edit its settings.</p></div>
            )}
            {leftTab === 'settings' && selectedRow?.type === 'custom' && !selectedBlock && (
              <div className="elm-settings-panel"><p style={{fontSize:'0.75rem',color:'#666',padding:12}}>Select a widget inside this custom row to edit its settings.</p></div>
            )}
          </div>
        </div>

        <div className="elm-canvas-wrap" style={{ justifyContent: responsiveMode !== 'desktop' ? 'center' : 'stretch' }}>
          <div className="elm-canvas" style={{ maxWidth: canvasWidth, width: '100%' }}>
            {rows.length === 0 && (
              <div className="elm-empty-state">
                <i className="fas fa-plus-circle"></i>
                <h3>Start Building Your Page</h3>
                <p>Click a section from the Add panel to add it, or drag widgets onto the canvas.</p>
              </div>
            )}
            {(() => {
              const visibleRows = rows.filter(r => !r.hidden)
              if (visibleRows.length === 0) return null
              return (
                <SortableList items={visibleRows} onReorder={(arr) => pushHistory(arr)} getId={r => r.id}>
                  {visibleRows.map((row, ri) => (
                    <SortableItem key={row.id} id={row.id}>
                      {(listeners) => {
                        const mergedStyles = { ...(row.styles || {}) }
                        const styleObj = {}
                        if (mergedStyles.background) styleObj.background = mergedStyles.background
                        if (mergedStyles.color) styleObj.color = mergedStyles.color
                        if (mergedStyles.textAlign) styleObj.textAlign = mergedStyles.textAlign
                        if (mergedStyles.maxWidth) styleObj.maxWidth = mergedStyles.maxWidth
                        if (mergedStyles.borderRadius) styleObj.borderRadius = mergedStyles.borderRadius
                        if (mergedStyles.boxShadow) styleObj.boxShadow = mergedStyles.boxShadow
                        if (mergedStyles.border) styleObj.border = mergedStyles.border
                        const padMap = { top:'paddingTop', right:'paddingRight', bottom:'paddingBottom', left:'paddingLeft' }
                        Object.entries(padMap).forEach(([short, css]) => { if (mergedStyles[short]) styleObj[css] = mergedStyles[short] })
                        ;['marginTop','marginRight','marginBottom','marginLeft'].forEach(k => { if (mergedStyles[k]) styleObj[k] = mergedStyles[k] })
                        const Tag = mergedStyles.htmlTag || 'section'
                        const isSel = selected?.rowId === row.id
                        return (
                          <Tag id={`sec-${row.id}`}
                            className={`elm-section ${isSel ? 'elm-section-active' : ''}`}
                            style={styleObj}
                            onClick={() => { setSelEl(null); setSelected({ rowId: row.id, colId: null, element: 'row' }) }}>
                            <div className="elm-section-handle" {...listeners}><i className="fas fa-grip-vertical"></i></div>
                            <div className="elm-section-tools">
                              <span className="elm-section-badge">{row.type === 'section' ? (SECTION_LABELS[row.sectionKey] || row.sectionKey) : 'Custom Row'}</span>
                              <button className="elm-tool-btn" onClick={(e) => { e.stopPropagation(); setLeftTab('settings'); setEditPane('content'); setSelected({ rowId: row.id, colId: null, element: 'row' }) }} title="Edit"><i className="fas fa-pen"></i></button>
                              <button className="elm-tool-btn" onClick={(e) => { e.stopPropagation(); duplicateRow(row.id) }} title="Duplicate"><i className="fas fa-copy"></i></button>
                              <button className="elm-tool-btn" onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(row.id) }} title="Hide"><i className="fas fa-eye-slash"></i></button>
                              <button className="elm-tool-btn elm-tool-btn-del" onClick={(e) => { e.stopPropagation(); removeRow(row.id) }} title="Delete"><i className="fas fa-trash"></i></button>
                            </div>

                            {row.type === 'section' && row.sectionKey && SECTION_COMPONENTS[row.sectionKey] ? (
                              <>
                                <div className="elm-section-label">{SECTION_LABELS[row.sectionKey] || row.sectionKey}</div>
                                <div className="elm-section-live"
                                  onClick={(e) => e.stopPropagation()}
                                  onDoubleClick={(e) => { e.stopPropagation(); startInlineEdit(row.id) }}>
                                  {inlineEl === row.id ? (
                                    <div className="elm-section-live-inner"
                                      dangerouslySetInnerHTML={{ __html: row.inlineHTML || '' }} />
                                  ) : row.inlineHTML ? (
                                    <div className="elm-section-live-inner"
                                      dangerouslySetInnerHTML={{ __html: row.inlineHTML }}
                                      onMouseMove={(e) => handleElHover(e, row.id)}
                                      onClick={(e) => handleElClick(e, row.id)}
                                      onDoubleClick={(e) => handleElDblClick(e, row.id)}>
                                      <div className="elm-el-highlight" style={{
                                        position: 'absolute', pointerEvents: 'none', zIndex: 20,
                                        border: hoveredEl?.rowId === row.id ? '2px solid #6cab96' : 'none',
                                        borderRadius: '2px', transition: 'all 0.08s',
                                        top: hoverPos?.top || 0, left: hoverPos?.left || 0,
                                        width: hoverPos?.width || 0, height: hoverPos?.height || 0,
                                      }} />
                                      <div className="elm-el-overlay" style={{ position: 'absolute', inset: 0, zIndex: 15, cursor: 'crosshair' }} />
                                    </div>
                                  ) : (
                                    <div className="elm-section-live-inner"
                                      onMouseMove={(e) => handleElHover(e, row.id)}
                                      onClick={(e) => handleElClick(e, row.id)}
                                      onDoubleClick={(e) => handleElDblClick(e, row.id)}>
                                      {(() => {
                                        const Comp = SECTION_COMPONENTS[row.sectionKey]
                                        const props = resolveSectionProps(row.sectionKey, localData)
                                        return <Comp {...props} />
                                      })()}
                                      <div className="elm-el-highlight" style={{
                                        position: 'absolute', pointerEvents: 'none', zIndex: 20,
                                        border: hoveredEl?.rowId === row.id && hoverPos ? '2px solid #6cab96' : 'none',
                                        borderRadius: '2px', transition: 'all 0.08s',
                                        top: hoverPos?.top || 0, left: hoverPos?.left || 0,
                                        width: hoverPos?.width || 0, height: hoverPos?.height || 0,
                                      }} />
                                      <div className="elm-el-overlay" style={{ position: 'absolute', inset: 0, zIndex: 15, cursor: 'crosshair' }} />
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : row.type === 'section' ? (
                              <div className="elm-section-preview">
                                <div className="elm-section-preview-header"><i className={`fas ${SECTION_ICONS[row.sectionKey] || 'fa-layer-group'}`}></i> {SECTION_LABELS[row.sectionKey] || row.sectionKey}</div>
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
                                      const bSel = selected?.block?.id === b.id
                                      return (
                                        <div key={b.id} className={`elm-widget ${bSel ? 'elm-widget-active' : ''}`}
                                          onClick={(e) => { e.stopPropagation(); setSelected({ rowId: row.id, colId: col.id, block: b, element: 'widget' }) }}>
                                          {bSel && <div className="elm-widget-tools"><button className="elm-widget-tool" onClick={(e) => { e.stopPropagation(); duplicateBlock(row.id, col.id, b.id) }} title="Duplicate"><i className="fas fa-copy"></i></button><button className="elm-widget-tool elm-tool-btn-del" onClick={(e) => { e.stopPropagation(); removeBlock(row.id, col.id, b.id) }} title="Delete"><i className="fas fa-trash"></i></button></div>}
                                          <WidgetPreview block={b} />
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
                                {row.columns.length < 4 && <button className="elm-add-col-btn" onClick={(e) => { e.stopPropagation(); addColumn(row.id) }} title="Add Column"><i className="fas fa-plus"></i></button>}
                              </div>
                            )}
                          </Tag>
                        )
                      }}
                    </SortableItem>
                  ))}
                </SortableList>
              )
            })()}
            {rows.some(r => r.hidden) && (
              <div className="elm-hidden-sections-bar">
                <i className="fas fa-eye-slash"></i> {rows.filter(r => r.hidden).length} hidden section(s)
                <button className="elm-restore-btn" onClick={() => setRows(prev => prev.map(r => r.hidden ? { ...r, hidden: false } : r))}>Restore all</button>
              </div>
            )}
            <button className="elm-add-section" onClick={() => addCustomRow(rows.length)}>
              <i className="fas fa-plus"></i> Add Custom Section
            </button>
          </div>
        </div>
      </div>
      {inlineEl && (
        <div className="elm-inline-toolbar">
          <span style={{fontSize:'10px',color:'#6cab96',marginRight:8}}>Editing inline — click Save when done</span>
          <button className="elm-tool-btn" style={{background:'#6cab96',color:'#0f0f1a',padding:'3px 10px',borderRadius:3,fontSize:11}}
            onClick={() => stopInlineEdit(inlineEl.rowId, true)}><i className="fas fa-check"></i> Save</button>
          <button className="elm-tool-btn elm-tool-btn-del" style={{padding:'3px 10px',borderRadius:3,fontSize:11}}
            onClick={() => stopInlineEdit(inlineEl.rowId, false)}><i className="fas fa-times"></i> Cancel</button>
        </div>
      )}
    </div>
  )
}

function WidgetContentFields({ block, onUpdate }) {
  if (block.type === 'text') return <textarea rows={6} value={block.content || ''} onChange={e => onUpdate({ content: e.target.value })} className="elm-input elm-textarea" />
  if (block.type === 'heading') return (<><select value={block.level || 'h2'} onChange={e => onUpdate({ level: e.target.value })} className="elm-input"><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option></select><input value={block.content || ''} onChange={e => onUpdate({ content: e.target.value })} className="elm-input" placeholder="Heading text" /></>)
  if (block.type === 'image') return (<><input value={block.src || ''} onChange={e => onUpdate({ src: e.target.value })} className="elm-input" placeholder="Image URL" /><input value={block.alt || ''} onChange={e => onUpdate({ alt: e.target.value })} className="elm-input" placeholder="Alt text" /><input value={block.caption || ''} onChange={e => onUpdate({ caption: e.target.value })} className="elm-input" placeholder="Caption" /></>)
  if (block.type === 'button') return (<><input value={block.text || ''} onChange={e => onUpdate({ text: e.target.value })} className="elm-input" placeholder="Button text" /><input value={block.url || ''} onChange={e => onUpdate({ url: e.target.value })} className="elm-input" placeholder="URL" /><select value={block.style || 'solid'} onChange={e => onUpdate({ style: e.target.value })} className="elm-input"><option value="solid">Solid</option><option value="outline">Outline</option></select></>)
  if (block.type === 'spacer') return <input type="number" value={block.height || 40} onChange={e => onUpdate({ height: parseInt(e.target.value) || 40 })} className="elm-input" placeholder="Height px" />
  if (block.type === 'html') return <textarea rows={6} value={block.html || ''} onChange={e => onUpdate({ html: e.target.value })} className="elm-input elm-textarea elm-mono" />
  if (block.type === 'icon') return (<><input value={block.icon || ''} onChange={e => onUpdate({ icon: e.target.value })} className="elm-input" placeholder="fa-star" /><select value={block.size || '2x'} onChange={e => onUpdate({ size: e.target.value })} className="elm-input"><option value="1x">Small</option><option value="2x">Medium</option><option value="3x">Large</option></select><input value={block.color || ''} onChange={e => onUpdate({ color: e.target.value })} className="elm-input" placeholder="#6cab96" /></>)
  if (block.type === 'video') return <input value={block.src || ''} onChange={e => onUpdate({ src: e.target.value })} className="elm-input" placeholder="Video URL" />
  return <p style={{fontSize:'0.75rem',color:'#666',padding:8}}>No editable fields</p>
}

function FieldEditor({ data, path, onUpdate, depth }) {
  if (depth > 5) return <div style={{fontSize:'0.7rem',color:'#666',padding:'4px 0'}}>Max depth reached</div>
  if (data === null || data === undefined) return null
  if (typeof data === 'string') {
    if (data.length > 120) return <textarea rows={4} value={data} onChange={e => onUpdate(path, e.target.value)} className="elm-input elm-textarea" />
    return <input value={data} onChange={e => onUpdate(path, e.target.value)} className="elm-input" />
  }
  if (typeof data === 'number') return <input type="number" value={data} onChange={e => onUpdate(path, parseFloat(e.target.value) || 0)} className="elm-input" />
  if (typeof data === 'boolean') return (
    <div style={{display:'flex',alignItems:'center',gap:8,margin:'4px 0'}}>
      <input type="checkbox" checked={data} onChange={e => onUpdate(path, e.target.checked)} style={{accentColor:'#6cab96'}} />
      <span style={{fontSize:'0.72rem',color:'#a0a0b0'}}>{path.split('.').pop()}</span>
    </div>
  )
  if (Array.isArray(data)) {
    if (data.length === 0) return <p style={{fontSize:'0.7rem',color:'#666',padding:'4px 0'}}>Empty list</p>
    return (
      <div style={{paddingLeft: depth > 0 ? 8 : 0}}>
        {data.map((item, idx) => (
          <div key={idx} style={{marginBottom:8,border:'1px solid #2a2a44',borderRadius:4,padding:8,background:'#1a1a2e'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <span style={{fontSize:'0.65rem',color:'#666'}}>Item {idx + 1}</span>
              <button style={{padding:'2px 6px',border:'none',background:'transparent',color:'#f14d4d',cursor:'pointer',fontSize:'10px'}}
                onClick={() => { const newArr = [...data]; newArr.splice(idx, 1); onUpdate(path, newArr) }}><i className="fas fa-times"></i></button>
            </div>
            <FieldEditor data={item} path={path + '.' + idx} onUpdate={onUpdate} depth={depth + 1} />
          </div>
        ))}
      </div>
    )
  }
  if (typeof data === 'object') {
    const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined && typeof v !== 'function')
    if (entries.length === 0) return <p style={{fontSize:'0.7rem',color:'#666',padding:'4px 0'}}>Empty object</p>
    return (
      <div style={{paddingLeft: depth > 0 ? 8 : 0}}>
        {entries.map(([key, val]) => {
          const isSimple = typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean'
          return (
            <div key={key} style={{marginBottom: isSimple ? 6 : 8}}>
              {!isSimple && <label style={{fontSize:'0.65rem',fontWeight:600,color:'#6cab96',textTransform:'uppercase',display:'block',marginBottom:4}}>{key}</label>}
              <FieldEditor data={val} path={path + '.' + key} onUpdate={onUpdate} depth={depth + 1} />
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

function WidgetPreview({ block }) {
  const s = block.styles || {}
  const wrap = { padding: '6px', transition: 'all 0.2s', ...(s.background ? { background: s.background } : {}), ...(s.color ? { color: s.color } : {}), borderRadius: s.borderRadius || '4px', textAlign: s.textAlign || 'left', ...(s.fontSize ? { fontSize: s.fontSize } : {}), ...(s.fontWeight ? { fontWeight: s.fontWeight } : {}), ...(s.marginTop ? { marginTop: s.marginTop } : {}), ...(s.marginBottom ? { marginBottom: s.marginBottom } : {}), ...(s.width ? { width: s.width } : {}), ...(s.minHeight ? { minHeight: s.minHeight } : {}), ...(s.boxShadow ? { boxShadow: s.boxShadow } : {}) }
  if (block.type === 'text') return <div style={wrap} dangerouslySetInnerHTML={{ __html: block.content || '' }} />
  if (block.type === 'heading') { const Tag = block.level || 'h2'; return <Tag style={wrap}>{block.content || 'Heading'}</Tag> }
  if (block.type === 'image') return <div style={wrap}><img src={block.src} alt={block.alt} style={{ maxWidth: '100%', display: 'block' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += '<span style=\'color:#666;font-size:0.75rem\'>Image placeholder</span>' }} />{block.caption && <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>{block.caption}</p>}</div>
  if (block.type === 'button') return <div style={wrap}><a className="elm-btn-preview" style={{ background: block.style === 'outline' ? 'transparent' : '#6cab96', color: block.style === 'outline' ? '#6cab96' : '#0f0f1a', border: block.style === 'outline' ? '1px solid #6cab96' : 'none' }}>{block.text || 'Button'}</a></div>
  if (block.type === 'divider') return <div style={wrap}><hr style={{ border: 'none', borderTop: '1px solid #2a2a44', margin: 0 }} /></div>
  if (block.type === 'spacer') return <div style={{ ...wrap, height: (block.height || 40) + 'px', background: 'transparent' }} />
  if (block.type === 'video') return <div style={wrap}><i className="fas fa-play-circle" style={{ fontSize: '2rem', color: '#6cab96' }}></i><p style={{ fontSize: '0.75rem', color: '#666' }}>Video: {block.src || 'No URL set'}</p></div>
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
