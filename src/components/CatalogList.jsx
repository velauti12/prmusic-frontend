import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'

// Listado genérico de artistas o géneros (tarjetas con link al detalle).
export default function CatalogList({ title, subtitle, fetcher, basePath, icon, emptyText, renderExtra }) {
  const { data, loading, error, reload } = useFetch(fetcher, [])
  const items = data || []

  return (
    <section>
      <div className="page-header">
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {loading && <Spinner />}
      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}
      {!loading && !error && items.length === 0 && <EmptyState icon={icon} title={emptyText} />}
      {!loading && !error && items.length > 0 && (
        <ul className="catalog-grid">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`${basePath}/${item.id}`} className="catalog-card">
                <span className="catalog-icon" aria-hidden="true">{icon}</span>
                <span className="catalog-name">{item.name}</span>
                {renderExtra && <span className="catalog-extra">{renderExtra(item)}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
