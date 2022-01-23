import { TPermission } from '../../components/PrivateRouteWrapper/PrivateRoutes'
import { TRole } from '../../interfaces/roles'

export const hasPermission = (permissions: TPermission[] = [], role: TRole) => {
  if (!role) {
    return false
  }

  if (permissions.includes('*') || permissions.includes(role)) {
    return true
  }
}
