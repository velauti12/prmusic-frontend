import CatalogDetail from '../components/CatalogDetail'
import { getArtist } from '../services/artistsService'

export default function ArtistDetail() {
  return (
    <CatalogDetail
      fetcher={getArtist}
      backPath="/artists"
      backLabel="Volver a artistas"
      notFoundText="Este artista no existe."
      icon="🎤"
      renderDescription={(artist) => artist.bio && <p className="page-subtitle">{artist.bio}</p>}
    />
  )
}
