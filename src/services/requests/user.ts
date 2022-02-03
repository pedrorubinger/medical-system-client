import { notification } from 'antd'
import { AxiosResponse } from 'axios'
import { IError } from '../../interfaces/error'

import { IUser, IUserFormValues } from '../../interfaces/user'
import { handleError } from '../../utils/helpers/errors'
import { api } from '../api'

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

interface IStoreUserResponse {
  user?: IUser | null
  error?: IError | null
}

export const storeUser = async (
  data: IUserFormValues
): Promise<IStoreUserResponse> => {
  try {
    const response: AxiosResponse<IUser> = await api.post('/user', data)

    return { user: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { user: null, error }
  }
}
