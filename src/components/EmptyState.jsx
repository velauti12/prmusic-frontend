// Estado vacío: cuando una lista no tiene resultados. `children` permite agregar una acción.
export default function EmptyState({ icon = '🎵', title, children }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <p className="empty-title">{title}</p>
      {children}
    </div>
  )
}
