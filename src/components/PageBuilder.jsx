import { useState, useEffect, useRef } from 'react'
import { SortableList, SortableItem } from './SortableList'

const BLOCK_META = {
  hero: { icon: 'fa-user', label: 'Hero', fields: ['firstName','title','tagline','heroSummary'] },
  about: { icon: 'fa-info-circle', label: 'About', fields: ['summary'] },
  logos: { icon: 'fa-handshake', label: 'Client Logos', fields: [] },
  projects: { icon: 'fa-code', label: 'Projects', fields: [] },
  testimonials: { icon: 'fa-star', label: 'Testimonials', fields: [] },
  achievements: { icon: 'fa-trophy', label: 'Achievements', fields: [] },
  process: { icon: 'fa-cogs', label: 'Services Timeline', fields: [] },
  quote: { icon: 'fa-quote-right', label: 'Quote', fields: [] },
  tools: { icon: 'fa-tools', label: 'Tools', fields: [] },
  faq: { icon: 'fa-question-circle', label: 'FAQ', fields: [] },
  articles: { icon: 'fa-newspaper', label: 'Articles', fields: [] },
  'portfolio-download': { icon: 'fa-download', label: 'Download', fields: [] },
  contact: { icon: 'fa-envelope', label: 'Contact', fields: [] },
  map: { icon: 'fa-map-marker-alt', label: 'Map', fields: [] },
  newsletter: { icon: 'fa-mail-bulk', label: 'Newsletter', fields: [] },
  education: { icon: 'fa-graduation-cap', label: 'Education', fields: [] },
  courses: { icon: 'fa-book', label: 'Courses', fields: [] },
  certifications: { icon: 'fa-certificate', label: 'Certifications', fields: [] },
}

export default function PageBuilder({ data, onSave }) {
  const [sections, setSections] = useState(data.settings?.sections || {})
  const [customSections, setCustomSections] = useState(data.customSections || [])
  const [expandedKey, setExpandedKey] = useState(null)
  const [showAddModal, setShowAddModal] = useState(null)
  const [localData, setLocalData] = useState(data)
  const r = useRef(true)

  useEffect(() => { setLocalData(data) }, [data])
  useEffect(() => {
    if (r.current) { r.current = false; return }
    const timer = setTimeout(() => onSave({ ...localData, settings: { ...localData.settings, sections }, customSections }, 'Page Builder'), 600)
    return () => clearTimeout(timer)
  }, [sections, customSections, localData.personalData?.firstName])

  const sectionEntries = Object.entries(sections)
    .map(([key, val]) => ({ key, ...val }))
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const reorderSections = (arr) => {
    const next = { ...sections }
    arr.forEach((item, index) => { next[item.key] = { ...next[item.key], order: index } })
    setSections(next)
  }

  const toggle = (key) => setSections(p => ({ ...p, [key]: { ...p[key], visible: !p[key]?.visible } }))

  const addBlock = (type) => {
    if (type === 'custom') {
      setCustomSections(p => [...p, { id: Date.now(), title: 'New Section', content: '', icon: 'fa-star', bg: '', layout: 'full', order: p.length }])
    } else if (sections[type]) {
      toggle(type)
    }
    setShowAddModal(null)
  }

  const removeBlock = (key) => {
    if (confirm(`Remove "${BLOCK_META[key]?.label || key}" from page?`)) {
      toggle(key)
    }
  }

  const removeCustom = (id) => {
    if (confirm('Delete this custom section?')) setCustomSections(p => p.filter(cs => cs.id !== id))
  }

  const ud = (f, v) => setLocalData(p => ({ ...p, personalData: { ...p.personalData, [f]: v } }))
  const updateCustom = (id, f, v) => setCustomSections(p => p.map(cs => cs.id === id ? { ...cs, [f]: v } : cs))

  const combined = [
    ...sectionEntries.filter(s => s.visible !== false).map(s => ({ ...s, isCustom: false })),
    ...customSections.map((cs, ci) => ({ key: `_custom_${cs.id}`, isCustom: true, id: cs.id, title: cs.title, icon: cs.icon, content: cs.content, bg: cs.bg, layout: cs.layout, visible: true, order: cs.order ?? sectionEntries.length + ci })),
  ].sort((a, b) => (a.order || 0) - (b.order || 0))

  const blockCount = (key) => {
    const d = localData
    if (key === 'projects') return d.projects?.length || 0
    if (key === 'articles') return d.articles?.length || 0
    if (key === 'logos') return d.clientLogos?.length || 0
    if (key === 'testimonials') return d.testimonials?.length || 0
    if (key === 'tools') return d.toolsData?.length || d.tools?.toolsCount || 0
    if (key === 'faq') return d.faq?.length || 0
    return null
  }

  const preview = (key) => {
    if (key === 'hero') return localData.personalData?.tagline?.slice(0, 80)
    if (key === 'about') return localData.personalData?.summary?.slice(0, 120)
    return null
  }

  return (
    <div className="page-builder">
      <div className="pb-toolbar"><i className="fas fa-pencil-ruler" style={{marginRight:8}}></i> Page Builder <span style={{fontSize:'0.7rem',color:'var(--text-dim)',marginLeft:12}}>Drag blocks to reorder &middot; Click to edit</span></div>

      <SortableList items={combined} onReorder={(arr) => {
        const reordered = {}
        arr.filter(i => !i.isCustom).forEach((item, index) => { reordered[item.key] = { ...sections[item.key], order: index } })
        setSections(p => ({ ...p, ...reordered }))
        setCustomSections(arr.filter(i => i.isCustom).map((cs, idx) => ({ ...customSections.find(c => c.id === cs.id), order: idx + arr.filter(i => !i.isCustom).length })))
      }} getId={item => item.isCustom ? `_custom_${item.id}` : item.key}>
        {combined.map((block) => (
          <SortableItem key={block.isCustom ? `_custom_${block.id}` : block.key} id={block.isCustom ? `_custom_${block.id}` : block.key}>
            {(listeners) => (
              <div className={`pb-block ${expandedKey === block.key ? 'pb-block-expanded' : ''}`}>
                <div className="pb-block-header">
                  <button {...listeners} className="admin-drag-handle" title="Drag to reorder"><i className="fas fa-grip-vertical"></i></button>
                  <i className={`fas ${block.isCustom ? block.icon || 'fa-star' : BLOCK_META[block.key]?.icon || 'fa-cube'}`} style={{color:'var(--accent)',width:20,textAlign:'center',fontSize:'0.9rem'}}></i>
                  <span className="pb-block-title">{block.isCustom ? block.title : BLOCK_META[block.key]?.label || block.key}</span>
                  <span className="pb-block-meta">
                    {block.isCustom ? 'Custom' : block.key}
                  </span>
                  {!block.isCustom && blockCount(block.key) !== null && (
                    <span className="pb-block-count">{blockCount(block.key)} items</span>
                  )}
                  <div className="pb-block-actions">
                    {!block.isCustom && (
                      <label className="admin-toggle" onClick={e => e.stopPropagation()} title="Toggle visibility">
                        <input type="checkbox" checked={block.visible !== false} onChange={() => toggle(block.key)} />
                        <span className="admin-toggle-slider"></span>
                      </label>
                    )}
                    <button className="pb-btn pb-btn-edit" onClick={() => setExpandedKey(expandedKey === block.key ? null : block.key)} title="Edit">
                      <i className={`fas ${expandedKey === block.key ? 'fa-chevron-up' : 'fa-pen'}`}></i>
                    </button>
                    {block.isCustom && (
                      <button className="pb-btn pb-btn-del" onClick={() => removeCustom(block.id)} title="Delete"><i className="fas fa-trash"></i></button>
                    )}
                    {!block.isCustom && (
                      <button className="pb-btn pb-btn-del" onClick={() => removeBlock(block.key)} title={block.visible !== false ? 'Hide section' : 'Hidden'}><i className={`fas ${block.visible !== false ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                    )}
                  </div>
                </div>

                {expandedKey === block.key && (
                  <div className="pb-block-editor">
                    {block.isCustom ? (
                      <div className="pb-editor-inline">
                        <div className="admin-field"><label>Title</label><input value={block.title} onChange={e => updateCustom(block.id, 'title', e.target.value)} /></div>
                        <div className="admin-field"><label>Content (HTML)</label><textarea rows={4} value={block.content} onChange={e => updateCustom(block.id, 'content', e.target.value)} /></div>
                        <div className="admin-field"><label>Icon (FA class)</label><input value={block.icon} onChange={e => updateCustom(block.id, 'icon', e.target.value)} /></div>
                        <div className="admin-field"><label>Background</label><input value={block.bg} onChange={e => updateCustom(block.id, 'bg', e.target.value)} /></div>
                        <div className="admin-field"><label>Layout</label><select value={block.layout} onChange={e => updateCustom(block.id, 'layout', e.target.value)} style={{padding:'6px',fontSize:'0.82rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)',width:'100%'}}>
                          <option value="full">Full Width</option><option value="contained">Contained</option><option value="split">Split (2 col)</option>
                        </select></div>
                      </div>
                    ) : block.key === 'hero' ? (
                      <div className="pb-editor-inline">
                        <div className="pb-editor-row"><div className="admin-field" style={{flex:1}}><label>First Name</label><input value={localData.personalData?.firstName || ''} onChange={e => ud('firstName', e.target.value)} /></div><div className="admin-field" style={{flex:1}}><label>Last Name</label><input value={localData.personalData?.lastName || ''} onChange={e => ud('lastName', e.target.value)} /></div></div>
                        <div className="admin-field"><label>Title</label><input value={localData.personalData?.title || ''} onChange={e => ud('title', e.target.value)} /></div>
                        <div className="admin-field"><label>Tagline</label><textarea rows={2} value={localData.personalData?.tagline || ''} onChange={e => ud('tagline', e.target.value)} /></div>
                        <div className="admin-field"><label>Hero Summary</label><textarea rows={4} value={localData.personalData?.heroSummary || ''} onChange={e => ud('heroSummary', e.target.value)} /></div>
                      </div>
                    ) : block.key === 'about' ? (
                      <div className="pb-editor-inline">
                        <div className="admin-field"><label>About Summary</label><textarea rows={6} value={localData.personalData?.summary || ''} onChange={e => ud('summary', e.target.value)} /></div>
                      </div>
                    ) : (
                      <div className="pb-editor-inline">
                        <p style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>Edit <strong>{BLOCK_META[block.key]?.label || block.key}</strong> content in the <strong>Content</strong> tab.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </SortableItem>
        ))}
      </SortableList>

      <button className="pb-add-block" onClick={() => setShowAddModal(true)}>
        <i className="fas fa-plus"></i> Add Block
      </button>

      {showAddModal && (
        <div className="pb-modal-overlay" onClick={() => setShowAddModal(null)}>
          <div className="pb-modal" onClick={e => e.stopPropagation()}>
            <div className="pb-modal-header"><strong>Add Block</strong><button className="pb-modal-close" onClick={() => setShowAddModal(null)}>&times;</button></div>
            <div className="pb-modal-grid">
              {Object.entries(BLOCK_META).filter(([key]) => !sectionEntries.find(s => s.key === key && s.visible !== false)).map(([key, meta]) => (
                <button key={key} className="pb-modal-item" onClick={() => addBlock(key)}>
                  <i className={`fas ${meta.icon}`}></i>
                  <span>{meta.label}</span>
                  {sectionEntries.find(s => s.key === key) && <span className="pb-modal-badge">Hidden</span>}
                </button>
              ))}
              <button className="pb-modal-item pb-modal-custom" onClick={() => addBlock('custom')}>
                <i className="fas fa-plus-circle"></i>
                <span>Custom Section</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'center'}}>
        <button className="admin-add-btn" onClick={() => onSave({ ...localData, settings: { ...localData.settings, sections }, customSections })}>
          <i className="fas fa-save" style={{marginRight:6}}></i> Save All Changes
        </button>
      </div>
    </div>
  )
}
