import styled from 'styled-components'

interface IContainerProps {
  useHamburgerMenu: boolean
}

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  flex-direction: ${({ useHamburgerMenu }: IContainerProps) =>
    useHamburgerMenu ? 'column' : 'row'};
  overflow: auto;
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
  /* position: fixed; */
`

export const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  /* background: red; */
`

export const PageContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px 20px;
  /* margin-top: 70px; */
`
