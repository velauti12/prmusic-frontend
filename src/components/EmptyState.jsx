// Estado vacío: cuando una lista no tiene resultados. `children` permite agregar una acción.
export default function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      {children}
    </div>
  )
}
