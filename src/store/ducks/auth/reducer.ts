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

export const AuthTypes = {
  AUTH_SIGN_IN_REQUEST: 'auth/AUTH_SIGN_IN_REQUEST',
  AUTH_SIGN_IN_SUCCESS: 'auth/AUTH_SIGN_IN_SUCCESS',
  AUTH_SIGN_IN_FAILURE: 'auth/AUTH_SIGN_IN_FAILURE',
  AUTH_SIGN_IN_CLEAR: 'auth/AUTH_SIGN_IN_CLEAR',
  AUTH_VALIDATE_TOKEN_REQUEST: 'auth/AUTH_VALIDATE_TOKEN_REQUEST',
  AUTH_VALIDATE_TOKEN_SUCCESS: 'auth/AUTH_VALIDATE_TOKEN_SUCCESS',
  AUTH_VALIDATE_TOKEN_FAILURE: 'auth/AUTH_VALIDATE_TOKEN_FAILURE',
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
    case AuthTypes.AUTH_SIGN_IN_REQUEST:
      return {
        ...state,
        loading: true,
        validating: false,
        data: null,
        error: null,
        isAuthorized: false,
      }
    case AuthTypes.AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        loading: false,
        validating: false,
        isAuthorized: true,
        data: action.payload,
        error: null,
      }
    case AuthTypes.AUTH_SIGN_IN_FAILURE:
      return {
        ...state,
        loading: false,
        validating: false,
        data: null,
        isAuthorized: false,
        error: action.payload,
      }
    case AuthTypes.AUTH_VALIDATE_TOKEN_REQUEST:
      return { ...state, validating: true, isAuthorized: false, error: null }
    case AuthTypes.AUTH_VALIDATE_TOKEN_SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: null,
        validating: false,
        isAuthorized: true,
      }
    case AuthTypes.AUTH_VALIDATE_TOKEN_FAILURE:
      return {
        ...state,
        validating: false,
        isAuthorized: false,
        error: action.payload,
      }
    case AuthTypes.AUTH_SIGN_IN_CLEAR:
      return { ...initialState }
    default:
      return state
  }
}

export const Creators = {
  signIn: (payload: ICredentials): AnyAction => ({
    type: AuthTypes.AUTH_SIGN_IN_REQUEST,
    payload,
  }),
  validateToken: (): AnyAction => ({
    type: AuthTypes.AUTH_VALIDATE_TOKEN_REQUEST,
  }),
  signInSuccess: (payload: IUser): AnyAction => ({
    type: AuthTypes.AUTH_SIGN_IN_SUCCESS,
    payload,
  }),
  signInFailure: (payload: IError): AnyAction => ({
    type: AuthTypes.AUTH_SIGN_IN_FAILURE,
    payload,
  }),
  validateTokenSuccess: (payload: IUser): AnyAction => ({
    type: AuthTypes.AUTH_VALIDATE_TOKEN_SUCCESS,
    payload,
  }),
  validateTokenFailure: (payload: IError): AnyAction => ({
    type: AuthTypes.AUTH_VALIDATE_TOKEN_FAILURE,
    payload,
  }),
  clearSignIn: (): AnyAction => ({
    type: AuthTypes.AUTH_SIGN_IN_CLEAR,
  }),
}
