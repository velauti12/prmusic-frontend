import { Link } from 'react-router-dom'

// Tarjeta de canción para usar en listados
export default function SongCard({ song }) {
  return (
    <div className="song-card">
      <h3>
        <Link to={`/songs/${song.id}`}>{song.title}</Link>
      </h3>
      <p className="song-meta">
        {song.artist?.name && <span>🎤 {song.artist.name}</span>}
        {song.genre?.name && <span> · 🎸 {song.genre.name}</span>}
        {song.original_key && <span> · 🎵 {song.original_key}</span>}
      </p>
    </div>
  )
}
