import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { logout as logoutApi } from '../services/authService'

export default function Navbar() {
  const { token, username, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    // Invalida el token en el servidor; si falla, igual cerramos la sesión local
    try { await logoutApi() } catch { /* sin conexión o token ya vencido */ }
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎵 PRMUSIC</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Canciones</Link>
        <Link to="/artists">Artistas</Link>
        <Link to="/genres">Géneros</Link>

        {token ? (
          <>
            <Link to="/songs/new">+ Nueva canción</Link>
            <Link to="/profile">👤 {username || 'Mi perfil'}</Link>
            <button onClick={handleLogout} className="btn-logout">
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register" className="btn-register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  )
}
