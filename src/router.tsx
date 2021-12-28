import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TRole } from './interfaces/roles'
import { GetAccount } from './pages/GetAccount'

import { Help } from './pages/Help'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { RecoverPassword } from './pages/RecoverPassword'

type TPermission = TRole | '*'

interface IPrivateRoute {
  permissions: TPermission[]
  route: React.ReactElement | null
}

export const Router = () => {
  const isAuthenticated = false
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
      route: <Route path="/" element={<Home />} />,
    },
    {
      permissions: ['*'],
      route: <Route key="help" path="/help" element={<Help />} />,
    },
  ]

  /** TO DO: Implement the method to check permissions */
  const hasPermission = (permissions: TPermission[] = []) => true

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
