import { IError } from '../../interfaces/error'
import { handleError } from '../../utils/helpers/errors'
import { api } from '../api'

interface IPasswordRecoveryResponse {
  success: boolean
  error: IError | null
}

export const recoverPassword = async (data: {
  email: string
}): Promise<IPasswordRecoveryResponse> => {
  try {
    await api.put('/user/password/change_password', data)
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: handleError(err) }
  }
}
