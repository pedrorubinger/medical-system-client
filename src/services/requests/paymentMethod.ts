/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { api } from '../api'
import { handleError } from '../../utils/helpers/errors'
import { IError } from '../../interfaces/error'
import { IPagination, IPaginationMeta, ISorting } from '../../interfaces/api'
import {
  IPaymentMethod,
  IPaymentMethodFormValues,
} from '../../interfaces/paymentMethod'

export interface IFetchPaymentMethodsParams
  extends IPagination,
    Partial<ISorting> {
  name?: string | null
}

interface IFetchPaymentMethodsAPIResponse {
  meta?: IPaginationMeta
  data: IPaymentMethod[]
}

interface IFetchPaymentMethodsResponse {
  meta: IPaginationMeta | null
  data: IPaymentMethod[] | null
  error: IError | null
}

interface IStoreOrUpdatePaymentMethodResponse {
  insurance: IPaymentMethod | null
  error: IError | null
}

interface IDeletePaymentMethodResponse {
  success: boolean
  error?: IError | null
}

interface IDeletePaymentMethodAPIResponse {
  success: boolean
}

const isInstance = (data: any): data is IFetchPaymentMethodsAPIResponse => {
  return 'meta' in data
}

export const fetchPaymentMethods = async (
  params?: IFetchPaymentMethodsParams
): Promise<IFetchPaymentMethodsResponse> => {
  try {
    const response: AxiosResponse<
      IFetchPaymentMethodsAPIResponse | IPaymentMethod[]
    > = await api.get('/payment_method', { params: { ...params } })

    return isInstance(response.data)
      ? {
          data: response.data.data,
          meta: response.data.meta || null,
          error: null,
        }
      : { data: response.data, error: null, meta: null }
  } catch (err) {
    return { data: null, meta: null, error: handleError(err) }
  }
}

export const storePaymentMethod = async (
  data: IPaymentMethodFormValues
): Promise<IStoreOrUpdatePaymentMethodResponse> => {
  try {
    const response: AxiosResponse<IPaymentMethod> = await api.post(
      '/payment_method',
      data
    )

    return { insurance: response.data, error: null }
  } catch (err) {
    return { insurance: null, error: handleError(err) }
  }
}

export const updatePaymentMethod = async (
  id: number,
  data: IPaymentMethodFormValues
): Promise<IStoreOrUpdatePaymentMethodResponse> => {
  try {
    const response: AxiosResponse<IPaymentMethod> = await api.put(
      `/payment_method/${id}`,
      data
    )

    return { insurance: response.data, error: null }
  } catch (err) {
    return { insurance: null, error: handleError(err) }
  }
}

export const deletePaymentMethod = async (
  id: number
): Promise<IDeletePaymentMethodResponse> => {
  try {
    const response: AxiosResponse<IDeletePaymentMethodAPIResponse> =
      await api.delete(`/payment_method/${id}`)

    return { success: response.data.success, error: null }
  } catch (err) {
    return { success: false, error: handleError(err) }
  }
}
