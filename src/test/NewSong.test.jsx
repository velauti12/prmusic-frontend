import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import NewSong from '../pages/NewSong'
import * as songsService from '../services/songsService'
import * as artistsService from '../services/artistsService'
import * as genresService from '../services/genresService'

vi.mock('../services/songsService')
vi.mock('../services/artistsService')
vi.mock('../services/genresService')

function renderForm() {
  return render(
    <MemoryRouter initialEntries={['/songs/new']}>
      <Routes>
        <Route path="/songs/new" element={<NewSong />} />
        <Route path="/songs/:id" element={<h1>Detalle</h1>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('NewSong', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    artistsService.getArtists.mockResolvedValue({ data: [{ id: 1, name: 'Almendra' }] })
    genresService.getGenres.mockResolvedValue({ data: [{ id: 2, name: 'Rock Nacional' }] })
  })

  it('valida los campos antes de enviar', async () => {
    renderForm()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Enviar canción' }))

    expect(screen.getByText('Elegí un artista.')).toBeInTheDocument()
    expect(screen.getByLabelText('Tono original *')).toHaveAttribute('aria-invalid', 'true')
    expect(songsService.createSong).not.toHaveBeenCalled()
  })

  it('envía la canción y abre su detalle', async () => {
    songsService.createSong.mockResolvedValue({ data: { id: 42 } })
    const user = userEvent.setup()
    renderForm()

    await screen.findByRole('option', { name: 'Almendra' })
    await screen.findByRole('option', { name: 'Rock Nacional' })
    await user.type(screen.getByLabelText('Título *'), 'Muchacha')
    await user.selectOptions(screen.getByLabelText('Artista *'), '1')
    await user.selectOptions(screen.getByLabelText('Género *'), '2')
    await user.type(screen.getByLabelText('Tono original *'), 'G')
    await user.type(screen.getByLabelText('Letra con acordes *'), 'G  D{enter}Muchacha ojos de papel')
    await user.click(screen.getByRole('button', { name: 'Enviar canción' }))

    expect(songsService.createSong).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Muchacha', artist_id: 1, original_key: 'G', genre_id: 2 })
    )
    expect(await screen.findByRole('heading', { name: 'Detalle' })).toBeInTheDocument()
  })

  it('muestra los errores de validación que devuelve la API', async () => {
    songsService.createSong.mockRejectedValue({
      response: { status: 422, data: { errors: ['Title ya existe para este artista'] } },
    })
    const user = userEvent.setup()
    renderForm()

    await screen.findByRole('option', { name: 'Almendra' })
    await screen.findByRole('option', { name: 'Rock Nacional' })
    await user.type(screen.getByLabelText('Título *'), 'Muchacha')
    await user.selectOptions(screen.getByLabelText('Artista *'), '1')
    await user.selectOptions(screen.getByLabelText('Género *'), '2')
    await user.type(screen.getByLabelText('Tono original *'), 'G')
    await user.type(screen.getByLabelText('Letra con acordes *'), 'G  D{enter}Muchacha ojos de papel')
    await user.click(screen.getByRole('button', { name: 'Enviar canción' }))

    expect(await screen.findByText(/Title ya existe para este artista/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar canción' })).toBeEnabled()
  })
})
