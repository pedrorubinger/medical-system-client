import React from 'react'

import { useWindowDimensions } from '../../hooks/useWindowDimensions'
import { ProfileActionsControl } from './ProfileActionsControl'
import { SearchBar } from '../UI/SearchBar'
import { mobileLimitWidth, Menu } from '../UI/Menu'
import {
  Container,
  PageContainer,
  PageContent,
  TopBarContainer,
} from './styles'

interface IPrivateRouteWrapperProps {
  children: React.ReactNode
}

export const PrivateRouteWrapper = ({
  children,
}: IPrivateRouteWrapperProps) => {
  const { width } = useWindowDimensions()
  const useHamburgerMenu = !!(width && width < mobileLimitWidth)

  return (
    <Container useHamburgerMenu={useHamburgerMenu}>
      <Menu />
      <PageContainer>
        {!useHamburgerMenu && (
          <TopBarContainer>
            <SearchBar />
            <ProfileActionsControl />
          </TopBarContainer>
        )}
        <PageContent>{children}</PageContent>
      </PageContainer>
    </Container>
  )
}
