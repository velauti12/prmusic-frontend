import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSong } from '../services/songsService'
import { getArtists } from '../services/artistsService'
import { getGenres } from '../services/genresService'
import useFetch from '../hooks/useFetch'
import ErrorMessage from '../components/ErrorMessage'
import ChordSheet from '../components/ChordSheet'
import { toast } from '../store/toastStore'
import { getErrorList } from '../utils/apiError'

// Mismas reglas que el modelo Song del back-end, para avisar antes de enviar
const KEY_REGEX = /^[A-G][b#]?(m|min|maj|dim|aug)?(7|9|11|13)?$/i

function validate(form) {
  const errors = {}
  const title = form.title.trim()
  if (title.length < 2 || title.length > 100) errors.title = 'El título debe tener entre 2 y 100 caracteres.'
  if (!form.artist_id) errors.artist_id = 'Elegí un artista.'
  if (!KEY_REGEX.test(form.original_key.trim())) errors.original_key = 'Usá un acorde válido, por ejemplo G, Am, C# o F#m7.'
  if (form.content.trim().length < 10) errors.content = 'La letra con acordes debe tener al menos 10 caracteres.'
  return errors
}

// Mensaje de error debajo de un campo (vinculado con aria-describedby)
function FieldError({ name, errors }) {
  if (!errors[name]) return null
  return <p id={`${name}-error`} className="field-error">{errors[name]}</p>
}

const EMPTY = { title: '', artist_id: '', genre_id: '', original_key: '', content: '' }

// Formulario para aportar una canción. Queda "pendiente" hasta que un admin la apruebe.
export default function NewSong() {
  const navigate = useNavigate()
  const artists = useFetch(getArtists, [])
  const genres = useFetch(getGenres, [])

  const [form, setForm] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState({})
  const [apiErrors, setApiErrors] = useState([])
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setFieldErrors((errs) => ({ ...errs, [name]: undefined }))
    setApiErrors([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return

    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      // Lleva el foco al primer campo con error
      document.getElementById(Object.keys(errors)[0])?.focus()
      return
    }

    setSaving(true)
    try {
      const { data } = await createSong({
        title: form.title.trim(),
        artist_id: Number(form.artist_id),
        genre_id: form.genre_id ? Number(form.genre_id) : null,
        original_key: form.original_key.trim(),
        content: form.content,
      })
      toast('¡Gracias! Tu canción quedó pendiente de aprobación.')
      navigate(`/songs/${data.id}`)
    } catch (err) {
      setApiErrors(getErrorList(err, 'No se pudo guardar la canción.'))
      setSaving(false)
    }
  }

  // Ayuda a describir cada campo con su error para lectores de pantalla
  const errorProps = (name) => (fieldErrors[name]
    ? { 'aria-invalid': true, 'aria-describedby': `${name}-error` }
    : {})

  return (
    <section>
      <div className="page-header">
        <h1>Aportar una canción</h1>
        <p className="page-subtitle">
          Un administrador la revisa antes de publicarla. Mientras tanto la vas a ver en tu perfil como pendiente.
        </p>
      </div>

      {artists.error && (
        <ErrorMessage message={`No se pudieron cargar los artistas. ${artists.error}`} onRetry={artists.reload} />
      )}

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input id="title" name="title" type="text" maxLength={100} value={form.title}
            onChange={handleChange} disabled={saving} {...errorProps('title')} />
          <FieldError name="title" errors={fieldErrors} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="artist_id">Artista *</label>
            <select id="artist_id" name="artist_id" value={form.artist_id} onChange={handleChange}
              disabled={saving || artists.loading} {...errorProps('artist_id')}>
              <option value="">{artists.loading ? 'Cargando...' : 'Elegí un artista'}</option>
              {artists.data?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <FieldError name="artist_id" errors={fieldErrors} />
          </div>

          <div className="form-group">
            <label htmlFor="genre_id">Género</label>
            <select id="genre_id" name="genre_id" value={form.genre_id} onChange={handleChange}
              disabled={saving || genres.loading}>
              <option value="">Sin género</option>
              {genres.data?.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="original_key">Tono original *</label>
            <input id="original_key" name="original_key" type="text" maxLength={5} placeholder="Ej: Am"
              value={form.original_key} onChange={handleChange} disabled={saving} {...errorProps('original_key')} />
            <FieldError name="original_key" errors={fieldErrors} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Letra con acordes *</label>
          <p className="field-hint" id="content-hint">
            Escribí los acordes en una línea arriba de la letra, alineados con la sílaba donde cambian.
          </p>
          <textarea id="content" name="content" rows={12} value={form.content} onChange={handleChange}
            disabled={saving} className="mono" aria-describedby="content-hint"
            placeholder={'Am        G\nMuchacha ojos de papel'} {...errorProps('content')} />
          <FieldError name="content" errors={fieldErrors} />
        </div>

        {form.content.trim() && (
          <details className="preview">
            <summary>Vista previa</summary>
            <ChordSheet content={form.content} fontSize={14} />
          </details>
        )}

        {apiErrors.length > 0 && (
          <ul className="error-list" role="alert">
            {apiErrors.map((msg) => <li key={msg}>{msg}</li>)}
          </ul>
        )}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Enviando...' : 'Enviar canción'}
        </button>
      </form>
    </section>
  )
}
