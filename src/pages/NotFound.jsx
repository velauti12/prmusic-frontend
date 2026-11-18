import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return (
    <EmptyState icon="🔍" title="Esta página no existe.">
      <Link to="/" className="btn-secondary">Volver al inicio</Link>
    </EmptyState>
  )
}
