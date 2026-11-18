import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getFavorites, addFavorite, removeFavorite } from '../services/favoritesService'
import { toast } from '../store/toastStore'
import { getErrorMessage } from '../utils/apiError'

// Botón para agregar o quitar una canción de favoritos.
// Sin sesión, lleva al login y después vuelve a esta canción.
export default function FavoriteButton({ songId }) {
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()
  const location = useLocation()
  const [favoriteId, setFavoriteId] = useState(null) // id del favorito si ya está guardada
  const [checking, setChecking] = useState(Boolean(token))
  const [saving, setSaving] = useState(false)

  // Al cargar, consulta si la canción ya está en mis favoritos
  useEffect(() => {
    if (!token) return
    let ignore = false
    getFavorites()
      .then(({ data }) => {
        if (ignore) return
        const fav = data.find((f) => f.song?.id === Number(songId))
        setFavoriteId(fav ? fav.id : null)
      })
      .catch(() => { /* si falla, el botón queda como "agregar" */ })
      .finally(() => { if (!ignore) setChecking(false) })
    return () => { ignore = true }
  }, [token, songId])

  const handleClick = async () => {
    if (!token) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    setSaving(true)
    try {
      if (favoriteId) {
        await removeFavorite(favoriteId)
        setFavoriteId(null)
        toast('Quitada de tus favoritos.')
      } else {
        const { data } = await addFavorite(Number(songId))
        setFavoriteId(data.id)
        toast('Agregada a tus favoritos.')
      }
    } catch (err) {
      toast(getErrorMessage(err, 'No se pudo actualizar favoritos.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const isFavorite = Boolean(favoriteId)
  let label = isFavorite ? '★ En favoritos' : '☆ Agregar a favoritos'
  if (!token) label = '☆ Iniciá sesión para guardar'
  if (saving) label = 'Guardando...'

  return (
    <button
      type="button"
      className={`btn-favorite${isFavorite ? ' is-favorite' : ''}`}
      onClick={handleClick}
      disabled={checking || saving}
      aria-pressed={token ? isFavorite : undefined}
    >
      {label}
    </button>
  )
}
