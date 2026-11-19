import useToastStore from '../store/toastStore'

// Contenedor de notificaciones. Se anuncia a lectores de pantalla con aria-live.
export default function Toaster() {
  const { toasts, dismiss } = useToastStore()
  return (
    <div className="toaster" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} role="status">
          <span>{t.message}</span>
          <button type="button" className="toast-close" onClick={() => dismiss(t.id)} aria-label="Cerrar notificación">×</button>
        </div>
      ))}
    </div>
  )
}
