import { AxiosError } from 'axios'

import { IError } from '../../interfaces/error'

const INTERNAL_ERROR_MSG =
  'Desculpe, um erro interno ocorreu. Por favor, tente novamente mais tarde ou contate-nos.'

export const handleError = (err: AxiosError | any): IError => {
  const errorObject: IError = {
    message: INTERNAL_ERROR_MSG,
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
  }

  if (err?.data) {
    if (err.data.status === 400) {
      errorObject.validation = {} /** TO DO: Implement validation errors... */
    }

    errorObject.code = err.data?.code
    errorObject.message = err.data.message
    errorObject.status = err.data.status
  }

  return errorObject
}
