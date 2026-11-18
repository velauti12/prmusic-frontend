import api from './api'

// GET /api/v1/songs  — solo aprobadas. Filtros: { q, artist_id, genre_id }
export const getSongs = (params = {}) =>
  api.get('/songs', { params })

// GET /api/v1/songs/:id
export const getSong = (id) =>
  api.get(`/songs/${id}`)

// GET /api/v1/songs/mine  — canciones que aportó el usuario logueado (cualquier estado)
export const getMySongs = () =>
  api.get('/songs/mine')

// POST /api/v1/songs  — queda en estado "pending" hasta que un admin la apruebe
export const createSong = (songData) =>
  api.post('/songs', { song: songData })

// GET /api/v1/songs/:id/transpose?semitones=N  → { key, content, ... }
export const transposeSong = (id, semitones) =>
  api.get(`/songs/${id}/transpose`, { params: { semitones } })
