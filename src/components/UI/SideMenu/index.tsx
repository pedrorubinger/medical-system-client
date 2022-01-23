import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useWindowDimensions } from '../../../hooks/useWindowDimensions'
import { RootState } from '../../../store'
import { hasPermission } from '../../../utils/helpers/permissions'
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
  const { width } = useWindowDimensions()
  const user = useSelector((state: RootState) => state.UserReducer)
  const filteredItems = PrivateRoutes.filter(
    (item) => item.show && hasPermission(item.permissions, user?.data?.role)
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
