import { useNavigate } from 'react-router-dom'

import { useWindowDimensions } from '../../../hooks/useWindowDimensions'
import { useHasPermission } from '../../../hooks/useHasPermissions'
import {
  IPrivateRoute,
  PrivateRoutes,
} from '../../PrivateRouteWrapper/PrivateRoutes'
import {
  Container,
  TopBar,
  LogoText,
  MenuItemsContainer,
  MenuItem,
} from './styles'

export const mobileLimitWidth = 1100

export const SideMenu = () => {
  const navigate = useNavigate()
  const { hasPermission } = useHasPermission()
  const { width } = useWindowDimensions()
  const filteredItems = PrivateRoutes.filter(
    (item) => item.show && hasPermission(item.permissions)
  )

  if (!width || width >= mobileLimitWidth) {
    return (
      <Container>
        <LogoText>MedApp</LogoText>
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
      </Container>
    )
  }

  return <TopBar />
}
