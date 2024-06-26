import { useState, useEffect } from 'react';

interface IResponse<T> {
    data: T | null
    isLoading: boolean,
    error: Error | null,
    clearError: () => void,
    refetchData: () => void
}
type fetchData<T> = (p?: any) => Promise<T | null> | never 

export function useAppwrite <T> (fn: fetchData<T>): IResponse<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState(null)

  const fetching = async () => {
    setIsLoading(true)
    
    try {
      const res = await fn()
      setData(res)
    } catch (error: any) {
        setError(error)
        console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const refetchData = () => {
    fetching()
  }

  useEffect(() => {
    fetching()
  }, [])

  const clearError = () => {
    setError(null)
  }

  return {data, isLoading, error, clearError, refetchData}
}