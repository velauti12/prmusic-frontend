import CatalogList from '../components/CatalogList'
import { getGenres } from '../services/genresService'

export default function Genres() {
  return (
    <CatalogList
      title="Géneros"
      subtitle="Explorá las canciones por estilo."
      fetcher={getGenres}
      basePath="/genres"
      emptyText="Todavía no hay géneros cargados."
    />
  )
}
