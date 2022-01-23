import styled from 'styled-components'

interface IContainerProps {
  useHamburgerMenu: boolean
}

interface IPageContainerProps {
  /** @default false */
  showSearchBar?: boolean
}

export const Container = styled.div<IContainerProps>`
  display: flex;
  flex-direction: ${({ useHamburgerMenu }: IContainerProps) =>
    useHamburgerMenu ? 'column' : 'row'};
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
`

export const PageContainer = styled.div<IPageContainerProps>`
  width: 100%;
  padding: 30px;
  padding-top: ${({ showSearchBar = false }) => (showSearchBar ? 0 : '30px')};
`

export const TopBarContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
