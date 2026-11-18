import api from './api'

// GET /api/v1/favorites  → favoritos del usuario logueado (cada uno con su canción)
export const getFavorites = () =>
  api.get('/favorites')

// POST /api/v1/favorites  { favorite: { song_id } }  (el usuario sale del token)
export const addFavorite = (songId) =>
  api.post('/favorites', { favorite: { song_id: songId } })

// DELETE /api/v1/favorites/:id
export const removeFavorite = (id) =>
  api.delete(`/favorites/${id}`)
