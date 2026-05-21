import { motion } from 'framer-motion'
import { personalData, experience, education, skillCategories, certifications, projects, awards } from '../data/portfolioData'

function buildCV() {
  const d = personalData

  const skillsHtml = skillCategories.map(cat =>
    `<p class="cv-skills-cat"><strong>${cat.category}:</strong> ${cat.skills.join(', ')}</p>`
  ).join('')

  const certHtml = certifications.map(c =>
    `<span class="cv-cert">${c.title} — ${c.issuer} (${c.year})</span>`
  ).join('<span class="cv-sep"> | </span>')

  const expHtml = experience.map(e => `
    <div class="cv-block">
      <div class="cv-exp-header"><strong>${e.role}</strong> <span class="cv-meta">${e.company} | ${e.period}${e.location ? ` | ${e.location}` : ''}</span></div>
      <ul class="cv-exp-details">${e.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
    </div>
  `).join('')

  const eduHtml = education.map(e =>
    `<p class="cv-edu"><strong>${e.degree}</strong> — ${e.school} <span class="cv-meta">(${e.year})</span></p>`
  ).join('')

  const projHtml = projects.filter(p => p.featured).map(p =>
    `<p class="cv-proj"><strong>${p.title}</strong> — ${p.description}${p.tags?.length ? ` <span class="cv-meta">[${p.tags.join(', ')}]</span>` : ''}</p>`
  ).join('')

  const awardHtml = awards.map(a =>
    `<span class="cv-award">${a.title} — ${a.issuer} (${a.year})</span>`
  ).join('<span class="cv-sep"> | </span>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Mohammed Kamal Shaat - CV</title>
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
  .cv-skills-cat { margin: 1px 0; font-size: 9.5pt; }
  .cv-cert, .cv-award { font-size: 9.5pt; }
  .cv-sep { color: #aaa; font-size: 8pt; margin: 0 2px; }
  .cv-proj { margin: 2px 0; font-size: 9.5pt; }
</style>
</head>
<body>
  <h1>${d.firstName} ${d.lastName}</h1>
  <div class="cv-title">${d.title}</div>
  <div class="cv-contact">${d.phone} &bull; ${d.email} &bull; ${d.location} &bull; ${d.linkedin}</div>

  <h2>Summary</h2>
  <p style="font-size:9.5pt;line-height:1.3">${d.summary}</p>

  <h2>Experience</h2>
  ${expHtml}

  <h2>Education</h2>
  ${eduHtml}

  <h2>Skills</h2>
  ${skillsHtml}

  <h2>Certifications</h2>
  <p>${certHtml}</p>

  ${projHtml ? `<h2>Featured Projects</h2>${projHtml}` : ''}

  ${awardHtml ? `<h2>Awards</h2><p>${awardHtml}</p>` : ''}
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