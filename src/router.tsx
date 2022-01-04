import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getToken } from './utils/helpers/token'
import { Creators } from './store/ducks/user/reducer'
import { TRole } from './interfaces/roles'
import { GetAccount } from './pages/GetAccount'
import { Help } from './pages/Help'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { RecoverPassword } from './pages/RecoverPassword'
import { RootState } from './store'
import { ProgressBar } from './components/UI/ProgressBar'

type TPermission = TRole | '*'

interface IPrivateRoute {
  permissions: TPermission[]
  path: string
  route: React.ReactElement | null
}

export const Router = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.UserReducer)
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const isAuthenticated = user?.isAuthorized
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
      path: '/',
      route: <Route key="root" path="/" element={<Home />} />,
    },
    {
      permissions: ['*'],
      path: '/help',
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

  useEffect(() => {
    if (getToken() && !user?.isAuthorized && !user?.validating) {
      dispatch(Creators.validateToken())
    }

    setIsMounted(true)
  }, [])

  if (!isMounted || user?.loading || user?.validating) {
    return <ProgressBar />
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
