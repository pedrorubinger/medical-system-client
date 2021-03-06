/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'
import { AnyAction } from 'redux'
import { all, call, fork, put, takeLatest } from 'redux-saga/effects'

import { api } from '../../../services/api'
import { IUser } from '../../../interfaces/user'
import { AuthTypes, Creators } from './reducer'
import { setToken } from '../../../utils/helpers/token'
import { handleError } from '../../../utils/helpers/errors'

interface ISignInResponseData {
  user: IUser
  token: string
}

interface IValidateTokenResponseData {
  user: IUser
}

function* userSignIn(action: AnyAction) {
  try {
    const response: AxiosResponse<ISignInResponseData> = yield call(
      api.post,
      '/session',
      action.payload
    )

    yield put(Creators.signInSuccess(response.data.user))
    yield setToken(response.data.token)
  } catch (err: any) {
    if (err?.data?.status === 400) {
      yield put(
        Creators.signInFailure({
          message: 'Email ou senha inválidos!',
          status: 400,
        })
      )
    } else {
      yield put(Creators.signInFailure(handleError(err)))
    }
  }
}

function* validateToken() {
  try {
    const response: AxiosResponse<IValidateTokenResponseData> = yield call(
      api.get,
      '/session/validate'
    )

    yield put(Creators.validateTokenSuccess(response.data.user))
  } catch (err: any) {
    yield put(Creators.signInFailure(null))
  }
}

function* getUserData(action: AnyAction) {
  try {
    const response: AxiosResponse<IUser> = yield call(
      api.get,
      `/user/${action.payload.id}`
    )

    yield put(Creators.getUserDataSuccess(response.data))
  } catch (err: any) {
    yield put(Creators.getUserDataFailure(handleError(err)))
  }
}

export function* watchSignInUser() {
  yield takeLatest(AuthTypes.AUTH_SIGN_IN_REQUEST, userSignIn)
}

export function* watchValidateToken() {
  yield takeLatest(AuthTypes.AUTH_VALIDATE_TOKEN_REQUEST, validateToken)
}

export function* watchGetUserData() {
  yield takeLatest(AuthTypes.AUTH_GET_USER_DATA_REQUEST, getUserData)
}

function* AuthSaga() {
  yield all([
    fork(watchSignInUser),
    fork(watchValidateToken),
    fork(watchGetUserData),
  ])
}

export default AuthSaga
