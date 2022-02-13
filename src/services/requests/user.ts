import { AxiosResponse } from 'axios'
import { IPagination, IPaginationMeta, ISorting } from '../../interfaces/api'
import { IError } from '../../interfaces/error'
import { TRole } from '../../interfaces/roles'

import { IUser, IUserFormValues } from '../../interfaces/user'
import { handleError } from '../../utils/helpers/errors'
import { api } from '../api'

export interface IFetchUsersParams extends IPagination, Partial<ISorting> {
  cpf?: string | null
  name?: string | null
  email?: string | null
  role?: TRole | null
  filterOwn?: boolean | null
}

interface IFetchUsersAPIResponse {
  meta?: IPaginationMeta
  data: IUser[]
}

interface IFetchUsersResponse {
  data: IFetchUsersAPIResponse | null
  error: IError | null
}

interface IStoreOrUpdateUserResponse {
  user?: IUser | null
  error?: IError | null
}

interface IDeleteUserResponse {
  success: boolean
  error?: IError | null
}

interface IDeleteUserAPIResponse {
  success: boolean
}

interface IValidateResetTokenUserResponse {
  email: string
  id: number
}

interface IValidateResetTokenResponse {
  user?: IValidateResetTokenUserResponse | null
  error?: IError | null
}

interface IValidateResetTokenAPIResponse {
  success: boolean
  user: IValidateResetTokenUserResponse
}

interface IUpdateUserData {
  id: number
  password?: string
  new_password?: string
  name?: string
  email?: string
  cpf?: string
  phone?: string
  is_admin?: boolean
  role?: TRole
}

export const fetchUsers = async (
  params: IFetchUsersParams
): Promise<IFetchUsersResponse> => {
  try {
    const response: AxiosResponse<IFetchUsersAPIResponse> = await api.get(
      '/user',
      { params: { ...params, filterOwn: true } }
    )

    return { data: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { data: null, error }
  }
}

export const storeUser = async (
  data: IUserFormValues
): Promise<IStoreOrUpdateUserResponse> => {
  try {
    const response: AxiosResponse<IUser> = await api.post('/user', data)

    return { user: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { user: null, error }
  }
}

export const updateUser = async (
  data: IUpdateUserData
): Promise<IStoreOrUpdateUserResponse> => {
  try {
    const response: AxiosResponse<IUser> = await api.put(
      `/user/${data.id}`,
      data
    )

    return { user: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { user: null, error }
  }
}

export const deleteUser = async (id: number): Promise<IDeleteUserResponse> => {
  try {
    const response: AxiosResponse<IDeleteUserAPIResponse> = await api.delete(
      `/user/${id}`
    )

    return { success: response.data.success, error: null }
  } catch (err) {
    const error = handleError(err)

    return { success: false, error }
  }
}

export const validateResetToken = async (
  token: string
): Promise<IValidateResetTokenResponse> => {
  try {
    const response: AxiosResponse<IValidateResetTokenAPIResponse> =
      await api.get(`/user/password/validate/${token}`)

    return { user: response.data.user, error: null }
  } catch (err) {
    const error = handleError(err)

    return { user: null, error }
  }
}
