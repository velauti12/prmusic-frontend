import { create } from 'zustand'

let nextId = 1

// Notificaciones breves para confirmar operaciones ("Agregado a favoritos", etc.)
const useToastStore = create((set) => ({
  toasts: [],
  show: (message, type = 'success') => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// Atajo para usar fuera de componentes: toast('Guardado') / toast('Falló', 'error')
export const toast = (message, type) => useToastStore.getState().show(message, type)

export default useToastStore
