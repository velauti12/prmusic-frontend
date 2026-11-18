import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

// Pages (las vamos a crear de a una)
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

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
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
        </Routes>
      </main>
    </BrowserRouter>
  )
}
