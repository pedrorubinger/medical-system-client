import { AxiosResponse } from 'axios'
import { AnyAction } from 'redux'
import { all, call, fork, put, takeLatest } from 'redux-saga/effects'

import { api } from '../../../services/api'
import { IUser } from '../../../interfaces/user'
import { UserTypes, Creators } from './reducer'
import { setToken } from '../../../utils/helpers/token'
import { handleError } from '../../../utils/helpers/errors'

interface ISignInResponse {
  user: IUser
  token: string
}

function* userSignIn(action: AnyAction) {
  try {
    const response: AxiosResponse<ISignInResponse> = yield call(
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

export function* watchSignInUser() {
  yield takeLatest(UserTypes.USER_SIGN_IN_REQUEST, userSignIn)
}

function* UserSaga() {
  yield all([fork(watchSignInUser)])
}

export default UserSaga
