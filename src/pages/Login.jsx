import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { login as loginApi } from '../services/authService'
import useAuthStore from '../store/authStore'
import ErrorMessage from '../components/ErrorMessage'
import { getErrorMessage } from '../utils/apiError'

export default function Login() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuthStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  // Si llegó desde una página protegida o desde "Agregar a favoritos", vuelve ahí
  const from      = location.state?.from || '/'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación básica en el cliente
    if (!form.username || !form.password) {
      setError('Completá usuario y contraseña.')
      return
    }

    setLoading(true)
    try {
      const { data } = await loginApi(form.username, form.password)
      // data = { token, user_id, username, role }
      login(data)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Error al iniciar sesión.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <ErrorMessage message={error} />

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="form-footer">
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>
    </div>
  )
}
