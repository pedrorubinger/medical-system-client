import React from 'react'

import { SideMenu } from '../UI/SideMenu'
import { Container, PageContainer } from './styles'

interface IPrivateRouteWrapperProps {
  children: React.ReactNode
}

export const PrivateRouteWrapper = ({
  children,
}: IPrivateRouteWrapperProps) => {
  return (
    <Container>
      <SideMenu />
      <PageContainer>{children}</PageContainer>
    </Container>
  )
}
