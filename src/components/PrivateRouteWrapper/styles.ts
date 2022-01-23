import styled from 'styled-components'

interface IContainerProps {
  useHamburgerMenu: boolean
}

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: ${({ useHamburgerMenu }: IContainerProps) =>
    useHamburgerMenu ? 'column' : 'row'};
`

export const TopBarContainer = styled.div`
  background: #fff;
  width: 100%;
  height: 60px;
  box-shadow: 0px 6px 22px -15px #c4c4c4;
  border-bottom: 1px solid #e0e0e0;
`

export const PageContainer = styled.div`
  width: 100%;
  padding: 0;
  margin: 0;
`

export const PageContent = styled.div`
  width: 100%;
  padding: 30px 20px;
`
