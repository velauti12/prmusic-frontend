import axios from 'axios'

// En desarrollo VITE_API_URL puede quedar vacío y Vite redirige /api al backend
// (ver proxy en vite.config.js). En producción apunta a la URL del backend.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor: agrega el token en cada request si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: si la sesión venció (401 con token guardado), limpia la sesión y
// manda al login. No aplica al propio /login: ahí el 401 es "credenciales inválidas"
// y el formulario tiene que poder mostrar el error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url === '/login'
    if (error.response?.status === 401 && !isLoginRequest && localStorage.getItem('token')) {
      ;['token', 'userId', 'username', 'role'].forEach((k) => localStorage.removeItem(k))
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
