import { AnyAction } from 'redux'

import { IError } from '../../../interfaces/error'
import { IUser } from '../../../interfaces/user'

interface ICredentials {
  email: string
  password: string
}

interface IState {
  loading: boolean
  validating: boolean
  data: IUser | null
  error: IError | null
  isAuthorized: boolean
}

export const UserTypes = {
  USER_SIGN_IN_REQUEST: 'user/USER_SIGN_IN_REQUEST',
  USER_SIGN_IN_SUCCESS: 'user/USER_SIGN_IN_SUCCESS',
  USER_SIGN_IN_FAILURE: 'user/USER_SIGN_IN_FAILURE',
  USER_SIGN_IN_CLEAR: 'user/USER_SIGN_IN_CLEAR',
  USER_VALIDATE_TOKEN_REQUEST: 'user/USER_VALIDATE_TOKEN_REQUEST',
  USER_VALIDATE_TOKEN_SUCCESS: 'user/USER_VALIDATE_TOKEN_SUCCESS',
  USER_VALIDATE_TOKEN_FAILURE: 'user/USER_VALIDATE_TOKEN_FAILURE',
}

const initialState: IState = {
  loading: false,
  validating: false,
  isAuthorized: false,
  data: null,
  error: null,
}

export default function reducer(
  state: IState = initialState,
  action: AnyAction
) {
  switch (action.type) {
    case UserTypes.USER_SIGN_IN_REQUEST:
      return {
        ...state,
        loading: true,
        validating: false,
        data: null,
        error: null,
        isAuthorized: false,
      }
    case UserTypes.USER_SIGN_IN_SUCCESS:
      return {
        ...state,
        loading: false,
        validating: false,
        isAuthorized: true,
        data: action.payload,
        error: null,
      }
    case UserTypes.USER_SIGN_IN_FAILURE:
      return {
        ...state,
        loading: false,
        validating: false,
        data: null,
        isAuthorized: false,
        error: action.payload,
      }
    case UserTypes.USER_VALIDATE_TOKEN_REQUEST:
      return { ...state, validating: true, isAuthorized: false, error: null }
    case UserTypes.USER_VALIDATE_TOKEN_SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: null,
        validating: false,
        isAuthorized: true,
      }
    case UserTypes.USER_VALIDATE_TOKEN_FAILURE:
      return {
        ...state,
        validating: false,
        isAuthorized: false,
        error: action.payload,
      }
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
  validateToken: (): AnyAction => ({
    type: UserTypes.USER_VALIDATE_TOKEN_REQUEST,
  }),
  signInSuccess: (payload: IUser): AnyAction => ({
    type: UserTypes.USER_SIGN_IN_SUCCESS,
    payload,
  }),
  signInFailure: (payload: IError): AnyAction => ({
    type: UserTypes.USER_SIGN_IN_FAILURE,
    payload,
  }),
  validateTokenSuccess: (payload: IUser): AnyAction => ({
    type: UserTypes.USER_VALIDATE_TOKEN_SUCCESS,
    payload,
  }),
  validateTokenFailure: (payload: IError): AnyAction => ({
    type: UserTypes.USER_VALIDATE_TOKEN_FAILURE,
    payload,
  }),
  clearSignIn: (): AnyAction => ({
    type: UserTypes.USER_SIGN_IN_CLEAR,
  }),
}
