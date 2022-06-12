import { useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FiXCircle } from 'react-icons/fi'

import MedAppLogo from '../../../assets/images/medical-app-logo.svg'
import { useWindowDimensions } from '../../../hooks/useWindowDimensions'
import { useHasPermission } from '../../../hooks/useHasPermissions'
import {
  IPrivateRoute,
  PrivateRoutes,
} from '../../PrivateRouteWrapper/PrivateRoutes'
import {
  CloseBackdrop,
  CloseMenu,
  Container,
  TopBar,
  LogoText,
  MenuItemsContainer,
  MenuItem,
  Backdrop,
  LogoContainer,
} from './styles'

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
          onClick={() => {
            navigate(item.path)
            if (mobileMenuIsOpened) {
              onCloseMobileMenu()
            }
          }}
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
        <LogoContainer>
          <LogoText>MedApp</LogoText>
          <img src={MedAppLogo} alt="Logo" height={27} width={27} />
        </LogoContainer>
        {MenuList}
      </Container>
    )
  }

  if (mobileMenuIsOpened) {
    return (
      <Container mobileMenuIsOpened={mobileMenuIsOpened} width={width}>
        {width >= 670 && (
          <>
            <Backdrop onClick={onCloseMobileMenu} />
            <CloseBackdrop onClick={onCloseMobileMenu}>
              Fechar <FiXCircle size={23} />
            </CloseBackdrop>
          </>
        )}
        <LogoText>MedApp</LogoText>
        {MenuList}
        {width < 670 && (
          <CloseMenu onClick={onCloseMobileMenu}>
            Fechar <FiXCircle size={19} />
          </CloseMenu>
        )}
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
