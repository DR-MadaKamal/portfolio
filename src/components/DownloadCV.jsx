import { personalData } from '../data/portfolioData'

export default function DownloadCV() {
  if (!personalData.cvUrl) return null
  return (
    <a href={personalData.cvUrl} download className="btn btn-sm btn-solid" style={{ marginLeft: 12 }}>
      <i className="fas fa-download" /> CV
    </a>
  )
}
