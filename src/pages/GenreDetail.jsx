import CatalogDetail from '../components/CatalogDetail'
import { getGenre } from '../services/genresService'

export default function GenreDetail() {
  return (
    <CatalogDetail
      fetcher={getGenre}
      backPath="/genres"
      backLabel="Volver a géneros"
      notFoundText="Este género no existe."
    />
  )
}
