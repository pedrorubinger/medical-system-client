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
  AUTH_SET_USER: 'auth/SET_USER',
  AUTH_SIGN_IN_REQUEST: 'auth/AUTH_SIGN_IN_REQUEST',
  AUTH_SIGN_IN_SUCCESS: 'auth/AUTH_SIGN_IN_SUCCESS',
  AUTH_SIGN_IN_FAILURE: 'auth/AUTH_SIGN_IN_FAILURE',
  AUTH_SIGN_IN_CLEAR: 'auth/AUTH_SIGN_IN_CLEAR',
  AUTH_VALIDATE_TOKEN_REQUEST: 'auth/AUTH_VALIDATE_TOKEN_REQUEST',
  AUTH_VALIDATE_TOKEN_SUCCESS: 'auth/AUTH_VALIDATE_TOKEN_SUCCESS',
  AUTH_VALIDATE_TOKEN_FAILURE: 'auth/AUTH_VALIDATE_TOKEN_FAILURE',
  AUTH_GET_USER_DATA_REQUEST: 'auth/AUTH_GET_USER_DATA_REQUEST',
  AUTH_GET_USER_DATA_SUCCESS: 'auth/AUTH_GET_USER_DATA_SUCCESS',
  AUTH_GET_USER_DATA_FAILURE: 'auth/AUTH_GET_USER_DATA_FAILURE',
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
    case AuthTypes.AUTH_SET_USER:
      return {
        ...state,
        loading: false,
        validating: false,
        data: action.payload,
        error: null,
      }
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
    case AuthTypes.AUTH_GET_USER_DATA_REQUEST:
      return { ...state, loading: true }
    case AuthTypes.AUTH_GET_USER_DATA_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
        isAuthorized: true,
      }
    case AuthTypes.AUTH_GET_USER_DATA_FAILURE:
      return {
        ...state,
        data: null,
        loading: false,
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
  setUser: (payload: IUser): AnyAction => ({
    type: AuthTypes.AUTH_SET_USER,
    payload,
  }),
  signIn: (payload: ICredentials): AnyAction => ({
    type: AuthTypes.AUTH_SIGN_IN_REQUEST,
    payload,
  }),
  signInSuccess: (payload: IUser): AnyAction => ({
    type: AuthTypes.AUTH_SIGN_IN_SUCCESS,
    payload,
  }),
  signInFailure: (payload: IError | null): AnyAction => ({
    type: AuthTypes.AUTH_SIGN_IN_FAILURE,
    payload,
  }),
  validateToken: (): AnyAction => ({
    type: AuthTypes.AUTH_VALIDATE_TOKEN_REQUEST,
  }),
  validateTokenSuccess: (payload: IUser): AnyAction => ({
    type: AuthTypes.AUTH_VALIDATE_TOKEN_SUCCESS,
    payload,
  }),
  validateTokenFailure: (payload: IError): AnyAction => ({
    type: AuthTypes.AUTH_VALIDATE_TOKEN_FAILURE,
    payload,
  }),
  getUserData: (payload: { id: number }): AnyAction => ({
    type: AuthTypes.AUTH_GET_USER_DATA_REQUEST,
    payload,
  }),
  getUserDataSuccess: (payload: IUser): AnyAction => ({
    type: AuthTypes.AUTH_GET_USER_DATA_SUCCESS,
    payload,
  }),
  getUserDataFailure: (payload: IError): AnyAction => ({
    type: AuthTypes.AUTH_GET_USER_DATA_FAILURE,
    payload,
  }),
  clearSignIn: (): AnyAction => ({
    type: AuthTypes.AUTH_SIGN_IN_CLEAR,
  }),
}
