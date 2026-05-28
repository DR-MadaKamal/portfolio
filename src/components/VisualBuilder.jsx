const COLOR_PRESETS = ['#0f0f1a','#252540','#2a2a44','#6cab96','#f0c040','#f14d4d','#a0a0b0','#d5d8e2','#ffffff']
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { SortableList, SortableItem } from './SortableList'
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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

const TEMPLATES = [
  { name: 'Single Page', icon: 'fa-file', desc: 'Hero + About + Projects + Contact', rows: ['hero','about','projects','contact'] },
  { name: 'Portfolio', icon: 'fa-briefcase', desc: 'Hero + Projects + Testimonials + FAQ', rows: ['hero','projects','testimonials','faq','contact'] },
  { name: 'Business', icon: 'fa-building', desc: 'Hero + Logos + Process + Contact', rows: ['hero','logos','process','map','contact'] },
  { name: 'Blog', icon: 'fa-newspaper', desc: 'Hero + Articles + Newsletter + Footer', rows: ['hero','articles','newsletter','contact'] },
  { name: 'Full Featured', icon: 'fa-star', desc: 'All sections', rows: ['hero','about','logos','projects','portfolio-gallery','case-studies','testimonials','achievements','process','tools','faq','articles','portfolio-download','map','newsletter','contact'] },
]

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

function extractStyles(el) {
  if (!el) return {}
  const s = getComputedStyle(el)
  const res = {}
  const map = { color: 'color', fontSize: 'fontSize', fontWeight: 'fontWeight', textAlign: 'textAlign', fontFamily: 'fontFamily', background: 'background' }
  Object.entries(map).forEach(([prop, key]) => {
    const val = s[prop]
    if (val && val !== 'initial' && val !== 'normal' && val !== 'none' && !val.includes('rgb(0, 0, 0)') && !val.includes('rgba(0, 0, 0, 0)')) res[key] = val
  })
  return res
}

function parseChildrenToBlocks(parentEl) {
  const blocks = []
  parentEl?.childNodes?.forEach(node => {
    if (node.nodeType === 3) {
      const t = node.textContent.trim()
      if (t) blocks.push({ id: uid(), type: 'text', content: `<p>${escapeHtml(t)}</p>`, styles: {} })
    } else if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase()
      const html = node.outerHTML
      const st = extractStyles(node)
      if (['h1','h2','h3','h4','h5','h6'].includes(tag))
        blocks.push({ id: uid(), type: 'heading', level: tag, content: node.textContent || '', styles: st })
      else if (tag === 'img')
        blocks.push({ id: uid(), type: 'image', src: node.getAttribute('src') || '', alt: node.getAttribute('alt') || '', caption: node.getAttribute('title') || '', styles: { ...st, width: node.style.width || '', borderRadius: node.style.borderRadius || '' } })
      else if (tag === 'a' && node.querySelector('img'))
        blocks.push({ id: uid(), type: 'image', src: node.querySelector('img')?.getAttribute('src') || '', alt: node.textContent || '', styles: st })
      else if (tag === 'a')
        blocks.push({ id: uid(), type: 'button', text: node.textContent || 'Link', url: node.getAttribute('href') || '#', style: 'outline', styles: st })
      else if (tag === 'button')
        blocks.push({ id: uid(), type: 'button', text: node.textContent || 'Button', url: '#', style: 'solid', styles: st })
      else
        blocks.push({ id: uid(), type: 'text', content: html, styles: st })
    }
  })
  return blocks
}

function escapeHtml(t) { return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

const SECTION_CONVERTERS = {
  hero: (d) => {
    const p = d.personalData || {}
    const blocks = [
      { id: uid(), type: 'heading', level: 'h1', content: p.title || '', dataPath: 'personalData.title' },
      { id: uid(), type: 'text', content: `<p>${p.tagline || ''}</p>`, dataPath: 'personalData.tagline' },
      { id: uid(), type: 'text', content: `<p>${(p.heroSummary || '').replace(/\n/g, '</p><p>')}</p>`, dataPath: 'personalData.heroSummary' },
    ]
    if (p.phone || p.email || p.location) {
      const line = [p.phone && `📞 ${p.phone}`, p.email && `✉️ ${p.email}`, p.location && `📍 ${p.location}`].filter(Boolean).join(' | ')
      blocks.push({ id: uid(), type: 'text', content: `<p>${line}</p>` })
    }
    if (p.cvUrl) blocks.push({ id: uid(), type: 'button', text: '📄 Download CV', url: p.cvUrl, style: 'solid', dataPath: 'personalData.cvUrl' })
    const qs = d.quotes
    if (qs?.length) qs.forEach((q, i) => blocks.push({ id: uid(), type: 'text', content: `<blockquote>${q.text || ''}<br/><cite>— ${q.author || ''}</cite></blockquote>`, dataPath: `quotes.${i}` }))
    return blocks
  },
  about: (d) => {
    const blocks = []
    if (d.personalData?.summary) blocks.push({ id: uid(), type: 'text', content: `<p>${(d.personalData.summary || '').replace(/\n/g, '</p><p>')}</p>`, dataPath: 'personalData.summary' })
    return blocks
  },
  faq: (d) => {
    return (d.faq || []).flatMap((item, i) => [
      { id: uid(), type: 'heading', level: 'h4', content: `Q: ${item.q || ''}`, dataPath: `faq.${i}.q` },
      { id: uid(), type: 'text', content: `<p>${item.a || ''}</p>`, dataPath: `faq.${i}.a` },
    ])
  },
  map: (d) => {
    const loc = d.personalData?.location
    if (!loc) return []
    return [{ id: uid(), type: 'text', content: `<p>📍 ${loc}</p>`, dataPath: 'personalData.location' }]
  },
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
      button: { icon: 'fa-link', label: 'Button', defaults: { text: 'Click Me', url: '#', style: 'solid' } },
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
      html: { icon: 'fa-code', label: 'Custom HTML', defaults: { html: '<div>Custom HTML</div>' } },
      shortcode: { icon: 'fa-code-branch', label: 'Shortcode', defaults: { key: '', placeholder: 'Insert shortcode...' } },
      container: { icon: 'fa-layer-group', label: 'Container', defaults: { children: [] } },
      form: { icon: 'fa-wpforms', label: 'Form', defaults: { fields:[{type:'text',label:'Name',required:true,placeholder:'Your name'},{type:'email',label:'Email',required:true,placeholder:'your@email.com'},{type:'textarea',label:'Message',required:false,placeholder:'Your message'}], submitText:'Send Message', successMsg:'Thank you!', redirectUrl:'', emailTo:'' } },
      'loop-grid': { icon: 'fa-th-list', label: 'Loop Grid', defaults: { source:'projects', layout:'grid', columns:3, itemTemplate:'card', maxItems:6, filterKey:'' } },
    }
  },
  advanced: {
    label: 'Interactive',
    items: {
      tabs: { icon: 'fa-folder-tree', label: 'Tabs', defaults: { items: [{label:'Tab 1',content:'<p>Content 1</p>'},{label:'Tab 2',content:'<p>Content 2</p>'},{label:'Tab 3',content:'<p>Content 3</p>'}], activeTab:0 } },
      accordion: { icon: 'fa-list', label: 'Accordion', defaults: { items: [{title:'Item 1',content:'<p>Content</p>',open:false},{title:'Item 2',content:'<p>Content</p>',open:false}], multiOpen:false } },
      counter: { icon: 'fa-chart-line', label: 'Counter', defaults: { number:100, suffix:'+', prefix:'', label:'Projects', duration:2, startCounting:false } },
      progress: { icon: 'fa-tasks', label: 'Progress Bar', defaults: { percent:75, label:'Skills', color:'#6cab96', showLabel:true } },
      carousel: { icon: 'fa-images', label: 'Image Carousel', defaults: { images:[{src:'https://placehold.co/600x400/252540/a0a0b0?text=Slide+1',caption:''},{src:'https://placehold.co/600x400/252540/a0a0b0?text=Slide+2',caption:''}], autoplay:true, speed:3000, arrows:true } },
      'star-rating': { icon: 'fa-star', label: 'Star Rating', defaults: { rating:4.5, max:5, size:'1.2rem', color:'#ffd700' } },
    }
  },
  global: {
    label: 'Global Widgets',
    items: {},
  },
  sections: {
    label: 'Site Sections',
    items: (() => {
      const m = {}
      Object.keys(SECTION_COMPONENTS).forEach(key => m[key] = { icon: SECTION_ICONS[key] || 'fa-layer-group', label: SECTION_LABELS[key] || key })
      return m
    })()
  }
}

const defaultSectionRow = (key) => ({ id: uid(), type: 'section', sectionKey: key, styles: {}, inlineHTML: null, inlineStyles: {} })
const defaultCustomRow = () => ({ id: uid(), type: 'custom', columns: [{ id: uid(), width: 100, blocks: [], styles: {} }], styles: {} })
const defaultNestedRow = () => ({ id: uid(), type: 'nested', columns: [{ id: uid(), width: 100, blocks: [], styles: {} }], styles: {} })

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
  const [previewMode, setPreviewMode] = useState(false)
  const [clipboard, setClipboard] = useState(null)
  const [sectionClipboard, setSectionClipboard] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [globalWidgets, setGlobalWidgets] = useState(() => data.builder?.globalWidgets || [])
  const [colResizing, setColResizing] = useState(null)
  const [panelCollapsed, setPanelCollapsed] = useState(() => document.cookie.includes('elm_panel_collapsed=1'))
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [selectedWidgets, setSelectedWidgets] = useState([])
  const [selectedSectionIds, setSelectedSectionIds] = useState([])
  const [collapsedSections, setCollapsedSections] = useState([])
  const [widgetPresets, setWidgetPresets] = useState(() => data.builder?.widgetPresets || [])
  const [zoom, setZoom] = useState(100)
  const [showGrid, setShowGrid] = useState(false)
  const [builderMode, setBuilderMode] = useState('page')
  const [themes, setThemes] = useState(() => data.builder?.themes || { header: null, footer: null })
  const [activeThemeType, setActiveThemeType] = useState('header')
  const [themeRows, setThemeRows] = useState(null)
  const [themeConditions, setThemeConditions] = useState({})
  const [popups, setPopups] = useState(() => data.builder?.popups || [])
  const [activePopupId, setActivePopupId] = useState(null)
  const [editingPopupTrigger, setEditingPopupTrigger] = useState(false)
  const globalWidgetsRef = useRef(globalWidgets); globalWidgetsRef.current = globalWidgets
  const themesRef = useRef(themes); themesRef.current = themes
  const popupsRef = useRef(popups); popupsRef.current = popups
  const r = useRef(true)
  const inlinePrevRef = useRef(null)
  const latestRef = useRef({ rows, localData })
  const colResizingRef = useRef(null)
  const hoverTimerRef = useRef(null)
  const syncingRef = useRef(false)
  const lastSavedRef = useRef(JSON.stringify(data))
  const onSaveRef = useRef(onSave); onSaveRef.current = onSave

  latestRef.current = { rows, localData }

  useEffect(() => {
    if (data && Object.keys(data).length) {
      syncingRef.current = true
      setLocalData(prev => { const m = JSON.parse(JSON.stringify(data)); if (prev?.builder?.rows) m.builder = { rows: prev.builder.rows, globalWidgets: prev.builder?.globalWidgets || globalWidgetsRef.current }; return m })
    }
  }, [data])

  useEffect(() => {
    if (r.current) { r.current = false; return }
    if (syncingRef.current) { syncingRef.current = false; return }
    const timer = setTimeout(() => {
      const { rows: r2, localData: d } = latestRef.current
      const saved = JSON.parse(JSON.stringify(d))
      saved.builder = { ...(saved.builder || {}), rows: r2, globalWidgets: globalWidgetsRef.current, themes: themesRef.current, popups: popupsRef.current }
      if (saved.settings?.sections) {
        r2.forEach((row, i) => {
          if ((row.type === 'section' || row.type === 'widget-section') && row.sectionKey) {
            if (!saved.settings.sections[row.sectionKey]) saved.settings.sections[row.sectionKey] = {}
            saved.settings.sections[row.sectionKey].visible = row.hidden !== true
            saved.settings.sections[row.sectionKey].order = i
          }
        })
      }
      const savedStr = JSON.stringify(saved)
      if (savedStr === lastSavedRef.current) return
      lastSavedRef.current = savedStr
      onSaveRef.current(saved, 'Builder')
    }, 500)
    return () => clearTimeout(timer)
  }, [rows, localData, globalWidgets])

  useEffect(() => () => {
    const { rows: r2, localData: d } = latestRef.current
    const saved = JSON.parse(JSON.stringify(d))
    saved.builder = { ...(saved.builder || {}), rows: r2, globalWidgets: globalWidgetsRef.current, themes: themesRef.current, popups: popupsRef.current }
    if (saved.settings?.sections) {
      r2.forEach((row, i) => {
        if ((row.type === 'section' || row.type === 'widget-section') && row.sectionKey) {
          if (!saved.settings.sections[row.sectionKey]) saved.settings.sections[row.sectionKey] = {}
          saved.settings.sections[row.sectionKey].visible = row.hidden !== true
          saved.settings.sections[row.sectionKey].order = i
        }
      })
    }
    const savedStr = JSON.stringify(saved)
    if (savedStr === lastSavedRef.current) return
    onSaveRef.current(saved, 'Builder')
  }, [])
  
  const isDirty = useMemo(() => {
    const copy = JSON.parse(JSON.stringify(localData))
    copy.builder = { ...(copy.builder || {}), rows, globalWidgets, themes, popups }
    if (copy.settings?.sections) {
      rows.forEach((row, i) => {
        if ((row.type === 'section' || row.type === 'widget-section') && row.sectionKey) {
          if (!copy.settings.sections[row.sectionKey]) copy.settings.sections[row.sectionKey] = {}
          copy.settings.sections[row.sectionKey].visible = row.hidden !== true
          copy.settings.sections[row.sectionKey].order = i
        }
      })
    }
    return JSON.stringify(copy) !== lastSavedRef.current
  }, [localData, rows, globalWidgets, themes, popups])

  const pushHistory = useCallback((newRows) => {
    setRows(newRows)
    setHistory(prev => { const trimmed = prev.slice(0, historyIdx + 1); const next = [...trimmed, JSON.parse(JSON.stringify(newRows))].slice(-50); setHistoryIdx(next.length - 1); return next })
  }, [historyIdx])

  const goToHistory = (idx) => { if (idx >= 0 && idx < history.length) { setHistoryIdx(idx); setRows(JSON.parse(JSON.stringify(history[idx]))) } }
  const undo = () => { if (historyIdx > 0) { const i = historyIdx - 1; goToHistory(i) } }
  const redo = () => { if (historyIdx < history.length - 1) { const i = historyIdx + 1; goToHistory(i) } }

  const addSectionRow = (key, idx) => { const arr = [...rows]; arr.splice(idx ?? rows.length, 0, defaultSectionRow(key)); pushHistory(arr) }
  const addCustomRow = (idx) => { const arr = [...rows]; arr.splice(idx ?? rows.length, 0, defaultCustomRow()); pushHistory(arr) }
  const removeRow = (id) => { const row = rows.find(r => r.id === id); if (row?.locked) return alert('Section is locked'); if (confirm('Delete this section?')) pushHistory(rows.filter(r => r.id !== id)) }
  const duplicateRow = (id) => { const row = rows.find(r => r.id === id); if (row?.locked) return; const ri = rows.findIndex(r => r.id === id); if (ri < 0) return; const c = JSON.parse(JSON.stringify(rows[ri])); c.id = uid(); const arr = [...rows]; arr.splice(ri + 1, 0, c); pushHistory(arr) }
  const toggleSectionVisibility = (id) => { setRows(prev => prev.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r)) }
  const toggleSectionLock = (id) => { setRows(prev => prev.map(r => r.id === id ? { ...r, locked: !r.locked } : r)) }
  const toggleCollapse = (id) => { setCollapsedSections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]) }

  const addNestedRow = (rowId, colId) => {
    pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: [...c.blocks, { id: uid(), type: 'nested-row', row: defaultNestedRow() }] } : c) } : r))
  }

  const addBlockToCol = (rowId, colId, type, defaults) => {
    const cat = Object.values(WIDGETS).find(c => c.items[type])
    const meta = cat?.items[type]
    const defs = defaults || meta?.defaults || {}
    if (!meta) return
    pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: [...c.blocks, { id: uid(), type, ...JSON.parse(JSON.stringify(defs)), styles: {} }] } : c) } : r))
  }

  const removeBlock = (rowId, colId, blockId) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.filter(b => b.id !== blockId) } : c) } : r))
  const updateBlockStyle = (rowId, colId, blockId, stylePatch) => pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.map(b => b.id === blockId ? { ...b, styles: { ...(b.styles || {}), ...stylePatch } } : b) } : c) } : r))
  const duplicateBlock = (rowId, colId, blockId) => { const ri = rows.findIndex(r => r.id === rowId); if (ri < 0) return; const col = rows[ri].columns.find(c => c.id === colId); if (!col) return; const bi = col.blocks.findIndex(b => b.id === blockId); if (bi < 0) return; const dup = { ...JSON.parse(JSON.stringify(col.blocks[bi])), id: uid() }; pushHistory(rows.map((r, i) => i !== ri ? r : { ...r, columns: r.columns.map(c => c.id !== colId ? c : { ...c, blocks: [...c.blocks.slice(0, bi + 1), dup, ...c.blocks.slice(bi + 1)] }) })) }
  const addColumn = (rowId) => pushHistory(rows.map(r => r.id === rowId && r.columns.length < 4 ? { ...r, columns: [...r.columns, { id: uid(), width: 0, blocks: [], styles: {} }].map(c => ({ ...c, width: Math.round(100 / (r.columns.length + 1)) })) } : r))
  const removeColumn = (rowId, colId) => pushHistory(rows.map(r => r.id === rowId && r.columns.length > 1 ? { ...r, columns: r.columns.filter(c => c.id !== colId).map(c => ({ ...c, width: Math.round(100 / (r.columns.length - 1)) })) } : r))
  const updateRowStyle = (rowId, stylePatch) => { setRows(prev => prev.map(r => r.id === rowId ? { ...r, styles: { ...(r.styles || {}), ...stylePatch } } : r)) }
  const reorderBlocks = (rowId, colId, newOrder) => { pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: newOrder } : c) } : r)) }

  const handleExportTemplate = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'builder-template.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportTemplate = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result)
        if (Array.isArray(imported)) pushHistory(imported)
        else alert('Invalid template: expected an array of rows')
      } catch { alert('Invalid JSON file') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const loadTemplate = (template) => {
    if (!confirm(`Load "${template.name}" template? This will replace all sections.`)) return
    pushHistory(template.rows.map(key => defaultSectionRow(key)))
  }

  const blockSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  function handleBlockSortEnd(event, rowId, colId) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    const col = row.columns?.find(c => c.id === colId)
    if (!col) return
    const oldIdx = col.blocks.findIndex(b => b.id === active.id)
    const newIdx = col.blocks.findIndex(b => b.id === over.id)
    if (oldIdx === -1 || newIdx === -1) return
    reorderBlocks(rowId, colId, arrayMove(col.blocks, oldIdx, newIdx))
  }

  function updateWidgetWithSync(rowId, colId, blockId, patch) {
    const patchedRows = rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: c.blocks.map(b => b.id === blockId ? { ...b, ...patch } : b) } : c) } : r)
    pushHistory(patchedRows)
    const block = rows.find(r => r.id === rowId)?.columns.find(c => c.id === colId)?.blocks.find(b => b.id === blockId)
    if (block?.dataPath && (patch.content !== undefined || patch.text !== undefined)) {
      const val = patch.content !== undefined ? patch.content : patch.text
      setLocalData(prev => { const n = JSON.parse(JSON.stringify(prev)); setDeep(n, block.dataPath, val); return n })
    }
  }

  function convertSectionToWidgets(rowId) {
    const row = rows.find(r => r.id === rowId)
    if (!row || !row.sectionKey) return
    const converter = SECTION_CONVERTERS[row.sectionKey]
    let blocks = []
    if (converter) {
      blocks = converter(localData).map(b => ({ ...b, styles: {} }))
    } else {
      const el = document.getElementById(`sec-${rowId}`)
      const inner = el?.querySelector('.elm-section-live-inner')
      blocks = parseChildrenToBlocks(inner)
    }
    if (blocks.length === 0) blocks.push({ id: uid(), type: 'text', content: '<p>Section content</p>', styles: {} })
    pushHistory(rows.map(r => r.id === rowId ? {
      ...r, type: 'widget-section', inlineHTML: null,
      columns: [{ id: uid(), width: 100, blocks }]
    } : r))
  }

  function handleSectionDrop(e, rowId, ri) {
    const t = e.dataTransfer.getData('text/plain')
    if (!t) return
    e.preventDefault()
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    if (row.type !== 'widget-section' && row.type !== 'custom' && row.type !== 'nested') {
      convertSectionToWidgets(rowId)
      setTimeout(() => {
        const updated = latestRef.current.rows.find(r => r.id === rowId)
        if (updated && updated.columns?.[0]) {
          addBlockToCol(rowId, updated.columns[0].id, t)
        }
      }, 50)
    } else if (row.columns?.[0]) {
      if (!isSection(t)) addBlockToCol(rowId, row.columns[0].id, t)
      else addSectionRow(t, ri + 1)
    }
  }

  function updateSectionField(sectionKey, fieldPath, value) {
    setLocalData(prev => { const n = JSON.parse(JSON.stringify(prev)); setDeep(n, fieldPath, value); return n })
  }

  function handleSaveNow() {
    const { localData: d } = latestRef.current
    const saved = JSON.parse(JSON.stringify(d))
    saved.builder = { ...(saved.builder || {}), rows: latestRef.current.rows, globalWidgets: globalWidgetsRef.current, themes: themesRef.current, popups: popupsRef.current }
    if (saved.settings?.sections) {
      latestRef.current.rows.forEach((row, i) => {
        if ((row.type === 'section' || row.type === 'widget-section') && row.sectionKey) {
          if (!saved.settings.sections[row.sectionKey]) saved.settings.sections[row.sectionKey] = {}
          saved.settings.sections[row.sectionKey].visible = row.hidden !== true
          saved.settings.sections[row.sectionKey].order = i
        }
      })
    }
    lastSavedRef.current = JSON.stringify(saved)
    onSaveRef.current(saved, 'Builder')
  }

  function startInlineEdit(rowId) {
    const contentEl = document.getElementById(`sec-${rowId}`)?.querySelector('.elm-section-live-inner')
    if (!contentEl) return
    inlinePrevRef.current = contentEl.innerHTML
    setInlineEl(rowId)
    contentEl.contentEditable = true
    contentEl.focus()
  }

  function stopInlineEdit(rowId, save) {
    const contentEl = document.getElementById(`sec-${rowId}`)?.querySelector('.elm-section-live-inner')
    if (!contentEl) return
    contentEl.contentEditable = false
    setInlineEl(null)
    setSelEl(null)
    if (save) {
      const html = contentEl.innerHTML
      setRows(prev => prev.map(r => r.id === rowId ? { ...r, inlineHTML: html } : r))
    } else if (inlinePrevRef.current) {
      contentEl.innerHTML = inlinePrevRef.current
    }
    inlinePrevRef.current = null
  }

  function handleElPointer(e, rowId, callback) {
    const overlay = document.getElementById(`sec-${rowId}`)?.querySelector('.elm-el-overlay')
    if (!overlay) return callback(null)
    overlay.style.pointerEvents = 'none'
    const target = document.elementFromPoint(e.clientX, e.clientY)
    overlay.style.pointerEvents = 'auto'
    if (!target) return callback(null)
    const isEditable = EDITABLE_TAGS.has(target.tagName?.toLowerCase()) || target.closest('[contenteditable]')
    const isInner = target.closest('.elm-section-live-inner')
    if (!isEditable || !isInner) return callback(null)
    callback(target)
  }

  function handleElHover(e, rowId) {
    if (inlineEl) { setHoveredEl(null); setHoverPos(null); return }
    if (hoverTimerRef.current) cancelAnimationFrame(hoverTimerRef.current)
    const cx = e.clientX, cy = e.clientY
    hoverTimerRef.current = requestAnimationFrame(() => {
      handleElPointer({ clientX: cx, clientY: cy, target: e.target }, rowId, (target) => {
        if (!target) { setHoveredEl(null); setHoverPos(null); return }
        const rect = target.getBoundingClientRect()
        const cr = document.getElementById(`sec-${rowId}`)?.getBoundingClientRect()
        if (!cr) return
        setHoveredEl({ el: target, rowId, tag: target.tagName.toLowerCase() })
        setHoverPos({ top: rect.top - cr.top, left: rect.left - cr.left, width: rect.width, height: rect.height })
      })
    })
  }

  function handleElClick(e, rowId) {
    if (inlineEl) return
    handleElPointer(e, rowId, (target) => {
      if (!target) { setSelEl(null); return }
      e.stopPropagation()
      const rect = target.getBoundingClientRect()
      const cr = document.getElementById(`sec-${rowId}`)?.getBoundingClientRect()
      if (!cr) return
      const s = getComputedStyle(target)
      setSelEl({
        el: target, rowId, tag: target.tagName.toLowerCase(), text: (target.textContent || '').trim().slice(0, 80),
        styles: { color: s.color, fontSize: s.fontSize, fontWeight: s.fontWeight, textAlign: s.textAlign, background: s.background, fontFamily: s.fontFamily },
        rect: { top: rect.top - cr.top, left: rect.left - cr.left, width: rect.width, height: rect.height }
      })
      setSelected({ rowId, colId: null, element: 'row' })
      setLeftTab('settings'); setEditPane('element')
    })
  }

  function handleElDblClick(e, rowId) {
    handleElPointer(e, rowId, (target) => {
      if (!target || inlineEl) return
      e.stopPropagation()
      target.contentEditable = true; target.focus()
      setInlineEl({ el: target, rowId })
      setSelEl(null)
      const r = document.createRange(); r.selectNodeContents(target)
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r)
    })
  }

  function applyElStyle(styleProp, value) {
    if (!selEl?.el) return
    selEl.el.style[styleProp] = value
    const rid = selEl.rowId
    const row = rows.find(r => r.id === rid)
    if (!row) return
    const sel = buildSelector(selEl.el)
    setRows(prev => prev.map(r => r.id === rid ? { ...r, inlineStyles: { ...(r.inlineStyles || {}), [sel]: { ...((r.inlineStyles || {})[sel] || {}), [styleProp]: value } } } : r))
    setSelEl(prev => prev ? { ...prev, styles: { ...prev.styles, [styleProp]: value } } : null)
  }

  function buildSelector(el) {
    if (!el || el === document.body) return ''
    if (el.id) return '#' + el.id
    let path = []; let cur = el
    while (cur && cur !== document.body && cur !== document) {
      const tag = cur.tagName?.toLowerCase() || ''
      let nth = 1; let sib = cur.previousElementSibling
      while (sib) { if (sib.tagName?.toLowerCase() === tag) nth++; sib = sib.previousElementSibling }
      path.unshift(tag + (nth > 1 ? `:nth-of-type(${nth})` : ''))
      cur = cur.parentElement
      if (cur?.classList?.contains('elm-section-live-inner')) break
    }
    return path.join(' > ')
  }

  function handleContextMenu(e, rowId) {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, rowId })
  }

  function handleCopyBlock(rowId, colId, blockId) {
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    const col = row.columns?.find(c => c.id === colId)
    if (!col) return
    const block = col.blocks.find(b => b.id === blockId)
    if (!block) return
    setClipboard({ ...JSON.parse(JSON.stringify(block)), id: uid() })
  }

  function handlePasteBlock(rowId, colId) {
    if (!clipboard) return
    const pasted = { ...JSON.parse(JSON.stringify(clipboard)), id: uid() }
    pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: [...c.blocks, pasted] } : c) } : r))
  }

  function handleCopySection(rowId) {
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    setSectionClipboard({ ...JSON.parse(JSON.stringify(row)), id: uid() })
  }

  function handlePasteSection() {
    if (!sectionClipboard) return
    const pasted = { ...JSON.parse(JSON.stringify(sectionClipboard)), id: uid() }
    pushHistory([...rows, pasted])
  }

  function handleSaveGlobalWidget(rowId, colId, blockId) {
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    const col = row.columns?.find(c => c.id === colId)
    if (!col) return
    const block = col.blocks.find(b => b.id === blockId)
    if (!block) return
    const name = prompt('Name this global widget:', block.type)
    if (!name) return
    const gw = { ...JSON.parse(JSON.stringify(block)), id: uid(), globalName: name }
    setGlobalWidgets(prev => [...prev, gw])
  }

  function addGlobalWidget(gw, rowId, colId) {
    const pasted = { ...JSON.parse(JSON.stringify(gw)), id: uid() }
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    pushHistory(rows.map(r => r.id === rowId ? { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, blocks: [...c.blocks, pasted] } : c) } : r))
  }

  function startColResize(e, rowId, colIdx) {
    e.preventDefault()
    setColResizing({ rowId, colIdx, startX: e.clientX, startWidths: null, row: rows.find(r => r.id === rowId) })
  }

  useEffect(() => {
    if (!colResizing) return
    const onMove = (e) => {
      const { rowId, colIdx, startX } = colResizing
      const row = latestRef.current.rows.find(r => r.id === rowId)
      if (!row) return
      if (!colResizing.startWidths) {
        setColResizing(prev => ({ ...prev, startWidths: row.columns.map(c => c.width) }))
        return
      }
      const el = document.getElementById(`sec-${rowId}`)
      if (!el) return
      const rect = el.getBoundingClientRect()
      const totalW = rect.width
      const dx = e.clientX - startX
      const deltaPct = (dx / totalW) * 100
      const widths = [...colResizing.startWidths]
      const leftW = Math.max(10, widths[colIdx] + deltaPct)
      const rightW = Math.max(10, widths[colIdx + 1] - deltaPct)
      widths[colIdx] = Math.round(leftW * 100) / 100
      widths[colIdx + 1] = Math.round(rightW * 100) / 100
      const sum = widths.reduce((a, b) => a + b, 0)
      const adjusted = widths.map(w => Math.round((w / sum) * 100))
      setRows(prev => prev.map(r => r.id === rowId ? { ...r, columns: r.columns.map((c, i) => ({ ...c, width: adjusted[i] })) } : r))
    }
    const onUp = () => setColResizing(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [colResizing])

  const searchableWidgets = useMemo(() => Object.entries(WIDGETS).flatMap(([catKey, cat]) => catKey === 'sections' ? [] : Object.entries(cat.items).map(([k, v]) => ({ key: k, ...v, category: cat.label }))), [])
  const filteredWidgets = search ? searchableWidgets.filter(w => w.label.toLowerCase().includes(search.toLowerCase())) : null
  const isSection = useCallback((type) => SECTION_COMPONENTS[type] != null, [])
  const canvasWidth = useMemo(() => previewMode ? '100%' : responsiveMode === 'mobile' ? '480px' : responsiveMode === 'tablet' ? '900px' : 'min(100%, 1400px)', [previewMode, responsiveMode])

  const selectedRow = useMemo(() => selected?.rowId ? rows.find(r => r.id === selected.rowId) : null, [selected?.rowId, rows])
  const selectedSectionKey = useMemo(() => selectedRow?.type === 'section' || selectedRow?.type === 'widget-section' ? selectedRow.sectionKey : null, [selectedRow])
  const selectedDataPaths = useMemo(() => selectedSectionKey ? (SECTION_DATA_PATHS[selectedSectionKey] || []) : [], [selectedSectionKey])
  const selectedBlock = useMemo(() => {
    if (selected?.element !== 'widget') return null
    const row = rows.find(r => r.id === selected.rowId)
    if (!row) return null
    const col = row.columns?.find(c => c.id === selected.colId)
    if (!col) return null
    return col.blocks.find(b => b.id === selected.block?.id) || null
  }, [selected, rows])
  const isWidgetMode = useMemo(() => selectedRow?.type === 'widget-section', [selectedRow])
  const allWidgets = useMemo(() => {
    const w = { ...WIDGETS }
    if (globalWidgets.length) w.global = { ...w.global, items: Object.fromEntries(globalWidgets.map(gw => [gw.id, { icon: 'fa-globe', label: gw.globalName || gw.type, ...gw }])) }
    return w
  }, [globalWidgets])
  const vr = useMemo(() => rows.filter(r => !r.hidden), [rows])
  const canvasRows = useMemo(() => {
    if (builderMode === 'theme' && themeRows) return themeRows
    if (builderMode === 'popup' && activePopupId) { const p = popups.find(x => x.id === activePopupId); return p?.rows || [] }
    return rows
  }, [builderMode, themeRows, activePopupId, popups, rows])

  const rowActions = (row, ri) => {
    if (!contextMenu || contextMenu.rowId !== row.id) return null
    return (
      <div style={{position:'fixed',top:contextMenu.y,left:contextMenu.x,zIndex:99999,background:'#252540',border:'1px solid #2a2a44',borderRadius:6,padding:'4px 0',minWidth:160,boxShadow:'0 8px 32px rgba(0,0,0,0.5)'}}
        onClick={()=>setContextMenu(null)}>
        {[
          {icon:'fa-pen',label:'Edit',action:()=>{setLeftTab('settings');setEditPane('content');setSelected({rowId:row.id,colId:null,element:'row'})}},
          {icon:'fa-pen',label:'Edit',action:()=>{setLeftTab('settings');setEditPane('content');setSelected({rowId:row.id,colId:null,element:'row'})}},
          {icon:'fa-copy',label:'Duplicate',action:()=>duplicateRow(row.id)},
          {icon:'fa-clipboard',label:'Copy Section',action:()=>handleCopySection(row.id)},
          {icon:row.locked?'fa-lock':'fa-unlock',label:row.locked?'Unlock':'Lock',action:()=>toggleSectionLock(row.id)},
          {icon:'fa-eye-slash',label:row.hidden?'Show':'Hide',action:()=>toggleSectionVisibility(row.id)},
          row.type==='section'&&!row.locked?{icon:'fa-th-large',label:'Convert to Widgets',action:()=>convertSectionToWidgets(row.id)}:null,
          {icon:'fa-chevron-up',label:'Move Up',action:()=>{if(!row.locked){const arr=[...rows];if(ri>0){[arr[ri-1],arr[ri]]=[arr[ri],arr[ri-1]];pushHistory(arr)}}}},
          {icon:'fa-chevron-down',label:'Move Down',action:()=>{if(!row.locked){const arr=[...rows];if(ri<arr.length-1){[arr[ri],arr[ri+1]]=[arr[ri+1],arr[ri]];pushHistory(arr)}}}},
          {icon:'fa-trash',label:'Delete',action:()=>removeRow(row.id),danger:true},
        ].filter(Boolean).map((item,i)=>(
          <div key={i} onClick={()=>{setContextMenu(null);item.action()}}
            style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',cursor:item.disabled?'not-allowed':'pointer',fontSize:12,color:item.danger?'#f14d4d':item.disabled?'#555':'#a0a0b0',transition:'background 0.1s'}}
            onMouseEnter={e=>e.target.style.background='rgba(108,171,150,0.08)'}
            onMouseLeave={e=>e.target.style.background='transparent'}>
            <i className={`fas ${item.icon}`} style={{width:14,fontSize:11,color:item.danger?'#f14d4d':'#6cab96'}}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  const renderBlock = (b, row, col, bSel, isCol) => {
    const isMulti = selectedWidgets.includes(b.id)
    return (
    <SortableBlock key={b.id} id={b.id}>
      <div className={`elm-widget ${bSel?'elm-widget-active':''} ${isMulti?'elm-widget-multi':''}`}
        onClick={e=>{e.stopPropagation();if(e.shiftKey){setSelectedWidgets(prev=>prev.includes(b.id)?prev.filter(id=>id!==b.id):[...prev,b.id]);setSelected({rowId:row.id,colId:col.id,block:b,element:'widget'})}else{setSelectedWidgets([]);setSelected({rowId:row.id,colId:col.id,block:b,element:'widget'})}}}>
        {bSel&&<div className="elm-widget-tools">
          <button className="elm-widget-tool" onClick={e=>{e.stopPropagation();handleCopyBlock(row.id,col.id,b.id)}} title="Copy"><i className="fas fa-copy"></i></button>
          <button className="elm-widget-tool" onClick={e=>{e.stopPropagation();handlePasteBlock(row.id,col.id)}} title="Paste"><i className="fas fa-paste"></i></button>
          <button className="elm-widget-tool" onClick={e=>{e.stopPropagation();handleSaveGlobalWidget(row.id,col.id,b.id)}} title="Save as Global"><i className="fas fa-globe"></i></button>
          <button className="elm-widget-tool" onClick={e=>{e.stopPropagation();duplicateBlock(row.id,col.id,b.id)}} title="Duplicate"><i className="fas fa-copy"></i> <sup>2</sup></button>
          <button className="elm-widget-tool elm-tool-btn-del" onClick={e=>{e.stopPropagation();removeBlock(row.id,col.id,b.id)}} title="Delete"><i className="fas fa-trash"></i></button>
        </div>}
        {b.type === 'nested-row' ? (
          <div className="elm-nested-row">
            <div className="elm-nested-row-label"><i className="fas fa-layer-group"></i> Inner Section</div>
            <NestedRowView row={b.row} parentRowId={row.id} parentColId={col.id}
              selected={selected} setSelected={setSelected} localData={localData}
              onUpdate={(updatedRow) => {
                setRows(prev => prev.map(r => r.id === row.id ? { ...r, columns: r.columns.map(c => c.id === col.id ? { ...c, blocks: c.blocks.map(bl => bl.id === b.id ? { ...bl, row: updatedRow } : bl) } : c) } : r))
              }} />
          </div>
        ) : (
          <WidgetPreview block={b} localData={localData} />
        )}
      </div>
    </SortableBlock>
  )
  }

  return (
    <div className="elm-overlay" onKeyDown={(e) => {
      if (e.key === 'Escape' && inlineEl) { stopInlineEdit(inlineEl.rowId, false); return }
      if (e.key === 'Escape' && contextMenu) { setContextMenu(null); return }
      if ((e.ctrlKey||e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.ctrlKey||e.metaKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo() }
      if ((e.ctrlKey||e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveNow() }
      if ((e.ctrlKey||e.metaKey) && e.key === 'c' && selectedBlock) { e.preventDefault(); handleCopyBlock(selected.rowId, selected.colId, selectedBlock.id) }
      if ((e.ctrlKey||e.metaKey) && e.key === 'v' && clipboard && selected?.colId) { e.preventDefault(); handlePasteBlock(selected.rowId, selected.colId) }
      if ((e.ctrlKey||e.metaKey) && e.shiftKey && e.key === 'V' && sectionClipboard) { e.preventDefault(); handlePasteSection() }
      if (e.key === 'Delete' && selEl?.el?.parentNode) { const rid = selEl.rowId; selEl.el.remove(); setSelEl(null); const inner = document.getElementById(`sec-${rid}`)?.querySelector('.elm-section-live-inner'); if (inner) setRows(prev => prev.map(r => r.id === rid ? { ...r, inlineHTML: inner.innerHTML } : r)) }
      if (e.key === '/' && (e.ctrlKey||e.metaKey)) { e.preventDefault(); setShowShortcuts(p=>!p) }
      if (e.key === 'Delete' && selected?.element === 'row' && selectedRow && !selectedRow.locked && rows.filter(r=>!r.hidden).length>1) { e.preventDefault(); if (confirm('Delete this section?')) pushHistory(rows.filter(r => r.id !== selectedRow.id)) }
    }} tabIndex={0}>
      {previewMode ? (
        <div className="elm-preview-overlay" onClick={()=>setPreviewMode(false)}>
          <div className="elm-preview-exit-btn"><i className="fas fa-times"></i> Exit Preview</div>
          <div className="elm-preview-canvas" onClick={e=>e.stopPropagation()}>
            <style>{`
              .elm-preview-overlay { position:fixed; inset:0; z-index:10002; background:#0f0f1a; display:flex; flex-direction:column; }
              .elm-preview-exit-btn { position:fixed; top:12px; right:12px; z-index:10003; padding:8px 16px; background:#252540; border:1px solid #2a2a44; border-radius:6px; color:#a0a0b0; cursor:pointer; font-size:13px; display:flex; align-items:center; gap:6px; }
              .elm-preview-exit-btn:hover { color:#d5d8e2; }
              .elm-preview-canvas { flex:1; overflow-y:auto; padding:40px; max-width:1200px; margin:0 auto; width:100%; }
            `}</style>
            {rows.filter(r=>!r.hidden).map(row=>{
              if (row.type === 'section' && row.sectionKey && SECTION_COMPONENTS[row.sectionKey]) {
                const Comp = SECTION_COMPONENTS[row.sectionKey]
                return <div key={row.id} style={{marginBottom:20}}><Comp {...resolveSectionProps(row.sectionKey, localData)}/></div>
              }
              return <div key={row.id} style={{color:'#555',padding:20,textAlign:'center'}}><i className="fas fa-eye-slash"></i> Hidden section</div>
            })}
          </div>
        </div>
      ) : (
        <>
      <div className="elm-topbar">
        <button className="elm-topbar-btn elm-exit-btn" onClick={onExit}><i className="fas fa-arrow-left"></i> <span>Exit</span></button>
        <div className="elm-topbar-center">
          <div className="elm-topbar-logo"><i className="fas fa-pencil-ruler"></i> Builder</div>
          <div className="elm-topbar-divider"></div>
          <button className="elm-topbar-btn" onClick={undo} disabled={historyIdx <= 0} title="Ctrl+Z"><i className="fas fa-undo"></i></button>
          <button className="elm-topbar-btn" onClick={redo} disabled={historyIdx >= history.length - 1} title="Ctrl+Shift+Z"><i className="fas fa-redo"></i></button>
          <div className="elm-topbar-divider"></div>
          <button className={`elm-topbar-btn ${previewMode?'active':''}`} onClick={()=>setPreviewMode(true)} title="Preview"><i className="fas fa-eye"></i></button>
          <div className="elm-topbar-divider"></div>
          <div className="elm-mode-switch">
            <button className={`elm-mode-btn ${builderMode==='page'?'active':''}`} onClick={()=>{setBuilderMode('page');setLeftTab('widgets')}} title="Page Builder"><i className="fas fa-file"></i> Page</button>
            <button className={`elm-mode-btn ${builderMode==='theme'?'active':''}`} onClick={()=>{setBuilderMode('theme');setLeftTab('widgets')}} title="Theme Builder"><i className="fas fa-paint-roller"></i> Theme</button>
            <button className={`elm-mode-btn ${builderMode==='popup'?'active':''}`} onClick={()=>{setBuilderMode('popup');setLeftTab('widgets')}} title="Popup Builder"><i className="fas fa-external-link-alt"></i> Popups</button>
          </div>
          <div className="elm-topbar-divider"></div>
          <div className="elm-responsive">
            <button className={`elm-resp-btn ${responsiveMode==='desktop'?'active':''}`} onClick={()=>setResponsiveMode('desktop')} title="Desktop"><i className="fas fa-desktop"></i></button>
            <button className={`elm-resp-btn ${responsiveMode==='tablet'?'active':''}`} onClick={()=>setResponsiveMode('tablet')} title="Tablet"><i className="fas fa-tablet-alt"></i></button>
            <button className={`elm-resp-btn ${responsiveMode==='mobile'?'active':''}`} onClick={()=>setResponsiveMode('mobile')} title="Mobile"><i className="fas fa-mobile-alt"></i></button>
            <button className={`elm-resp-btn ${showGrid?'active':''}`} onClick={()=>setShowGrid(p=>!p)} title="Toggle grid overlay" style={{marginLeft:4}}><i className="fas fa-th"></i></button>
          </div>
          <div className="elm-zoom-control" style={{display:'flex',alignItems:'center',gap:6,marginLeft:12}}>
            <i className="fas fa-search-minus" style={{fontSize:10,color:'#6cab96'}}></i>
            <input type="range" min="50" max="200" value={zoom} onChange={e=>setZoom(parseInt(e.target.value))}
              style={{width:60,height:3,cursor:'pointer',accentColor:'#6cab96'}} />
            <i className="fas fa-search-plus" style={{fontSize:10,color:'#6cab96'}}></i>
            <span style={{fontSize:10,color:'#a0a0b0',minWidth:30}}>{zoom}%</span>
          </div>
          <div className="elm-quick-nav" style={{marginLeft:12}}>
            <select className="elm-input" style={{fontSize:10,padding:'3px 6px',width:'auto',maxWidth:130,cursor:'pointer'}} value="" onChange={e=>{const id=e.target.value;if(id){const el=document.getElementById(`sec-${id}`);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});setSelected({rowId:id,colId:null,element:'row'})}}}}>
              <option value="">Sections</option>
              {[builderMode==='page'?vr:canvasRows].flat().map(row=>(
                <option key={row.id} value={row.id}>{SECTION_LABELS[row.sectionKey]||row.sectionKey||'Custom'}{row.hidden?' (hidden)':''}{row.locked?' 🔒':''}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="elm-topbar-right">
          <button className={`elm-topbar-btn elm-collapse-btn ${panelCollapsed?'active':''}`} onClick={()=>{const next=!panelCollapsed;setPanelCollapsed(next);document.cookie=`elm_panel_collapsed=${next?1:0};path=/;max-age=31536000`}} title={panelCollapsed?'Show Panel':'Hide Panel'}><i className={`fas ${panelCollapsed?'fa-chevron-right':'fa-chevron-left'}`}></i></button>
          <span className="elm-status" style={{color:isDirty?'#f0c040':'#6cab96'}}><i className={`fas ${isDirty?'fa-circle':'fa-check-circle'}`} style={{fontSize:8,marginRight:4}}></i>{isDirty?'Unsaved':'Saved'}</span>
          <button className="elm-topbar-btn" onClick={()=>setShowShortcuts(true)} title="Shortcuts (Ctrl+/)"><i className="fas fa-keyboard"></i></button>
          {sectionClipboard&&<button className="elm-topbar-btn" onClick={handlePasteSection} title="Paste section (Ctrl+Shift+V)"><i className="fas fa-clipboard"></i></button>}
          <button className="elm-save-btn" onClick={handleSaveNow}><i className="fas fa-save"></i> Save</button>
        </div>
      </div>

      <div className="elm-body">
        <div className={`elm-panel ${panelCollapsed?'elm-panel-collapsed':''}`}>
          <div className="elm-panel-tabs">
            <button className={`elm-panel-tab ${leftTab==='widgets'?'active':''}`} onClick={()=>setLeftTab('widgets')}><i className="fas fa-th"></i> Add</button>
            <button className={`elm-panel-tab ${leftTab==='structure'?'active':''}`} onClick={()=>setLeftTab('structure')}><i className="fas fa-list"></i> Structure</button>
            <button className={`elm-panel-tab ${leftTab==='templates'?'active':''}`} onClick={()=>setLeftTab('templates')}><i className="fas fa-palette"></i> Templates</button>
            <button className={`elm-panel-tab ${leftTab==='history'?'active':''}`} onClick={()=>setLeftTab('history')}><i className="fas fa-history"></i> History</button>
            <button className={`elm-panel-tab ${leftTab==='settings'?'active':''}`} onClick={()=>{setLeftTab('settings');setEditPane('content')}}><i className="fas fa-cog"></i> Settings</button>
          </div>
          <div className="elm-panel-content">
            {builderMode === 'theme' && (
              <div className="elm-structure">
                <div className="elm-structure-title"><i className="fas fa-paint-roller"></i> Theme Builder</div>
                <div className="elm-templates-list">
                  {['header','footer'].map(type=>{
                    const tmpl = themes[type]
                    const isActive = activeThemeType === type
                    return <div key={type} className={`elm-struct-item ${isActive?'active':''}`} style={{cursor:'pointer',marginBottom:4}} onClick={()=>setActiveThemeType(type)}>
                      <i className={`fas fa-${type==='header'?'arrow-up':'arrow-down'}`} style={{color:'#6cab96'}}></i>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,color:'#a0a0b0',fontWeight:600,textTransform:'capitalize'}}>{type}</div>
                        <div style={{fontSize:10,color:'#666'}}>{tmpl ? 'Template created' : 'Not set'}</div>
                      </div>
                      {tmpl ? <span className="elm-struct-badge" style={{cursor:'pointer'}} onClick={e=>{e.stopPropagation();setThemeRows(tmpl.rows||[]);setThemeConditions(tmpl.conditions||{})}}>Edit</span> : <span className="elm-struct-badge" style={{cursor:'pointer',background:'#6cab96',color:'#0f0f1a'}} onClick={e=>{e.stopPropagation();const newRows=[];setThemeRows(newRows);setThemeConditions({})}}>Create</span>}
                    </div>
                  })}
                </div>
                {themeRows!==null&&<div style={{marginTop:12,borderTop:'1px solid #2a2a44',paddingTop:12}}>
                  <div className="elm-settings-heading">Display Conditions</div>
                  {['entire_site','home_page','all_pages','all_articles','all_projects'].map(cond=>(
                    <label key={cond} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 0',fontSize:11,color:'#a0a0b0',cursor:'pointer'}}>
                      <input type="radio" name="themeCond" checked={themeConditions.rule===cond} onChange={()=>setThemeConditions(c=>({...c,rule:cond}))} style={{accentColor:'#6cab96'}} />
                      {cond.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}
                    </label>
                  ))}
                  <div style={{display:'flex',gap:6,marginTop:8}}>
                    <button className="elm-tool-btn" style={{background:'#6cab96',color:'#0f0f1a',padding:'6px 14px',borderRadius:3,fontSize:11}} onClick={()=>{setThemes(t=>({...t,[activeThemeType]:{rows:themeRows,conditions:themeConditions}}));setThemeRows(null);alert(`${activeThemeType} template saved!`)}}><i className="fas fa-save"></i> Save Template</button>
                    <button className="elm-tool-btn elm-tool-btn-del" style={{padding:'6px 14px',borderRadius:3,fontSize:11}} onClick={()=>setThemeRows(null)}><i className="fas fa-times"></i> Cancel</button>
                  </div>
                </div>}
                <p style={{fontSize:'0.7rem',color:'#666',marginTop:12}}>Theme templates let you design your site header and footer separately from the page content.</p>
              </div>
            )}
            {builderMode === 'popup' && (
              <div className="elm-structure">
                <div className="elm-structure-title"><i className="fas fa-external-link-alt"></i> Popup Builder</div>
                <button className="elm-tool-btn" style={{width:'100%',padding:'8px',border:'1px dashed #6cab96',borderRadius:4,color:'#6cab96',fontSize:11,marginBottom:10,background:'transparent',cursor:'pointer'}} onClick={()=>{const id=uid();setPopups(p=>[...p,{id,name:`Popup ${p.length+1}`,rows:[],trigger:{type:'click',value:''},settings:{width:'auto',animation:'fade',closeBtn:true}}]);setActivePopupId(id)}}><i className="fas fa-plus"></i> New Popup</button>
                {popups.map(p=>(
                  <div key={p.id} className={`elm-struct-item ${activePopupId===p.id?'active':''}`} style={{cursor:'pointer',marginBottom:2}} onClick={()=>setActivePopupId(p.id)}>
                    <i className="fas fa-external-link-alt" style={{color:'#6cab96'}}></i>
                    <span style={{flex:1}}>{p.name||'Unnamed Popup'}</span>
                    <span className="elm-struct-badge">{p.trigger?.type||'click'}</span>
                    <button className="elm-tool-btn elm-tool-btn-del" style={{padding:'1px 4px',fontSize:9}} onClick={e=>{e.stopPropagation();if(confirm('Delete this popup?'))setPopups(prev=>prev.filter(x=>x.id!==p.id))}}><i className="fas fa-times"></i></button>
                  </div>
                ))}
                {activePopupId&&(()=>{const p=popups.find(x=>x.id===activePopupId);if(!p)return null;return <div style={{marginTop:12,borderTop:'1px solid #2a2a44',paddingTop:12}}>
                  <input value={p.name||''} onChange={e=>setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,name:e.target.value}:x))} className="elm-input" placeholder="Popup name" />
                  <div className="elm-settings-heading" style={{marginTop:8}}>Trigger</div>
                  <select value={p.trigger?.type||'click'} onChange={e=>setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,trigger:{...x.trigger,type:e.target.value}}:x))} className="elm-input"><option value="click">On Click</option><option value="onload">On Page Load</option><option value="scroll">On Scroll</option><option value="exit">Exit Intent</option><option value="timer">After Timer</option></select>
                  {p.trigger?.type==='click'&&<input value={p.trigger?.value||''} onChange={e=>setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,trigger:{...x.trigger,value:e.target.value}}:x))} className="elm-input" placeholder="CSS selector (e.g. #my-button)" />}
                  {p.trigger?.type==='timer'&&<input type="number" value={p.trigger?.value||3} onChange={e=>setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,trigger:{...x.trigger,value:e.target.value}}:x))} className="elm-input" placeholder="Seconds" />}
                  {p.trigger?.type==='scroll'&&<input type="number" value={p.trigger?.value||50} onChange={e=>setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,trigger:{...x.trigger,value:e.target.value}}:x))} className="elm-input" placeholder="Scroll %" />}
                  <div className="elm-settings-heading" style={{marginTop:8}}>Settings</div>
                  <select value={p.settings?.width||'auto'} onChange={e=>setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,settings:{...x.settings,width:e.target.value}}:x))} className="elm-input"><option value="auto">Auto</option><option value="small">Small (400px)</option><option value="medium">Medium (600px)</option><option value="large">Large (900px)</option><option value="full">Full Screen</option></select>
                  <select value={p.settings?.animation||'fade'} onChange={e=>setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,settings:{...x.settings,animation:e.target.value}}:x))} className="elm-input"><option value="fade">Fade</option><option value="slide-up">Slide Up</option><option value="slide-down">Slide Down</option><option value="zoom">Zoom</option></select>
                  <label style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#a0a0b0',margin:'4px 0'}}><input type="checkbox" checked={p.settings?.closeBtn!==false} onChange={e=>setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,settings:{...x.settings,closeBtn:e.target.checked}}:x))} style={{accentColor:'#6cab96'}} /> Show close button</label>
                  <div style={{display:'flex',gap:6,marginTop:8}}>
                    <button className="elm-tool-btn" style={{background:'#6cab96',color:'#0f0f1a',padding:'6px 14px',borderRadius:3,fontSize:11}} onClick={()=>{setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,rows:latestRef.current.rows}:x));alert('Popup content saved!')}}><i className="fas fa-save"></i> Save Content</button>
                    <button className="elm-tool-btn" style={{padding:'6px 14px',borderRadius:3,fontSize:11}} onClick={()=>setActivePopupId(null)}><i className="fas fa-times"></i> Close</button>
                  </div>
                </div>})()}
              </div>
            )}
            {builderMode === 'page' && leftTab === 'widgets' && (
              <div className="elm-widgets">
                <div className="elm-widgets-search"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search widgets & sections..." /></div>
                {(() => {
                  const cats = Object.entries(allWidgets).filter(([ck]) => ck !== 'global' || globalWidgets.length > 0)
                  return search ? (
                    <div className="elm-widget-grid">
                      {cats.flatMap(([ck,cat])=>Object.entries(typeof cat.items === 'function' ? cat.items() : cat.items).map(([k,v])=>({key:k,...v,category:cat.label,catKey:ck}))).filter(w=>w.label.toLowerCase().includes(search.toLowerCase())).map(w=>(
                        <div key={w.key} className="elm-widget-item" draggable onDragStart={e=>e.dataTransfer.setData('text/plain',w.key)} onClick={()=>{if(isSection(w.key))addSectionRow(w.key,rows.length);else if(w.catKey==='global'&&selected?.rowId){const ri=rows.findIndex(r=>r.id===selected.rowId);if(ri>=0)addGlobalWidget(w,selected.rowId,selected?.colId||rows[ri].columns?.[0]?.id)}}}><i className={`fas ${w.icon}`}></i><span>{w.label}</span></div>
                      ))}
                    </div>
                  ) : cats.map(([ck,cat])=>(
                    <div key={ck} className="elm-widget-category">
                      <div className="elm-widget-cat-label">{cat.label}</div>
                      <div className="elm-widget-grid">
                        {Object.entries(typeof cat.items === 'function' ? cat.items() : cat.items).map(([key,meta])=>(
                          <div key={key} className="elm-widget-item" draggable onDragStart={e=>e.dataTransfer.setData('text/plain',key)} onClick={()=>{if(isSection(key))addSectionRow(key,rows.length);else if(ck==='global'){const ri=rows.findIndex(r=>r.id===selected?.rowId);if(ri>=0)addGlobalWidget(meta,selected.rowId,selected.colId||rows[ri].columns?.[0]?.id)}}}><i className={`fas ${meta.icon}`}></i><span>{meta.label}</span></div>
                        ))}
                      </div>
                    </div>
                  ))
                })()}
              </div>
            )}
            {builderMode === 'page' && leftTab === 'structure' && (
              <div className="elm-structure">
                <div className="elm-structure-title"><i className="fas fa-sitemap"></i> Page Structure</div>
                <div style={{display:'flex', gap:6, marginBottom:10}}>
                  <button className="elm-tool-btn" style={{fontSize:9}} onClick={handleExportTemplate}><i className="fas fa-file-export"></i> Export</button>
                  <button className="elm-tool-btn" style={{fontSize:9}} onClick={()=>document.getElementById('import-file-input').click()}><i className="fas fa-file-import"></i> Import</button>
                  <input id="import-file-input" type="file" accept=".json" style={{display:'none'}} onChange={handleImportTemplate} />
                </div>
                <div style={{display:'flex',gap:4,marginBottom:8}}>
                  <button className="elm-tool-btn" style={{fontSize:9,flex:1}} onClick={()=>setRows(prev=>prev.map(r=>r.hidden?{...r,hidden:false}:r))}><i className="fas fa-eye"></i> Show all</button>
                  <button className="elm-tool-btn" style={{fontSize:9,flex:1}} onClick={()=>setRows(prev=>prev.map(r=>({...r,hidden:true})))}><i className="fas fa-eye-slash"></i> Hide all</button>
                </div>
                {rows.length===0&&<p style={{fontSize:'0.75rem',color:'#666',padding:12}}>No sections yet.</p>}
                {rows.map((row,ri)=>(
                  <div key={row.id} className={`elm-struct-item ${selected?.rowId===row.id?'active':''}`} onClick={()=>setSelected({rowId:row.id,colId:null,element:'row'})} style={{opacity:row.hidden?0.4:1}} onContextMenu={e=>handleContextMenu(e,row.id)}>
                    <input type="checkbox" checked={selectedSectionIds.includes(row.id)} onChange={e=>{const c=e.target.checked;setSelectedSectionIds(prev=>c?[...prev,row.id]:prev.filter(id=>id!==row.id))}} onClick={e=>e.stopPropagation()} style={{accentColor:'#6cab96'}} />
                    <i className={`fas ${row.type==='widget-section'?'fa-th-large':row.type==='nested'?'fa-layer-group':row.type==='section'?'fa-layer-group':'fa-columns'}`} style={{color:row.locked?'#f0c040':'inherit'}}></i>
                    <span>{row.locked?'🔒 ':''}{row.type==='widget-section'?'✏️ ':''}{row.type==='section'||row.type==='widget-section'?(SECTION_LABELS[row.sectionKey]||row.sectionKey):row.type==='nested'?`Inner ${ri+1}`:`Custom Row ${ri+1}`}</span>
                    <span className="elm-struct-badge">{row.hidden?'hidden':row.locked?'locked':row.type==='widget-section'?'widgets':row.type==='nested'?'nested':row.type==='section'?'component':`${row.columns.length} col`}</span>
                  </div>
                ))}
                {selectedSectionIds.length>0&&<div style={{display:'flex',gap:4,marginTop:8}}>
                  <button className="elm-tool-btn" style={{fontSize:9,flex:1}} onClick={()=>setRows(prev=>prev.map(r=>selectedSectionIds.includes(r.id)?{...r,hidden:!r.hidden}:r))}><i className="fas fa-eye"></i> Toggle visibility</button>
                  <button className="elm-tool-btn" style={{fontSize:9,flex:1}} onClick={()=>setSelectedSectionIds([])}>Clear</button>
                </div>}
              </div>
            )}
            {builderMode === 'page' && leftTab === 'templates' && (
              <div className="elm-structure">
                <div className="elm-structure-title"><i className="fas fa-palette"></i> Quick Templates</div>
                <p style={{fontSize:'0.7rem',color:'#666',marginBottom:10}}>Replace all sections with a pre-built layout.</p>
                {TEMPLATES.map(t => (
                  <div key={t.name} className="elm-struct-item" style={{cursor:'pointer',marginBottom:4}} onClick={()=>loadTemplate(t)}>
                    <i className={`fas ${t.icon}`} style={{color:'#6cab96'}}></i>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:'#a0a0b0',fontWeight:600}}>{t.name}</div>
                      <div style={{fontSize:10,color:'#666'}}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {builderMode === 'page' && leftTab === 'history' && (
              <div className="elm-structure">
                <div className="elm-structure-title"><i className="fas fa-history"></i> Change History <span style={{fontSize:10,color:'#666',fontWeight:400}}>{history.length}/50</span></div>
                <p style={{fontSize:'0.7rem',color:'#666',marginBottom:10}}>Click any state to restore. Ctrl+Z / Ctrl+Shift+Z to navigate.</p>
                <div style={{position:'relative',paddingLeft:16}}>
                  {history.map((h, idx) => {
                    const sectionCount = h.filter(r=>r.type==='section'||r.type==='widget-section').length
                    const widgetCount = h.reduce((s,r)=>(r.columns||[]).reduce((sc,c)=>(c.blocks||[]).length+sc,0)+s,0)
                    return (
                    <div key={idx} className={`elm-struct-item ${historyIdx===idx?'active':''}`} style={{cursor:'pointer',marginBottom:2,position:'relative'}}
                      onClick={()=>goToHistory(idx)}>
                      <div style={{position:'absolute',left:-12,top:'50%',transform:'translateY(-50%)',width:8,height:8,borderRadius:'50%',background:idx===historyIdx?'#6cab96':idx<historyIdx?'#2a2a44':'transparent',border:idx<historyIdx?'none':'1px solid #333'}} />
                      <span style={{fontSize:11,flex:1}}>{idx===0?'Initial':`Step ${idx}`}{idx===historyIdx?' ← current':''}</span>
                      <span className="elm-struct-badge">{sectionCount} sec, {widgetCount} w</span>
                    </div>
                  )})}
                </div>
              </div>
            )}
            {builderMode === 'page' && leftTab === 'settings' && selectedRow && (selectedRow.type === 'section' || selectedRow.type === 'widget-section') && selectedSectionKey && (
              <div className="elm-settings-panel">
                <div className="elm-settings-title"><i className={`fas ${SECTION_ICONS[selectedSectionKey]||'fa-layer-group'}`}></i> {SECTION_LABELS[selectedSectionKey]||selectedSectionKey}</div>
                <div style={{display:'flex',gap:4,marginBottom:12,borderBottom:'1px solid #2a2a44'}}>
                  {[{k:'content',l:'Content'},{k:'style',l:'Style'},{k:'advanced',l:'Advanced'}, ...(selEl?[{k:'element',l:`<${selEl.tag}>`}]:[]), ...(!isWidgetMode?[{k:'convert',l:'Widgets'}]:[])].map(t=>(
                    <button key={t.k} onClick={()=>setEditPane(t.k)}
                      style={{padding:'6px 8px',border:'none',background:'transparent',color:editPane===t.k?'#6cab96':'#666',cursor:'pointer',fontSize:'10px',fontWeight:600,textTransform:'uppercase',borderBottom:editPane===t.k?'2px solid #6cab96':'2px solid transparent',fontFamily:'inherit',whiteSpace:'nowrap'}}>
                      {t.l}
                    </button>
                  ))}
                </div>
                {editPane === 'element' && selEl && (
                  <div className="elm-settings-section">
                    <div className="elm-settings-heading">&lt;{selEl.tag}&gt; {selEl.text}</div>
                    <label className="elm-settings-label">Color</label><input value={selEl.styles?.color||''} onChange={e=>applyElStyle('color',e.target.value)} className="elm-input" />
                    <label className="elm-settings-label">Font Size</label><input value={selEl.styles?.fontSize||''} onChange={e=>applyElStyle('fontSize',e.target.value)} className="elm-input" />
                    <label className="elm-settings-label">Font Weight</label><select value={selEl.styles?.fontWeight||''} onChange={e=>applyElStyle('fontWeight',e.target.value)} className="elm-input"><option value="">Default</option><option value="300">Light</option><option value="400">Regular</option><option value="600">Semi Bold</option><option value="700">Bold</option><option value="900">Black</option></select>
                    <label className="elm-settings-label">Font Family</label><input value={selEl.styles?.fontFamily||''} onChange={e=>applyElStyle('fontFamily',e.target.value)} className="elm-input" />
                    <label className="elm-settings-label">Text Align</label><select value={selEl.styles?.textAlign||''} onChange={e=>applyElStyle('textAlign',e.target.value)} className="elm-input"><option value="">Default</option><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
                    <label className="elm-settings-label">Background</label><input value={selEl.styles?.background||''} onChange={e=>applyElStyle('background',e.target.value)} className="elm-input" />
                    <label className="elm-settings-label">Padding</label>
                    <div className="elm-spacing-grid">{['paddingTop','paddingRight','paddingBottom','paddingLeft'].map(s=>(<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s.replace('padding','')[0]}</label><input type="number" value={parseInt(selEl.styles?.[s])||0} onChange={e=>applyElStyle(s,e.target.value+'px')} className="elm-input elm-input-sm" /></div>))}</div>
                    <label className="elm-settings-label">Margin</label>
                    <div className="elm-spacing-grid">{['marginTop','marginRight','marginBottom','marginLeft'].map(s=>(<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s.replace('margin','')[0]}</label><input type="number" value={parseInt(selEl.styles?.[s])||0} onChange={e=>applyElStyle(s,e.target.value+'px')} className="elm-input elm-input-sm" /></div>))}</div>
                    <div style={{marginTop:12,display:'flex',gap:6}}>
                      <button className="elm-tool-btn elm-tool-btn-del" onClick={()=>{if(selEl.el?.parentNode){const rid=selEl.rowId;selEl.el.remove();setSelEl(null);const inner=document.getElementById(`sec-${rid}`)?.querySelector('.elm-section-live-inner');if(inner)setRows(prev=>prev.map(r=>r.id===rid?{...r,inlineHTML:inner.innerHTML}:r))}}}><i className="fas fa-trash"></i> Delete</button>
                      <button className="elm-tool-btn" onClick={()=>{if(selEl.el){const c=selEl.el.cloneNode(true);selEl.el.parentNode?.insertBefore(c,selEl.el.nextSibling)}}}><i className="fas fa-copy"></i> Duplicate</button>
                    </div>
                  </div>
                )}
                {editPane === 'content' && isWidgetMode && (
                  <div className="elm-settings-section">
                    <div className="elm-settings-heading">Widgets in this section</div>
                    <p style={{fontSize:'0.7rem',color:'#666',marginBottom:8}}>Click a widget to edit.</p>
                    {selectedRow.columns?.[0]?.blocks.map((b,i)=>(
                      <div key={b.id} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 6px',marginBottom:4,borderRadius:3,background:selected?.block?.id===b.id?'rgba(108,171,150,0.1)':'transparent',cursor:'pointer'}}
                        onClick={()=>setSelected({rowId:selectedRow.id,colId:selectedRow.columns[0].id,block:b,element:'widget'})}>
                        <i className={`fas ${WIDGETS.basic.items[b.type]?.icon||'fa-cube'}`} style={{color:'#6cab96',width:14,fontSize:10}}></i>
                        <span style={{fontSize:'0.7rem',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#a0a0b0'}}>{WIDGETS.basic.items[b.type]?.label||b.type}</span>
                        <button className="elm-tool-btn elm-tool-btn-del" style={{padding:'1px 4px',fontSize:9}} onClick={(e)=>{e.stopPropagation();removeBlock(selectedRow.id,selectedRow.columns[0].id,b.id)}}><i className="fas fa-times"></i></button>
                      </div>
                    ))}
                  </div>
                )}
                {editPane === 'content' && !isWidgetMode && (
                  <div className="elm-settings-section">
                    <div className="elm-settings-heading">Section Content</div>
                    <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>
                      {!inlineEl&&<button className="elm-tool-btn" style={{background:'#6cab96',color:'#0f0f1a',padding:'4px 10px',borderRadius:3,fontSize:11}} onClick={()=>startInlineEdit(selectedRow.id)}><i className="fas fa-pen"></i> Edit Inline</button>}
                      {inlineEl===selectedRow.id&&<><button className="elm-tool-btn" style={{background:'#6cab96',color:'#0f0f1a',padding:'4px 10px',borderRadius:3,fontSize:11}} onClick={()=>stopInlineEdit(selectedRow.id,true)}><i className="fas fa-check"></i> Save</button><button className="elm-tool-btn elm-tool-btn-del" style={{padding:'4px 10px',borderRadius:3,fontSize:11}} onClick={()=>stopInlineEdit(selectedRow.id,false)}><i className="fas fa-times"></i> Cancel</button></>}
                      {selectedRow.inlineHTML&&!inlineEl&&<button className="elm-tool-btn" style={{padding:'4px 10px',borderRadius:3,fontSize:11}} onClick={()=>{if(confirm('Reset inline edits?'))setRows(prev=>prev.map(r=>r.id===selectedRow.id?{...r,inlineHTML:null,inlineStyles:{}}:r))}}><i className="fas fa-undo-alt"></i> Reset</button>}
                    </div>
                    {selectedDataPaths.length>0?selectedDataPaths.map(({path,label})=>{
                      const data=getDeep(localData,path)
                      if(data===undefined||data===null)return null
                      return (<div key={path} style={{marginBottom:16}}><label className="elm-settings-label" style={{fontWeight:700,marginBottom:6}}>{label}</label><FieldEditor data={data} path={path} onUpdate={(fp,val)=>updateSectionField(selectedSectionKey,fp,val)} depth={0}/></div>)
                    }):<p style={{fontSize:'0.75rem',color:'#666',padding:8}}>No content fields.</p>}
                  </div>
                )}
                {editPane === 'convert' && !isWidgetMode && (
                  <div className="elm-settings-section">
                    <div className="elm-settings-heading">Convert to Editable Widgets</div>
                    <p style={{fontSize:'0.75rem',color:'#a0a0b0',marginBottom:12,lineHeight:1.5}}>Break this section into individual widget blocks you can edit, reorder, and style freely. Changes sync back to the website data.</p>
                    <button className="elm-tool-btn" style={{background:'#6cab96',color:'#0f0f1a',padding:'8px 16px',borderRadius:4,fontSize:12}} onClick={()=>{convertSectionToWidgets(selectedRow.id);setEditPane('content')}}>
                      <i className="fas fa-th-large"></i> Convert to Widgets
                    </button>
                    {SECTION_CONVERTERS[selectedSectionKey]&&<p style={{fontSize:'0.65rem',color:'#6cab96',marginTop:8}}>✨ Smart conversion supported for this section (edits sync to live data)</p>}
                  </div>
                )}
                {editPane === 'style' && (
                  <div className="elm-settings-section"><div className="elm-settings-heading">Section Style</div>
                    <label className="elm-settings-label">Background</label>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      <input value={(selectedRow.styles||{}).background||''} onChange={e=>updateRowStyle(selectedRow.id,{background:e.target.value})} className="elm-input" style={{flex:1,minWidth:80}} />
                      {COLOR_PRESETS.map(c=><div key={c} onClick={()=>updateRowStyle(selectedRow.id,{background:c})} style={{width:16,height:16,borderRadius:'50%',background:c,cursor:'pointer',border:c==='#ffffff'?'1px solid #333':'none',flexShrink:0}} title={c} />)}
                    </div>
                    <label className="elm-settings-label">Text Color</label>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      <input value={(selectedRow.styles||{}).color||''} onChange={e=>updateRowStyle(selectedRow.id,{color:e.target.value})} className="elm-input" style={{flex:1,minWidth:80}} />
                      {COLOR_PRESETS.map(c=><div key={c} onClick={()=>updateRowStyle(selectedRow.id,{color:c})} style={{width:16,height:16,borderRadius:'50%',background:c,cursor:'pointer',border:c==='#ffffff'?'1px solid #333':'none',flexShrink:0}} title={c} />)}
                    </div>
                    <label className="elm-settings-label">Text Align</label><select value={(selectedRow.styles||{}).textAlign||''} onChange={e=>updateRowStyle(selectedRow.id,{textAlign:e.target.value})} className="elm-input"><option value="">Default</option><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
                    <label className="elm-settings-label">Max Width</label><input value={(selectedRow.styles||{}).maxWidth||''} onChange={e=>updateRowStyle(selectedRow.id,{maxWidth:e.target.value})} className="elm-input" />
                    <label className="elm-settings-label">Padding</label><div className="elm-spacing-grid">{['top','right','bottom','left'].map(s=>(<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s[0].toUpperCase()}</label><input type="number" value={parseInt((selectedRow.styles||{})[s])||0} onChange={e=>updateRowStyle(selectedRow.id,{[s]:e.target.value+'px'})} className="elm-input elm-input-sm" /></div>))}</div>
                    <label className="elm-settings-label">Margin</label><div className="elm-spacing-grid">{['marginTop','marginRight','marginBottom','marginLeft'].map(s=>(<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s.replace('margin','')[0]}</label><input type="number" value={parseInt((selectedRow.styles||{})[s])||0} onChange={e=>updateRowStyle(selectedRow.id,{[s]:e.target.value+'px'})} className="elm-input elm-input-sm" /></div>))}</div>
                    <label className="elm-settings-label">Border Radius</label><input type="number" value={parseInt((selectedRow.styles||{}).borderRadius)||0} onChange={e=>updateRowStyle(selectedRow.id,{borderRadius:e.target.value+'px'})} className="elm-input" />
                    <label className="elm-settings-label">Box Shadow</label><input value={(selectedRow.styles||{}).boxShadow||''} onChange={e=>updateRowStyle(selectedRow.id,{boxShadow:e.target.value})} className="elm-input" />
                    <label className="elm-settings-label">Border</label><input value={(selectedRow.styles||{}).border||''} onChange={e=>updateRowStyle(selectedRow.id,{border:e.target.value})} className="elm-input" />
                  </div>
                )}
                {editPane === 'advanced' && (
                  <div className="elm-settings-section"><div className="elm-settings-heading">Advanced</div>
                    <label className="elm-settings-label">Section Group</label><input value={(selectedRow.styles||{}).group||''} onChange={e=>updateRowStyle(selectedRow.id,{group:e.target.value})} className="elm-input" placeholder="e.g. hero, content, footer" />
                    <label className="elm-settings-label">CSS Class</label><input value={(selectedRow.styles||{}).cssClass||''} onChange={e=>updateRowStyle(selectedRow.id,{cssClass:e.target.value})} className="elm-input elm-mono" />
                    <label className="elm-settings-label">CSS ID</label><input value={(selectedRow.styles||{}).cssId||''} onChange={e=>updateRowStyle(selectedRow.id,{cssId:e.target.value})} className="elm-input elm-mono" />
                    <label className="elm-settings-label">HTML Tag</label><select value={(selectedRow.styles||{}).htmlTag||'section'} onChange={e=>updateRowStyle(selectedRow.id,{htmlTag:e.target.value})} className="elm-input"><option value="section">section</option><option value="div">div</option><option value="article">article</option></select>
                    <label className="elm-settings-label">Custom CSS</label><textarea rows={5} value={(selectedRow.styles||{}).customCSS||''} onChange={e=>updateRowStyle(selectedRow.id,{customCSS:e.target.value})} className="elm-input elm-textarea elm-mono" placeholder=".my-class { color: red; }" />
                  </div>
                )}
              </div>
            )}
            {builderMode === 'page' && leftTab === 'settings' && selected?.element === 'widget' && selectedBlock && (
              <div className="elm-settings-panel">
                <div className="elm-settings-title">{selectedBlock.type.charAt(0).toUpperCase()+selectedBlock.type.slice(1)} Settings</div>
                <div style={{display:'flex',gap:4,marginBottom:12,borderBottom:'1px solid #2a2a44'}}>
                  {['content','style','advanced'].map(t=>(<button key={t} onClick={()=>setEditPane(t)} style={{padding:'6px 12px',border:'none',background:'transparent',color:editPane===t?'#6cab96':'#666',cursor:'pointer',fontSize:'11px',fontWeight:600,textTransform:'uppercase',borderBottom:editPane===t?'2px solid #6cab96':'2px solid transparent',fontFamily:'inherit'}}>{t}</button>))}
                </div>
                {editPane === 'content' && <div className="elm-settings-section"><div className="elm-settings-heading">Content</div><WidgetContentFields block={selectedBlock} onUpdate={(patch)=>{updateWidgetWithSync(selected.rowId,selected.colId,selectedBlock.id,patch)}} /></div>}
                {editPane === 'style' && <div className="elm-settings-section"><div className="elm-settings-heading">Style</div>
                  <label className="elm-settings-label">Background</label>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    <input value={(selectedBlock.styles||{}).background||''} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{background:e.target.value})} className="elm-input" style={{flex:1,minWidth:80}} />
                    {COLOR_PRESETS.map(c=><div key={c} onClick={()=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{background:c})} style={{width:16,height:16,borderRadius:'50%',background:c,cursor:'pointer',border:c==='#ffffff'?'1px solid #333':'none',flexShrink:0}} title={c} />)}
                  </div>
                  <label className="elm-settings-label">Text Color</label>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    <input value={(selectedBlock.styles||{}).color||''} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{color:e.target.value})} className="elm-input" style={{flex:1,minWidth:80}} />
                    {COLOR_PRESETS.map(c=><div key={c} onClick={()=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{color:c})} style={{width:16,height:16,borderRadius:'50%',background:c,cursor:'pointer',border:c==='#ffffff'?'1px solid #333':'none',flexShrink:0}} title={c} />)}
                  </div>
                  <label className="elm-settings-label">Text Align</label><select value={(selectedBlock.styles||{}).textAlign||'left'} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{textAlign:e.target.value})} className="elm-input"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
                  <label className="elm-settings-label">Font Size</label><input value={(selectedBlock.styles||{}).fontSize||''} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{fontSize:e.target.value})} className="elm-input" />
                  <label className="elm-settings-label">Font Weight</label><select value={(selectedBlock.styles||{}).fontWeight||''} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{fontWeight:e.target.value})} className="elm-input"><option value="">Default</option><option value="300">Light</option><option value="400">Regular</option><option value="600">Semi Bold</option><option value="700">Bold</option><option value="900">Black</option></select>
                  <label className="elm-settings-label">Min Height</label><input value={(selectedBlock.styles||{}).minHeight||''} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{minHeight:e.target.value})} className="elm-input" />
                  <label className="elm-settings-label">Border Radius</label><input type="number" value={parseInt((selectedBlock.styles||{}).borderRadius)||0} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{borderRadius:e.target.value+'px'})} className="elm-input" />
                  <label className="elm-settings-label">Width</label><input value={(selectedBlock.styles||{}).width||''} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{width:e.target.value})} className="elm-input" />
                  <label className="elm-settings-label">Padding</label><div className="elm-spacing-grid">{['top','right','bottom','left'].map(s=>(<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s[0].toUpperCase()}</label><input type="number" value={parseInt((selectedBlock.styles||{})[s])||0} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{[s]:e.target.value+'px'})} className="elm-input elm-input-sm" /></div>))}</div>
                  <label className="elm-settings-label">Margin</label><div className="elm-spacing-grid">{['marginTop','marginRight','marginBottom','marginLeft'].map(s=>(<div key={s}><label style={{fontSize:'0.6rem',color:'#666'}}>{s.replace('margin','')[0]}</label><input type="number" value={parseInt((selectedBlock.styles||{})[s])||0} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{[s]:e.target.value+'px'})} className="elm-input elm-input-sm" /></div>))}</div>
                </div>}
                {editPane === 'advanced' && <div className="elm-settings-section"><div className="elm-settings-heading">Advanced</div>
                  <label className="elm-settings-label">CSS Class</label><input value={(selectedBlock.styles||{}).cssClass||''} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{cssClass:e.target.value})} className="elm-input elm-mono" />
                  <label className="elm-settings-label">CSS ID</label><input value={(selectedBlock.styles||{}).cssId||''} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{cssId:e.target.value})} className="elm-input elm-mono" />
                  <label className="elm-settings-label">Custom CSS</label><textarea rows={4} value={(selectedBlock.styles||{}).customCSS||''} onChange={e=>updateBlockStyle(selected.rowId,selected.colId,selectedBlock.id,{customCSS:e.target.value})} className="elm-input elm-textarea elm-mono" placeholder=".my-class { color: red; }" />
                </div>}
                <div style={{marginTop:8,borderTop:'1px solid #2a2a44',paddingTop:8}}>
                  <div className="elm-settings-heading">Actions</div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    <button className="elm-tool-btn" style={{fontSize:10}} onClick={()=>handleCopyBlock(selected.rowId,selected.colId,selectedBlock.id)}><i className="fas fa-copy"></i> Copy</button>
                    {clipboard&&<button className="elm-tool-btn" style={{fontSize:10}} onClick={()=>handlePasteBlock(selected.rowId,selected.colId)}><i className="fas fa-paste"></i> Paste</button>}
                    <button className="elm-tool-btn" style={{fontSize:10}} onClick={()=>handleSaveGlobalWidget(selected.rowId,selected.colId,selectedBlock.id)}><i className="fas fa-globe"></i> Save Global</button>
                    <button className="elm-tool-btn" style={{fontSize:10}} onClick={()=>{const name=prompt('Preset name:',selectedBlock.type);if(name){const preset={name,block:JSON.parse(JSON.stringify({...selectedBlock,id:undefined}))};setWidgetPresets(p=>[...p,preset])}}}><i className="fas fa-bookmark"></i> Save Preset</button>
                    {widgetPresets.length>0&&<select className="elm-input" style={{fontSize:10,padding:'3px 6px',width:'auto'}} value="" onChange={e=>{const idx=parseInt(e.target.value);if(idx>=0){const p=widgetPresets[idx];if(p){const merged={...JSON.parse(JSON.stringify(p.block)),id:selectedBlock.id,type:selectedBlock.type};updateBlock(selected.rowId,selected.colId,selectedBlock.id,merged)}}}}><option value="">Load Preset</option>{widgetPresets.map((p,i)=><option key={i} value={i}>{p.name}</option>)}</select>}
                    <button className="elm-tool-btn elm-tool-btn-del" style={{fontSize:10}} onClick={()=>removeBlock(selected.rowId,selected.colId,selectedBlock.id)}><i className="fas fa-trash"></i> Delete</button>
                  </div>
                  {clipboard&&<p style={{fontSize:'0.65rem',color:'#6cab96',marginTop:6}}>📋 Widget copied — Ctrl+V to paste</p>}
                </div>
              </div>
            )}
            {builderMode === 'page' && leftTab === 'settings' && !selectedRow && !selectedBlock && <div className="elm-settings-panel"><p style={{fontSize:'0.75rem',color:'#666',padding:12}}>Click a section or widget in the canvas to edit.</p></div>}
            {builderMode === 'page' && leftTab === 'settings' && selectedRow?.type === 'custom' && !selectedBlock && <div className="elm-settings-panel"><p style={{fontSize:'0.75rem',color:'#666',padding:12}}>Select a widget to edit its settings.</p></div>}
          </div>
        </div>

        <div className="elm-canvas-wrap" style={{justifyContent:responsiveMode!=='desktop'?'center':'stretch',transform:`scale(${zoom/100})`,transformOrigin:'top center',...(showGrid?{backgroundImage:'linear-gradient(rgba(108,171,150,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(108,171,150,0.06) 1px,transparent 1px)',backgroundSize:'20px 20px'}:{})}}>
          <div className="elm-canvas" style={{maxWidth:canvasWidth,width:'100%'}}>
            {builderMode==='theme'&&<div className="elm-empty-state"><i className="fas fa-paint-roller"></i><h3>Theme Builder</h3><p>Design your section layout below, then click <strong>"Save Template"</strong> in the Theme panel to capture it. Drag sections onto the canvas and arrange them as needed.</p></div>}
            {builderMode==='popup'&&<div className="elm-empty-state"><i className="fas fa-external-link-alt"></i><h3>Popup Builder</h3><p>Select or create a popup from the panel, design its content in Page mode, then click <strong>"Save Content"</strong> to capture it. Or add sections below and save when ready.</p></div>}
            {builderMode==='page'&&rows.length===0&&<div className="elm-empty-state"><i className="fas fa-plus-circle"></i><h3>Start Building</h3><p>Click a section from the Add panel to add it.</p></div>}
            {(()=>{
              const displayRows = builderMode==='page' ? vr : canvasRows
              if(displayRows.length===0)return null
              return (
                <SortableList items={displayRows} onReorder={arr=>{if(builderMode==='theme'&&themeRows!==null)setThemeRows(arr);else if(builderMode==='popup'&&activePopupId)setPopups(prev=>prev.map(x=>x.id===activePopupId?{...x,rows:arr}:x));else pushHistory(arr)}} getId={r=>r.id}>
                  {displayRows.map((row,ri)=>(
                    <SortableItem key={row.id} id={row.id}>
                      {(listeners)=>{
                        const ms={...(row.styles||{})}
                        const so={}
                        if(ms.background)so.background=ms.background
                        if(ms.color)so.color=ms.color
                        if(ms.textAlign)so.textAlign=ms.textAlign
                        if(ms.maxWidth)so.maxWidth=ms.maxWidth
                        if(ms.borderRadius)so.borderRadius=ms.borderRadius
                        if(ms.boxShadow)so.boxShadow=ms.boxShadow
                        if(ms.border)so.border=ms.border
                        const pm={top:'paddingTop',right:'paddingRight',bottom:'paddingBottom',left:'paddingLeft'}
                        Object.entries(pm).forEach(([sh,css])=>{if(ms[sh])so[css]=ms[sh]})
                        ;['marginTop','marginRight','marginBottom','marginLeft'].forEach(k=>{if(ms[k])so[k]=ms[k]})
                        const Tag=ms.htmlTag||'section'
                        const isSel=selected?.rowId===row.id
                        const wm=row.type==='widget-section'
                        return (
                          <Tag id={`sec-${row.id}`} className={`elm-section ${isSel?'elm-section-active':''} ${wm?'elm-section-widget-mode':''}`} style={so}
                            onDragOver={e=>{if(!wm&&row.type!=='custom'&&row.type!=='nested')e.dataTransfer.dropEffect='copy';e.preventDefault()}}
                            onDrop={e=>handleSectionDrop(e,row.id,ri)}
                            onClick={()=>{setSelEl(null);setSelected({rowId:row.id,colId:null,element:'row'})}}
                            onContextMenu={e=>handleContextMenu(e,row.id)}>
                            <div className="elm-section-handle" {...listeners} style={{opacity:row.locked?0.4:1}}><i className="fas fa-grip-vertical"></i></div>
                            <div className="elm-section-tools">
                              <span className="elm-section-badge">{row.locked?'🔒 ':wm?'✏️ ':''}{SECTION_LABELS[row.sectionKey]||row.sectionKey||'Custom Row'}</span>
                              <button className="elm-tool-btn" onClick={e=>{e.stopPropagation();setLeftTab('settings');setEditPane('content');setSelected({rowId:row.id,colId:null,element:'row'})}} title="Edit"><i className="fas fa-pen"></i></button>
                              <button className="elm-tool-btn" onClick={e=>{e.stopPropagation();toggleSectionLock(row.id)}} title={row.locked?'Unlock':'Lock'}><i className={`fas ${row.locked?'fa-lock':'fa-unlock'}`}></i></button>
                              <button className="elm-tool-btn" onClick={e=>{e.stopPropagation();toggleCollapse(row.id)}} title={collapsedSections.includes(row.id)?'Expand':'Collapse'}><i className={`fas ${collapsedSections.includes(row.id)?'fa-chevron-right':'fa-chevron-up'}`}></i></button>
                              {!wm&&<button className="elm-tool-btn" onClick={e=>{e.stopPropagation();convertSectionToWidgets(row.id);setLeftTab('settings');setEditPane('content')}} title="Convert to Widgets"><i className="fas fa-th-large"></i></button>}
                              <button className="elm-tool-btn" onClick={e=>{e.stopPropagation();duplicateRow(row.id)}} title="Duplicate"><i className="fas fa-copy"></i></button>
                              <button className="elm-tool-btn" onClick={e=>{e.stopPropagation();toggleSectionVisibility(row.id)}} title="Hide"><i className="fas fa-eye-slash"></i></button>
                              {!row.locked&&<button className="elm-tool-btn elm-tool-btn-del" onClick={e=>{e.stopPropagation();removeRow(row.id)}} title="Delete"><i className="fas fa-trash"></i></button>}
                            </div>

                            {collapsedSections.includes(row.id) ? (
                              <div className="elm-section-collapsed" onClick={e=>{e.stopPropagation();toggleCollapse(row.id)}} style={{padding:'8px 16px',color:'#6cab96',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:6,borderTop:'1px solid #2a2a44'}}>
                                <i className="fas fa-chevron-right"></i> {SECTION_LABELS[row.sectionKey]||row.sectionKey||'Section'} <span style={{color:'#555',marginLeft:4}}>(collapsed)</span>
                              </div>
                            ) : (<>
                            {wm ? (
                              <div className="elm-widget-section-content">
                                <div className="elm-widget-section-header">✏️ {SECTION_LABELS[row.sectionKey]||'Section'} <span style={{fontSize:9,color:'#6cab96',fontWeight:400}}>widget mode</span></div>
                                <div className="elm-custom-row" style={{minHeight:40}}>
                                  {row.columns.map(col=>(
                                    <div key={col.id} className={`elm-column ${selected?.colId===col.id?'elm-column-active':''}`} style={{flex:col.width/100,minWidth:0}}
                                      onClick={e=>{e.stopPropagation();setSelected({rowId:row.id,colId:col.id,element:'column'})}}
                                      onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='move'}}
                                      onDrop={e=>{const t=e.dataTransfer.getData('text/plain');if(t&&!isSection(t))addBlockToCol(row.id,col.id,t);else if(t&&isSection(t))addSectionRow(t,ri+1)}}>
                                      <div className="elm-col-resize"><span className="elm-col-width-badge">{col.width}%</span></div>
                                      {col.blocks.length===0&&<div className="elm-col-empty"><i className="fas fa-plus-circle"></i> Drop widget here</div>}
                                      {col.blocks.length>0&&(
                                        <DndContext sensors={blockSensors} onDragEnd={(event)=>handleBlockSortEnd(event,row.id,col.id)}>
                                          <SortableContext items={col.blocks.map(b=>b.id)}>
                                            <div className="elm-widget-blocks-sortable">
                                              {col.blocks.map((b,i)=>{
                                                const bSel=selected?.block?.id===b.id
                                                return renderBlock(b, row, col, bSel, true)
                                              })}
                                            </div>
                                          </SortableContext>
                                        </DndContext>
                                      )}
                                      <div className="elm-add-widget">
                                        <select className="elm-add-select" value="" onChange={e=>{if(e.target.value){addBlockToCol(row.id,col.id,e.target.value);e.target.value=''}}}>
                                          <option value="">+ Add Widget</option>
                                          {Object.entries(allWidgets).filter(([k])=>k!=='sections'&&k!=='global').flatMap(([,cat])=>Object.entries(cat.items).map(([k,m])=><option key={k} value={k}>{m.label}</option>))}
                                        </select>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : row.type === 'section' && row.sectionKey && SECTION_COMPONENTS[row.sectionKey] ? (
                              <>
                                <div className="elm-section-label">{SECTION_LABELS[row.sectionKey]||row.sectionKey}</div>
                                <div className="elm-section-live">
                                  {inlineEl===row.id ? (
                                    <div className="elm-section-live-inner" dangerouslySetInnerHTML={{__html:row.inlineHTML||''}} />
                                  ) : row.inlineHTML ? (
                                    <div className="elm-section-live-inner" dangerouslySetInnerHTML={{__html:row.inlineHTML}}
                                      onMouseMove={e=>handleElHover(e,row.id)} onClick={e=>handleElClick(e,row.id)} onDoubleClick={e=>handleElDblClick(e,row.id)}>
                                      <div className="elm-el-highlight" style={{position:'absolute',pointerEvents:'none',zIndex:20,border:hoveredEl?.rowId===row.id&&hoverPos?'2px solid #6cab96':'none',borderRadius:2,transition:'all 0.08s',top:hoverPos?.top||0,left:hoverPos?.left||0,width:hoverPos?.width||0,height:hoverPos?.height||0}}/>
                                      <div className="elm-el-overlay"/>
                                    </div>
                                  ) : (
                                    <div className="elm-section-live-inner" onMouseMove={e=>handleElHover(e,row.id)} onClick={e=>handleElClick(e,row.id)} onDoubleClick={e=>handleElDblClick(e,row.id)}>
                                      <LiveSectionContent sectionKey={row.sectionKey} localData={localData} />
                                      <div className="elm-el-highlight" style={{position:'absolute',pointerEvents:'none',zIndex:20,border:hoveredEl?.rowId===row.id&&hoverPos?'2px solid #6cab96':'none',borderRadius:2,transition:'all 0.08s',top:hoverPos?.top||0,left:hoverPos?.left||0,width:hoverPos?.width||0,height:hoverPos?.height||0}}/>
                                      <div className="elm-el-overlay"/>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : row.type === 'section' ? (
                              <div className="elm-section-preview"><div className="elm-section-preview-header"><i className={`fas ${SECTION_ICONS[row.sectionKey]||'fa-layer-group'}`}></i> {SECTION_LABELS[row.sectionKey]||row.sectionKey}</div></div>
                            ) : (
                              <div className="elm-custom-row">
                                {row.columns.map((col, ci)=>(
                                  <div key={col.id} className={`elm-column ${selected?.colId===col.id?'elm-column-active':''}`} style={{flex:col.width/100,minWidth:0,display:'flex',flexDirection:'column'}}
                                    onClick={e=>{e.stopPropagation();setSelected({rowId:row.id,colId:col.id,element:'column'})}}
                                    onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='move'}}
                                    onDrop={e=>{const t=e.dataTransfer.getData('text/plain');if(t&&!isSection(t))addBlockToCol(row.id,col.id,t);else if(t&&isSection(t))addSectionRow(t,ri+1)}}>
                                    <div className="elm-col-resize"><span className="elm-col-width-badge">{col.width}%</span>
                                      {row.columns.length>1&&<button className="elm-col-remove" onClick={e=>{e.stopPropagation();removeColumn(row.id,col.id)}}><i className="fas fa-times"></i></button>}
                                    </div>
                                    {ci < row.columns.length - 1 && (
                                      <div className="elm-col-resize-handle" onMouseDown={e=>startColResize(e,row.id,ci)}
                                        style={{position:'absolute',right:-4,top:0,bottom:0,width:8,cursor:'col-resize',zIndex:10}}/>
                                    )}
                                    {col.blocks.length===0&&<div className="elm-col-empty">Drop widget here</div>}
                                    {col.blocks.length>0&&(
                                      <DndContext sensors={blockSensors} onDragEnd={(event)=>handleBlockSortEnd(event,row.id,col.id)}>
                                        <SortableContext items={col.blocks.map(b=>b.id)}>
                                          {col.blocks.map(b=>{const bSel=selected?.block?.id===b.id;return renderBlock(b, row, col, bSel, false)})}
                                        </SortableContext>
                                      </DndContext>
                                    )}
                                    <div className="elm-add-widget">
                                      <select className="elm-add-select" value="" onChange={e=>{if(e.target.value){if(e.target.value==='__nested__')addNestedRow(row.id,col.id);else addBlockToCol(row.id,col.id,e.target.value);e.target.value=''}}}>
                                        <option value="">+ Add</option>
                                        <option value="__nested__">📦 Inner Section</option>
                                        <option disabled>── Widgets ──</option>
                                        {Object.entries(allWidgets).filter(([k])=>k!=='sections'&&k!=='global').flatMap(([,cat])=>Object.entries(cat.items).map(([k,m])=><option key={k} value={k}>{m.label}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                ))}
                                {row.columns.length<4&&<button className="elm-add-col-btn" onClick={e=>{e.stopPropagation();addColumn(row.id)}} title="Add Column"><i className="fas fa-plus"></i></button>}
                              </div>
                            )}</>)}
                          </Tag>
                        )
                      }}
                    </SortableItem>
                  ))}
                </SortableList>
              )
            })()}
            {builderMode==='page'&&rows.some(r=>r.hidden)&&<div className="elm-hidden-sections-bar"><i className="fas fa-eye-slash"></i> {rows.filter(r=>r.hidden).length} hidden <button className="elm-restore-btn" onClick={()=>setRows(prev=>prev.map(r=>r.hidden?{...r,hidden:false}:r))}>Restore all</button></div>}
            {builderMode==='page'&&<div style={{display:'flex',gap:6,alignItems:'center',justifyContent:'center',padding:12}}>
              <select className="elm-input" style={{fontSize:11,padding:'6px 10px',cursor:'pointer',width:'auto'}} value="" onChange={e=>{const v=e.target.value;if(v){const layouts={single:[100],two:[50,50],three:[33,33,34],four:[25,25,25,25],sidebar:[30,70],sidebarRight:[70,30]};const widths=layouts[v];if(widths){const arr=[...rows];arr.splice(rows.length,0,{id:uid(),type:'custom',columns:widths.map(w=>({id:uid(),width:w,blocks:[],styles:{}})),styles:{}});pushHistory(arr)}}}}>
                <option value="">+ Add Row</option>
                <option value="single">Single column</option>
                <option value="two">Two columns (50/50)</option>
                <option value="three">Three columns</option>
                <option value="four">Four columns</option>
                <option value="sidebar">Sidebar left (30/70)</option>
                <option value="sidebarRight">Sidebar right (70/30)</option>
              </select>
            </div>}
          </div>
        </div>
      </div>
      {inlineEl&&<div className="elm-inline-toolbar"><span style={{fontSize:'10px',color:'#6cab96',marginRight:8}}>✏️ Inline editing — click Save when done</span>
        <button className="elm-tool-btn" style={{background:'#6cab96',color:'#0f0f1a',padding:'3px 10px',borderRadius:3,fontSize:11}} onClick={()=>stopInlineEdit(inlineEl.rowId,true)}><i className="fas fa-check"></i> Save</button>
        <button className="elm-tool-btn elm-tool-btn-del" style={{padding:'3px 10px',borderRadius:3,fontSize:11}} onClick={()=>stopInlineEdit(inlineEl.rowId,false)}><i className="fas fa-times"></i> Cancel</button>
      </div>}
      {contextMenu && rows.filter(r=>!r.hidden).map(row => rowActions(row, rows.findIndex(r => r.id === row.id)))}
      {clipboard&&<div style={{position:'fixed',bottom:60,left:'50%',transform:'translateX(-50%)',background:'#252540',border:'1px solid #2a2a44',borderRadius:6,padding:'6px 14px',fontSize:11,color:'#6cab96',zIndex:9999}}>📋 Widget copied — Ctrl+V to paste</div>}
      {sectionClipboard&&<div style={{position:'fixed',bottom:90,left:'50%',transform:'translateX(-50%)',background:'#252540',border:'1px solid #2a2a44',borderRadius:6,padding:'6px 14px',fontSize:11,color:'#6cab96',zIndex:9999}}>📋 Section copied — Ctrl+Shift+V to paste</div>}
      {selectedWidgets.length>1&&<div style={{position:'fixed',bottom:100,left:'50%',transform:'translateX(-50%)',background:'#252540',border:'1px solid #2a2a44',borderRadius:6,padding:'6px 14px',fontSize:11,color:'#a0a0b0',zIndex:9999,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
        <span>{selectedWidgets.length} selected</span>
        <button className="elm-tool-btn elm-tool-btn-del" style={{fontSize:10}} onClick={()=>{selectedWidgets.forEach(id=>{const r=rows.find(rr=>rr.columns?.some(c=>c.blocks?.some(b=>b.id===id)));if(r){const c=r.columns.find(cc=>cc.blocks?.some(b=>b.id===id));if(c)removeBlock(r.id,c.id,id)}});setSelectedWidgets([])}}><i className="fas fa-trash"></i> Delete</button>
        <button className="elm-tool-btn" style={{fontSize:10}} onClick={()=>{selectedWidgets.forEach(id=>{rows.forEach(r=>r.columns?.forEach(c=>{const bi=c.blocks.findIndex(b=>b.id===id);if(bi>=0)duplicateBlock(r.id,c.id,id)}))});setSelectedWidgets([])}}><i className="fas fa-copy"></i> Duplicate</button>
        <span style={{fontSize:9,color:'#555'}}>BG:</span>
        <select className="elm-input" style={{width:60,fontSize:10,padding:'2px 4px'}} value="" onChange={e=>{const v=e.target.value;if(v){selectedWidgets.forEach(id=>{rows.forEach(r=>r.columns?.forEach(c=>{const bi=c.blocks.findIndex(b=>b.id===id);if(bi>=0)updateBlockStyle(r.id,c.id,id,{background:v})}))});setSelectedWidgets([])}}}>
          <option value="">Color</option>
          {COLOR_PRESETS.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <button className="elm-tool-btn" style={{fontSize:10}} onClick={()=>setSelectedWidgets([])}>Clear</button>
      </div>}
      {showShortcuts&&<div className="elm-shortcuts-overlay" onClick={()=>setShowShortcuts(false)}>
        <div className="elm-shortcuts-modal" onClick={e=>e.stopPropagation()}>
          <div className="elm-shortcuts-title"><i className="fas fa-keyboard"></i> Keyboard Shortcuts <button className="elm-tool-btn elm-tool-btn-del" style={{float:'right',padding:'2px 8px'}} onClick={()=>setShowShortcuts(false)}><i className="fas fa-times"></i></button></div>
          <div className="elm-shortcuts-grid">
            {[
              {keys:'Ctrl+Z',desc:'Undo'},{keys:'Ctrl+Shift+Z',desc:'Redo'},
              {keys:'Ctrl+S',desc:'Save'},{keys:'Ctrl+C',desc:'Copy widget'},{keys:'Ctrl+V',desc:'Paste widget'},
              {keys:'Ctrl+/',desc:'Toggle shortcuts'},{keys:'Esc',desc:'Cancel inline edit / Close menu'},
              {keys:'Delete',desc:'Delete element'},{keys:'Shift+Click',desc:'Multi-select widgets'},
            ].map(s=><div key={s.keys} className="elm-shortcuts-row"><span className="elm-shortcut-keys">{s.keys}</span><span className="elm-shortcut-desc">{s.desc}</span></div>)}
          </div>
        </div>
      </div>}
      </>
      )}
    </div>
  )
}

const NestedRowView = memo(function NestedRowView({ row, parentRowId, parentColId, selected, setSelected, onUpdate, localData }) {
  const col = row.columns?.[0]
  const blockSensors = { current: null }
  return (
    <div className="elm-nested-inner">
      {row.columns.map((col, ci) => (
        <div key={col.id} className="elm-nested-col" style={{flex:col.width/100}}>
          {col.blocks.map(b => (
            <div key={b.id} className={`elm-widget ${selected?.block?.id===b.id?'elm-widget-active':''}`}
              onClick={e=>{e.stopPropagation();setSelected({rowId:parentRowId,colId:parentColId,block:b,element:'widget'})}}>
              <WidgetPreview block={b} localData={localData} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
)

const WidgetContentFields = memo(function WidgetContentFields({ block, onUpdate }) {
  if(block.type==='text')return <textarea rows={6} value={block.content||''} onChange={e=>onUpdate({content:e.target.value})} className="elm-input elm-textarea" />
  if(block.type==='heading')return(<><select value={block.level||'h2'} onChange={e=>onUpdate({level:e.target.value})} className="elm-input"><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option></select><input value={block.content||''} onChange={e=>onUpdate({content:e.target.value})} className="elm-input" placeholder="Heading text" /></>)
  if(block.type==='image')return(<><div style={{display:'flex',gap:4}}><input value={block.src||''} onChange={e=>onUpdate({src:e.target.value})} className="elm-input" placeholder="Image URL" style={{flex:1}} /><label className="elm-tool-btn" style={{fontSize:10,padding:'4px 8px',cursor:'pointer',whiteSpace:'nowrap'}}><i className="fas fa-upload"></i> Upload<input type="file" accept="image/*" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=ev=>onUpdate({src:ev.target.result});r.readAsDataURL(f)}}}/></label></div><input value={block.alt||''} onChange={e=>onUpdate({alt:e.target.value})} className="elm-input" placeholder="Alt text" /><input value={block.caption||''} onChange={e=>onUpdate({caption:e.target.value})} className="elm-input" placeholder="Caption" /></>)
  if(block.type==='button')return(<><input value={block.text||''} onChange={e=>onUpdate({text:e.target.value})} className="elm-input" placeholder="Button text" /><input value={block.url||''} onChange={e=>onUpdate({url:e.target.value})} className="elm-input" placeholder="URL" /><select value={block.style||'solid'} onChange={e=>onUpdate({style:e.target.value})} className="elm-input"><option value="solid">Solid</option><option value="outline">Outline</option></select></>)
  if(block.type==='spacer')return <input type="number" value={block.height||40} onChange={e=>onUpdate({height:parseInt(e.target.value)||40})} className="elm-input" />
  if(block.type==='html')return <textarea rows={6} value={block.html||''} onChange={e=>onUpdate({html:e.target.value})} className="elm-input elm-textarea elm-mono" />
  if(block.type==='shortcode')return <input value={block.key||''} onChange={e=>onUpdate({key:e.target.value})} className="elm-input" placeholder="[year], [site-url], [company]" />
  if(block.type==='container')return <p style={{fontSize:'0.7rem',color:'#666',padding:8}}>Container widget (drag widgets into it)</p>
  if(block.type==='icon')return(<><input value={block.icon||''} onChange={e=>onUpdate({icon:e.target.value})} className="elm-input" placeholder="fa-star" /><select value={block.size||'2x'} onChange={e=>onUpdate({size:e.target.value})} className="elm-input"><option value="1x">Small</option><option value="2x">Medium</option><option value="3x">Large</option></select><input value={block.color||''} onChange={e=>onUpdate({color:e.target.value})} className="elm-input" /></>)
  if(block.type==='video')return <input value={block.src||''} onChange={e=>onUpdate({src:e.target.value})} className="elm-input" />
  if(block.type==='tabs')return (<div>{block.items?.map((item,i)=><div key={i} style={{marginBottom:8,border:'1px solid #2a2a44',borderRadius:4,padding:6}}><div style={{display:'flex',gap:4,marginBottom:4}}><input value={item.label||''} onChange={e=>{const n=[...block.items];n[i]={...n[i],label:e.target.value};onUpdate({items:n})}} className="elm-input" placeholder="Tab label" style={{margin:0,flex:1}} /><button style={{padding:'2px 6px',border:'none',background:'transparent',color:'#f14d4d',cursor:'pointer',fontSize:10}} onClick={()=>{const n=block.items.filter((_,j)=>j!==i);onUpdate({items:n})}}><i className="fas fa-times"></i></button></div><textarea rows={2} value={item.content||''} onChange={e=>{const n=[...block.items];n[i]={...n[i],content:e.target.value};onUpdate({items:n})}} className="elm-input elm-textarea" placeholder="Content HTML" /></div>)}<button className="elm-tool-btn" onClick={()=>onUpdate({items:[...block.items,{label:`Tab ${block.items.length+1}`,content:'<p>New tab</p>'}]})}><i className="fas fa-plus"></i> Add Tab</button></div>)
  if(block.type==='accordion')return (<div>{block.items?.map((item,i)=><div key={i} style={{marginBottom:8,border:'1px solid #2a2a44',borderRadius:4,padding:6}}><div style={{display:'flex',gap:4,marginBottom:4}}><input value={item.title||''} onChange={e=>{const n=[...block.items];n[i]={...n[i],title:e.target.value};onUpdate({items:n})}} className="elm-input" placeholder="Title" style={{margin:0,flex:1}} /><button style={{padding:'2px 6px',border:'none',background:'transparent',color:'#f14d4d',cursor:'pointer',fontSize:10}} onClick={()=>{const n=block.items.filter((_,j)=>j!==i);onUpdate({items:n})}}><i className="fas fa-times"></i></button></div><textarea rows={2} value={item.content||''} onChange={e=>{const n=[...block.items];n[i]={...n[i],content:e.target.value};onUpdate({items:n})}} className="elm-input elm-textarea" placeholder="Content HTML" /></div>)}<button className="elm-tool-btn" onClick={()=>onUpdate({items:[...block.items,{title:`Item ${block.items.length+1}`,content:'<p>Content</p>',open:false}]})}><i className="fas fa-plus"></i> Add Item</button></div>)
  if(block.type==='counter')return (<><input value={block.number||100} onChange={e=>onUpdate({number:parseInt(e.target.value)||0})} className="elm-input" type="number" placeholder="Number" /><div style={{display:'flex',gap:4}}><input value={block.prefix||''} onChange={e=>onUpdate({prefix:e.target.value})} className="elm-input" placeholder="Prefix (+)" style={{flex:1}} /><input value={block.suffix||''} onChange={e=>onUpdate({suffix:e.target.value})} className="elm-input" placeholder="Suffix (%)" style={{flex:1}} /></div><input value={block.label||''} onChange={e=>onUpdate({label:e.target.value})} className="elm-input" placeholder="Label" /><input value={block.duration||2} onChange={e=>onUpdate({duration:parseFloat(e.target.value)||2})} className="elm-input" type="number" step="0.5" placeholder="Duration (s)" /></>)
  if(block.type==='progress')return (<><input value={block.percent||75} onChange={e=>onUpdate({percent:parseInt(e.target.value)||0})} className="elm-input" type="number" min="0" max="100" placeholder="Percent" /><input value={block.label||''} onChange={e=>onUpdate({label:e.target.value})} className="elm-input" placeholder="Label" /><input value={block.color||'#6cab96'} onChange={e=>onUpdate({color:e.target.value})} className="elm-input" placeholder="Color" /><label style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#a0a0b0',margin:'4px 0'}}><input type="checkbox" checked={block.showLabel!==false} onChange={e=>onUpdate({showLabel:e.target.checked})} style={{accentColor:'#6cab96'}} /> Show label</label></>)
  if(block.type==='carousel')return (<div>{block.images?.map((img,i)=><div key={i} style={{display:'flex',gap:4,marginBottom:4}}><input value={img.src||''} onChange={e=>{const n=[...block.images];n[i]={...n[i],src:e.target.value};onUpdate({images:n})}} className="elm-input" placeholder="Image URL" style={{flex:1,margin:0}} /><button style={{padding:'2px 6px',border:'none',background:'transparent',color:'#f14d4d',cursor:'pointer',fontSize:10}} onClick={()=>{const n=block.images.filter((_,j)=>j!==i);onUpdate({images:n})}}><i className="fas fa-times"></i></button></div>)}<button className="elm-tool-btn" onClick={()=>onUpdate({images:[...block.images,{src:'https://placehold.co/600x400/252540/a0a0b0?text=Slide',caption:''}]})}><i className="fas fa-plus"></i> Add Image</button><div style={{display:'flex',gap:4,marginTop:6}}><label style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'#a0a0b0'}}><input type="checkbox" checked={block.autoplay!==false} onChange={e=>onUpdate({autoplay:e.target.checked})} style={{accentColor:'#6cab96'}} /> Autoplay</label><input value={block.speed||3000} onChange={e=>onUpdate({speed:parseInt(e.target.value)||3000})} className="elm-input" type="number" placeholder="Speed (ms)" style={{width:80}} /></div></div>)
  if(block.type==='star-rating')return (<><input value={block.rating||4.5} onChange={e=>onUpdate({rating:parseFloat(e.target.value)||0})} className="elm-input" type="number" step="0.1" min="0" max={block.max||5} placeholder="Rating" /><input value={block.max||5} onChange={e=>onUpdate({max:parseInt(e.target.value)||5})} className="elm-input" type="number" min="1" placeholder="Max stars" /><input value={block.color||'#ffd700'} onChange={e=>onUpdate({color:e.target.value})} className="elm-input" placeholder="Color" /></>)
  if(block.type==='form')return (<div><div className="elm-settings-heading" style={{marginTop:0}}>Form Fields</div>{block.fields?.map((f,i)=><div key={i} style={{marginBottom:6,border:'1px solid #2a2a44',borderRadius:4,padding:6}}><div style={{display:'flex',gap:4,marginBottom:4}}><select value={f.type||'text'} onChange={e=>{const n=[...block.fields];n[i]={...n[i],type:e.target.value};onUpdate({fields:n})}} className="elm-input" style={{flex:1,margin:0}}><option value="text">Text</option><option value="email">Email</option><option value="textarea">Textarea</option><option value="select">Select</option><option value="checkbox">Checkbox</option><option value="radio">Radio</option><option value="number">Number</option><option value="url">URL</option><option value="tel">Tel</option><option value="date">Date</option><option value="file">File Upload</option><option value="hidden">Hidden</option></select><button style={{padding:'2px 6px',border:'none',background:'transparent',color:'#f14d4d',cursor:'pointer',fontSize:10}} onClick={()=>{const n=block.fields.filter((_,j)=>j!==i);onUpdate({fields:n})}}><i className="fas fa-times"></i></button></div><input value={f.label||''} onChange={e=>{const n=[...block.fields];n[i]={...n[i],label:e.target.value};onUpdate({fields:n})}} className="elm-input" placeholder="Label" style={{margin:0}} /><div style={{display:'flex',gap:4,marginTop:4}}><input value={f.placeholder||''} onChange={e=>{const n=[...block.fields];n[i]={...n[i],placeholder:e.target.value};onUpdate({fields:n})}} className="elm-input" placeholder="Placeholder" style={{flex:1,margin:0}} /><label style={{display:'flex',alignItems:'center',gap:3,fontSize:10,color:'#a0a0b0',whiteSpace:'nowrap'}}><input type="checkbox" checked={f.required!==false} onChange={e=>{const n=[...block.fields];n[i]={...n[i],required:e.target.checked};onUpdate({fields:n})}} style={{accentColor:'#6cab96'}} /> Required</label></div>{f.type==='select'&&<input value={f.options||''} onChange={e=>{const n=[...block.fields];n[i]={...n[i],options:e.target.value};onUpdate({fields:n})}} className="elm-input" placeholder="Options (comma separated)" style={{marginTop:4}} />}</div>)}<button className="elm-tool-btn" onClick={()=>onUpdate({fields:[...block.fields,{type:'text',label:'New Field',required:false,placeholder:''}]})}><i className="fas fa-plus"></i> Add Field</button><div style={{marginTop:8}}><div className="elm-settings-heading">Form Settings</div><input value={block.submitText||'Send Message'} onChange={e=>onUpdate({submitText:e.target.value})} className="elm-input" placeholder="Submit button text" /><input value={block.successMsg||'Thank you!'} onChange={e=>onUpdate({successMsg:e.target.value})} className="elm-input" placeholder="Success message" /><input value={block.redirectUrl||''} onChange={e=>onUpdate({redirectUrl:e.target.value})} className="elm-input" placeholder="Redirect URL (optional)" /><input value={block.emailTo||''} onChange={e=>onUpdate({emailTo:e.target.value})} className="elm-input" placeholder="Email to (optional)" /></div></div>)
  if(block.type==='loop-grid')return (<><select value={block.source||'projects'} onChange={e=>onUpdate({source:e.target.value})} className="elm-input"><option value="projects">Projects</option><option value="articles">Articles</option><option value="testimonials">Testimonials</option><option value="portfolioWorks">Portfolio Works</option><option value="caseStudies">Case Studies</option><option value="experience">Experience</option><option value="education">Education</option></select><div style={{display:'flex',gap:4}}><select value={block.layout||'grid'} onChange={e=>onUpdate({layout:e.target.value})} className="elm-input" style={{flex:1}}><option value="grid">Grid</option><option value="list">List</option><option value="carousel">Carousel</option></select><select value={block.columns||3} onChange={e=>onUpdate({columns:parseInt(e.target.value)||3})} className="elm-input" style={{width:60}}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div><input value={block.maxItems||6} onChange={e=>onUpdate({maxItems:parseInt(e.target.value)||6})} className="elm-input" type="number" placeholder="Max items" /><input value={block.filterKey||''} onChange={e=>onUpdate({filterKey:e.target.value})} className="elm-input" placeholder="Filter key (e.g. category)" /></>)
  return <p style={{fontSize:'0.75rem',color:'#666',padding:8}}>No fields</p>
})

const FieldEditor = memo(function FieldEditor({ data, path, onUpdate, depth }) {
  if(depth>5)return <div style={{fontSize:'0.7rem',color:'#666',padding:'4px 0'}}>Max depth</div>
  if(data===null||data===undefined)return null
  if(typeof data==='string')return data.length>120?<textarea rows={4} value={data} onChange={e=>onUpdate(path,e.target.value)} className="elm-input elm-textarea" />:<input value={data} onChange={e=>onUpdate(path,e.target.value)} className="elm-input" />
  if(typeof data==='number')return <input type="number" value={data} onChange={e=>onUpdate(path,parseFloat(e.target.value)||0)} className="elm-input" />
  if(typeof data==='boolean')return <div style={{display:'flex',alignItems:'center',gap:8,margin:'4px 0'}}><input type="checkbox" checked={data} onChange={e=>onUpdate(path,e.target.checked)} style={{accentColor:'#6cab96'}} /><span style={{fontSize:'0.72rem',color:'#a0a0b0'}}>{path.split('.').pop()}</span></div>
  if(Array.isArray(data)){if(data.length===0)return <p style={{fontSize:'0.7rem',color:'#666',padding:'4px 0'}}>Empty list</p>;return <div style={{paddingLeft:depth>0?8:0}}>{data.map((item,idx)=><div key={idx} style={{marginBottom:8,border:'1px solid #2a2a44',borderRadius:4,padding:8,background:'#1a1a2e'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}><span style={{fontSize:'0.65rem',color:'#666'}}>Item {idx+1}</span><button style={{padding:'2px 6px',border:'none',background:'transparent',color:'#f14d4d',cursor:'pointer',fontSize:'10px'}} onClick={()=>{const na=[...data];na.splice(idx,1);onUpdate(path,na)}}><i className="fas fa-times"></i></button></div><FieldEditor data={item} path={path+'.'+idx} onUpdate={onUpdate} depth={depth+1}/></div>)}</div>}
  if(typeof data==='object'){const entries=Object.entries(data).filter(([,v])=>v!==null&&v!==undefined&&typeof v!=='function');if(entries.length===0)return <p style={{fontSize:'0.7rem',color:'#666',padding:'4px 0'}}>Empty object</p>;return <div style={{paddingLeft:depth>0?8:0}}>{entries.map(([key,val])=>{const isSimple=typeof val==='string'||typeof val==='number'||typeof val==='boolean';return <div key={key} style={{marginBottom:isSimple?6:8}}>{!isSimple&&<label style={{fontSize:'0.65rem',fontWeight:600,color:'#6cab96',textTransform:'uppercase',display:'block',marginBottom:4}}>{key}</label>}<FieldEditor data={val} path={path+'.'+key} onUpdate={onUpdate} depth={depth+1}/></div>})}</div>}
  return null
})

const WidgetPreview = memo(function WidgetPreview({ block, localData }) {
  const s=block.styles||{}
  const clazz = s.cssClass || ''
  const id = s.cssId || undefined
  const wrap={padding:'6px',transition:'all 0.2s',...(s.background?{background:s.background}:{}),...(s.color?{color:s.color}:{}),borderRadius:s.borderRadius||'4px',textAlign:s.textAlign||'left',...(s.fontSize?{fontSize:s.fontSize}:{}),...(s.fontWeight?{fontWeight:s.fontWeight}:{}),...(s.marginTop?{marginTop:s.marginTop}:{}),...(s.marginBottom?{marginBottom:s.marginBottom}:{}),...(s.width?{width:s.width}:{}),...(s.minHeight?{minHeight:s.minHeight}:{}),...(s.boxShadow?{boxShadow:s.boxShadow}:{})}
  const wrapProps = { style: wrap, className: clazz || undefined, id }
  if(block.type==='text')return <div {...wrapProps} dangerouslySetInnerHTML={{__html:block.content||''}}/>
  if(block.type==='heading'){const Tag=block.level||'h2';return <Tag {...wrapProps}>{block.content||'Heading'}</Tag>}
  if(block.type==='image')return <div {...wrapProps}><img src={block.src} alt={block.alt} style={{maxWidth:'100%',display:'block'}} onError={e=>{e.target.style.display='none';e.target.parentElement.innerHTML+='<span style=\'color:#666;font-size:0.75rem\'>Image placeholder</span>'}}/>{block.caption&&<p style={{fontSize:'0.75rem',color:'#666',marginTop:4}}>{block.caption}</p>}</div>
  if(block.type==='button')return <div {...wrapProps}><a className="elm-btn-preview" style={{background:block.style==='outline'?'transparent':'#6cab96',color:block.style==='outline'?'#6cab96':'#0f0f1a',border:block.style==='outline'?'1px solid #6cab96':'none'}}>{block.text||'Button'}</a></div>
  if(block.type==='divider')return <div {...wrapProps}><hr style={{border:'none',borderTop:'1px solid #2a2a44',margin:0}}/></div>
  if(block.type==='spacer')return <div style={{...wrap,height:(block.height||40)+'px',background:'transparent'}}/>
  if(block.type==='video')return <div {...wrapProps}><i className="fas fa-play-circle" style={{fontSize:'2rem',color:'#6cab96'}}></i><p style={{fontSize:'0.75rem',color:'#666'}}>Video: {block.src||'No URL'}</p></div>
  if(block.type==='icon')return <div {...wrapProps}><i className={`fas ${block.icon||'fa-star'}`} style={{fontSize:block.size==='3x'?'2rem':block.size==='2x'?'1.5rem':'1rem',color:block.color||'#6cab96'}}></i></div>
  if(block.type==='html')return <div {...wrapProps} dangerouslySetInnerHTML={{__html:block.html||''}}/>
  if(block.type==='shortcode')return <div style={{...wrap,fontSize:'0.75rem',color:'#6cab96',fontFamily:'monospace',padding:'4px 8px',background:'rgba(108,171,150,0.06)',borderRadius:4,display:'inline-block'}}><i className="fas fa-code-branch" style={{marginRight:4}}></i> {block.key||'[shortcode]'}</div>
  if(block.type==='container')return <div style={{...wrap,border:'1px dashed #6cab96',borderRadius:4,minHeight:40,display:'flex',alignItems:'center',justifyContent:'center',color:'#6cab96',fontSize:'0.7rem'}}><i className="fas fa-layer-group"></i> Container</div>
  if(block.type==='tabs')return <TabsPreview block={block} id={id} clazz={clazz} s={s} />
  if(block.type==='accordion')return <AccordionPreview block={block} id={id} clazz={clazz} s={s} />
  if(block.type==='counter')return <CounterPreview block={block} id={id} clazz={clazz} s={s} />
  if(block.type==='progress')return <ProgressPreview block={block} id={id} clazz={clazz} s={s} />
  if(block.type==='carousel')return <CarouselPreview block={block} id={id} clazz={clazz} s={s} />
  if(block.type==='star-rating')return <StarRatingPreview block={block} id={id} clazz={clazz} s={s} />
  if(block.type==='form')return <FormPreview block={block} id={id} clazz={clazz} s={s} />
  if(block.type==='loop-grid')return <LoopGridPreview block={block} id={id} clazz={clazz} s={s} localData={localData} />
  if(block.type==='heading')return <div {...wrapProps}><WidgetPreview block={block}/></div>
  return <div {...wrapProps}>Unknown widget</div>
})

/* ── Interactive Widget Previews ── */
function TabsPreview({ block, id, clazz, s }) {
  const [active, setActive] = useState(block.activeTab||0)
  return <div style={{border:'1px solid #2a2a44',borderRadius:4,overflow:'hidden'}}>
    <div style={{display:'flex',borderBottom:'1px solid #2a2a44',background:'#1a1a2e'}}>
      {block.items?.map((item,i)=>(
        <button key={i} onClick={()=>setActive(i)}
          style={{padding:'6px 12px',border:'none',background:active===i?'#252540':'transparent',color:active===i?'#6cab96':'#a0a0b0',cursor:'pointer',fontSize:11,fontWeight:active===i?600:400,borderBottom:active===i?'2px solid #6cab96':'2px solid transparent',fontFamily:'inherit'}}>
          {item.label||`Tab ${i+1}`}
        </button>
      ))}
    </div>
    <div style={{padding:12,fontSize:12,color:'#a0a0b0',minHeight:40,lineHeight:1.5}}
      dangerouslySetInnerHTML={{__html:block.items?.[active]?.content||'<p>Empty tab</p>'}} />
  </div>
}

function AccordionPreview({ block, id, clazz, s }) {
  const [open, setOpen] = useState(block.items?.map((_,i)=>i===0))
  return <div style={{border:'1px solid #2a2a44',borderRadius:4,overflow:'hidden'}}>
    {block.items?.map((item,i)=>(
      <div key={i} style={{borderBottom:i<block.items.length-1?'1px solid #2a2a44':'none'}}>
        <button onClick={()=>setOpen(prev=>{const n=[...prev];n[i]=!n[i];return n})}
          style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',border:'none',background:'transparent',color:open[i]?'#6cab96':'#a0a0b0',cursor:'pointer',fontSize:12,fontFamily:'inherit',textAlign:'left'}}>
          <span>{item.title||`Item ${i+1}`}</span>
          <i className={`fas fa-chevron-${open[i]?'up':'down'}`} style={{fontSize:10,color:'#666'}}></i>
        </button>
        {open[i]&&<div style={{padding:'4px 12px 10px',fontSize:11,color:'#888',lineHeight:1.5}} dangerouslySetInnerHTML={{__html:item.content||''}} />}
      </div>
    ))}
  </div>
}

function CounterPreview({ block, id, clazz, s }) {
  return <div style={{textAlign:'center',padding:'12px 8px'}}>
    <div style={{fontSize:28,fontWeight:800,color:'#6cab96',fontFamily:'monospace'}}>
      {block.prefix||''}<span>{block.number||0}</span>{block.suffix||''}
    </div>
    {block.label&&<div style={{fontSize:11,color:'#a0a0b0',marginTop:4}}>{block.label}</div>}
  </div>
}

function ProgressPreview({ block, id, clazz, s }) {
  const pct = Math.min(100,Math.max(0,block.percent||75))
  return <div style={{padding:'8px 0'}}>
    {block.showLabel!==false&&block.label&&<div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:4,color:'#a0a0b0'}}><span>{block.label}</span><span>{pct}%</span></div>}
    <div style={{height:8,background:'#1a1a2e',borderRadius:4,overflow:'hidden',border:'1px solid #2a2a44'}}>
      <div style={{height:'100%',width:pct+'%',background:block.color||'#6cab96',borderRadius:4,transition:'width 0.6s'}} />
    </div>
  </div>
}

function CarouselPreview({ block, id, clazz, s }) {
  const [idx, setIdx] = useState(0)
  const imgs = block.images||[]
  useEffect(()=>{if(!block.autoplay||imgs.length<2)return;const t=setInterval(()=>setIdx(i=>(i+1)%imgs.length),block.speed||3000);return ()=>clearInterval(t)},[block.autoplay,block.speed,imgs.length])
  if(!imgs.length)return <div style={{padding:20,textAlign:'center',color:'#555',fontSize:11}}>No images</div>
  return <div style={{position:'relative',borderRadius:4,overflow:'hidden',background:'#1a1a2e'}}>
    <img src={imgs[idx]?.src} alt="" style={{width:'100%',height:120,objectFit:'cover',display:'block'}} onError={e=>{e.target.style.display='none';e.target.parentElement.innerHTML='<div style=padding:40;text-align:center;color:#555;font-size:11px>Image not found</div>'}} />
    {imgs.length>1&&<><button onClick={()=>setIdx(i=>(i-1+imgs.length)%imgs.length)} style={{position:'absolute',left:4,top:'50%',transform:'translateY(-50%)',padding:'4px 8px',border:'none',background:'rgba(0,0,0,0.5)',color:'#fff',borderRadius:3,cursor:'pointer',fontSize:11}}><i className="fas fa-chevron-left"></i></button>
    <button onClick={()=>setIdx(i=>(i+1)%imgs.length)} style={{position:'absolute',right:4,top:'50%',transform:'translateY(-50%)',padding:'4px 8px',border:'none',background:'rgba(0,0,0,0.5)',color:'#fff',borderRadius:3,cursor:'pointer',fontSize:11}}><i className="fas fa-chevron-right"></i></button>
    <div style={{position:'absolute',bottom:4,left:'50%',transform:'translateX(-50%)',display:'flex',gap:4}}>
      {imgs.map((_,i)=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:i===idx?'#6cab96':'rgba(255,255,255,0.3)',cursor:'pointer'}} onClick={()=>setIdx(i)} />)}
    </div></>}
  </div>
}

function StarRatingPreview({ block, id, clazz, s }) {
  const r=block.rating||0,m=block.max||5,c=block.color||'#ffd700',sz=block.size||'1.2rem'
  return <div style={{display:'flex',alignItems:'center',gap:2,padding:'4px 0'}}>
    {[...Array(m)].map((_,i)=>{const v=i+1;const f=r>=v?1:r>=v-0.5?0.5:0
    return <i key={i} className={`fas fa-star${f<1?'-half':''}${f===0?'-o':''}`} style={{color:c,fontSize:sz}} />
    })}
    <span style={{fontSize:11,color:'#a0a0b0',marginLeft:4}}>{r}/{m}</span>
  </div>
}

/* ── Form Widget Preview ── */
function FormPreview({ block, id, clazz, s }) {
  const [submitted, setSubmitted] = useState(false)
  const [vals, setVals] = useState({})
  if(submitted)return <div style={{padding:16,textAlign:'center',color:'#6cab96',fontSize:12}}><i className="fas fa-check-circle" style={{fontSize:24,marginBottom:8,display:'block'}}></i>{block.successMsg||'Thank you!'}</div>
  return <div style={{padding:8}}>
    {block.fields?.map((f,i)=>(
      <div key={i} style={{marginBottom:8}}>
        {f.type!=='hidden'&&<label style={{display:'block',fontSize:11,color:'#a0a0b0',marginBottom:3}}>{f.label}{f.required?' *':''}</label>}
        {f.type==='textarea'?<textarea value={vals[f.label]||''} onChange={e=>setVals(v=>({...v,[f.label]:e.target.value}))} placeholder={f.placeholder} style={{width:'100%',padding:'7px 10px',borderRadius:3,border:'1px solid #2a2a44',background:'#1a1a2e',color:'#d5d8e2',fontSize:12,fontFamily:'inherit',minHeight:60}} />:
        f.type==='select'?<select value={vals[f.label]||''} onChange={e=>setVals(v=>({...v,[f.label]:e.target.value}))} style={{width:'100%',padding:'7px 10px',borderRadius:3,border:'1px solid #2a2a44',background:'#1a1a2e',color:'#d5d8e2',fontSize:12,fontFamily:'inherit'}}><option value="">Select...</option>{(f.options||'').split(',').map((o,j)=><option key={j} value={o.trim()}>{o.trim()}</option>)}</select>:
        f.type==='checkbox'?<label style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#a0a0b0'}}><input type="checkbox" checked={vals[f.label]||false} onChange={e=>setVals(v=>({...v,[f.label]:e.target.checked}))} style={{accentColor:'#6cab96'}} /> {f.label}</label>:
        f.type==='radio'?<div>{(f.options||'').split(',').map((o,j)=><label key={j} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#a0a0b0',marginBottom:2}}><input type="radio" name={f.label} value={o.trim()} checked={vals[f.label]===o.trim()} onChange={e=>setVals(v=>({...v,[f.label]:e.target.value}))} style={{accentColor:'#6cab96'}} /> {o.trim()}</label>)}</div>:
        <input type={f.type||'text'} value={vals[f.label]||''} onChange={e=>setVals(v=>({...v,[f.label]:e.target.value}))} placeholder={f.placeholder} style={{width:'100%',padding:'7px 10px',borderRadius:3,border:'1px solid #2a2a44',background:'#1a1a2e',color:'#d5d8e2',fontSize:12,fontFamily:'inherit'}} />}
      </div>
    ))}
    <button onClick={()=>setSubmitted(true)} style={{width:'100%',padding:'8px 16px',border:'none',borderRadius:3,background:'#6cab96',color:'#0f0f1a',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{block.submitText||'Send'}</button>
  </div>
}

/* ── Loop Grid Widget Preview ── */
function LoopGridPreview({ block, id, clazz, s, localData }) {
  const src = block.source||'projects'
  const items = localData?.[src]
  const data = Array.isArray(items)?items.slice(0,block.maxItems||6):[]
  if(!data.length)return <div style={{padding:20,textAlign:'center',color:'#555',fontSize:11}}>No {src} found</div>
  const cols = block.columns||3
  return <div>
    <div style={{fontSize:9,color:'#6cab96',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:6}}><i className="fas fa-th-list"></i> {src} ({data.length} items)</div>
    <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(cols,data.length)},1fr)`,gap:6}}>
      {data.map((item,i)=>(
        <div key={i} style={{padding:8,borderRadius:3,background:'#1a1a2e',border:'1px solid #2a2a44',fontSize:10,color:'#a0a0b0'}}>
          <div style={{fontWeight:600,color:'#d5d8e2',marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.title||item.name||item.q||`Item ${i+1}`}</div>
          <div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#666'}}>{item.description||item.summary||item.a||''}</div>
        </div>
      ))}
    </div>
  </div>
}

const LiveSectionContent = memo(function LiveSectionContent({ sectionKey, localData }) {
  const Comp = SECTION_COMPONENTS[sectionKey]
  if (!Comp) return null
  return <Comp {...resolveSectionProps(sectionKey, localData)} />
})

function buildDefaultRows(data) {
  const sections = data.settings?.sections || {}
  return Object.entries(sections).filter(([,s])=>s.visible!==false).sort((a,b)=>(a[1].order||0)-(b[1].order||0)).map(([key])=>defaultSectionRow(key))
}

const SortableBlock = memo(function SortableBlock({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    zIndex: isDragging ? 1 : 'auto',
    touchAction: 'none',
  }
  return <div ref={setNodeRef} style={style} {...attributes} {...listeners}>{children}</div>
})
