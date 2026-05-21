import { motion } from 'framer-motion'
import { personalData, experience, education, skillCategories, certifications, projects, articles, testimonials, awards, courses } from '../data/portfolioData'

function buildCV() {
  const d = personalData
  const skillsHtml = skillCategories.map(cat => `
    <h3>${cat.category}</h3>
    <ul>${cat.skills.map(s => `<li>${s.name}</li>`).join('')}</ul>
  `).join('')

  const certHtml = certifications.map(c => `
    <p><strong>${c.title}</strong> — ${c.issuer} (${c.year})</p>
  `).join('')

  const expHtml = experience.map(e => `
    <div class="cv-block">
      <h3>${e.role}</h3>
      <p class="cv-meta">${e.company} | ${e.period}${e.location ? ` | ${e.location}` : ''}</p>
      <ul>${e.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
    </div>
  `).join('')

  const eduHtml = education.map(e => `
    <p><strong>${e.degree}</strong> — ${e.school} (${e.year})</p>
  `).join('')

  const projHtml = projects.filter(p => p.featured).map(p => `
    <div class="cv-block">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p class="cv-meta">${p.tags?.join(', ') || ''}${p.client ? ` | Client: ${p.client}` : ''}</p>
    </div>
  `).join('')

  const awardHtml = awards.map(a => `
    <p><strong>${a.title}</strong> — ${a.issuer} (${a.year})</p>
  `).join('')

  const articleHtml = articles.slice(0, 5).map(a => `
    <p><strong>${a.title}</strong> — ${a.date}</p>
  `).join('')

  const testHtml = testimonials.map(t => `
    <div class="cv-block">
      <p>"${t.text}"</p>
      <p class="cv-meta">— ${t.name}, ${t.role}</p>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Mohammed Kamal Shaat - CV</title>
<style>
  @page { margin: 0.7in 0.8in; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Arial', 'Helvetica', sans-serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.5; }
  h1 { font-size: 16pt; margin-bottom: 2px; }
  h2 { font-size: 12pt; border-bottom: 1.5px solid #333; padding-bottom: 3px; margin: 18px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  h3 { font-size: 10.5pt; margin: 6px 0 2px; }
  p { margin: 2px 0; }
  ul { margin: 2px 0 4px 18px; }
  li { margin-bottom: 1px; }
  .cv-meta { color: #555; font-size: 9.5pt; }
  .cv-contact { margin: 4px 0; font-size: 9.5pt; color: #444; }
  .cv-block { margin-bottom: 6px; }
  .cv-section { page-break-inside: avoid; }
  hr { border: none; border-top: 1px solid #ddd; margin: 14px 0; }
</style>
</head>
<body>
  <h1>${d.firstName} ${d.lastName}</h1>
  <p class="cv-meta">${d.title}</p>
  <p class="cv-contact">${d.phone} | ${d.email} | ${d.location} | ${d.linkedin}</p>
  <hr>
  <h2>Professional Summary</h2>
  <p>${d.summary}</p>
  <div class="cv-section"><h2>Experience</h2>${expHtml}</div>
  <div class="cv-section"><h2>Education</h2>${eduHtml}</div>
  <div class="cv-section"><h2>Skills & Expertise</h2>${skillsHtml}</div>
  <div class="cv-section"><h2>Licenses & Certifications</h2>${certHtml}</div>
  <div class="cv-section"><h2>Featured Projects</h2>${projHtml}</div>
  <div class="cv-section"><h2>Awards & Recognition</h2>${awardHtml}</div>
  <div class="cv-section"><h2>Publications</h2>${articleHtml}</div>
  <hr>
  <p class="cv-meta" style="text-align:center;">References available upon request</p>
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