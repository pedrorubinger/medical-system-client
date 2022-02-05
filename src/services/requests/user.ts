import { notification } from 'antd'
import { AxiosResponse } from 'axios'
import { IError } from '../../interfaces/error'
import { TRole } from '../../interfaces/roles'

import { IUser, IUserFormValues } from '../../interfaces/user'
import { handleError } from '../../utils/helpers/errors'
import { api } from '../api'

interface IStoreOrUpdateUserResponse {
  user?: IUser | null
  error?: IError | null
}

interface IValidateResetTokenUserResponse {
  email: string
  id: number
}

interface IValidateResetTokenResponse {
  user?: IValidateResetTokenUserResponse | null
  error?: IError | null
}

interface IValidateResetTokenAxiosResponse {
  success: boolean
  user: IValidateResetTokenUserResponse
}

interface IUpdateUserData {
  id: number
  password?: string
  confirmed?: string
  name?: string
  email?: string
  cpf?: string
  phone?: string
  is_admin?: boolean
  role?: TRole
}

export const fetchUsers = async () => {
  try {
    const response: AxiosResponse<IUser[]> = await api.get('/user')

    return response.data
  } catch (err) {
    const error = handleError(err)

    notification.error({
      message: error.message,
    })
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

export const validateResetToken = async (
  token: string
): Promise<IValidateResetTokenResponse> => {
  try {
    const response: AxiosResponse<IValidateResetTokenAxiosResponse> =
      await api.get(`/user/set_password/${token}`)

    return { user: response.data.user, error: null }
  } catch (err) {
    const error = handleError(err)

    return { user: null, error }
  }
}
