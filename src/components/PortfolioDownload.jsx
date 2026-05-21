import { motion } from 'framer-motion'

function buildCV() {
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
  <h1>Mohammed Kamal Shaat</h1>
  <div class="cv-title">Pharmacist | Full-Stack Marketer | Brand Growth Architect</div>
  <div class="cv-contact">Cairo / Al-Faiyum, Egypt | +201009852109 | 16491@must.edu.eg | linkedin.com/in/mohammedkamal-shaat</div>

  <h2>Professional Summary</h2>
  <p style="font-size:9.5pt;line-height:1.3">Results-driven Pharmacy graduate and Full-Stack Marketing Professional with extensive experience in pharmaceutical operations, B2B/B2C sales management, and omnichannel marketing. Demonstrated success in managing pharmacy operations, optimizing sales-trend analysis, and executing high-conversion medical marketing campaigns for healthcare providers. Highly adept at bridging clinical knowledge with advanced digital marketing, CRM, and brand strategies to drive product visibility, engage Healthcare Professionals (HCPs), and maximize ROI by up to 35% in competitive markets.</p>

  <h2>Education</h2>
  <p class="cv-edu"><strong>Bachelor's Degree in Pharmacy</strong> — Misr University For Science And Technology (Al-Faiyum, Egypt) <span class="cv-meta">(09/2005 – 06/2026)</span></p>
  <p style="font-size:9pt;color:#555;margin:1px 0 6px 0;">Core coursework: Medicinal Chemistry, Pharmacology, Nephron Histology, and Clinical Pharmacy.</p>

  <h2>Professional Experience</h2>

  <div class="cv-block">
    <div class="cv-exp-header"><strong>Full Stack Marketing Manager</strong> <span class="cv-meta">Vape City E-liquid | 05/2024 – Present | Abbasiya, Cairo, Egypt</span></div>
    <ul class="cv-exp-details">
      <li>Spearhead full-stack marketing initiatives and brand strategy, managing strategic budgets across high-impact digital advertising channels to maximize ROI by 35%.</li>
      <li>Develop comprehensive product catalogs, technical descriptions, and targeted marketing content, boosting product visibility and B2C online engagement by over 40%.</li>
      <li style="list-style:none;margin-left:-16px;font-size:9pt;color:#555;"><strong>Key Brands &amp; Projects:</strong> Vape City E-liquid (E-commerce catalog &amp; brand assets), Vapsy E-liquid, Flavow Store, Mr-Vape.</li>
    </ul>
  </div>

  <div class="cv-block">
    <div class="cv-exp-header"><strong>Founder &amp; Lead Creative Director</strong> <span class="cv-meta">Mada Kamal (Creative Agency) | 01/2022 – Present | Remote / Freelance</span></div>
    <ul class="cv-exp-details">
      <li>Founded and manage a creative agency delivering premium branding, motion graphics, and full-stack marketing solutions for over 20+ international B2B and B2C clients.</li>
      <li>Executed product launch messaging, paid social campaigns, and UI/UX conversion improvements, achieving a 25% average increase in user conversion rates for diverse clients.</li>
      <li style="list-style:none;margin-left:-16px;font-size:9pt;color:#555;"><strong>Key Clients &amp; Projects:</strong> Adoni's Clinics, Breath Beauty Centers, Ghareeb Dentist, Swell Lake Strip Mall, Bluecastle Caffee (UAE), Elon's, Green Planet, B Way Agency, Klüger, MAJAL, Eagle Eye (إي إيجيل), MR Belal (الدينامو), Kazoza Mix, Mlabs-Shabab, Avalance Auto Repair (UAE), Toy's Station Nursery, H&amp;M Perfume's store (KSA), Samir Tito Barber.</li>
    </ul>
  </div>

  <div class="cv-block">
    <div class="cv-exp-header"><strong>Marketing Manager &amp; Motion Graphics Editor</strong> <span class="cv-meta">Trade Point | 01/2022 – Present | Al-Faiyum, Egypt</span></div>
    <ul class="cv-exp-details">
      <li>Manage and direct business teams, including sales and call center personnel, streamlining customer acquisition and improving client retention rates by 18%.</li>
      <li>Direct internal and external marketing programs, ensuring cohesive cross-platform messaging and producing polished multimedia content to differentiate the brand in a saturated market.</li>
      <li style="list-style:none;margin-left:-16px;font-size:9pt;color:#555;"><strong>Key Clients &amp; Projects:</strong> TradePoint, Majal, Nice Ads Agency, Instires, Al-Tayeb, Click &amp; Set.</li>
    </ul>
  </div>

  <div class="cv-block">
    <div class="cv-exp-header"><strong>Digital Marketing Manager</strong> <span class="cv-meta">Al-Tayeb Trading &amp; Supplies (Instires) | 07/2023 – 08/2024 | Al-Faiyum, Egypt</span></div>
    <ul class="cv-exp-details">
      <li>Led digital campaigns for the parent company and its major brand Instires, driving a 50% increase in social media engagement and generating over 5,000+ pre-launch leads.</li>
      <li>Cultivated strategic relationships with 15+ key influencers to significantly expand brand reach and market penetration.</li>
      <li style="list-style:none;margin-left:-16px;font-size:9pt;color:#555;"><strong>Key Brands &amp; Projects:</strong> Instires (انستايرز), Al-Tayeb.</li>
    </ul>
  </div>

  <div class="cv-block">
    <div class="cv-exp-header"><strong>Marketing Manager</strong> <span class="cv-meta">Aldoha Engineering | 06/2018 – 07/2023 | 6th of October City &amp; Al-Faiyum, Egypt</span></div>
    <ul class="cv-exp-details">
      <li>Led comprehensive marketing strategies over 5 years, establishing a strong regional footprint and increasing qualified leads by 45%.</li>
      <li>Optimized digital advertising budgets and delivered detailed visual performance reports, reducing cost-per-acquisition (CPA) by 20% for internal stakeholders.</li>
      <li style="list-style:none;margin-left:-16px;font-size:9pt;color:#555;"><strong>Key Clients &amp; Projects:</strong> Aldoha Engineering, Summit View Real Estate, The Groove Strip Mall.</li>
    </ul>
  </div>

  <div class="cv-block">
    <div class="cv-exp-header"><strong>Pharmacy Operations Supervisor</strong> <span class="cv-meta">Dr. Hamada Hamdi El-Gendy Pharmacy | 04/2015 – 11/2018 | Abswai, Al-Faiyum, Egypt</span></div>
    <ul class="cv-exp-details">
      <li>Managed daily pharmacy operations, procurement, and inventory, utilizing sales-trend analysis to maintain 95% inventory accuracy, prevent stockouts, and increase overall profitability by 15%.</li>
      <li>Provided expert patient counseling on Rx and OTC medications to 80+ patients daily, ensuring optimal therapeutic outcomes, drug safety, and excellent customer retention.</li>
      <li>Trained and mentored junior pharmacists and assistants while ensuring strict regulatory compliance.</li>
    </ul>
  </div>

  <div class="cv-block">
    <div class="cv-exp-header"><strong>Pharmacy Trainee (Senior &amp; Junior)</strong> <span class="cv-meta">Dr. Khalid Sayd Pharmacy &amp; Dr. Rasha Said Pharmacy | 04/2013 – 04/2015 | Al-Faiyum, Egypt</span></div>
    <ul class="cv-exp-details">
      <li>Gained foundational clinical experience in patient communication, healthcare facility operations, and pharmaceutical care.</li>
    </ul>
  </div>

  <h2>Core Competencies &amp; Skills</h2>
  <div class="cv-skills-grid">
    <div class="cv-skills-col"><strong>Medical Sales &amp; Marketing</strong><span>Healthcare Professional (HCP) Engagement</span><span>Medical Detailing</span><span>B2B/B2C Sales</span><span>Clinical Campaign Management</span><span>Omnichannel Marketing</span></div>
    <div class="cv-skills-col"><strong>Pharmacy &amp; Clinical Knowledge</strong><span>Pharmacology</span><span>Patient Counseling</span><span>Inventory &amp; Procurement</span><span>Prescription Analysis</span><span>Regulatory Compliance</span></div>
    <div class="cv-skills-col"><strong>Business Operations</strong><span>Customer Relationship Management (CRM)</span><span>Sales-Trend Analysis</span><span>Team Leadership</span><span>Budget Management</span></div>
    <div class="cv-skills-col"><strong>Digital &amp; Creative Tools</strong><span>Full-Stack Marketing</span><span>Entity-Based SEO</span><span>Motion Graphics (After Effects)</span><span>UI/UX Conversion</span><span>AI Prompts (Gemini)</span></div>
  </div>

  <h2>Certifications &amp; Awards</h2>
  <p><span class="cv-cert">Top Performer in Digital Marketing — Google Learning (2023)</span><span class="cv-sep"> | </span><span class="cv-cert">Advanced Digital Marketing Excellence — Udacity &amp; MCIT (2021)</span><span class="cv-sep"> | </span><span class="cv-cert">Customer Relationship Management (CRM) — HP LIFE</span><span class="cv-sep"> | </span><span class="cv-cert">The Art of Sales — HP LIFE</span><span class="cv-sep"> | </span><span class="cv-cert">Social Media Marketing Foundations — LinkedIn</span><span class="cv-sep"> | </span><span class="cv-cert">Skills for Passing Personal Interviews — Misr University for Science and Technology</span></p>
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