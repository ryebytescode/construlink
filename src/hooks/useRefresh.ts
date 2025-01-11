import { useEffect, useState } from 'react'

export function useRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  function refresh() {
    setIsRefreshing(true)
  }

  useEffect(() => {
    if (isRefreshing) setIsRefreshing(false)
  }, [isRefreshing, setIsRefreshing])

  return { refresh, isRefreshing }
}
