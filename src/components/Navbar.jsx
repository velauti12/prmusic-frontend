import { Link, NavLink, useNavigate } from 'react-router-dom'
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
    <header className="navbar">
      <Link to="/" className="navbar-brand">PRMUSIC</Link>

      <nav className="navbar-links" aria-label="Principal">
        <NavLink to="/" end>Canciones</NavLink>
        <NavLink to="/artists">Artistas</NavLink>
        <NavLink to="/genres">Géneros</NavLink>
      </nav>

      <div className="navbar-user">
        {token ? (
          <>
            <NavLink to="/songs/new" className="btn-primary btn-small">Subir canción</NavLink>
            <NavLink to="/profile">{username || 'Mi perfil'}</NavLink>
            <button type="button" onClick={handleLogout} className="btn-link">Salir</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Iniciar sesión</NavLink>
            <NavLink to="/register" className="btn-primary btn-small">Crear cuenta</NavLink>
          </>
        )}
      </div>
    </header>
  )
}
