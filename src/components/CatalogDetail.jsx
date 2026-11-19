import { Link, useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import SongCard from './SongCard'

// Detalle de un artista o género con sus canciones
export default function CatalogDetail({ fetcher, backPath, backLabel, notFoundText, renderDescription }) {
  const { id } = useParams()
  const { data, loading, error, reload } = useFetch(() => fetcher(id), [id])

  if (loading) return <Spinner />

  if (error) {
    return error === 'Recurso no encontrado' ? (
      <EmptyState title={notFoundText}>
        <Link to={backPath} className="btn-secondary">{backLabel}</Link>
      </EmptyState>
    ) : (
      <ErrorMessage message={error} onRetry={reload} />
    )
  }

  const songs = data.songs || []

  return (
    <section>
      <Link to={backPath} className="back-link">{backLabel}</Link>

      <div className="page-header">
        <h1>{data.name}</h1>
        {renderDescription && renderDescription(data)}
      </div>

      {songs.length > 0 && (
        <h2 className="section-title">
          {songs.length} {songs.length === 1 ? 'canción' : 'canciones'}
        </h2>
      )}

      {songs.length === 0 ? (
        <EmptyState title="Todavía no hay canciones publicadas acá.">
          <Link to="/songs/new" className="btn-secondary">Aportar una</Link>
        </EmptyState>
      ) : (
        <div className="song-list">
          {songs.map((song) => <SongCard key={song.id} song={song} />)}
        </div>
      )}
    </section>
  )
}
