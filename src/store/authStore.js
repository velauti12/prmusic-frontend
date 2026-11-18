import { create } from 'zustand'

const KEYS = ['token', 'userId', 'username', 'role']

const useAuthStore = create((set) => ({
  // Estado inicial: leer del localStorage si ya había una sesión
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('userId') || null,
  username: localStorage.getItem('username') || null,
  role: localStorage.getItem('role') || null,

  // Guarda la sesión con la respuesta de POST /login
  login: ({ token, user_id, username, role }) => {
    const session = { token, userId: String(user_id), username, role }
    KEYS.forEach((k) => localStorage.setItem(k, session[k]))
    set(session)
  },

  // Borra la sesión local (el token en el servidor se invalida con DELETE /logout)
  logout: () => {
    KEYS.forEach((k) => localStorage.removeItem(k))
    set({ token: null, userId: null, username: null, role: null })
  },
}))

export default useAuthStore
