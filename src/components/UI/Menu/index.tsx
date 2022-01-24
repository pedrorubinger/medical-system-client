import { useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'

import { useWindowDimensions } from '../../../hooks/useWindowDimensions'
import { useHasPermission } from '../../../hooks/useHasPermissions'
import {
  IPrivateRoute,
  PrivateRoutes,
} from '../../PrivateRouteWrapper/PrivateRoutes'
import {
  CloseBackdrop,
  Container,
  TopBar,
  LogoText,
  MenuItemsContainer,
  MenuItem,
  Backdrop,
} from './styles'
import { FiXCircle } from 'react-icons/fi'

interface IMenuProps {
  mobileMenuIsOpened: boolean
  onOpenMobileMenu: () => void
  onCloseMobileMenu: () => void
}

export const mobileLimitWidth = 1100

export const Menu = ({
  mobileMenuIsOpened,
  onCloseMobileMenu,
  onOpenMobileMenu,
}: IMenuProps) => {
  const navigate = useNavigate()
  const { hasPermission } = useHasPermission()
  const { width } = useWindowDimensions()
  const filteredItems = PrivateRoutes.filter(
    (item) => item.show && hasPermission(item.permissions)
  )

  const MenuList = (
    <MenuItemsContainer>
      {filteredItems.map((item: IPrivateRoute, i: number) => (
        <MenuItem
          key={i}
          title={item?.title}
          onClick={() => navigate(item.path)}
          isActive={window.location.pathname === item.path}>
          {item.icon}
          {item.name}
        </MenuItem>
      ))}
    </MenuItemsContainer>
  )

  if (!width || width >= mobileLimitWidth) {
    return (
      <Container>
        <LogoText>MedApp</LogoText>
        {MenuList}
      </Container>
    )
  }

  if (mobileMenuIsOpened) {
    return (
      <Container>
        <Backdrop onClick={onCloseMobileMenu} />
        <CloseBackdrop onClick={onCloseMobileMenu}>
          {width >= 410 ? 'Fechar' : ''} <FiXCircle size={23} />
        </CloseBackdrop>
        <LogoText>MedApp</LogoText>
        {MenuList}
      </Container>
    )
  }

  return (
    <TopBar>
      <GiHamburgerMenu
        color="#fff"
        size={25}
        cursor="pointer"
        onClick={onOpenMobileMenu}
      />
    </TopBar>
  )
}
