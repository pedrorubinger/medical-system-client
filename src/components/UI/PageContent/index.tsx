import React from 'react'
import { Container } from './styles'

interface IPageContentProps {
  children: React.ReactNode
}

export const PageContent = ({ children, ...rest }: IPageContentProps) => {
  return <Container {...rest}>{children}</Container>
}
