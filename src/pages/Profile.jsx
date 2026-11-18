import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getMySongs } from '../services/songsService'
import { getFavorites, removeFavorite } from '../services/favoritesService'
import useFetch from '../hooks/useFetch'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { toast } from '../store/toastStore'
import { getErrorMessage } from '../utils/apiError'

// Perfil del usuario logueado: sus aportes (con estado de moderación) y sus favoritos.
export default function Profile() {
  const username = useAuthStore((s) => s.username)

  return (
    <section>
      <div className="page-header page-header-row">
        <div>
          <h1>Hola, {username}</h1>
          <p className="page-subtitle">Tus canciones aportadas y tus favoritas.</p>
        </div>
        <Link to="/songs/new" className="btn-secondary">+ Aportar canción</Link>
      </div>

      <div className="profile-grid">
        <MySongs />
        <MyFavorites />
      </div>
    </section>
  )
}

function MySongs() {
  const { data, loading, error, reload } = useFetch(getMySongs, [])
  const songs = data || []

  return (
    <section className="profile-section" aria-labelledby="mis-canciones">
      <h2 id="mis-canciones">Mis canciones</h2>
      {loading && <Spinner label="Cargando tus canciones..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}
      {!loading && !error && songs.length === 0 && (
        <EmptyState icon="✍️" title="Todavía no aportaste canciones.">
          <Link to="/songs/new" className="btn-secondary">Aportar la primera</Link>
        </EmptyState>
      )}
      {!loading && !error && songs.length > 0 && (
        <ul className="profile-list">
          {songs.map((song) => (
            <li key={song.id}>
              <div>
                <Link to={`/songs/${song.id}`}>{song.title}</Link>
                <span className="muted"> · {song.artist?.name}</span>
              </div>
              <StatusBadge status={song.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function MyFavorites() {
  const { data, loading, error, reload, setData } = useFetch(getFavorites, [])
  const [removingId, setRemovingId] = useState(null)
  const favorites = data || []

  const handleRemove = async (fav) => {
    setRemovingId(fav.id)
    try {
      await removeFavorite(fav.id)
      setData((list) => list.filter((f) => f.id !== fav.id))
      toast(`"${fav.song.title}" quitada de favoritos.`)
    } catch (err) {
      toast(getErrorMessage(err, 'No se pudo quitar de favoritos.'), 'error')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <section className="profile-section" aria-labelledby="mis-favoritos">
      <h2 id="mis-favoritos">Mis favoritos</h2>
      {loading && <Spinner label="Cargando tus favoritos..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}
      {!loading && !error && favorites.length === 0 && (
        <EmptyState icon="☆" title="No tenés canciones favoritas.">
          <Link to="/" className="btn-secondary">Buscar canciones</Link>
        </EmptyState>
      )}
      {!loading && !error && favorites.length > 0 && (
        <ul className="profile-list">
          {favorites.map((fav) => (
            <li key={fav.id}>
              <div>
                <Link to={`/songs/${fav.song.id}`}>{fav.song.title}</Link>
                <span className="muted"> · {fav.song.artist?.name} · Tono {fav.song.original_key}</span>
              </div>
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={() => handleRemove(fav)}
                disabled={removingId === fav.id}
                aria-label={`Quitar ${fav.song.title} de favoritos`}
              >
                {removingId === fav.id ? 'Quitando...' : 'Quitar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
