// Convierte un error de axios en un mensaje legible para el usuario.
export function getErrorMessage(err, fallback = 'Ocurrió un error inesperado.') {
  if (!err?.response) {
    return 'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.'
  }
  const { status, data } = err.response
  if (data?.error) return data.error
  if (Array.isArray(data?.errors) && data.errors.length) return data.errors.join(' ')
  if (status === 404) return 'No encontramos lo que buscabas.'
  if (status >= 500) return 'El servidor tuvo un problema. Intentá de nuevo en unos minutos.'
  return fallback
}

// Lista de errores de validación (422) para mostrar en formularios.
export function getErrorList(err, fallback = 'No se pudo guardar.') {
  const errors = err?.response?.data?.errors
  if (Array.isArray(errors) && errors.length) return errors
  return [getErrorMessage(err, fallback)]
}
