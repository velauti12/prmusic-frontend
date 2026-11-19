import { useState } from 'react'

// Video de la canción como en Cifra Club: primero una miniatura y, al darle play,
// un reproductor chico fijo en la esquina para seguir leyendo los acordes.
export default function VideoPlayer({ youtubeId, title, artist }) {
  const [open, setOpen] = useState(false)

  if (!youtubeId) {
    const query = encodeURIComponent(`${title} ${artist || ''}`.trim())
    return (
      <a className="video-search" href={`https://www.youtube.com/results?search_query=${query}`}
        target="_blank" rel="noreferrer">
        Buscar en YouTube
      </a>
    )
  }

  return (
    <>
      <button type="button" className="video-thumb" onClick={() => setOpen(true)} aria-label={`Ver el video de ${title}`}>
        <img src={`https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`} alt="" loading="lazy" />
        <span className="video-play" aria-hidden="true">▶</span>
      </button>

      {open && (
        <div className="mini-player" role="dialog" aria-label={`Video de ${title}`}>
          <div className="mini-player-bar">
            <span>{title}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar video">×</button>
          </div>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
            title={`Video de ${title}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </>
  )
}
