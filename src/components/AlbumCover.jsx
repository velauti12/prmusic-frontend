// Tapa del disco. Si todavía no tiene imagen, muestra una "tapa de cuaderno"
// con el nombre del disco escrito, para que no quede un hueco.
export default function AlbumCover({ album, className = '' }) {
  if (!album) return null

  if (album.cover_url) {
    return <img className={`album-cover ${className}`} src={album.cover_url} alt={`Tapa de ${album.title}`} loading="lazy" />
  }

  return (
    <div className={`album-cover album-cover-blank ${className}`} role="img" aria-label={`${album.title} (sin tapa)`}>
      <span aria-hidden="true">{album.title}</span>
    </div>
  )
}
