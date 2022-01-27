import styled from 'styled-components'

interface IMenuItemProps {
  /** @default false */
  isActive?: boolean
}

interface IContainerProps {
  /** @default false */
  mobileMenuIsOpened?: boolean
  width?: number
}

export const Container = styled.div<IContainerProps>`
  background-color: #3d405b;
  width: 20%;
  min-width: 270px;
  min-height: 100vh;
  padding: 15px 20px;
  width: ${({ mobileMenuIsOpened = false, width }) =>
    mobileMenuIsOpened && width && width < 670 ? '100%' : '20%'};
  overflow: auto;
`

export const TopBar = styled.div`
  background-color: #3d405b;
  width: 100%;
  height: 50px;
  padding: 10px;
  min-width: 400px;
  overflow-x: auto;
`

export const LogoText = styled.h1`
  color: #fff;
  font-size: 25px;
  align-self: center;
  text-align: center;
  transition: 0.8s;
  font-family: 'Antic Slab', serif;
  padding-bottom: 20px;
  border-bottom: 1px solid #6b6c6d;
  cursor: default;

  &:hover {
    text-shadow: 0px 1px 0px #f8f8f8;
  }
`

export const MenuItemsContainer = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 35px;
  justify-content: center;
`

export const MenuItem = styled.li<IMenuItemProps>`
  color: ${({ isActive = false }) => (isActive ? '#fff' : '#b1b6bf')};
  background-color: ${({ isActive = false }) => (isActive ? '#363954' : '')};
  border-left: ${({ isActive = false }) =>
    isActive ? '4px solid #272a42' : '0px solid #3d405b'};
  padding: 12px;
  margin: 3px 0;
  display: flex;
  align-items: center;
  transition: 0.3s;
  cursor: pointer;

  & svg {
    margin-right: 10px;
  }

  &:hover {
    color: #fff;
    background-color: #363954;
    text-shadow: 0px 1px 0px #f4f4f4;
  }
`

export const Backdrop = styled.div`
  background-color: #000;
  opacity: 0.8;
  width: calc(100vw + 270px);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 270px;
`

export const CloseBackdrop = styled.span`
  color: #fff;
  position: absolute;
  display: flex;
  right: 10px;
  top: 10px;
  transition: 0.7s;
  font-size: 22px;
  cursor: pointer;

  & svg {
    margin-left: 6px;
  }

  &:hover {
    text-shadow: 0px 1px 0px #f4f4f4;
  }
`

export const CloseMenu = styled.span`
  color: #fff;
  display: flex;
  margin-top: 15px;
  border-top: 1px solid #6b6c6d;
  padding-top: 20px;
  margin-left: 12px;
  transition: 0.7s;
  font-size: 18px;
  cursor: pointer;

  & svg {
    margin-left: 6px;
  }

  &:hover {
    text-shadow: 0px 1px 0px #f4f4f4;
  }
`
