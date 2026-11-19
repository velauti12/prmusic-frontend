import CatalogList from '../components/CatalogList'
import { getArtists } from '../services/artistsService'

export default function Artists() {
  return (
    <CatalogList
      title="Artistas"
      subtitle="Elegí una banda o artista para ver sus canciones."
      fetcher={getArtists}
      basePath="/artists"
      emptyText="Todavía no hay artistas cargados."
      renderExtra={(artist) => artist.bio}
    />
  )
}
