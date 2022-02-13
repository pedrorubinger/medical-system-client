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
  data: IFetchInsurancesAPIResponse | null
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

export const fetchInsurances = async (
  params: IFetchInsurancesParams
): Promise<IFetchInsurancesResponse> => {
  try {
    const response: AxiosResponse<IFetchInsurancesAPIResponse> = await api.get(
      '/insurance',
      { params: { ...params } }
    )

    return { data: response.data, error: null }
  } catch (err) {
    return { data: null, error: handleError(err) }
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
