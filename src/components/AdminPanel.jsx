import { useState, useEffect, useCallback, useRef } from 'react'
import { personalData as defaultPersonal, experience as defaultExp, projects as defaultProjects, articles as defaultArticles, skillCategories as defaultSkills, education as defaultEdu, courses as defaultCourses, languages as defaultLangs } from '../data/portfolioData'

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

function getDefaults() {
  return {
    personalData: defaultPersonal,
    experience: defaultExp,
    projects: defaultProjects,
    articles: defaultArticles,
    skillCategories: defaultSkills,
    education: defaultEdu,
    courses: defaultCourses,
    languages: defaultLangs,
  }
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
    if (saved) setData(saved)
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
      const defs = getDefaults()
      localStorage.removeItem(STORAGE_KEY)
      setData(null)
      if (onDataChange) onDataChange(null)
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
              {['personal','experience','projects','articles'].map(t => (
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

function autoSaveForm(DynamicComponent) {
  return function Wrapper(props) {
    const [localData, setLocalData] = useState(null)
    const firstRender = useRef(true)

    useEffect(() => {
      if (firstRender.current) {
        firstRender.current = false
        return
      }
      if (localData) {
        props.onSave(localData, window._lastEditLabel || 'Edited')
      }
    }, [localData])

    const handleSave = (newData, label) => {
      window._lastEditLabel = label
      setLocalData(newData)
    }

    return <DynamicComponent {...props} onSave={handleSave} />
  }
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

  const add = () => setList(prev => [...prev, { title: 'New Article', description: '', url: '#', readTime: '5 min', date: new Date().toISOString().slice(0,10) }])
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
          <Input label="URL" value={a.url} onChange={v => update(i, 'url', v)} />
          <Input label="Read Time" value={a.readTime} onChange={v => update(i, 'readTime', v)} />
          <Input label="Date" value={a.date} onChange={v => update(i, 'date', v)} />
        </div>
      ))}
    </div>
  )
}
