import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

// Redirige al /login si el usuario no está autenticado
export default function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return children
}
