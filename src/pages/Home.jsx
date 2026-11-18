import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getSongs } from '../services/songsService'
import { getArtists } from '../services/artistsService'
import { getGenres } from '../services/genresService'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import SongCard from '../components/SongCard'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

// Listado de canciones aprobadas con buscador y filtros.
// Los filtros viven en la URL (?q=&artist_id=&genre_id=) para poder compartir o volver atrás.
export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const artistId = searchParams.get('artist_id') || ''
  const genreId = searchParams.get('genre_id') || ''
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const q = useDebounce(query.trim())

  const songs = useFetch(
    () => getSongs({ q: q || undefined, artist_id: artistId || undefined, genre_id: genreId || undefined }),
    [q, artistId, genreId]
  )
  // Los filtros son opcionales: si fallan, el listado sigue funcionando
  const artists = useFetch(getArtists, [])
  const genres = useFetch(getGenres, [])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
    updateParam('q', e.target.value.trim())
  }

  const hasFilters = Boolean(query || artistId || genreId)
  const clearFilters = () => {
    setQuery('')
    setSearchParams({}, { replace: true })
  }

  const list = songs.data || []

  return (
    <section>
      <div className="page-header">
        <h1>Canciones</h1>
        <p className="page-subtitle">Buscá un tema y tocalo con sus acordes.</p>
      </div>

      <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group filter-search">
          <label htmlFor="q">Buscar</label>
          <input
            id="q"
            type="search"
            placeholder="Título o artista"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="artist">Artista</label>
          <select
            id="artist"
            value={artistId}
            onChange={(e) => updateParam('artist_id', e.target.value)}
            disabled={!artists.data}
          >
            <option value="">Todos</option>
            {artists.data?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="genre">Género</label>
          <select
            id="genre"
            value={genreId}
            onChange={(e) => updateParam('genre_id', e.target.value)}
            disabled={!genres.data}
          >
            <option value="">Todos</option>
            {genres.data?.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>

        {hasFilters && (
          <button type="button" className="btn-secondary filter-clear" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </form>

      {songs.loading && <Spinner label="Cargando canciones..." />}

      {!songs.loading && songs.error && (
        <ErrorMessage message={songs.error} onRetry={songs.reload} />
      )}

      {!songs.loading && !songs.error && list.length === 0 && (
        <EmptyState
          icon="🔍"
          title={hasFilters ? 'No hay canciones que coincidan con tu búsqueda.' : 'Todavía no hay canciones publicadas.'}
        >
          {hasFilters && (
            <button type="button" className="btn-secondary" onClick={clearFilters}>Limpiar filtros</button>
          )}
        </EmptyState>
      )}

      {!songs.loading && !songs.error && list.length > 0 && (
        <>
          <p className="results-count" aria-live="polite">
            {list.length} {list.length === 1 ? 'canción' : 'canciones'}
          </p>
          <div className="song-list">
            {list.map((song) => <SongCard key={song.id} song={song} />)}
          </div>
        </>
      )}
    </section>
  )
}
