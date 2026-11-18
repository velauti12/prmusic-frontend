import { useEffect, useState } from 'react'

// Devuelve `value` recién cuando dejó de cambiar durante `delay` ms (para no
// pedir a la API en cada tecla del buscador).
export default function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}
