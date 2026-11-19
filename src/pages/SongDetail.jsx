import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSong, transposeSong } from '../services/songsService'
import useFetch from '../hooks/useFetch'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import ChordSheet from '../components/ChordSheet'
import FavoriteButton from '../components/FavoriteButton'
import AlbumCover from '../components/AlbumCover'
import { getErrorMessage } from '../utils/apiError'

const MIN_FONT = 12
const MAX_FONT = 26

// Detalle de una canción: acordes, transposición (la calcula la API), tamaño de
// letra, autoscroll para tocar sin usar las manos y botón de favoritos.
// La `key` hace que al pasar a otra canción se reinicie todo (tono, letra, autoscroll)
export default function SongDetailPage() {
  const { id } = useParams()
  return <SongDetail key={id} id={id} />
}

function SongDetail({ id }) {
  const { data: song, loading, error, reload } = useFetch(() => getSong(id), [id])

  const [semitones, setSemitones] = useState(0)
  const [transposed, setTransposed] = useState(null) // { key, content } devuelto por la API
  const [transposing, setTransposing] = useState(false)
  const [transposeError, setTransposeError] = useState(null)
  const [fontSize, setFontSize] = useState(16)
  const [scrollSpeed, setScrollSpeed] = useState(0) // 0 = apagado

  // Pide a la API la versión transpuesta. Los botones quedan deshabilitados
  // mientras tanto, así no se pisan dos pedidos.
  const changeTone = async (next) => {
    setSemitones(next)
    setTransposeError(null)
    if (next === 0) {
      setTransposed(null)
      return
    }
    setTransposing(true)
    try {
      const { data } = await transposeSong(id, next)
      setTransposed(data)
    } catch (err) {
      setTransposeError(getErrorMessage(err, 'No se pudo cambiar el tono.'))
    } finally {
      setTransposing(false)
    }
  }

  // Autoscroll: baja la página de a poco mientras está activo
  useEffect(() => {
    if (!scrollSpeed) return
    const timer = setInterval(() => {
      window.scrollBy(0, 1)
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 1) setScrollSpeed(0)
    }, 120 / scrollSpeed)
    return () => clearInterval(timer)
  }, [scrollSpeed])

  if (loading) return <Spinner label="Cargando canción..." />

  if (error) {
    const notFound = error === 'Recurso no encontrado'
    return notFound ? (
      <EmptyState title="Esta canción no existe o todavía no fue aprobada.">
        <Link to="/" className="btn-secondary">Volver al listado</Link>
      </EmptyState>
    ) : (
      <ErrorMessage message={error} onRetry={reload} />
    )
  }

  // Mientras llega la respuesta se sigue mostrando la última versión
  const currentKey = (semitones !== 0 && transposed?.key) || song.original_key
  const content = (semitones !== 0 && transposed?.content) || song.content
  const shift = semitones > 0 ? `+${semitones}` : `${semitones}`

  return (
    <article className="song-detail">
      <Link to="/" className="back-link">Volver al listado</Link>

      {song.status && song.status !== 'approved' && (
        <p className={`status-banner status-${song.status}`} role="status">
          {song.status === 'pending'
            ? 'Esta canción está pendiente de aprobación. Por ahora solo la ves vos.'
            : 'Esta canción fue rechazada.'}
        </p>
      )}

      <header className="song-header">
        <AlbumCover album={song.album} className="song-header-cover" />
        <div className="song-header-info">
          <h1>{song.title}</h1>
          <p className="song-byline">
            {song.artist && <Link to={`/artists/${song.artist.id}`}>{song.artist.name}</Link>}
            {song.album && <>, del disco <em>{song.album.title}</em></>}
          </p>
          {song.genre && (
            <Link to={`/genres/${song.genre.id}`} className="tag">{song.genre.name}</Link>
          )}
        </div>
        <FavoriteButton songId={song.id} />
      </header>

      <div className="song-tools" role="toolbar" aria-label="Herramientas de la canción">
        <div className="tool-group">
          <span className="tool-label">Tono</span>
          <div className="stepper">
            <button type="button" onClick={() => changeTone(Math.max(semitones - 1, -11))}
              disabled={transposing || semitones <= -11} aria-label="Bajar medio tono">−</button>
            <output className="stepper-value" aria-live="polite">
              {currentKey}
              {semitones !== 0 && <small> {shift}</small>}
            </output>
            <button type="button" onClick={() => changeTone(Math.min(semitones + 1, 11))}
              disabled={transposing || semitones >= 11} aria-label="Subir medio tono">+</button>
          </div>
          {semitones !== 0 && (
            <button type="button" className="btn-link" onClick={() => changeTone(0)} disabled={transposing}>
              Volver a {song.original_key}
            </button>
          )}
        </div>

        <div className="tool-group">
          <span className="tool-label">Letra</span>
          <div className="stepper">
            <button type="button" onClick={() => setFontSize((f) => Math.max(f - 2, MIN_FONT))}
              disabled={fontSize <= MIN_FONT} aria-label="Achicar letra">−</button>
            <output className="stepper-value">{fontSize}</output>
            <button type="button" onClick={() => setFontSize((f) => Math.min(f + 2, MAX_FONT))}
              disabled={fontSize >= MAX_FONT} aria-label="Agrandar letra">+</button>
          </div>
        </div>

        <div className="tool-group">
          <label className="tool-label" htmlFor="autoscroll">Autoscroll</label>
          <select id="autoscroll" value={scrollSpeed} onChange={(e) => setScrollSpeed(Number(e.target.value))}>
            <option value={0}>Apagado</option>
            <option value={1}>Lento</option>
            <option value={2}>Medio</option>
            <option value={4}>Rápido</option>
          </select>
        </div>
      </div>

      {transposeError && (
        <ErrorMessage message={transposeError} onRetry={() => changeTone(semitones)} />
      )}

      <div className={`sheet-page${transposing ? ' is-updating' : ''}`} aria-busy={transposing}>
        <ChordSheet key={currentKey} content={content} fontSize={fontSize} />
      </div>
    </article>
  )
}
