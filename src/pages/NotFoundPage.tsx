import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <div className="not-found-msg">This page doesn't exist.</div>
      <Link to="/" className="submit-btn not-found-link">
        Back to Dashboard
      </Link>
    </div>
  )
}
