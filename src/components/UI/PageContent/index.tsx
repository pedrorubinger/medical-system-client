import React from 'react'
import { Container } from './styles'

interface IPageContentProps {
  margin?: string | undefined
  children: React.ReactNode
}

export const PageContent = ({
  children,
  margin,
  ...rest
}: IPageContentProps) => {
  return (
    <Container margin={margin} {...rest}>
      {children}
    </Container>
  )
}
