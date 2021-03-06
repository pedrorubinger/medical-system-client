/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { notification } from 'antd'
import { ErrorOption } from 'react-hook-form'

import { IBadRequestError, IError } from '../../interfaces/error'
import { BAD_REQUEST_MESSAGES, ERROR_MESSAGES } from '../constants/errors'

const getErrorMessage = (err: any, errStatus: any) => {
  if (ERROR_MESSAGES?.[err.data?.code]) {
    return ERROR_MESSAGES?.[err.data?.code]
  }

  if (errStatus === 500) {
    return ERROR_MESSAGES.INTERNAL_ERROR_MSG
  }

  return err.data?.message || ERROR_MESSAGES.INTERNAL_ERROR_MSG
}

export const handleError = (
  err: AxiosError | any,
  notificate = true
): IError => {
  const errorObject: IError = {
    message: ERROR_MESSAGES.INTERNAL_ERROR_MSG,
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
  }

  const errStatus = err?.data?.status || err?.status || 500

  if (err?.data) {
    if ((errStatus === 400 || errStatus === 422) && err.data?.errors?.length) {
      errorObject.validation = err.data.errors.map(
        (validationErr: IBadRequestError) => ({
          ...validationErr,
          message:
            BAD_REQUEST_MESSAGES?.[validationErr.message] ||
            BAD_REQUEST_MESSAGES.DEFAULT,
        })
      )
      errorObject.code = 'VALIDATION_ERROR'
      errorObject.message = 'Alguns campos requerem sua atenção!'
    } else {
      errorObject.code = err.data?.code
      errorObject.message = getErrorMessage(err, errStatus)
    }
  }

  if (errStatus !== 422 && errStatus !== 400 && notificate) {
    notification.error({ message: errorObject.message })
  }

  errorObject.status = errStatus
  return errorObject
}

export function setFieldErrors<T>(
  setError: (
    name: T,
    error: ErrorOption,
    options?:
      | {
          shouldFocus: boolean
        }
      | undefined
  ) => void,
  error: IError
) {
  if (!error?.validation?.length) {
    return null
  }

  if (error.status === 422 || error.status === 400) {
    error.validation.forEach((err) => {
      setError(err.field as unknown as T, {
        type: 'manual',
        message: err.message,
      })
    })
  }
}
