import { useState, useEffect } from 'react';

interface IResponse<T> {
    data: T | null
    isLoading: boolean,
    error: Error | null,
    clearError: () => void
}
type fetchData<T> = () => Promise<T | null | never>

export function useAppwrite <T, I> (fn: fetchData<T>, initial: I): IResponse<T | I> {
  const [data, setData] = useState<T | I | null>(initial)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    fn()
      .then(res => {
        setData(res)
      })
      .catch(error => {
        setError(error)
        console.log(error)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const clearError = () => {
    setError(null)
  }

  return {data, isLoading, error, clearError}
}