import React from 'react'

import { useWindowDimensions } from '../../hooks/useWindowDimensions'
import { ProfileActionsControl } from './ProfileActionsControl'
import { SearchBar } from '../UI/SearchBar'
import { mobileLimitWidth, SideMenu } from '../UI/SideMenu'
import { Container, PageContainer, TopBarContainer } from './styles'

interface IPrivateRouteWrapperProps {
  children: React.ReactNode
  /** @default true */
  showSearchBar?: boolean
}

export const PrivateRouteWrapper = ({
  children,
  showSearchBar = true,
}: IPrivateRouteWrapperProps) => {
  const { width } = useWindowDimensions()
  const useHamburgerMenu = !!(width && width < mobileLimitWidth)

  return (
    <Container useHamburgerMenu={useHamburgerMenu}>
      <SideMenu />
      <PageContainer showSearchBar={showSearchBar}>
        <TopBarContainer>
          {!!showSearchBar && <SearchBar />}
          <ProfileActionsControl />
        </TopBarContainer>
        {children}
      </PageContainer>
    </Container>
  )
}
