import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { TRole } from './interfaces/roles'
import { GetAccount } from './pages/GetAccount'
import { Help } from './pages/Help'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { RecoverPassword } from './pages/RecoverPassword'
import { RootState } from './store'

type TPermission = TRole | '*'

interface IPrivateRoute {
  permissions: TPermission[]
  route: React.ReactElement | null
}

export const Router = () => {
  const user = useSelector((state: RootState) => state.UserReducer)
  const isAuthenticated = !!user?.data
  const publicRoutes = [
    <Route key="login" path="/login" element={<Login />} />,
    <Route
      key="recover-password"
      path="/recover-password"
      element={<RecoverPassword />}
    />,
    <Route key="get-account" path="/get-account" element={<GetAccount />} />,
  ]
  const privateRoutes: IPrivateRoute[] = [
    {
      permissions: ['*'],
      route: <Route key="root" path="/" element={<Home />} />,
    },
    {
      permissions: ['*'],
      route: <Route key="help" path="/help" element={<Help />} />,
    },
  ]

  const hasPermission = (permissions: TPermission[] = []) => {
    if (!user.data) {
      return false
    }

    if (permissions.includes('*' || user.data.role)) {
      return true
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated && publicRoutes?.map((route) => route)}
        {isAuthenticated &&
          privateRoutes?.map((route: IPrivateRoute) =>
            hasPermission(route.permissions) ? route.route : null
          )}

        {/* UNAUTHORIZED ACCESS: Redirect to default pages */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        {isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </BrowserRouter>
  )
}
