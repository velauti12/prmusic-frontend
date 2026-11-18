import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../utils/apiError'

/**
 * Ejecuta una petición a la API y expone sus estados.
 *   const { data, loading, error, reload } = useFetch(() => getSongs(params), [params])
 * `fetcher` devuelve la promesa de axios; `data` es `response.data`.
 * Si las dependencias cambian antes de que termine, la respuesta vieja se descarta.
 */
export default function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [attempt, setAttempt] = useState(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps)

  useEffect(() => {
    let ignore = false
    setState((s) => ({ ...s, loading: true, error: null }))
    run()
      .then((res) => { if (!ignore) setState({ data: res.data, loading: false, error: null }) })
      .catch((err) => { if (!ignore) setState({ data: null, loading: false, error: getErrorMessage(err) }) })
    return () => { ignore = true }
  }, [run, attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  // Permite actualizar los datos localmente (por ejemplo, quitar un ítem borrado)
  const setData = useCallback(
    (updater) => setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater })),
    []
  )

  return { ...state, reload, setData }
}
