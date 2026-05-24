import { useState, useEffect, useCallback, useRef } from 'react'
import { personalData as defaultPersonal, experience as defaultExp, projects as defaultProjects, articles as defaultArticles, skillCategories as defaultSkills, education as defaultEdu, courses as defaultCourses, testimonials as defaultTestimonials, awards as defaultAwards, certifications as defaultCerts, clientLogos as defaultLogos, servicesTimeline as defaultTimeline, quotes as defaultQuotes, tools as defaultToolsData, faq as defaultFaq } from '../data/portfolioData'

const STORAGE_KEY = 'portfolio-admin-data'
const HISTORY_KEY = 'portfolio-admin-history'
const FORM_KEY = 'portfolio-contact-submissions'
const RECYCLE_KEY = 'portfolio-recycle-bin'
const MAX_HISTORY = 50
const PASSWORD = 'admin2026'

function loadSaved() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null }
  catch { return null }
}
function saveToStorage(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
function loadHistory() {
  try { const raw = localStorage.getItem(HISTORY_KEY); return raw ? JSON.parse(raw) : [] }
  catch { return [] }
}
function loadForms() {
  try { const raw = localStorage.getItem(FORM_KEY); return raw ? JSON.parse(raw) : [] }
  catch { return [] }
}
function loadRecycle() {
  try { const raw = localStorage.getItem(RECYCLE_KEY); return raw ? JSON.parse(raw) : [] }
  catch { return [] }
}
const VISITS_KEY = 'portfolio-visits'
const DAILY_KEY = 'portfolio-daily-visits'

const defaultSections = {
  hero: { visible: true, order: 0, bg: '', animation: 'fade', spacing: 'normal' },
  about: { visible: true, order: 1, bg: '', animation: 'fade', spacing: 'normal' },
  logos: { visible: true, order: 2, bg: '', animation: 'fade', spacing: 'compact' },
  projects: { visible: true, order: 3, bg: '', animation: 'fade', spacing: 'normal' },
  testimonials: { visible: true, order: 4, bg: '', animation: 'fade', spacing: 'normal' },
  achievements: { visible: true, order: 5, bg: '', animation: 'fade', spacing: 'normal' },
  process: { visible: true, order: 6, bg: '', animation: 'slide', spacing: 'normal' },
  quote: { visible: true, order: 7, bg: '', animation: 'fade', spacing: 'compact' },
  tools: { visible: true, order: 8, bg: '', animation: 'fade', spacing: 'normal' },
  faq: { visible: true, order: 9, bg: '', animation: 'fade', spacing: 'normal' },
  articles: { visible: true, order: 10, bg: '', animation: 'fade', spacing: 'normal' },
  'portfolio-download': { visible: true, order: 11, bg: '', animation: 'fade', spacing: 'compact' },
  contact: { visible: true, order: 12, bg: '', animation: 'fade', spacing: 'normal' },
  map: { visible: true, order: 13, bg: '', animation: 'fade', spacing: 'compact' },
  newsletter: { visible: true, order: 14, bg: '', animation: 'fade', spacing: 'compact' },
}

const defaultTheme = {
  accent: '#6cab96', accent2: '#e8a87c', bg: '#0f0f1a', bgAlt: '#1a1a2e', text: '#e0e0e0',
  textSecondary: '#a0a0b0', textDim: '#666', textMuted: '#888', border: '#2a2a3e',
}

const defaultTools = {
  googleAnalyticsId: 'G-8KGJ55VFQ2', facebookPixelId: '', searchConsoleMeta: '', chatCode: '', calendlyLink: '',
  newsletterEnabled: true, cookieConsentEnabled: true, pwaEnabled: true, rssEnabled: true,
  fontFamily: 'Inter', imageCdn: '', maintenanceMode: false, maintenanceMsg: 'Under maintenance — back soon!',
}

function getDefaults() {
  return {
    personalData: defaultPersonal, experience: defaultExp, projects: defaultProjects,
    articles: defaultArticles, skillCategories: defaultSkills, education: defaultEdu, courses: defaultCourses,
    testimonials: defaultTestimonials, awards: defaultAwards, certifications: defaultCerts,
    clientLogos: defaultLogos, servicesTimeline: defaultTimeline, quotes: defaultQuotes,
    tools: defaultToolsData, faq: defaultFaq,
    settings: { sections: JSON.parse(JSON.stringify(defaultSections)), theme: { ...defaultTheme }, images: [], tools: { ...defaultTools } },
    customSections: [], customPages: [], sectionDesign: {},
  }
}

function applyTheme(theme) {
  if (!theme) return
  const root = document.documentElement
  const map = { accent:'--accent', accent2:'--accent2', bg:'--bg', bgAlt:'--bg-alt', text:'--text', textSecondary:'--text-secondary', textDim:'--text-dim', textMuted:'--text-muted', border:'--border' }
  Object.entries(map).forEach(([key, cssVar]) => { if (theme[key]) root.style.setProperty(cssVar, theme[key]) })
}

export default function AdminPanel({ onDataChange }) {
  const [visible, setVisible] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('dashboard')
  const [data, setData] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [msg, setMsg] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    const saved = loadSaved()
    if (saved) { setData(saved); if (saved.settings?.theme) applyTheme(saved.settings.theme) }
    setHistory(loadHistory())
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.ctrlKey && e.shiftKey && e.key === 'Q') { e.preventDefault(); setVisible(true) } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const pushToHistory = useCallback((newData, label) => {
    const entry = { timestamp: Date.now(), label: label || 'Auto-save', data: JSON.parse(JSON.stringify(newData)) }
    setHistory(prev => { const updated = [entry, ...prev].slice(0, MAX_HISTORY); localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); return updated })
  }, [])

  const debouncedSave = useCallback((newData, label) => {
    setData(newData); saveToStorage(newData); if (onDataChange) onDataChange(newData)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => { pushToHistory(newData, label); setMsg('Auto-saved'); setTimeout(() => setMsg(''), 1500) }, 800)
  }, [onDataChange, pushToHistory])

  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current) } }, [])

  const restoreHistory = (entry) => {
    if (confirm(`Restore version from ${new Date(entry.timestamp).toLocaleString()}?`)) {
      setData(entry.data); saveToStorage(entry.data); if (onDataChange) onDataChange(entry.data)
      if (entry.data.settings?.theme) applyTheme(entry.data.settings.theme)
      setMsg('Restored'); setTimeout(() => setMsg(''), 2000)
    }
  }
  const clearHistory = () => { if (confirm('Delete all history?')) { setHistory([]); localStorage.removeItem(HISTORY_KEY) } }
  const login = () => { if (password === PASSWORD) { setAuthed(true); setMsg('') } else { setMsg('Incorrect password') } }
  const reset = () => {
    if (confirm('Reset ALL data to defaults? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY); setData(null); if (onDataChange) onDataChange(null); applyTheme(defaultTheme); setMsg('Reset to default')
    }
  }
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data || getDefaults(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'portfolio-backup.json'; a.click(); URL.revokeObjectURL(url)
  }
  const importJSON = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]; if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try { const imported = JSON.parse(ev.target.result); setData(imported); saveToStorage(imported); if (onDataChange) onDataChange(imported); setMsg('Imported!') } catch { setMsg('Invalid JSON file') }
      }; reader.readAsText(file)
    }; input.click()
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
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Enter password" autoFocus />
            <button onClick={login}>Login</button>
            {msg && <p className="admin-msg">{msg}</p>}
          </div>
        ) : showHistory ? (
          <>
            <div className="admin-tabs"><button onClick={() => setShowHistory(false)}>&larr; Back</button><span style={{flex:1}}></span><button className="admin-reset" onClick={clearHistory}>Clear History</button><span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{history.length} versions</span></div>
            <div className="admin-content">
              {history.length === 0 ? <p style={{textAlign:'center',color:'var(--text-muted)',padding:40}}>No history yet.</p> : history.map((entry, i) => (
                <div key={i} className="admin-history-item">
                  <div className="admin-history-info"><span className="admin-history-time">{new Date(entry.timestamp).toLocaleString()}</span><span className="admin-history-label">{entry.label}</span></div>
                  <button className="admin-restore-btn" onClick={() => restoreHistory(entry)}>Restore</button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="admin-tabs">
              {['dashboard','content','sections','design','pages','media','tools'].map(t => (
                <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
              <button onClick={() => setShowHistory(true)}>History ({history.length})</button>
              <button onClick={exportJSON}>Export</button>
              <button onClick={importJSON}>Import</button>
              <button className="admin-reset" onClick={reset}>Reset</button>
              <span style={{marginLeft:'auto',fontSize:'0.75rem',color:'var(--accent)'}}>{msg}</span>
            </div>
            <div className="admin-content">
              {tab === 'dashboard' && <DashboardForm data={current} />}
              {tab === 'content' && <ContentForm data={current} onSave={debouncedSave} />}
              {tab === 'sections' && <SectionsForm data={current} onSave={debouncedSave} />}
              {tab === 'design' && <DesignForm data={current} onSave={debouncedSave} />}
              {tab === 'pages' && <PagesForm data={current} onSave={debouncedSave} />}
              {tab === 'media' && <MediaForm data={current} onSave={debouncedSave} />}
              {tab === 'tools' && <ToolsForm data={current} onSave={debouncedSave} />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Input({ label, value, onChange, multiline, type }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {multiline ? <textarea rows={4} value={value || ''} onChange={e => onChange(e.target.value)} />
        : type === 'checkbox' ? <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
        : <input type={type || 'text'} value={value || ''} onChange={e => onChange(e.target.value)} />}
    </div>
  )
}

/* ========== DASHBOARD ========== */
function DashboardForm({ data }) {
  const [forms, setForms] = useState([])
  const visits = parseInt(localStorage.getItem(VISITS_KEY) || '0')
  const daily = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}')
  const dailyCount = Object.keys(daily).length
  useEffect(() => { setForms(loadForms()) }, [])

  const clearForms = () => { if (confirm('Delete all form submissions?')) { localStorage.removeItem(FORM_KEY); setForms([]) } }
  const exportForms = () => {
    const blob = new Blob([JSON.stringify(forms, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'contact-submissions.json'; a.click(); URL.revokeObjectURL(url)
  }
  const deleteForm = (id) => {
    const updated = forms.filter(f => f.id !== id)
    localStorage.setItem(FORM_KEY, JSON.stringify(updated)); setForms(updated)
  }

  const sectionCount = Object.keys(data.settings?.sections || {}).length
  const customSections = data.customSections?.length || 0
  const customPages = data.customPages?.length || 0
  const images = data.settings?.images?.length || 0

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12,marginBottom:20}}>
        {[
          { label: 'Total Visits', value: visits, icon: 'fa-eye' },
          { label: 'Active Days', value: dailyCount, icon: 'fa-calendar' },
          { label: 'Sections', value: sectionCount, icon: 'fa-layer-group' },
          { label: 'Custom Sections', value: customSections, icon: 'fa-plus-circle' },
          { label: 'Custom Pages', value: customPages, icon: 'fa-file' },
          { label: 'Images in DB', value: images, icon: 'fa-image' },
          { label: 'Form Submissions', value: forms.length, icon: 'fa-envelope' },
          { label: 'History Versions', value: JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').length, icon: 'fa-history' },
        ].map((s, i) => (
          <div key={i} className="admin-stat-card">
            <i className={`fas ${s.icon}`} style={{color:'var(--accent)',fontSize:'1.2rem',marginBottom:6}} />
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <strong>Contact Form Submissions ({forms.length})</strong>
          <div style={{display:'flex',gap:6}}>
            {forms.length > 0 && <button className="admin-add-small" onClick={exportForms}>Export</button>}
            {forms.length > 0 && <button className="admin-add-small" style={{borderColor:'var(--accent2)',color:'var(--accent2)'}} onClick={clearForms}>Clear All</button>}
          </div>
        </div>
        {forms.length === 0 ? <p style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>No submissions yet.</p> : forms.slice(0, 20).map((f, i) => (
          <div key={f.id} className="admin-form-row">
            <div style={{flex:1}}>
              <strong style={{fontSize:'0.82rem'}}>{f.name}</strong> <span style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{f.email}</span>
              <p style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:2}}>{f.message?.slice(0, 120)}{f.message?.length > 120 ? '...' : ''}</p>
              <span style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>{new Date(f.timestamp).toLocaleString()}</span>
            </div>
            <button className="admin-del-btn-sm" onClick={() => deleteForm(f.id)}>&times;</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== CONTENT (consolidated) ========== */
function ContentForm({ data, onSave }) {
  const [contentTab, setContentTab] = useState('personal')
  return (
    <div>
      <div className="admin-sub-tabs">
          {['personal','experience','projects','articles','skills','education','courses','testimonials','awards','clients'].map(t => (
            <button key={t} className={`admin-tab-sm ${contentTab === t ? 'active' : ''}`} onClick={() => setContentTab(t)}>{t}</button>
          ))}
      </div>
      {contentTab === 'personal' && <PersonalForm data={data} onSave={onSave} />}
      {contentTab === 'experience' && <ExperienceForm data={data} onSave={onSave} />}
      {contentTab === 'projects' && <ProjectsForm data={data} onSave={onSave} />}
      {contentTab === 'articles' && <ArticlesForm data={data} onSave={onSave} />}
      {contentTab === 'skills' && <SkillsForm data={data} onSave={onSave} />}
      {contentTab === 'education' && <EducationForm data={data} onSave={onSave} />}
      {contentTab === 'courses' && <CoursesForm data={data} onSave={onSave} />}
      {contentTab === 'testimonials' && <TestimonialsForm data={data} onSave={onSave} />}
      {contentTab === 'awards' && <AwardsForm data={data} onSave={onSave} />}
      {contentTab === 'clients' && <ClientsForm data={data} onSave={onSave} />}
    </div>
  )
}

function PersonalForm({ data, onSave }) {
  const [d, setD] = useState({ ...defaultPersonal, ...data.personalData })
  const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const t = setTimeout(() => onSave({ ...data, personalData: d }, 'Personal'), 500); return () => clearTimeout(t) }, [d])
  const set = (k, v) => setD({ ...d, [k]: v })
  return (<div>
    <Input label="First Name" value={d.firstName} onChange={v => set('firstName', v)} />
    <Input label="Last Name" value={d.lastName} onChange={v => set('lastName', v)} />
    <Input label="Title" value={d.title} onChange={v => set('title', v)} />
    <Input label="Phone" value={d.phone} onChange={v => set('phone', v)} />
    <Input label="Email" value={d.email} onChange={v => set('email', v)} />
    <Input label="Location" value={d.location} onChange={v => set('location', v)} />
    <Input label="LinkedIn URL" value={d.linkedin} onChange={v => set('linkedin', v)} />
    <Input label="DOB" value={d.dob} onChange={v => set('dob', v)} />
    <Input label="Portfolio URL" value={d.portfolioUrl} onChange={v => set('portfolioUrl', v)} />
    <Input label="WhatsApp Number" value={d.whatsapp} onChange={v => set('whatsapp', v)} />
    <Input label="CV URL" value={d.cvUrl} onChange={v => set('cvUrl', v)} />
    <Input label="Tagline" value={d.tagline} onChange={v => set('tagline', v)} multiline />
    <div style={{fontSize:'0.72rem',color:'var(--text-dim)',margin:'4px 0'}}>— Hero section —</div>
    <Input label="Hero Summary" value={d.heroSummary || ''} onChange={v => set('heroSummary', v)} multiline />
    <div style={{fontSize:'0.72rem',color:'var(--text-dim)',margin:'4px 0'}}>— About section —</div>
    <Input label="About Summary" value={d.summary} onChange={v => set('summary', v)} multiline />
    <Input label="Available for work" value={d.available} type="checkbox" />
  </div>)
}

function ExperienceForm({ data, onSave }) {
  const [list, setList] = useState(data.experience)
  const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const t = setTimeout(() => onSave({ ...data, experience: list }, 'Experience'), 500); return () => clearTimeout(t) }, [list])
  const update = (i, f, v) => setList(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const move = (i, d) => setList(p => { const j = i + d; if (j < 0 || j >= p.length) return p; const c = [...p]; [c[i], c[j]] = [c[j], c[i]]; return c })
  const add = () => setList(p => [...p, { role: 'New Role', company: 'Company', period: '', highlights: [], links: [], media: [] }])
  const remove = (i) => { if (confirm('Delete?')) setList(p => p.filter((_, idx) => idx !== i)) }
  const dup = (i) => setList(p => { const c = [...p]; c.splice(i + 1, 0, { ...JSON.parse(JSON.stringify(p[i])) }); return c })
  const addH = (i) => setList(p => { const c = [...p]; c[i] = { ...c[i], highlights: [...(c[i].highlights || []), ''] }; return c })
  const updH = (i, j, v) => setList(p => { const c = [...p]; const h = [...(c[i].highlights || [])]; h[j] = v; c[i] = { ...c[i], highlights: h }; return c })
  const delH = (i, j) => setList(p => { const c = [...p]; c[i] = { ...c[i], highlights: (c[i].highlights || []).filter((_, idx) => idx !== j) }; return c })
  return (<div>
    {list.map((exp, i) => (<div key={i} className="admin-card">
      <div className="admin-card-header"><strong>{exp.role || 'New'}</strong><div className="admin-card-actions"><button onClick={() => move(i, -1)} disabled={i === 0}>&uarr;</button><button onClick={() => move(i, 1)} disabled={i === list.length - 1}>&darr;</button><button onClick={() => dup(i)} title="Duplicate">&#x1F4CB;</button><button className="admin-del-btn" onClick={() => remove(i)}>&times;</button></div></div>
      <Input label="Role" value={exp.role} onChange={v => update(i, 'role', v)} />
      <Input label="Company" value={exp.company} onChange={v => update(i, 'company', v)} />
      <Input label="Period" value={exp.period} onChange={v => update(i, 'period', v)} />
      <Input label="Location" value={exp.location} onChange={v => update(i, 'location', v)} />
      <Input label="Logo Path" value={exp.logo} onChange={v => update(i, 'logo', v)} />
      <details><summary style={{fontSize:'0.78rem',cursor:'pointer',color:'var(--text-muted)'}}>Highlights ({exp.highlights?.length || 0})</summary>
        {(exp.highlights || []).map((h, j) => (<div key={j} className="admin-inline-row"><input value={h} onChange={e => updH(i, j, e.target.value)} /><button className="admin-del-btn-sm" onClick={() => delH(i, j)}>&times;</button></div>))}
        <button className="admin-add-small" onClick={() => addH(i)}>+ Highlight</button>
      </details>
    </div>))}
    <button className="admin-add-btn" onClick={add}>+ Add Experience</button>
  </div>)
}

function ProjectsForm({ data, onSave }) {
  const [list, setList] = useState(data.projects)
  const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const t = setTimeout(() => onSave({ ...data, projects: list }, 'Projects'), 500); return () => clearTimeout(t) }, [list])
  const update = (i, f, v) => setList(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const move = (i, d) => setList(p => { const j = i + d; if (j < 0 || j >= p.length) return p; const c = [...p]; [c[i], c[j]] = [c[j], c[i]]; return c })
  const add = () => setList(p => [...p, { title: 'New Project', description: '', url: '', tags: [], challenge: '', solution: '', result: '', images: [] }])
  const remove = (i) => { if (confirm('Delete?')) setList(p => p.filter((_, idx) => idx !== i)) }
  const dup = (i) => setList(p => { const c = [...p]; c.splice(i + 1, 0, { ...JSON.parse(JSON.stringify(p[i])) }); return c })
  const addTag = (i) => setList(p => { const c = [...p]; c[i] = { ...c[i], tags: [...(c[i].tags || []), ''] }; return c })
  const updTag = (i, j, v) => setList(p => { const c = [...p]; const t = [...(c[i].tags || [])]; t[j] = v; c[i] = { ...c[i], tags: t }; return c })
  const delTag = (i, j) => setList(p => { const c = [...p]; c[i] = { ...c[i], tags: (c[i].tags || []).filter((_, idx) => idx !== j) }; return c })
  const addImg = (i) => setList(p => { const c = [...p]; c[i] = { ...c[i], images: [...(c[i].images || []), ''] }; return c })
  const updImg = (i, j, v) => setList(p => { const c = [...p]; const im = [...(c[i].images || [])]; im[j] = v; c[i] = { ...c[i], images: im }; return c })
  const delImg = (i, j) => setList(p => { const c = [...p]; c[i] = { ...c[i], images: (c[i].images || []).filter((_, idx) => idx !== j) }; return c })
  return (<div>
    {list.map((p, i) => (<div key={i} className="admin-card">
      <div className="admin-card-header"><strong>{p.title}</strong><div className="admin-card-actions"><button onClick={() => move(i, -1)} disabled={i === 0}>&uarr;</button><button onClick={() => move(i, 1)} disabled={i === list.length - 1}>&darr;</button><button onClick={() => dup(i)} title="Duplicate">&#x1F4CB;</button><button className="admin-del-btn" onClick={() => remove(i)}>&times;</button></div></div>
      <Input label="Title" value={p.title} onChange={v => update(i, 'title', v)} />
      <Input label="Description" value={p.description} onChange={v => update(i, 'description', v)} multiline />
      <Input label="URL" value={p.url} onChange={v => update(i, 'url', v)} />
      <Input label="Challenge" value={p.challenge} onChange={v => update(i, 'challenge', v)} multiline />
      <Input label="Solution" value={p.solution} onChange={v => update(i, 'solution', v)} multiline />
      <Input label="Result" value={p.result} onChange={v => update(i, 'result', v)} multiline />
      <details><summary style={{fontSize:'0.78rem',cursor:'pointer',color:'var(--text-muted)'}}>Tags ({p.tags?.length || 0})</summary>
        {(p.tags || []).map((t, j) => (<div key={j} className="admin-inline-row"><input value={t} onChange={e => updTag(i, j, e.target.value)} /><button className="admin-del-btn-sm" onClick={() => delTag(i, j)}>&times;</button></div>))}
        <button className="admin-add-small" onClick={() => addTag(i)}>+ Tag</button>
      </details>
      <details><summary style={{fontSize:'0.78rem',cursor:'pointer',color:'var(--text-muted)'}}>Screenshots ({p.images?.length || 0})</summary>
        {(p.images || []).map((im, j) => (<div key={j} className="admin-inline-row"><input value={im} placeholder="Image URL" onChange={e => updImg(i, j, e.target.value)} /><button className="admin-del-btn-sm" onClick={() => delImg(i, j)}>&times;</button></div>))}
        <button className="admin-add-small" onClick={() => addImg(i)}>+ Image</button>
      </details>
    </div>))}
    <button className="admin-add-btn" onClick={add}>+ Add Project</button>
  </div>)
}

function ArticlesForm({ data, onSave }) {
  const [list, setList] = useState(data.articles)
  const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const t = setTimeout(() => onSave({ ...data, articles: list }, 'Articles'), 500); return () => clearTimeout(t) }, [list])
  const update = (i, f, v) => setList(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const add = () => setList(p => [...p, { title: 'New Article', description: '', image: '', content: '', readTime: '5 min', date: new Date().toISOString().slice(0,10), tags: [], author: { name: 'Mohammed Kamal Shaat', avatar: '/portfolio/photo.png' } }])
  const remove = (i) => { if (confirm('Delete?')) setList(p => p.filter((_, idx) => idx !== i)) }
  const dup = (i) => setList(p => { const c = [...p]; c.splice(i + 1, 0, { ...JSON.parse(JSON.stringify(p[i])) }); return c })
  const addTag = (i) => setList(p => { const c = [...p]; c[i] = { ...c[i], tags: [...(c[i].tags || []), ''] }; return c })
  const updTag = (i, j, v) => setList(p => { const c = [...p]; const t = [...(c[i].tags || [])]; t[j] = v; c[i] = { ...c[i], tags: t }; return c })
  const delTag = (i, j) => setList(p => { const c = [...p]; c[i] = { ...c[i], tags: (c[i].tags || []).filter((_, idx) => idx !== j) }; return c })
  return (<div>
    {list.map((a, i) => (<div key={i} className="admin-card">
      <div className="admin-card-header"><strong>{a.title}</strong><div className="admin-card-actions"><button onClick={() => dup(i)} title="Duplicate">&#x1F4CB;</button><button className="admin-del-btn" onClick={() => remove(i)}>&times;</button></div></div>
      <Input label="Title" value={a.title} onChange={v => update(i, 'title', v)} />
      <Input label="Description" value={a.description} onChange={v => update(i, 'description', v)} multiline />
      <Input label="Image URL" value={a.image} onChange={v => update(i, 'image', v)} />
      <Input label="Content (Markdown)" value={a.content} onChange={v => update(i, 'content', v)} multiline />
      <Input label="Read Time (or 'auto')" value={a.readTime} onChange={v => update(i, 'readTime', v)} />
      <Input label="Date" value={a.date} onChange={v => update(i, 'date', v)} />
      <Input label="Author Name" value={a.author?.name || ''} onChange={v => update(i, 'author', { ...(a.author || {}), name: v })} />
      <Input label="Author Avatar URL" value={a.author?.avatar || ''} onChange={v => update(i, 'author', { ...(a.author || {}), avatar: v })} />
      <details><summary style={{fontSize:'0.78rem',cursor:'pointer',color:'var(--text-muted)'}}>Tags ({a.tags?.length || 0})</summary>
        {(a.tags || []).map((t, j) => (<div key={j} className="admin-inline-row"><input value={t} onChange={e => updTag(i, j, e.target.value)} /><button className="admin-del-btn-sm" onClick={() => delTag(i, j)}>&times;</button></div>))}
        <button className="admin-add-small" onClick={() => addTag(i)}>+ Tag</button>
      </details>
    </div>))}
    <button className="admin-add-btn" onClick={add}>+ Add Article</button>
  </div>)
}

function SkillsForm({ data, onSave }) {
  const [list, setList] = useState(data.skillCategories)
  const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const t = setTimeout(() => onSave({ ...data, skillCategories: list }, 'Skills'), 500); return () => clearTimeout(t) }, [list])
  const updateCat = (i, v) => setList(p => { const c = [...p]; c[i] = { ...c[i], category: v }; return c })
  const addCat = () => setList(p => [...p, { category: 'New Category', skills: [{ name: 'Skill', percentage: 80 }] }])
  const delCat = (i) => setList(p => p.filter((_, idx) => idx !== i))
  const addSkill = (ci) => setList(p => { const c = [...p]; c[ci] = { ...c[ci], skills: [...(c[ci].skills || []), { name: '', percentage: 50 }] }; return c })
  const updSkill = (ci, si, f, v) => setList(p => { const c = [...p]; const s = [...(c[ci].skills || [])]; s[si] = { ...s[si], [f]: v }; c[ci] = { ...c[ci], skills: s }; return c })
  const delSkill = (ci, si) => setList(p => { const c = [...p]; c[ci] = { ...c[ci], skills: (c[ci].skills || []).filter((_, idx) => idx !== si) }; return c })
  return (<div>
    {list.map((cat, ci) => (<div key={ci} className="admin-card">
      <div className="admin-card-header"><Input label="Category" value={cat.category} onChange={v => updateCat(ci, v)} /><button className="admin-del-btn" onClick={() => delCat(ci)}>&times;</button></div>
      {cat.skills.map((s, si) => (<div key={si} className="admin-inline-row">
        <input value={s.name} placeholder="Skill name" onChange={e => updSkill(ci, si, 'name', e.target.value)} style={{flex:2}} />
        <input value={s.percentage} type="number" min={0} max={100} onChange={e => updSkill(ci, si, 'percentage', parseInt(e.target.value) || 0)} style={{flex:1}} />
        <button className="admin-del-btn-sm" onClick={() => delSkill(ci, si)}>&times;</button>
      </div>))}
      <button className="admin-add-small" onClick={() => addSkill(ci)}>+ Skill</button>
    </div>))}
    <button className="admin-add-btn" onClick={addCat}>+ Add Category</button>
  </div>)
}

function EducationForm({ data, onSave }) {
  const [list, setList] = useState(data.education)
  const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const t = setTimeout(() => onSave({ ...data, education: list }, 'Education'), 500); return () => clearTimeout(t) }, [list])
  const update = (i, f, v) => setList(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const add = () => setList(p => [...p, { degree: 'Degree', school: 'School', year: 'Year' }])
  const remove = (i) => setList(p => p.filter((_, idx) => idx !== i))
  return (<div>{list.map((e, i) => (<div key={i} className="admin-card"><div className="admin-card-header"><strong>{e.degree}</strong><button className="admin-del-btn" onClick={() => remove(i)}>&times;</button></div><Input label="Degree" value={e.degree} onChange={v => update(i, 'degree', v)} /><Input label="School" value={e.school} onChange={v => update(i, 'school', v)} /><Input label="Year" value={e.year} onChange={v => update(i, 'year', v)} /></div>))}<button className="admin-add-btn" onClick={add}>+ Add Education</button></div>)
}

function CoursesForm({ data, onSave }) {
  const [list, setList] = useState(data.courses || [])
  const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const t = setTimeout(() => onSave({ ...data, courses: list }, 'Courses'), 500); return () => clearTimeout(t) }, [list])
  const update = (i, f, v) => setList(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const add = () => setList(p => [...p, { name: 'Course', provider: 'Provider', year: '' }])
  const remove = (i) => setList(p => p.filter((_, idx) => idx !== i))
  return (<div>{list.map((c, i) => (<div key={i} className="admin-card"><div className="admin-card-header"><strong>{c.name}</strong><button className="admin-del-btn" onClick={() => remove(i)}>&times;</button></div><Input label="Name" value={c.name} onChange={v => update(i, 'name', v)} /><Input label="Provider" value={c.provider} onChange={v => update(i, 'provider', v)} /><Input label="Year" value={c.year} onChange={v => update(i, 'year', v)} /></div>))}<button className="admin-add-btn" onClick={add}>+ Add Course</button></div>)
}

function TestimonialsForm({ data, onSave }) {
  const [list, setList] = useState(data.testimonials || [])
  const r = useRef(true)
  useEffect(() => {
    if (r.current) { r.current = false; return }
    // save to settings.testimonials for persistence
    const s = data.settings || {}
    const timer = setTimeout(() => onSave({ ...data, testimonials: list, settings: { ...s, testimonialData: list } }, 'Testimonials'), 500)
    return () => clearTimeout(timer)
  }, [list])
  const update = (i, f, v) => setList(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const add = () => setList(p => [...p, { name: 'Name', role: 'Role', text: 'Review text', rating: 5 }])
  const remove = (i) => setList(p => p.filter((_, idx) => idx !== i))
  return (<div>{list.map((t, i) => (<div key={i} className="admin-card"><div className="admin-card-header"><strong>{t.name}</strong><button className="admin-del-btn" onClick={() => remove(i)}>&times;</button></div><Input label="Name" value={t.name} onChange={v => update(i, 'name', v)} /><Input label="Role" value={t.role} onChange={v => update(i, 'role', v)} /><Input label="Text" value={t.text} onChange={v => update(i, 'text', v)} multiline /><Input label="Rating (1-5)" value={t.rating} type="number" onChange={v => update(i, 'rating', parseInt(v) || 5)} /></div>))}<button className="admin-add-btn" onClick={add}>+ Add Testimonial</button></div>)
}

function AwardsForm({ data, onSave }) {
  const [list, setList] = useState(data.awards || [])
  const r = useRef(true)
  useEffect(() => {
    if (r.current) { r.current = false; return }
    const timer = setTimeout(() => onSave({ ...data, awards: list }, 'Awards'), 500)
    return () => clearTimeout(timer)
  }, [list])
  const update = (i, f, v) => setList(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const add = () => setList(p => [...p, { title: 'Award', issuer: 'Issuer', year: '', icon: 'fa-trophy' }])
  const remove = (i) => setList(p => p.filter((_, idx) => idx !== i))
  return (<div>{list.map((a, i) => (<div key={i} className="admin-card"><div className="admin-card-header"><strong>{a.title}</strong><button className="admin-del-btn" onClick={() => remove(i)}>&times;</button></div><Input label="Title" value={a.title} onChange={v => update(i, 'title', v)} /><Input label="Issuer" value={a.issuer} onChange={v => update(i, 'issuer', v)} /><Input label="Year" value={a.year} onChange={v => update(i, 'year', v)} /><Input label="Icon Class" value={a.icon} onChange={v => update(i, 'icon', v)} /></div>))}<button className="admin-add-btn" onClick={add}>+ Add Award</button></div>)
}

function ClientsForm({ data, onSave }) {
  const [list, setList] = useState(data.clientLogos || [])
  const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const timer = setTimeout(() => onSave({ ...data, clientLogos: list }, 'Clients'), 500); return () => clearTimeout(timer) }, [list])
  const update = (i, f, v) => setList(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const move = (i, d) => setList(p => { const j = i + d; if (j < 0 || j >= p.length) return p; const c = [...p]; [c[i], c[j]] = [c[j], c[i]]; return c })
  const add = () => setList(p => [...p, { src: '/portfolio/images/logos/new-logo.png', name: 'New Client', link: '' }])
  const remove = (i) => { if (confirm('Delete this client?')) setList(p => p.filter((_, idx) => idx !== i)) }
  return (<div>
    <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:12}}>Manage client logos. Add their logo image URL, display name, and an optional work link (Google Drive, OneDrive, etc.).</p>
    {list.map((c, i) => (<div key={i} className="admin-card">
      <div className="admin-card-header"><strong>{c.name || 'Client'}</strong><div className="admin-card-actions"><button onClick={() => move(i, -1)} disabled={i === 0}>&uarr;</button><button onClick={() => move(i, 1)} disabled={i === list.length - 1}>&darr;</button><button className="admin-del-btn" onClick={() => remove(i)}>&times;</button></div></div>
      <Input label="Company Name" value={c.name} onChange={v => update(i, 'name', v)} />
      <Input label="Logo Image URL" value={c.src} onChange={v => update(i, 'src', v)} />
      <Input label="Work Link (Google Drive / OneDrive)" value={c.link || ''} onChange={v => update(i, 'link', v)} />
    </div>))}
    <button className="admin-add-btn" onClick={add}>+ Add Client</button>
  </div>)
}

/* ========== SECTIONS (visibility + custom sections) ========== */
function SectionsForm({ data, onSave }) {
  const [sections, setSections] = useState(data.settings?.sections || {})
  const [customSections, setCustomSections] = useState(data.customSections || [])
  const r = useRef(true)
  useEffect(() => {
    if (r.current) { r.current = false; return }
    const timer = setTimeout(() => onSave({ ...data, settings: { ...data.settings, sections }, customSections }, 'Sections'), 400)
    return () => clearTimeout(timer)
  }, [sections, customSections])

  const toggle = (key) => setSections(p => ({ ...p, [key]: { ...p[key], visible: !p[key]?.visible } }))
  const setOrder = (key, val) => setSections(p => ({ ...p, [key]: { ...p[key], order: parseInt(val) || 0 } }))

  const csAdd = () => setCustomSections(p => [...p, { id: Date.now(), title: 'New Section', content: '', icon: 'fa-star', bg: '', layout: 'full' }])
  const csUpd = (i, f, v) => setCustomSections(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const csDel = (i) => { if (confirm('Delete this custom section?')) setCustomSections(p => p.filter((_, idx) => idx !== i)) }
  const csMove = (i, d) => setCustomSections(p => { const j = i + d; if (j < 0 || j >= p.length) return p; const c = [...p]; [c[i], c[j]] = [c[j], c[i]]; return c })

  return (
    <div>
      <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:12}}>Toggle sections on/off, set order, or create custom sections.</p>
      <div className="admin-sub-tabs" style={{marginBottom:12}}>
        <span style={{fontSize:'0.82rem',fontWeight:600}}>Built-in Sections</span>
      </div>
      {Object.entries(sections).sort((a, b) => (a[1]?.order || 0) - (b[1]?.order || 0)).map(([key, s]) => (
        <div key={key} className="admin-card" style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px'}}>
          <label className="admin-toggle"><input type="checkbox" checked={s.visible !== false} onChange={() => toggle(key)} /><span className="admin-toggle-slider"></span></label>
          <span style={{flex:1,fontSize:'0.82rem',textTransform:'capitalize'}}>{key.replace(/-/g, ' ')}</span>
          <label style={{fontSize:'0.72rem',color:'var(--text-muted)',display:'flex',alignItems:'center',gap:4}}>Order: <input type="number" value={s.order || 0} onChange={e => setOrder(key, e.target.value)} style={{width:48,padding:'2px 4px',fontSize:'0.8rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)'}} /></label>
        </div>
      ))}
      <div className="admin-sub-tabs" style={{margin:'16px 0 8px'}}>
        <span style={{fontSize:'0.82rem',fontWeight:600}}>Custom Sections ({customSections.length})</span>
      </div>
      {customSections.map((cs, i) => (
        <div key={cs.id} className="admin-card">
          <div className="admin-card-header">
            <Input label="Section Title" value={cs.title} onChange={v => csUpd(i, 'title', v)} />
            <div className="admin-card-actions"><button onClick={() => csMove(i, -1)} disabled={i === 0}>&uarr;</button><button onClick={() => csMove(i, 1)} disabled={i === customSections.length - 1}>&darr;</button><button className="admin-del-btn" onClick={() => csDel(i)}>&times;</button></div>
          </div>
          <Input label="Content (HTML or text)" value={cs.content} onChange={v => csUpd(i, 'content', v)} multiline />
          <Input label="Icon (FontAwesome class)" value={cs.icon} onChange={v => csUpd(i, 'icon', v)} />
          <Input label="Background (color/gradient)" value={cs.bg} onChange={v => csUpd(i, 'bg', v)} />
          <select value={cs.layout} onChange={e => csUpd(i, 'layout', e.target.value)} style={{padding:'6px',fontSize:'0.82rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)',width:'100%',marginBottom:8}}>
            <option value="full">Full Width</option><option value="contained">Contained</option><option value="split">Split (2 col)</option>
          </select>
        </div>
      ))}
      <button className="admin-add-btn" onClick={csAdd}>+ Add Custom Section</button>
    </div>
  )
}

/* ========== DESIGN (per-section bg, animation, spacing) ========== */
function DesignForm({ data, onSave }) {
  const [theme, setTheme] = useState(data.settings?.theme || {})
  const [sectionDesign, setSectionDesign] = useState(data.sectionDesign || {})
  const r = useRef(true)
  useEffect(() => {
    if (r.current) { r.current = false; return }
    const timer = setTimeout(() => { onSave({ ...data, settings: { ...data.settings, theme }, sectionDesign }, 'Design'); applyTheme(theme) }, 400)
    return () => clearTimeout(timer)
  }, [theme, sectionDesign])

  const setThemeField = (key, val) => setTheme(p => ({ ...p, [key]: val }))
  const setSecDesign = (key, f, val) => setSectionDesign(p => ({ ...p, [key]: { ...(p[key] || {}), [f]: val } }))

  const labels = { accent: 'Accent', accent2: 'Secondary Accent', bg: 'Background', bgAlt: 'Card BG', text: 'Text', textSecondary: 'Secondary Text', textDim: 'Dim Text', textMuted: 'Muted Text', border: 'Border' }

  return (
    <div>
      <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:12}}>Customize colors and per-section design settings.</p>

      <div className="admin-card">
        <strong>Global Colors</strong>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:8}}>
          {Object.entries(labels).map(([key, label]) => (
            <div key={key} className="admin-field" style={{margin:0}}>
              <label>{label}</label>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <input type="color" value={theme[key] || '#000'} onChange={e => setThemeField(key, e.target.value)} style={{width:32,height:32,padding:0,border:'1px solid var(--border)',borderRadius:4,cursor:'pointer',background:'none'}} />
                <input value={theme[key] || ''} onChange={e => setThemeField(key, e.target.value)} style={{flex:1,padding:'4px 6px',fontSize:'0.75rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)',fontFamily:'monospace'}} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <strong>Per-Section Backgrounds</strong>
        <p style={{fontSize:'0.72rem',color:'var(--text-muted)',marginBottom:8}}>Set custom background colors, gradients, or image URLs for each section.</p>
        {Object.keys(data.settings?.sections || {}).map(key => (
          <div key={key} className="admin-inline-row">
            <span style={{fontSize:'0.72rem',textTransform:'capitalize',minWidth:100,color:'var(--text-muted)'}}>{key.replace(/-/g, ' ')}</span>
            <input value={sectionDesign[key]?.bg || ''} onChange={e => setSecDesign(key, 'bg', e.target.value)} placeholder="Background (color/gradient/url)" style={{fontSize:'0.72rem',fontFamily:'monospace'}} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== PAGES (custom pages) ========== */
function PagesForm({ data, onSave }) {
  const [pages, setPages] = useState(data.customPages || [])
  const r = useRef(true)
  useEffect(() => {
    if (r.current) { r.current = false; return }
    const timer = setTimeout(() => onSave({ ...data, customPages: pages }, 'Pages'), 400)
    return () => clearTimeout(timer)
  }, [pages])

  const add = () => setPages(p => [...p, { id: Date.now(), title: 'New Page', slug: 'new-page', content: '', enabled: true, metaTitle: '', metaDesc: '' }])
  const update = (i, f, v) => setPages(p => { const c = [...p]; c[i] = { ...c[i], [f]: v }; return c })
  const remove = (i) => { if (confirm('Delete this page?')) setPages(p => p.filter((_, idx) => idx !== i)) }
  const togglePage = (i) => setPages(p => { const c = [...p]; c[i] = { ...c[i], enabled: !c[i].enabled }; return c })

  return (
    <div>
      <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:12}}>Create custom pages with your own content.</p>
      {pages.map((p, i) => (
        <div key={p.id} className="admin-card">
          <div className="admin-card-header">
            <Input label="Page Title" value={p.title} onChange={v => update(i, 'title', v)} />
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <label className="admin-toggle"><input type="checkbox" checked={p.enabled !== false} onChange={() => togglePage(i)} /><span className="admin-toggle-slider"></span></label>
              <button className="admin-del-btn" onClick={() => remove(i)}>&times;</button>
            </div>
          </div>
          <Input label="URL Slug (e.g. about-me)" value={p.slug} onChange={v => update(i, 'slug', v)} />
          <Input label="Meta Title (SEO)" value={p.metaTitle} onChange={v => update(i, 'metaTitle', v)} />
          <Input label="Meta Description" value={p.metaDesc} onChange={v => update(i, 'metaDesc', v)} multiline />
          <Input label="Content (HTML or text)" value={p.content} onChange={v => update(i, 'content', v)} multiline />
        </div>
      ))}
      <button className="admin-add-btn" onClick={add}>+ Add Page</button>
    </div>
  )
}

/* ========== MEDIA ========== */
function MediaForm({ data, onSave }) {
  const [images, setImages] = useState(data.settings?.images || [])
  const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const timer = setTimeout(() => { onSave({ ...data, settings: { ...data.settings, images } }, 'Media') }, 400); return () => clearTimeout(timer) }, [images])
  const [newUrl, setNewUrl] = useState(''); const [newLabel, setNewLabel] = useState(''); const [newCat, setNewCat] = useState('general')
  const add = () => { if (!newUrl.trim()) return; setImages(p => [...p, { id: Date.now(), url: newUrl.trim(), label: newLabel.trim() || 'Untitled', category: newCat }]); setNewUrl(''); setNewLabel('') }
  const remove = (id) => { if (confirm('Remove?')) setImages(p => p.filter(img => img.id !== id)) }
  const cats = [...new Set(images.map(i => i.category))]; const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? images : images.filter(i => i.category === filter)
  return (<div>
    <div className="admin-card" style={{marginBottom:12}}>
      <strong>Add Image URL</strong>
      <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label" style={{padding:'6px 8px',fontSize:'0.82rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)'}} />
        <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Image URL" style={{padding:'6px 8px',fontSize:'0.82rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)',fontFamily:'monospace'}} />
        <div style={{display:'flex',gap:6}}>
          <select value={newCat} onChange={e => setNewCat(e.target.value)} style={{flex:1,padding:'6px',fontSize:'0.78rem',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:4,color:'var(--text)'}}><option value="general">General</option><option value="logos">Logos</option><option value="backgrounds">Backgrounds</option><option value="icons">Icons</option><option value="projects">Projects</option></select>
          <button className="admin-add-small" onClick={add}>Add</button>
        </div>
      </div>
    </div>
    {images.length > 0 && <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
      <button className={`admin-tab-sm ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({images.length})</button>
      {cats.map(c => <button key={c} className={`admin-tab-sm ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c} ({images.filter(i => i.category === c).length})</button>)}
    </div>}
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:8}}>
      {filtered.map(img => (<div key={img.id} className="admin-img-card"><img src={img.url} alt={img.label} loading="lazy" onError={e => e.target.style.display='none'} /><div className="admin-img-info"><span className="admin-img-label">{img.label}</span><span className="admin-img-cat">{img.category}</span></div><button className="admin-img-del" onClick={() => remove(img.id)} title="Remove">&times;</button></div>))}
      {images.length === 0 && <p style={{fontSize:'0.78rem',color:'var(--text-muted)',gridColumn:'1/-1',textAlign:'center',padding:40}}>No images yet.</p>}
    </div>
  </div>)
}

/* ========== TOOLS ========== */
function ToolsForm({ data, onSave }) {
  const settings = data.settings || {}; const tools = settings.tools || {}
  const [d, setD] = useState(tools); const r = useRef(true)
  useEffect(() => { if (r.current) { r.current = false; return }; const timer = setTimeout(() => { onSave({ ...data, settings: { ...settings, tools: d } }, 'Tools') }, 500); return () => clearTimeout(timer) }, [d])
  const set = (k, v) => setD(p => ({ ...p, [k]: v }))

  return (<div>
    <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:12}}>Configure analytics, chat, SEO, and site-wide settings.</p>
    <div className="admin-card"><strong>Analytics & Tracking</strong><Input label="Google Analytics ID" value={d.googleAnalyticsId || ''} onChange={v => set('googleAnalyticsId', v)} /><Input label="Facebook Pixel ID" value={d.facebookPixelId || ''} onChange={v => set('facebookPixelId', v)} /><Input label="Search Console Meta Tag" value={d.searchConsoleMeta || ''} onChange={v => set('searchConsoleMeta', v)} multiline /></div>
    <div className="admin-card"><strong>Live Chat & Booking</strong><Input label="Chat Embed Code (HTML)" value={d.chatCode || ''} onChange={v => set('chatCode', v)} multiline /><Input label="Calendly Link" value={d.calendlyLink || ''} onChange={v => set('calendlyLink', v)} /></div>
    <div className="admin-card"><strong>SEO & Performance</strong><Input label="Font Family" value={d.fontFamily || 'Inter'} onChange={v => set('fontFamily', v)} /><Input label="Image CDN URL" value={d.imageCdn || ''} onChange={v => set('imageCdn', v)} /></div>
    <div className="admin-card"><strong>Maintenance Mode</strong><label className="admin-toggle-label"><span>Enable Maintenance Mode</span><label className="admin-toggle"><input type="checkbox" checked={!!d.maintenanceMode} onChange={() => set('maintenanceMode', !d.maintenanceMode)} /><span className="admin-toggle-slider"></span></label></label>{d.maintenanceMode && <Input label="Maintenance Message" value={d.maintenanceMsg} onChange={v => set('maintenanceMsg', v)} multiline />}</div>
    <div className="admin-card"><strong>Toggles</strong>{['newsletterEnabled','cookieConsentEnabled','pwaEnabled','rssEnabled'].map(key => (<div key={key} className="admin-toggle-label"><span>{key.replace(/Enabled$/, '').replace(/([A-Z])/g, ' $1').trim()}</span><label className="admin-toggle"><input type="checkbox" checked={!!d[key]} onChange={() => set(key, !d[key])} /><span className="admin-toggle-slider"></span></label></div>))}</div>
  </div>)
}
