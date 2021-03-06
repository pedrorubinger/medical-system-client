import React, { useState } from 'react'

import { useWindowDimensions } from '../../hooks/useWindowDimensions'
import { ProfileActionsControl } from './ProfileActionsControl'
import { SearchBar } from '../UI/SearchBar'
import { mobileLimitWidth, Menu } from '../UI/Menu'
import {
  Container,
  // CopyrightNotice,
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
    <Container useHamburgerMenu={useHamburgerMenu && !mobileMenuIsOpened}>
      {width && width < 670 && useHamburgerMenu && mobileMenuIsOpened ? (
        <Menu
          mobileMenuIsOpened={mobileMenuIsOpened}
          onOpenMobileMenu={() => setMobileMenuIsOpened(true)}
          onCloseMobileMenu={() => setMobileMenuIsOpened(false)}
        />
      ) : (
        <>
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
            <PageContent>
              {children}
              {/* <CopyrightNotice>
                Copyright &copy; {new Date()?.getFullYear()} MedApp by{' '}
                <a
                  href="https://github.com/pedrorubinger"
                  target="_blank"
                  rel="noreferrer">
                  Pedro Rubinger
                </a>
              </CopyrightNotice> */}
            </PageContent>
          </PageContainer>
        </>
      )}
    </Container>
  )
}
