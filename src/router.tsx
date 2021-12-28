import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TRole } from './interfaces/roles'

import { Help } from './pages/Help'
import { Home } from './pages/Home'
import { Login } from './pages/Login'

type TPermission = TRole | '*'

interface IPrivateRoute {
  permissions: TPermission[]
  route: React.ReactElement | null
}

export const Router = () => {
  const isAuthenticated = true
  const publicRoutes = [<Route key="login" path="/login" element={<Login />} />]
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
        {!isAuthenticated && <Route path="*" element={<Navigate to="/login" />} />}
        {isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </BrowserRouter>
  )
}
