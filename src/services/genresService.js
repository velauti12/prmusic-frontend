import api from './api'

export const getGenres = () => api.get('/genres')
export const getGenre  = (id) => api.get(`/genres/${id}`)
