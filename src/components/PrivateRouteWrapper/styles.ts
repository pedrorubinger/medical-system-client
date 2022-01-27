import styled from 'styled-components'

interface IContainerProps {
  useHamburgerMenu: boolean
}

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #f3f4f7;
  display: flex;
  flex-direction: ${({ useHamburgerMenu }: IContainerProps) =>
    useHamburgerMenu ? 'column' : 'row'};
  overflow-x: auto;
`

export const TopBarContainer = styled.div`
  background: #fff;
  width: 100%;
  height: 70px;
  box-shadow: 0px 6px 22px -15px #c4c4c4;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`

export const PageContainer = styled.div<IContainerProps>`
  height: 100%;
  padding: 0;
  margin: 0;
  width: ${({ useHamburgerMenu }) =>
    useHamburgerMenu ? 'calc(100% - 270px)' : '100%'};
  min-width: 400px;
  overflow: x;
`

export const PageContent = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  padding: 25px 20px;
  overflow: auto;
`
