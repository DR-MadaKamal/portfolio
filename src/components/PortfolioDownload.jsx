import { motion } from 'framer-motion'
import { personalData as defaultPersonal, experience as defaultExp, education as defaultEdu, skillCategories as defaultSkills, awards as defaultAwards } from '../data/portfolioData'

function esc(str) { if (!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }

function getData() {
  let saved = null
  try { saved = JSON.parse(localStorage.getItem('portfolio-admin-data') || 'null') } catch {}
  return {
    personalData: saved?.personalData ? { ...defaultPersonal, ...saved.personalData } : defaultPersonal,
    experience: saved?.experience || defaultExp,
    education: saved?.education || defaultEdu,
    skillCategories: saved?.skillCategories || defaultSkills,
    awards: saved?.awards || defaultAwards,
  }
}

function buildExpHTML(exp) {
  return exp.map(e => {
    const highlights = (e.highlights || []).map(h => `<li>${esc(h)}</li>`).join('\n')
    return `<div class="cv-block">
    <div class="cv-exp-header"><strong>${esc(e.role)}</strong> <span class="cv-meta">${esc(e.company)} | ${esc(e.period)} | ${esc(e.location)}</span></div>
    <ul class="cv-exp-details">${highlights}</ul>
  </div>`
  }).join('\n\n')
}

function buildSkillsHTML(cats) {
  return cats.map(c => {
    const skills = (c.skills || []).map(s => `<span>${esc(s)}</span>`).join('')
    return `<div class="cv-skills-col"><strong>${esc(c.category)}</strong>${skills}</div>`
  }).join('\n')
}

function buildAwardsHTML(awards) {
  return awards.map(a => `<li><span class="cv-cert">${esc(a.title)} — ${esc(a.issuer)} (${esc(a.year)})</span></li>`).join('\n')
}

function buildCV() {
  const d = getData()
  const p = d.personalData
  const edu = d.education[0] || {}
  const name = `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'CV'
  const contact = [p.location, p.phone, p.email, p.linkedin].filter(Boolean).join(' | ')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(name)} - CV</title>
<style>
  @page { margin: 0.4in 0.5in; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Arial', 'Helvetica', sans-serif; font-size: 10pt; color: #111; line-height: 1.2; }
  h1 { font-size: 15pt; margin-bottom: 1px; }
  .cv-title { font-size: 10pt; color: #444; margin-bottom: 2px; }
  .cv-contact { font-size: 9pt; color: #444; margin-bottom: 10px; }
  h2 { font-size: 11pt; border-bottom: 1px solid #333; padding-bottom: 1px; margin: 12px 0 4px; text-transform: uppercase; letter-spacing: 0.3px; }
  p { margin: 1px 0; }
  ul { margin: 1px 0 2px 16px; }
  li { margin-bottom: 0; }
  .cv-meta { color: #555; font-size: 9pt; }
  .cv-block { margin-bottom: 4px; }
  .cv-exp-header { display: flex; justify-content: space-between; }
  .cv-exp-details { margin-top: 1px; }
  .cv-exp-details li { font-size: 9.5pt; }
  .cv-edu { margin: 1px 0; }
  .cv-skills-grid { margin: 2px 0; }
  .cv-skills-col { margin: 3px 0; font-size: 9.5pt; }
  .cv-skills-col strong { font-size: 9.5pt; }
  .cv-skills-col span { display: inline; }
  .cv-skills-col span:after { content: ', '; }
  .cv-skills-col span:last-child:after { content: ''; }
  .cv-cert, .cv-award { font-size: 9.5pt; }
  .cv-sep { color: #aaa; font-size: 8pt; margin: 0 2px; }
</style>
</head>
<body>
  <h1>${esc(name)}</h1>
  <div class="cv-title">${esc(p.title)}</div>
  <div class="cv-contact">${esc(contact)}</div>

  <h2>Professional Summary</h2>
  <p style="font-size:9.5pt;line-height:1.3">${esc(p.summary)}</p>

  <h2>Education</h2>
  <p class="cv-edu"><strong>${esc(edu.degree)}</strong> — ${esc(edu.school)} (${esc(edu.location)}) <span class="cv-meta">(${esc(edu.year)})</span></p>
  ${edu.coursework ? `<p style="font-size:9pt;color:#555;margin:1px 0 6px 0;">Core coursework: ${edu.coursework.join(', ')}.</p>` : ''}

  <h2>Professional Experience</h2>
  ${buildExpHTML(d.experience)}

  <h2>Core Competencies &amp; Skills</h2>
  <div class="cv-skills-grid">
    ${buildSkillsHTML(d.skillCategories)}
  </div>

  <h2>Certifications &amp; Awards</h2>
  <ul>
    ${buildAwardsHTML(d.awards)}
  </ul>
</body>
</html>`
}

export default function PortfolioDownload() {
  const handleDownload = () => {
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(buildCV())
      w.document.close()
      w.focus()
      w.print()
    }
  }

  return (
    <section className="section download-section">
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: 12 }}>
            <i className="fas fa-file-pdf" style={{ color: 'var(--accent2)', marginRight: 8 }} />
            Download My CV
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20, maxWidth: 480, margin: '0 auto 20px' }}>
            Complete ATS-friendly CV with experience, education, skills, certifications, projects, and more.
          </p>
          <motion.button onClick={handleDownload} className="btn btn-solid"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <i className="fas fa-download" /> Download CV
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}