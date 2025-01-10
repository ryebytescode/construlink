import { useEffect, useRef } from 'react'

export function useRenderCount(componentName: string) {
  if (!__DEV__) return

  const count = useRef(0)

  useEffect(() => {
    count.current++
    console.info(`Rendered (${count.current}x):`, componentName)
  })
}
