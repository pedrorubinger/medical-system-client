import { AnyAction } from 'redux'

import { IError } from '../../../interfaces/error'
import { IUser } from '../../../interfaces/user'

interface IState {
  loading: boolean
  users: IUser[]
  error: IError | null
}

export const UserTypes = {
  FETCH_USERS: 'user/FETCH_USERS',
  FETCH_USERS_SUCCESS: 'user/FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILURE: 'user/FETCH_USERS_FAILURE',
  CLEAR_USERS: 'user/CLEAR_USERS',
}

const initialState: IState = {
  loading: false,
  error: null,
  users: [],
}

export default function reducer(
  state: IState = initialState,
  action: AnyAction
) {
  switch (action.type) {
    case UserTypes.FETCH_USERS:
      return { ...state, loading: true, error: null, users: [] }
    case UserTypes.FETCH_USERS_SUCCESS:
      return { ...state, loading: false, error: null, users: action.payload }
    case UserTypes.FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload, users: [] }
    case UserTypes.CLEAR_USERS:
      return { ...initialState }
    default:
      return state
  }
}

export const Creators = {
  fetchUsers: (): AnyAction => ({
    type: UserTypes.FETCH_USERS,
  }),
  fetchUsersSuccess: (payload: IUser[]): AnyAction => ({
    type: UserTypes.FETCH_USERS_SUCCESS,
    payload,
  }),
  fetchUsersFailure: (payload: IError): AnyAction => ({
    type: UserTypes.FETCH_USERS_FAILURE,
    payload,
  }),
  clearUsers: (): AnyAction => ({
    type: UserTypes.CLEAR_USERS,
  }),
}
