import { AxiosResponse } from 'axios'
import { all, call, fork, put, takeLatest } from 'redux-saga/effects'

import { api } from '../../../services/api'
import { IUser } from '../../../interfaces/user'
import { UserTypes, Creators } from './reducer'
import { handleError } from '../../../utils/helpers/errors'

function* fetchUsers() {
  try {
    const response: AxiosResponse<IUser[]> = yield call(api.get, '/user')

    yield put(Creators.fetchUsersSuccess(response.data))
  } catch (err: any) {
    yield put(Creators.fetchUsersFailure(handleError(err)))
  }
}

export function* watchFetchUsers() {
  yield takeLatest(UserTypes.FETCH_USERS, fetchUsers)
}

function* UserSaga() {
  yield all([fork(watchFetchUsers)])
}

export default UserSaga
