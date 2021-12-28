import { AnyAction } from 'redux'

import { IError } from '../../../interfaces/error'
import { IUser } from '../../../interfaces/user'

interface ICredentials {
  email: string
  password: string
}

interface IState {
  loading: boolean
  data: IUser | null
  error: IError | null
}

export const UserTypes = {
  USER_SIGN_IN_REQUEST: 'user/USER_SIGN_IN_REQUEST',
  USER_SIGN_IN_SUCCESS: 'user/USER_SIGN_IN_SUCCESS',
  USER_SIGN_IN_FAILURE: 'user/USER_SIGN_IN_FAILURE',
  USER_SIGN_IN_CLEAR: 'USER/USER_SIGN_IN_CLEAR',
}

const initialState = {
  loading: false,
  data: null,
  error: null,
}

export default function reducer(
  state: IState = initialState,
  action: AnyAction
) {
  switch (action.type) {
    case UserTypes.USER_SIGN_IN_REQUEST:
      return { loading: true, data: null, error: null }
    case UserTypes.USER_SIGN_IN_SUCCESS:
      return { loading: false, data: action.payload, error: null }
    case UserTypes.USER_SIGN_IN_FAILURE:
      return { loading: false, data: null, error: action.payload }
    case UserTypes.USER_SIGN_IN_CLEAR:
      return { ...initialState }
    default:
      return state
  }
}

export const Creators = {
  signIn: (payload: ICredentials): AnyAction => ({
    type: UserTypes.USER_SIGN_IN_REQUEST,
    payload,
  }),
  signInSuccess: (payload: IUser): AnyAction => ({
    type: UserTypes.USER_SIGN_IN_SUCCESS,
    payload,
  }),
  signInFailure: (payload: IError): AnyAction => ({
    type: UserTypes.USER_SIGN_IN_FAILURE,
    payload,
  }),
  clearSignIn: (): AnyAction => ({
    type: UserTypes.USER_SIGN_IN_CLEAR,
  }),
}
