import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Toaster from './components/Toaster'

// Pages
import Home       from './pages/Home'
import SongDetail from './pages/SongDetail'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Profile    from './pages/Profile'
import NewSong    from './pages/NewSong'
import Artists    from './pages/Artists'
import ArtistDetail from './pages/ArtistDetail'
import Genres     from './pages/Genres'
import GenreDetail from './pages/GenreDetail'
import NotFound   from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Navbar />
      <main id="contenido" className="main-content" tabIndex={-1}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/"              element={<Home />} />
          <Route path="/songs/:id"     element={<SongDetail />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/artists"       element={<Artists />} />
          <Route path="/artists/:id"   element={<ArtistDetail />} />
          <Route path="/genres"        element={<Genres />} />
          <Route path="/genres/:id"    element={<GenreDetail />} />

          {/* Rutas privadas (requieren login) */}
          <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/songs/new" element={
            <PrivateRoute><NewSong /></PrivateRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
    </BrowserRouter>
  )
}
