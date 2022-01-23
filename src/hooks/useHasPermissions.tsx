import { useSelector } from 'react-redux'
import { TPermission } from '../components/PrivateRouteWrapper/PrivateRoutes'
import { RootState } from '../store'

interface IUseHasPermission {
  hasPermission: (permissions: TPermission[]) => boolean
}

export const useHasPermission = (): IUseHasPermission => {
  const user = useSelector((state: RootState) => state.UserReducer)
  const role = user?.data?.role
  const userIsAdmin = user?.data?.is_admin

  const hasPermission = (permissions: TPermission[] = []) => {
    if (!role) {
      return false
    }

    return (
      permissions.includes('*') ||
      (permissions.includes('admin') && userIsAdmin) ||
      permissions.includes(role)
    )
  }

  return { hasPermission }
}
