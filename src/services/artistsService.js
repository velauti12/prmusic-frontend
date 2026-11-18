import api from './api'

export const getArtists = () => api.get('/artists')
export const getArtist  = (id) => api.get(`/artists/${id}`)
