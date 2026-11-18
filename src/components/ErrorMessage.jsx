// Mensaje de error reutilizable. Con `onRetry` muestra un botón para reintentar.
export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="error-message" role="alert">
      <span>⚠️ {message}</span>
      {onRetry && (
        <button type="button" className="btn-secondary btn-small" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
