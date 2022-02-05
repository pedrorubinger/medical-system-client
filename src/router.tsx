import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getToken } from './utils/helpers/token'
import { Creators } from './store/ducks/auth/reducer'
import { GetAccount } from './pages/GetAccount'
import { Login } from './pages/Login'
import { RecoverPassword } from './pages/RecoverPassword'
import { SetPassword } from './pages/SetPassword'
import { RootState } from './store'
import { ProgressBar } from './components/UI/ProgressBar'
import {
  IPrivateRoute,
  PrivateRoutes,
} from './components/PrivateRouteWrapper/PrivateRoutes'
import { useHasPermission } from './hooks/useHasPermissions'

export const Router = () => {
  const dispatch = useDispatch()
  const { hasPermission } = useHasPermission()
  const user = useSelector((state: RootState) => state.AuthReducer)
  const [isMounted, setIsMounted] = useState(false)
  const isAuthenticated = user?.isAuthorized
  const publicRoutes = [
    <Route key="login" path="/login" element={<Login />} />,
    <Route
      key="recover-password"
      path="/recover-password"
      element={<RecoverPassword />}
    />,
    <Route key="set-password" path="/set-password" element={<SetPassword />} />,
    <Route key="get-account" path="/get-account" element={<GetAccount />} />,
  ]

  useEffect(() => {
    if (getToken() && !user?.isAuthorized && !user?.validating) {
      dispatch(Creators.validateToken())
    }

    setIsMounted(true)
  }, [])

  if (!isMounted || user?.validating) {
    return <ProgressBar />
  }

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated && publicRoutes?.map((route) => route)}
        {isAuthenticated &&
          PrivateRoutes?.map((route: IPrivateRoute) =>
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
