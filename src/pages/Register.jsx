import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi, login as loginApi } from '../services/authService'
import useAuthStore from '../store/authStore'
import { getErrorList } from '../utils/apiError'

export default function Register() {
  const [form, setForm]       = useState({ username: '', email: '', password: '', password_confirmation: '' })
  const [errors, setErrors]   = useState([])
  const [loading, setLoading] = useState(false)

  const { login } = useAuthStore()
  const navigate  = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación básica en el cliente
    const clientErrors = []
    if (!form.username) clientErrors.push('El usuario es requerido.')
    if (!form.email)    clientErrors.push('El email es requerido.')
    if (!form.password) clientErrors.push('La contraseña es requerida.')
    if (form.password !== form.password_confirmation)
      clientErrors.push('Las contraseñas no coinciden.')
    if (clientErrors.length > 0) { setErrors(clientErrors); return }

    setLoading(true)
    try {
      await registerApi(form)
      // El registro no devuelve token: iniciamos sesión con las mismas credenciales
      const { data } = await loginApi(form.username, form.password)
      login(data)
      navigate('/')
    } catch (err) {
      setErrors(getErrorList(err, 'Error al registrarse.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>Crear cuenta</h1>

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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
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
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password_confirmation">Repetir contraseña</label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            value={form.password_confirmation}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {errors.length > 0 && (
          <ul className="error-list" role="alert">
            {errors.map((msg) => <li key={msg}>{msg}</li>)}
          </ul>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p className="form-footer">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  )
}
