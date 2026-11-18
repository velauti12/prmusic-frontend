import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import useAuthStore from '../store/authStore'
import * as authService from '../services/authService'

// Se simula la API: la demostración integrada usa la API real (consigna §5.2)
vi.mock('../services/authService')

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Inicio</h1>} />
      </Routes>
    </MemoryRouter>
  )
}

async function fillAndSubmit(username, password) {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Usuario'), username)
  await user.type(screen.getByLabelText('Contraseña'), password)
  await user.click(screen.getByRole('button', { name: 'Ingresar' }))
}

describe('Login', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useAuthStore.getState().logout()
  })

  it('con credenciales válidas guarda la sesión y vuelve al inicio', async () => {
    authService.login.mockResolvedValue({
      data: { token: 'abc123', user_id: 7, username: 'bauti', role: 'user' },
    })

    renderLogin()
    await fillAndSubmit('bauti', 'password123')

    expect(authService.login).toHaveBeenCalledWith('bauti', 'password123')
    expect(await screen.findByRole('heading', { name: 'Inicio' })).toBeInTheDocument()
    expect(useAuthStore.getState()).toMatchObject({ token: 'abc123', userId: '7', username: 'bauti' })
    expect(localStorage.getItem('token')).toBe('abc123')
  })

  it('con credenciales inválidas muestra el error de la API y no inicia sesión', async () => {
    authService.login.mockRejectedValue({
      response: { status: 401, data: { error: 'Credenciales inválidas' } },
    })

    renderLogin()
    await fillAndSubmit('bauti', 'mala')

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas')
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeEnabled()
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('sin completar los campos no llama a la API', async () => {
    renderLogin()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Completá usuario y contraseña.')
    expect(authService.login).not.toHaveBeenCalled()
  })
})
