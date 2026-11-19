import { Link } from 'react-router-dom'
import AlbumCover from './AlbumCover'

// Fila del listado, como el índice de un cuaderno: título, artista y el tono a la derecha
export default function SongCard({ song }) {
  return (
    <article className="song-row">
      <AlbumCover album={song.album} className="song-row-cover" />
      <div className="song-row-text">
        <h3 className="song-row-title">
          <Link to={`/songs/${song.id}`}>{song.title}</Link>
        </h3>
        <p className="song-row-meta">
          {song.artist?.name}
          {song.genre?.name && <span className="song-row-genre">{song.genre.name}</span>}
        </p>
      </div>
      <span className="song-row-leader" aria-hidden="true" />
      {song.original_key && (
        <span className="song-row-key" title="Tono original">
          <span className="sr-only">Tono </span>{song.original_key}
        </span>
      )}
    </article>
  )
}
