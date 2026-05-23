import { personalData as defaultPersonal } from '../data/portfolioData'

export default function WhatsAppButton({ personalData: editedPersonal }) {
  const data = editedPersonal || defaultPersonal
  const phone = data.whatsapp?.replace(/[^0-9]/g, '')
  if (!phone) return null
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      title="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp" />
    </a>
  )
}
