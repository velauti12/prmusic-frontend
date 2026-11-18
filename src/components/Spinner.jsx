// Indicador de carga centrado
export default function Spinner({ label = 'Cargando...' }) {
  return (
    <div className="spinner-wrapper" role="status">
      <div className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
