/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { api } from '../api'
import { handleError } from '../../utils/helpers/errors'
import { IError } from '../../interfaces/error'
import { IInsurance, IInsuranceFormValues } from '../../interfaces/insurance'
import { IPagination, IPaginationMeta, ISorting } from '../../interfaces/api'

export interface IFetchInsurancesParams extends IPagination, Partial<ISorting> {
  name?: string | null
}

interface IFetchInsurancesAPIResponse {
  meta?: IPaginationMeta
  data: IInsurance[]
}

interface IFetchInsurancesResponse {
  meta: IPaginationMeta | null
  data: IInsurance[] | null
  error: IError | null
}

interface IStoreOrUpdateInsuranceResponse {
  insurance: IInsurance | null
  error: IError | null
}

interface IDeleteInsuranceResponse {
  success: boolean
  error?: IError | null
}

interface IDeleteInsuranceAPIResponse {
  success: boolean
}

const isInstance = (data: any): data is IFetchInsurancesAPIResponse => {
  return 'meta' in data
}

export const fetchInsurances = async (
  params?: IFetchInsurancesParams
): Promise<IFetchInsurancesResponse> => {
  try {
    const response: AxiosResponse<IFetchInsurancesAPIResponse | IInsurance[]> =
      await api.get('/insurance', { params: { ...params } })

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

export const storeInsurance = async (
  data: IInsuranceFormValues
): Promise<IStoreOrUpdateInsuranceResponse> => {
  try {
    const response: AxiosResponse<IInsurance> = await api.post(
      '/insurance',
      data
    )

    return { insurance: response.data, error: null }
  } catch (err) {
    return { insurance: null, error: handleError(err) }
  }
}

export const updateInsurance = async (
  id: number,
  data: IInsuranceFormValues
): Promise<IStoreOrUpdateInsuranceResponse> => {
  try {
    const response: AxiosResponse<IInsurance> = await api.put(
      `/insurance/${id}`,
      data
    )

    return { insurance: response.data, error: null }
  } catch (err) {
    return { insurance: null, error: handleError(err) }
  }
}

export const deleteInsurance = async (
  id: number
): Promise<IDeleteInsuranceResponse> => {
  try {
    const response: AxiosResponse<IDeleteInsuranceAPIResponse> =
      await api.delete(`/insurance/${id}`)

    return { success: response.data.success, error: null }
  } catch (err) {
    return { success: false, error: handleError(err) }
  }
}
