import { useState, useEffect, useCallback } from 'react'
import { personalData as defaultPersonal, experience as defaultExp, projects as defaultProjects, articles as defaultArticles, skillCategories as defaultSkills, education as defaultEdu, courses as defaultCourses, languages as defaultLangs } from '../data/portfolioData'

const STORAGE_KEY = 'portfolio-admin-data'
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

export default function AdminPanel({ onDataChange }) {
  const [visible, setVisible] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('personal')
  const [data, setData] = useState(null)
  const [msg, setMsg] = useState('')
  const [imageList, setImageList] = useState([])

  useEffect(() => {
    fetch('/portfolio/public/images-list.json')
      .then(r => r.json()).then(setImageList).catch(() => {})
    const saved = loadSaved()
    if (saved) setData(saved)
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

  const login = () => {
    if (password === PASSWORD) {
      setAuthed(true)
      setMsg('')
    } else {
      setMsg('Incorrect password')
    }
  }

  const save = useCallback((newData) => {
    setData(newData)
    saveToStorage(newData)
    if (onDataChange) onDataChange(newData)
    setMsg('Saved!')
    setTimeout(() => setMsg(''), 2000)
  }, [onDataChange])

  const reset = () => {
    if (confirm('Reset all edits to default?')) {
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

  const getDefaults = () => ({
    personalData: defaultPersonal,
    experience: defaultExp,
    projects: defaultProjects,
    articles: defaultArticles,
    skillCategories: defaultSkills,
    education: defaultEdu,
    courses: defaultCourses,
    languages: defaultLangs,
  })

  if (!visible) return null

  const current = data || getDefaults()

  return (
    <div className="admin-overlay" onClick={(e) => { if (e.target.className === 'admin-overlay') { setVisible(false); setAuthed(false) } }}>
      <div className="admin-panel">
        <button className="admin-close" onClick={() => { setVisible(false); setAuthed(false) }}>&times;</button>

        {!authed ? (
          <div className="admin-login">
            <h2>Admin Login</h2>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()} placeholder="Enter password" autoFocus />
            <button onClick={login}>Login</button>
            {msg && <p className="admin-msg">{msg}</p>}
          </div>
        ) : (
          <>
            <div className="admin-tabs">
              {['personal','experience','projects','articles'].map(t => (
                <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
              <button onClick={exportJSON}>Export</button>
              <button className="admin-reset" onClick={reset}>Reset</button>
              <span style={{marginLeft:12,fontSize:'0.75rem',color:'var(--accent)'}}>{msg}</span>
            </div>

            <div className="admin-content">
              {tab === 'personal' && <PersonalForm data={current} onSave={save} />}
              {tab === 'experience' && <ExperienceForm data={current} onSave={save} />}
              {tab === 'projects' && <ProjectsForm data={current} onSave={save} />}
              {tab === 'articles' && <ArticlesForm data={current} onSave={save} />}
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
  const save = () => onSave({ ...data, personalData: d })
  return (
    <div>
      <Input label="First Name" value={d.firstName} onChange={v => setD({...d, firstName: v})} />
      <Input label="Last Name" value={d.lastName} onChange={v => setD({...d, lastName: v})} />
      <Input label="Title" value={d.title} onChange={v => setD({...d, title: v})} />
      <Input label="Phone" value={d.phone} onChange={v => setD({...d, phone: v})} />
      <Input label="Email" value={d.email} onChange={v => setD({...d, email: v})} />
      <Input label="Location" value={d.location} onChange={v => setD({...d, location: v})} />
      <Input label="LinkedIn" value={d.linkedin} onChange={v => setD({...d, linkedin: v})} />
      <Input label="Tagline" value={d.tagline} onChange={v => setD({...d, tagline: v})} multiline />
      <Input label="Summary" value={d.summary} onChange={v => setD({...d, summary: v})} multiline />
      <button className="admin-save-btn" onClick={save}>Save Personal Info</button>
    </div>
  )
}

function ExperienceForm({ data, onSave }) {
  const [list, setList] = useState(data.experience)

  const update = (i, field, val) => {
    const copy = [...list]
    copy[i] = { ...copy[i], [field]: val }
    setList(copy)
  }

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const copy = [...list]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    setList(copy)
  }

  const add = () => {
    setList([...list, { role: 'New Role', company: 'Company', period: 'Date', location: '', highlights: [], links: [], media: [] }])
  }

  const remove = (i) => {
    if (confirm(`Delete "${list[i].role}"?`)) setList(list.filter((_, idx) => idx !== i))
  }

  const addHighlight = (i) => {
    const copy = [...list]
    copy[i] = { ...copy[i], highlights: [...(copy[i].highlights || []), ''] }
    setList(copy)
  }

  const updateHighlight = (i, j, v) => {
    const copy = [...list]
    const h = [...(copy[i].highlights || [])]
    h[j] = v
    copy[i] = { ...copy[i], highlights: h }
    setList(copy)
  }

  const removeHighlight = (i, j) => {
    const copy = [...list]
    copy[i] = { ...copy[i], highlights: (copy[i].highlights || []).filter((_, idx) => idx !== j) }
    setList(copy)
  }

  const addMedia = (i) => {
    const copy = [...list]
    copy[i] = { ...copy[i], media: [...(copy[i].media || []), { title: '', description: '', image: '' }] }
    setList(copy)
  }

  const updateMedia = (i, j, field, val) => {
    const copy = [...list]
    const m = [...(copy[i].media || [])]
    m[j] = { ...m[j], [field]: val }
    copy[i] = { ...copy[i], media: m }
    setList(copy)
  }

  const removeMedia = (i, j) => {
    const copy = [...list]
    copy[i] = { ...copy[i], media: (copy[i].media || []).filter((_, idx) => idx !== j) }
    setList(copy)
  }

  const addLink = (i) => {
    const copy = [...list]
    copy[i] = { ...copy[i], links: [...(copy[i].links || []), { label: '', url: '' }] }
    setList(copy)
  }

  const updateLink = (i, j, field, val) => {
    const copy = [...list]
    const l = [...(copy[i].links || [])]
    l[j] = { ...l[j], [field]: val }
    copy[i] = { ...copy[i], links: l }
    setList(copy)
  }

  const removeLink = (i, j) => {
    const copy = [...list]
    copy[i] = { ...copy[i], links: (copy[i].links || []).filter((_, idx) => idx !== j) }
    setList(copy)
  }

  return (
    <div>
      <div className="admin-actions-top">
        <button className="admin-add-btn" onClick={add}>+ Add Experience</button>
        <button className="admin-save-btn" onClick={() => onSave({...data, experience: list})}>Save All</button>
      </div>
      {list.map((exp, i) => (
        <div key={i} className="admin-card">
          <div className="admin-card-header">
            <span><strong>{exp.role}</strong> @ {exp.company}</span>
            <div className="admin-card-actions">
              <button onClick={() => move(i, -1)} disabled={i === 0}>&uarr;</button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1}>&darr;</button>
              <button className="admin-del-btn" onClick={() => remove(i)}>&times;</button>
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

  const update = (i, field, val) => {
    const copy = [...list]
    copy[i] = { ...copy[i], [field]: val }
    setList(copy)
  }

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const copy = [...list]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    setList(copy)
  }

  const add = () => setList([...list, { title: 'New Project', description: '', url: '', tags: [] }])
  const remove = (i) => { if (confirm(`Delete "${list[i].title}"?`)) setList(list.filter((_, idx) => idx !== i)) }

  const addTag = (i) => {
    const copy = [...list]
    copy[i] = { ...copy[i], tags: [...(copy[i].tags || []), ''] }
    setList(copy)
  }

  const updateTag = (i, j, v) => {
    const copy = [...list]
    const t = [...(copy[i].tags || [])]
    t[j] = v
    copy[i] = { ...copy[i], tags: t }
    setList(copy)
  }

  const removeTag = (i, j) => {
    const copy = [...list]
    copy[i] = { ...copy[i], tags: (copy[i].tags || []).filter((_, idx) => idx !== j) }
    setList(copy)
  }

  return (
    <div>
      <div className="admin-actions-top">
        <button className="admin-add-btn" onClick={add}>+ Add Project</button>
        <button className="admin-save-btn" onClick={() => onSave({...data, projects: list})}>Save All</button>
      </div>
      {list.map((p, i) => (
        <div key={i} className="admin-card">
          <div className="admin-card-header">
            <span><strong>{p.title}</strong></span>
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

  const update = (i, field, val) => {
    const copy = [...list]
    copy[i] = { ...copy[i], [field]: val }
    setList(copy)
  }

  const add = () => setList([...list, { title: 'New Article', description: '', url: '#', readTime: '5 min', date: new Date().toISOString().slice(0,10) }])
  const remove = (i) => { if (confirm(`Delete "${list[i].title}"?`)) setList(list.filter((_, idx) => idx !== i)) }

  return (
    <div>
      <div className="admin-actions-top">
        <button className="admin-add-btn" onClick={add}>+ Add Article</button>
        <button className="admin-save-btn" onClick={() => onSave({...data, articles: list})}>Save All</button>
      </div>
      {list.map((a, i) => (
        <div key={i} className="admin-card">
          <div className="admin-card-header">
            <span><strong>{a.title}</strong></span>
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
