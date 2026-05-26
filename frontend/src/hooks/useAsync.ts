import { useCallback, useEffect, useState } from "react"
import type { DependencyList } from "react"

export function useAsync<T>(factory: () => Promise<T>, deps: DependencyList = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await factory()
      setData(result)
    } catch (nextError) {
      setError(nextError)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    reload()
  }, [reload])

  return { data, loading, error, reload, setData }
}
