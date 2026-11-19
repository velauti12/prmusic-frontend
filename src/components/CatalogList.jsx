import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'

// Listado de artistas o géneros
export default function CatalogList({ title, subtitle, fetcher, basePath, emptyText, renderExtra }) {
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
      {!loading && !error && items.length === 0 && <EmptyState title={emptyText} />}
      {!loading && !error && items.length > 0 && (
        <ul className="catalog-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`${basePath}/${item.id}`} className="catalog-item">
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
