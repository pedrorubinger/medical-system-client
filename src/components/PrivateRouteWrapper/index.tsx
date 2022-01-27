import React, { useState } from 'react'

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
  const [mobileMenuIsOpened, setMobileMenuIsOpened] = useState(false)
  const useHamburgerMenu = !!(width && width < mobileLimitWidth)

  return (
    <div style={{ display: 'flex', background: 'red', height: '100%' }}>
      <Container useHamburgerMenu={useHamburgerMenu && !mobileMenuIsOpened}>
        {/* <Menu
          mobileMenuIsOpened={mobileMenuIsOpened}
          onOpenMobileMenu={() => setMobileMenuIsOpened(true)}
          onCloseMobileMenu={() => setMobileMenuIsOpened(false)}
        /> */}
        <Menu
          mobileMenuIsOpened={mobileMenuIsOpened}
          onOpenMobileMenu={() => setMobileMenuIsOpened(true)}
          onCloseMobileMenu={() => setMobileMenuIsOpened(false)}
        />
        <PageContainer
          useHamburgerMenu={useHamburgerMenu && mobileMenuIsOpened}>
          {!useHamburgerMenu && (
            <TopBarContainer>
              <SearchBar />
              <ProfileActionsControl />
            </TopBarContainer>
          )}
          <PageContent>{children}</PageContent>
        </PageContainer>
      </Container>
    </div>
  )
}
