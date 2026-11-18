import { Link } from 'react-router-dom'

// Tarjeta de canción para los listados. Muestra la portada del álbum si tiene.
export default function SongCard({ song }) {
  const cover = song.album?.cover_url
  return (
    <article className="song-card">
      <div className="song-cover" aria-hidden="true">
        {cover ? <img src={cover} alt="" loading="lazy" /> : <span>🎵</span>}
      </div>
      <div className="song-info">
        <h3>
          <Link to={`/songs/${song.id}`}>{song.title}</Link>
        </h3>
        <p className="song-meta">
          {song.artist?.name && <span>🎤 {song.artist.name}</span>}
          {song.genre?.name && <span> · 🎸 {song.genre.name}</span>}
          {song.original_key && <span> · Tono {song.original_key}</span>}
        </p>
      </div>
    </article>
  )
}
