import { useState, useEffect, useCallback, useRef } from 'react'
import { personalData as defaultPersonal, experience as defaultExp, projects as defaultProjects, articles as defaultArticles, skillCategories as defaultSkills, education as defaultEdu, courses as defaultCourses } from '../data/portfolioData'

const STORAGE_KEY = 'portfolio-admin-data'
const HISTORY_KEY = 'portfolio-admin-history'
const MAX_HISTORY = 50
const PASSWORD = 'admin2026'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const defaultSections = {
  hero: { visible: true, order: 0 },
  about: { visible: true, order: 1 },
  projects: { visible: true, order: 2 },
  testimonials: { visible: true, order: 3 },
  achievements: { visible: true, order: 4 },
  quote: { visible: true, order: 5 },
  articles: { visible: true, order: 6 },
  contact: { visible: true, order: 7 },
}

const defaultTheme = {
  accent: '#64ffda',
  accent2: '#ff6b6b',
  bg: '#0f0f1a',
  bgAlt: '#1a1a2e',
  text: '#e0e0e0',
  textSecondary: '#a0a0b0',
  textDim: '#666',
  textMuted: '#888',
  border: '#2a2a3e',
}

const defaultTools = {
  googleAnalyticsId: '',
  facebookPixelId: '',
  searchConsoleMeta: '',
  chatCode: '',
  calendlyLink: '',
  newsletterEnabled: true,
  cookieConsentEnabled: true,
  pwaEnabled: true,
  rssEnabled: true,
  fontFamily: 'Inter',
  imageCdn: '',
  businessHours: [
    { day: 'Sunday – Thursday', hours: '10:00 AM – 7:00 PM' },
    { day: 'Friday', hours: 'Closed' },
    { day: 'Saturday', hours: '11:00 AM – 4:00 PM' },
  ],
  socialLinks: [
    { label: 'Facebook', url: 'https://facebook.com/DR.MadaKamal', icon: 'fab fa-facebook-f' },
    { label: 'Instagram', url: 'https://instagram.com/mada_kamal_', icon: 'fab fa-instagram' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/mohammedkamal-shaat', icon: 'fab fa-linkedin-in' },
    { label: 'WhatsApp', url: 'https://wa.me/201009852109', icon: 'fab fa-whatsapp' },
  ],
  projectsEnabled: true,
  articlesEnabled: true,
}

function getDefaults() {
  return {
    personalData: defaultPersonal,
    experience: defaultExp,
    projects: defaultProjects,
    articles: defaultArticles,
    skillCategories: defaultSkills,
    education: defaultEdu,
    courses: defaultCourses,
    settings: {
      sections: { ...defaultSections },
      theme: { ...defaultTheme },
      images: [],
      tools: { ...defaultTools },
    },
  }
}

function applyTheme(theme) {
  const root = document.documentElement
  Object.entries(theme).forEach(([key, val]) => {
    const cssKey = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(cssKey, val)
  })
}

export default function AdminPanel({ onDataChange }) {
  const [visible, setVisible] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('personal')
  const [data, setData] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [msg, setMsg] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    const saved = loadSaved()
    if (saved) {
      setData(saved)
      if (saved.settings?.theme) applyTheme(saved.settings.theme)
    }
    setHistory(loadHistory())
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setVisible(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const pushToHistory = useCallback((newData, label) => {
    const entry = { timestamp: Date.now(), label: label || 'Auto-save', data: JSON.parse(JSON.stringify(newData)) }
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const debouncedSave = useCallback((newData, label) => {
    setData(newData)
    saveToStorage(newData)
    if (onDataChange) onDataChange(newData)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      pushToHistory(newData, label)
      setMsg('Auto-saved')
      setTimeout(() => setMsg(''), 1500)
    }, 800)
  }, [onDataChange, pushToHistory])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const restoreHistory = (entry) => {
    if (confirm(`Restore version from ${new Date(entry.timestamp).toLocaleString()}? Current edits will be replaced.`)) {
      setData(entry.data)
      saveToStorage(entry.data)
      if (onDataChange) onDataChange(entry.data)
      if (entry.data.settings?.theme) applyTheme(entry.data.settings.theme)
      setMsg('History restored')
      setTimeout(() => setMsg(''), 2000)
    }
  }

  const clearHistory = () => {
    if (confirm('Delete all history versions?')) {
      setHistory([])
      localStorage.removeItem(HISTORY_KEY)
    }
  }

  const login = () => {
    if (password === PASSWORD) {
      setAuthed(true)
      setMsg('')
    } else {
      setMsg('Incorrect password')
    }
  }

  const reset = () => {
    if (confirm('Reset all edits to default?')) {
      localStorage.removeItem(STORAGE_KEY)
      const defs = getDefaults()
      setData(null)
      if (onDataChange) onDataChange(null)
      applyTheme(defaultTheme)
      setMsg('Reset to default')
    }
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data || getDefaults(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'portfolio-data.json'; a.click()
    URL.revokeObjectURL(url)
  }

  if (!visible) return null

  const current = data || getDefaults()

  return (
    <div className="admin-overlay" onClick={(e) => { if (e.target.className === 'admin-overlay') { setVisible(false); setAuthed(false); setShowHistory(false) } }}>
      <div className="admin-panel">
        <button className="admin-close" onClick={() => { setVisible(false); setAuthed(false); setShowHistory(false) }}>&times;</button>

        {!authed ? (
          <div className="admin-login">
            <h2>Admin Login</h2>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()} placeholder="Enter password" autoFocus />
            <button onClick={login}>Login</button>
            {msg && <p className="admin-msg">{msg}</p>}
          </div>
        ) : showHistory ? (
          <>
            <div className="admin-tabs">
              <button onClick={() => setShowHistory(false)}>&larr; Back</button>
              <span style={{flex:1}}></span>
              <button className="admin-reset" onClick={clearHistory}>Clear History</button>
              <span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{history.length} versions</span>
            </div>
            <div className="admin-content">
              {history.length === 0 ? (
                <p style={{textAlign:'center',color:'var(--text-muted)',padding:40}}>No history yet. Make edits to create version snapshots.</p>
              ) : (
                history.map((entry, i) => (
                  <div key={i} className="admin-history-item">
                    <div className="admin-history-info">
                      <span className="admin-history-time">{new Date(entry.timestamp).toLocaleString()}</span>
                      <span className="admin-history-label">{entry.label}</span>
                    </div>
                    <button className="admin-restore-btn" onClick={() => restoreHistory(entry)}>Restore</button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="admin-tabs">
              {['personal','experience','projects','articles','sections','theme','images','tools'].map(t => (
                <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
              <button onClick={() => setShowHistory(true)}>History ({history.length})</button>
              <button onClick={exportJSON}>Export</button>
              <button className="admin-reset" onClick={reset}>Reset</button>
              <span style={{marginLeft:'auto',fontSize:'0.75rem',color:'var(--accent)'}}>{msg}</span>
            </div>

            <div className="admin-content">
              {tab === 'personal' && <PersonalForm data={current} onSave={debouncedSave} />}
              {tab === 'experience' && <ExperienceForm data={current} onSave={debouncedSave} />}
              {tab === 'projects' && <ProjectsForm data={current} onSave={debouncedSave} />}
              {tab === 'articles' && <ArticlesForm data={current} onSave={debouncedSave} />}
              {tab === 'sections' && <SectionsForm data={current} onSave={debouncedSave} />}
              {tab === 'theme' && <ThemeForm data={current} onSave={debouncedSave} />}
              {tab === 'images' && <ImagesForm data={current} onSave={debouncedSave} />}
              {tab === 'tools' && <ToolsForm data={current} onSave={debouncedSave} />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Input({ label, value, onChange, multiline }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {multiline
        ? <textarea rows={3} value={value || ''} onChange={e => onChange(e.target.value)} />
        : <input value={value || ''} onChange={e => onChange(e.target.value)} />}
    </div>
  )
}

function PersonalForm({ data, onSave }) {
  const [d, setD] = useState(data.personalData)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const timer = setTimeout(() => onSave({ ...data, personalData: d }, 'Personal info'), 500)
    return () => clearTimeout(timer)
  }, [d])

  const set = (key, val) => setD({ ...d, [key]: val })

  return (
    <div>
      <Input label="First Name" value={d.firstName} onChange={v => set('firstName', v)} />
      <Input label="Last Name" value={d.lastName} onChange={v => set('lastName', v)} />
      <Input label="Title" value={d.title} onChange={v => set('title', v)} />
      <Input label="Phone" value={d.phone} onChange={v => set('phone', v)} />
      <Input label="Email" value={d.email} onChange={v => set('email', v)} />
      <Input label="Location" value={d.location} onChange={v => set('location', v)} />
      <Input label="LinkedIn" value={d.linkedin} onChange={v => set('linkedin', v)} />
      <Input label="Tagline" value={d.tagline} onChange={v => set('tagline', v)} multiline />
      <Input label="Summary" value={d.summary} onChange={v => set('summary', v)} multiline />
    </div>
  )
}

function ExperienceForm({ data, onSave }) {
  const [list, setList] = useState(data.experience)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const timer = setTimeout(() => onSave({ ...data, experience: list }, 'Experience'), 500)
    return () => clearTimeout(timer)
  }, [list])

  const update = (i, field, val) => setList(prev => {
    const copy = [...prev]; copy[i] = { ...copy[i], [field]: val }; return copy
  })

  const move = (i, dir) => setList(prev => {
    const j = i + dir
    if (j < 0 || j >= prev.length) return prev
    const copy = [...prev]; [copy[i], copy[j]] = [copy[j], copy[i]]; return copy
  })

  const add = () => setList(prev => [...prev, { role: 'New Role', company: 'Company', period: 'Date', location: '', highlights: [], links: [], media: [] }])
  const remove = (i) => { if (confirm(`Delete "${list[i].role}"?`)) setList(prev => prev.filter((_, idx) => idx !== i)) }

  const addHighlight = (i) => setList(prev => { const c = [...prev]; c[i] = { ...c[i], highlights: [...(c[i].highlights || []), ''] }; return c })
  const updateHighlight = (i, j, v) => setList(prev => { const c = [...prev]; const h = [...(c[i].highlights || [])]; h[j] = v; c[i] = { ...c[i], highlights: h }; return c })
  const removeHighlight = (i, j) => setList(prev => { const c = [...prev]; c[i] = { ...c[i], highlights: (c[i].highlights || []).filter((_, idx) => idx !== j) }; return c })

  const addMedia = (i) => setList(prev => { const c = [...prev]; c[i] = { ...c[i], media: [...(c[i].media || []), { title: '', description: '', image: '' }] }; return c })
  const updateMedia = (i, j, field, val) => setList(prev => { const c = [...prev]; const m = [...(c[i].media || [])]; m[j] = { ...m[j], [field]: val }; c[i] = { ...c[i], media: m }; return c })
  const removeMedia = (i, j) => setList(prev => { const c = [...prev]; c[i] = { ...c[i], media: (c[i].media || []).filter((_, idx) => idx !== j) }; return c })

  const addLink = (i) => setList(prev => { const c = [...prev]; c[i] = { ...c[i], links: [...(c[i].links || []), { label: '', url: '' }] }; return c })
  const updateLink = (i, j, field, val) => setList(prev => { const c = [...prev]; const l = [...(c[i].links || [])]; l[j] = { ...l[j], [field]: val }; c[i] = { ...c[i], links: l }; return c })
  const removeLink = (i, j) => setList(prev => { const c = [...prev]; c[i] = { ...c[i], links: (c[i].links || []).filter((_, idx) => idx !== j) }; return c })

  return (
    <div>
      <button className="admin-add-btn" onClick={add} style={{marginBottom:12}}>+ Add Experience</button>
      {list.map((exp, i) => (
        <div key={i} className="admin-card">
          <div className="admin-card-header">
            <span style={{fontSize:'0.82rem'}}><strong>{exp.role}</strong> @ {exp.company}</span>
            <div className="admin-card-actions">
              <button onClick={() => move(i, -1)} disabled={i === 0} title="Move up">&uarr;</button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1} title="Move down">&darr;</button>
              <button className="admin-del-btn" onClick={() => remove(i)} title="Delete">&times;</button>
            </div>
          </div>
          <Input label="Role" value={exp.role} onChange={v => update(i, 'role', v)} />
          <Input label="Company" value={exp.company} onChange={v => update(i, 'company', v)} />
          <Input label="Period" value={exp.period} onChange={v => update(i, 'period', v)} />
          <Input label="Location" value={exp.location} onChange={v => update(i, 'location', v)} />
          <Input label="Logo Path" value={exp.logo} onChange={v => update(i, 'logo', v)} />

          <div className="admin-subsection">
            <strong>Highlights</strong>
            {(exp.highlights || []).map((h, j) => (
              <div key={j} className="admin-inline-row">
                <input value={h} onChange={e => updateHighlight(i, j, e.target.value)} />
                <button className="admin-del-btn-sm" onClick={() => removeHighlight(i, j)}>&times;</button>
              </div>
            ))}
            <button className="admin-add-small" onClick={() => addHighlight(i)}>+ Add Highlight</button>
          </div>

          <div className="admin-subsection">
            <strong>Links</strong>
            {(exp.links || []).map((l, j) => (
              <div key={j} className="admin-inline-row">
                <input value={l.label} placeholder="Label" onChange={e => updateLink(i, j, 'label', e.target.value)} />
                <input value={l.url} placeholder="URL" onChange={e => updateLink(i, j, 'url', e.target.value)} />
                <button className="admin-del-btn-sm" onClick={() => removeLink(i, j)}>&times;</button>
              </div>
            ))}
            <button className="admin-add-small" onClick={() => addLink(i)}>+ Add Link</button>
          </div>

          <div className="admin-subsection">
            <strong>Media ({exp.media?.length || 0})</strong>
            {(exp.media || []).map((m, j) => (
              <div key={j} className="admin-media-row">
                <input value={m.title} placeholder="Title" onChange={e => updateMedia(i, j, 'title', e.target.value)} />
                <input value={m.description} placeholder="Description" onChange={e => updateMedia(i, j, 'description', e.target.value)} />
                <input value={m.image || ''} placeholder="Image path or URL" onChange={e => updateMedia(i, j, 'image', e.target.value)} />
                <button className="admin-del-btn-sm" onClick={() => removeMedia(i, j)}>&times;</button>
              </div>
            ))}
            <button className="admin-add-small" onClick={() => addMedia(i)}>+ Add Media</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectsForm({ data, onSave }) {
  const [list, setList] = useState(data.projects)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const timer = setTimeout(() => onSave({ ...data, projects: list }, 'Projects'), 500)
    return () => clearTimeout(timer)
  }, [list])

  const update = (i, field, val) => setList(prev => {
    const copy = [...prev]; copy[i] = { ...copy[i], [field]: val }; return copy
  })

  const move = (i, dir) => setList(prev => {
    const j = i + dir; if (j < 0 || j >= prev.length) return prev
    const copy = [...prev]; [copy[i], copy[j]] = [copy[j], copy[i]]; return copy
  })

  const add = () => setList(prev => [...prev, { title: 'New Project', description: '', url: '', tags: [] }])
  const remove = (i) => { if (confirm(`Delete "${list[i].title}"?`)) setList(prev => prev.filter((_, idx) => idx !== i)) }

  const addTag = (i) => setList(prev => { const c = [...prev]; c[i] = { ...c[i], tags: [...(c[i].tags || []), ''] }; return c })
  const updateTag = (i, j, v) => setList(prev => { const c = [...prev]; const t = [...(c[i].tags || [])]; t[j] = v; c[i] = { ...c[i], tags: t }; return c })
  const removeTag = (i, j) => setList(prev => { const c = [...prev]; c[i] = { ...c[i], tags: (c[i].tags || []).filter((_, idx) => idx !== j) }; return c })

  return (
    <div>
      <button className="admin-add-btn" onClick={add} style={{marginBottom:12}}>+ Add Project</button>
      {list.map((p, i) => (
        <div key={i} className="admin-card">
          <div className="admin-card-header">
            <span style={{fontSize:'0.82rem'}}><strong>{p.title}</strong></span>
            <div className="admin-card-actions">
              <button onClick={() => move(i, -1)} disabled={i === 0}>&uarr;</button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1}>&darr;</button>
              <button className="admin-del-btn" onClick={() => remove(i)}>&times;</button>
            </div>
          </div>
          <Input label="Title" value={p.title} onChange={v => update(i, 'title', v)} />
          <Input label="Description" value={p.description} onChange={v => update(i, 'description', v)} multiline />
          <Input label="URL" value={p.url} onChange={v => update(i, 'url', v)} />
          <div className="admin-subsection">
            <strong>Tags</strong>
            {(p.tags || []).map((t, j) => (
              <div key={j} className="admin-inline-row">
                <input value={t} onChange={e => updateTag(i, j, e.target.value)} />
                <button className="admin-del-btn-sm" onClick={() => removeTag(i, j)}>&times;</button>
              </div>
            ))}
            <button className="admin-add-small" onClick={() => addTag(i)}>+ Add Tag</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ArticlesForm({ data, onSave }) {
  const [list, setList] = useState(data.articles)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const timer = setTimeout(() => onSave({ ...data, articles: list }, 'Articles'), 500)
    return () => clearTimeout(timer)
  }, [list])

  const update = (i, field, val) => setList(prev => {
    const copy = [...prev]; copy[i] = { ...copy[i], [field]: val }; return copy
  })

  const add = () => setList(prev => [...prev, { title: 'New Article', description: '', image: '', content: '', readTime: '5 min', date: new Date().toISOString().slice(0,10) }])
  const remove = (i) => { if (confirm(`Delete "${list[i].title}"?`)) setList(prev => prev.filter((_, idx) => idx !== i)) }

  return (
    <div>
      <button className="admin-add-btn" onClick={add} style={{marginBottom:12}}>+ Add Article</button>
      {list.map((a, i) => (
        <div key={i} className="admin-card">
          <div className="admin-card-header">
            <span style={{fontSize:'0.82rem'}}><strong>{a.title}</strong></span>
            <button className="admin-del-btn" onClick={() => remove(i)}>&times;</button>
          </div>
          <Input label="Title" value={a.title} onChange={v => update(i, 'title', v)} />
          <Input label="Description" value={a.description} onChange={v => update(i, 'description', v)} multiline />
          <Input label="Image URL" value={a.image || ''} onChange={v => update(i, 'image', v)} />
          <Input label="Content" value={a.content || ''} onChange={v => update(i, 'content', v)} multiline />
          <Input label="Read Time" value={a.readTime} onChange={v => update(i, 'readTime', v)} />
          <Input label="Date" value={a.date} onChange={v => update(i, 'date', v)} />
        </div>
      ))}
    </div>
  )
}

function SectionsForm({ data, onSave }) {
  const [sections, setSections] = useState(data.settings?.sections || {})
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const timer = setTimeout(() => {
      const newSettings = { ...data.settings, sections }
      onSave({ ...data, settings: newSettings }, 'Sections')
    }, 400)
    return () => clearTimeout(timer)
  }, [sections])

  const toggle = (key) => setSections(prev => ({ ...prev, [key]: { ...prev[key], visible: !prev[key]?.visible } }))
  const setOrder = (key, val) => setSections(prev => ({ ...prev, [key]: { ...prev[key], order: parseInt(val) || 0 } }))

  return (
    <div>
      <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:12}}>Show/hide sections and set their display order.</p>
      {Object.entries(sections).sort((a, b) => (a[1]?.order || 0) - (b[1]?.order || 0)).map(([key, s]) => (
        <div key={key} className="admin-card" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px'}}>
          <label className="admin-toggle">
            <input type="checkbox" checked={s.visible !== false} onChange={() => toggle(key)} />
            <span className="admin-toggle-slider"></span>
          </label>
          <span style={{flex:1,fontSize:'0.82rem',textTransform:'capitalize'}}>{key}</span>
          <label style={{fontSize:'0.72rem',color:'var(--text-muted)',display:'flex',alignItems:'center',gap:4}}>
            Order:
            <input type="number" value={s.order || 0} onChange={e => setOrder(key, e.target.value)}
              style={{width:48,padding:'2px 4px',fontSize:'0.8rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)'}} />
          </label>
        </div>
      ))}
    </div>
  )
}

function ThemeForm({ data, onSave }) {
  const [theme, setTheme] = useState(data.settings?.theme || {})
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const timer = setTimeout(() => {
      const newSettings = { ...data.settings, theme }
      onSave({ ...data, settings: newSettings }, 'Theme')
      applyTheme(theme)
    }, 400)
    return () => clearTimeout(timer)
  }, [theme])

  const set = (key, val) => setTheme(prev => ({ ...prev, [key]: val }))

  const labels = {
    accent: 'Accent Color',
    accent2: 'Secondary Accent',
    bg: 'Background',
    bgAlt: 'Card Background',
    text: 'Text Color',
    textSecondary: 'Secondary Text',
    textDim: 'Dim Text',
    textMuted: 'Muted Text',
    border: 'Border Color',
  }

  return (
    <div>
      <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:12}}>Customize the website colors. Changes apply immediately.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="admin-field" style={{margin:0}}>
            <label>{label}</label>
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <input type="color" value={theme[key] || '#000'} onChange={e => set(key, e.target.value)}
                style={{width:36,height:36,padding:0,border:'1px solid var(--border)',borderRadius:4,cursor:'pointer',background:'none'}} />
              <input value={theme[key] || ''} onChange={e => set(key, e.target.value)}
                style={{flex:1,padding:'6px 8px',fontSize:'0.78rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)',fontFamily:'monospace'}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ToolsForm({ data, onSave }) {
  const settings = data.settings || {}
  const tools = settings.tools || {}
  const [d, setD] = useState(tools)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const timer = setTimeout(() => {
      onSave({ ...data, settings: { ...settings, tools: d } }, 'Tools')
    }, 500)
    return () => clearTimeout(timer)
  }, [d])

  const set = (key, val) => setD(prev => ({ ...prev, [key]: val }))
  const updateSocial = (i, field, val) => setD(prev => {
    const links = [...(prev.socialLinks || [])]; links[i] = { ...links[i], [field]: val }; return { ...prev, socialLinks: links }
  })
  const addSocial = () => setD(prev => ({ ...prev, socialLinks: [...(prev.socialLinks || []), { label: '', url: '', icon: 'fas fa-link' }] }))
  const removeSocial = (i) => setD(prev => ({ ...prev, socialLinks: (prev.socialLinks || []).filter((_, idx) => idx !== i) }))
  const updateHours = (i, field, val) => setD(prev => {
    const hours = [...(prev.businessHours || [])]; hours[i] = { ...hours[i], [field]: val }; return { ...prev, businessHours: hours }
  })
  const addHour = () => setD(prev => ({ ...prev, businessHours: [...(prev.businessHours || []), { day: '', hours: '' }] }))
  const removeHour = (i) => setD(prev => ({ ...prev, businessHours: (prev.businessHours || []).filter((_, idx) => idx !== i) }))

  return (
    <div>
      <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:12}}>Configure analytics, chat, SEO, and site-wide tools.</p>

      <div className="admin-card">
        <strong style={{fontSize:'0.82rem'}}>Analytics & Tracking</strong>
        <Input label="Google Analytics ID (e.g. G-XXXXXXX)" value={d.googleAnalyticsId || ''} onChange={v => set('googleAnalyticsId', v)} />
        <Input label="Facebook Pixel ID (e.g. 1234567890)" value={d.facebookPixelId || ''} onChange={v => set('facebookPixelId', v)} />
        <Input label="Google Search Console Meta Tag" value={d.searchConsoleMeta || ''} onChange={v => set('searchConsoleMeta', v)} multiline />
      </div>

      <div className="admin-card">
        <strong style={{fontSize:'0.82rem'}}>Live Chat & Booking</strong>
        <Input label="Live Chat Embed Code (Tawk.to / Crisp HTML)" value={d.chatCode || ''} onChange={v => set('chatCode', v)} multiline />
        <Input label="Calendly Link (e.g. https://calendly.com/...)" value={d.calendlyLink || ''} onChange={v => set('calendlyLink', v)} />
      </div>

      <div className="admin-card">
        <strong style={{fontSize:'0.82rem'}}>SEO & Performance</strong>
        <Input label="Font Family (e.g. Inter, Poppins, Roboto)" value={d.fontFamily || 'Inter'} onChange={v => set('fontFamily', v)} />
        <Input label="Image CDN URL (optional, e.g. https://cdn.example.com/)" value={d.imageCdn || ''} onChange={v => set('imageCdn', v)} />
        <div className="admin-subsection">
          <strong>Toggles</strong>
          {['newsletterEnabled','cookieConsentEnabled','pwaEnabled','rssEnabled'].map(key => (
            <div key={key} className="admin-toggle-label">
              <span>{key.replace(/Enabled$/, '').replace(/([A-Z])/g, ' $1').trim()}</span>
              <label className="admin-toggle">
                <input type="checkbox" checked={!!d[key]} onChange={() => set(key, !d[key])} />
                <span className="admin-toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <strong style={{fontSize:'0.82rem'}}>Social Links</strong>
        {(d.socialLinks || []).map((link, i) => (
          <div key={i} className="admin-inline-row">
            <input value={link.label} placeholder="Label" onChange={e => updateSocial(i, 'label', e.target.value)} style={{flex:1}} />
            <input value={link.url} placeholder="URL" onChange={e => updateSocial(i, 'url', e.target.value)} style={{flex:2}} />
            <input value={link.icon} placeholder="Icon class" onChange={e => updateSocial(i, 'icon', e.target.value)} style={{flex:1}} />
            <button className="admin-del-btn-sm" onClick={() => removeSocial(i)}>&times;</button>
          </div>
        ))}
        <button className="admin-add-small" onClick={addSocial}>+ Add Social Link</button>
      </div>

      <div className="admin-card">
        <strong style={{fontSize:'0.82rem'}}>Business Hours</strong>
        {(d.businessHours || []).map((h, i) => (
          <div key={i} className="admin-inline-row">
            <input value={h.day} placeholder="Day" onChange={e => updateHours(i, 'day', e.target.value)} style={{flex:1}} />
            <input value={h.hours} placeholder="Hours" onChange={e => updateHours(i, 'hours', e.target.value)} style={{flex:1}} />
            <button className="admin-del-btn-sm" onClick={() => removeHour(i)}>&times;</button>
          </div>
        ))}
        <button className="admin-add-small" onClick={addHour}>+ Add Hours</button>
      </div>
    </div>
  )
}

function ImagesForm({ data, onSave }) {
  const [images, setImages] = useState(data.settings?.images || [])
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const timer = setTimeout(() => {
      const newSettings = { ...data.settings, images }
      onSave({ ...data, settings: newSettings }, 'Images')
    }, 400)
    return () => clearTimeout(timer)
  }, [images])

  const [newUrl, setNewUrl] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newCat, setNewCat] = useState('general')

  const addImage = () => {
    if (!newUrl.trim()) return
    setImages(prev => [...prev, { id: Date.now(), url: newUrl.trim(), label: newLabel.trim() || 'Untitled', category: newCat }])
    setNewUrl(''); setNewLabel('')
  }

  const removeImage = (id) => {
    if (confirm('Remove this image from the database?')) setImages(prev => prev.filter(img => img.id !== id))
  }

  const cats = [...new Set(images.map(i => i.category))]
  const [filterCat, setFilterCat] = useState('all')

  const filtered = filterCat === 'all' ? images : images.filter(i => i.category === filterCat)

  return (
    <div>
      <div className="admin-card" style={{marginBottom:16}}>
        <strong style={{fontSize:'0.82rem'}}>Add Image URL</strong>
        <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label / name" style={{padding:'6px 8px',fontSize:'0.82rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)'}} />
          <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Image URL" style={{padding:'6px 8px',fontSize:'0.82rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)',fontFamily:'monospace'}} />
          <div style={{display:'flex',gap:6}}>
            <select value={newCat} onChange={e => setNewCat(e.target.value)} style={{flex:1,padding:'6px',fontSize:'0.78rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)'}}>
              <option value="general">General</option>
              <option value="logos">Logos</option>
              <option value="backgrounds">Backgrounds</option>
              <option value="icons">Icons</option>
            </select>
            <button className="admin-add-small" onClick={addImage}>Add</button>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
          <button className={`admin-tab-sm ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>All ({images.length})</button>
          {cats.map(c => (
            <button key={c} className={`admin-tab-sm ${filterCat === c ? 'active' : ''}`} onClick={() => setFilterCat(c)}>{c} ({images.filter(i => i.category === c).length})</button>
          ))}
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:8}}>
        {filtered.map(img => (
          <div key={img.id} className="admin-img-card">
            <img src={img.url} alt={img.label} onError={e => e.target.style.display='none'} />
            <div className="admin-img-info">
              <span className="admin-img-label">{img.label}</span>
              <span className="admin-img-cat">{img.category}</span>
            </div>
            <button className="admin-img-del" onClick={() => removeImage(img.id)} title="Remove">&times;</button>
          </div>
        ))}
        {images.length === 0 && <p style={{fontSize:'0.78rem',color:'var(--text-muted)',gridColumn:'1/-1',textAlign:'center',padding:40}}>No images yet. Add image URLs above.</p>}
      </div>
    </div>
  )
}
