import { useState, useEffect, useCallback } from 'react'

interface IDimensions {
  width: number | null
  height: number | null
}

export const useWindowDimensions = (): IDimensions => {
  const hasWindow = typeof window !== 'undefined'

  const getWindowDimensions = useCallback((): IDimensions => {
    const width = hasWindow ? window.innerWidth : null
    const height = hasWindow ? window.innerHeight : null

    return { width, height }
  }, [hasWindow])

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    if (hasWindow) {
      const handleResize = (): void => {
        setWindowDimensions(getWindowDimensions())
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [getWindowDimensions, hasWindow])

  return windowDimensions
}
