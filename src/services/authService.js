import api from './api'

// POST /api/v1/login  → { token, user_id, username, role }
export const login = (username, password) =>
  api.post('/login', { username, password })

// DELETE /api/v1/logout  → invalida el token en el servidor
export const logout = () =>
  api.delete('/logout')

// POST /api/v1/users (registro). No devuelve token: después hay que llamar a login.
export const register = (userData) =>
  api.post('/users', { user: userData })
