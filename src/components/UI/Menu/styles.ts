import styled from 'styled-components'

interface IMenuItemProps {
  /** @default false */
  isActive?: boolean
}

export const Container = styled.div`
  background-color: #3d405b;
  width: 20%;
  min-width: 270px;
  min-height: 100vh;
  padding: 15px 20px;
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
  width: calc(100% - 270px);
  height: 100vh;
  position: absolute;
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
