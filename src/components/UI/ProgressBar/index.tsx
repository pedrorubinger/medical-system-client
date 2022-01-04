import { useEffect } from 'react'

import { Container, ProgressArea } from './styles'

export const ProgressBar = () => {
  useEffect(() => {
    const bar = document.getElementById('progress')

    const frame = () => {
      if (progress >= 90) {
        clearInterval(id)
      } else if (bar) {
        bar.style.width = `${++progress}%`
      }
    }

    let progress = 1
    const id = setInterval(frame, 100)

    return () => clearInterval(id)
  }, [])

  return (
    <Container>
      <ProgressArea id="progress" />
    </Container>
  )
}
