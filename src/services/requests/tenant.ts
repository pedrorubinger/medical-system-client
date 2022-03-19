import { AxiosResponse } from 'axios'
import { IPagination, IPaginationMeta, ISorting } from '../../interfaces/api'
import { IError } from '../../interfaces/error'

import { ITenant, ITenantFormValues } from '../../interfaces/tenant'
import { handleError } from '../../utils/helpers/errors'
import { api } from '../api'

export interface IFetchTenantsParams extends IPagination, Partial<ISorting> {
  name?: string | null
  filterOwn?: boolean | null
}

interface IFetchTenantsAPIResponse {
  meta?: IPaginationMeta
  data: ITenant[]
}

interface IFetchTenantsResponse {
  data: IFetchTenantsAPIResponse | null
  error: IError | null
}

interface IStoreOrUpdateTenantResponse {
  tenant?: ITenant | null
  error?: IError | null
}

interface IDeleteTenantResponse {
  success: boolean
  error?: IError | null
}

interface IDeleteTenantAPIResponse {
  success: boolean
}

interface IUpdateTenantData {
  id: number
  name?: string
  is_active?: boolean
}

export const fetchTenants = async (
  params: IFetchTenantsParams
): Promise<IFetchTenantsResponse> => {
  try {
    const response: AxiosResponse<IFetchTenantsAPIResponse> = await api.get(
      '/tenant',
      { params: { ...params, filterOwn: true } }
    )

    return { data: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { data: null, error }
  }
}

export const storeTenant = async (
  data: ITenantFormValues
): Promise<IStoreOrUpdateTenantResponse> => {
  try {
    const response: AxiosResponse<ITenant> = await api.post('/tenant', data)

    return { tenant: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { tenant: null, error }
  }
}

export const updateTenant = async (
  data: IUpdateTenantData
): Promise<IStoreOrUpdateTenantResponse> => {
  try {
    const response: AxiosResponse<ITenant> = await api.put(
      `/tenant/${data.id}`,
      data
    )

    return { tenant: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { tenant: null, error }
  }
}

export const deleteTenant = async (
  id: number
): Promise<IDeleteTenantResponse> => {
  try {
    const response: AxiosResponse<IDeleteTenantAPIResponse> = await api.delete(
      `/tenant/${id}`
    )

    return { success: response.data.success, error: null }
  } catch (err) {
    const error = handleError(err)

    return { success: false, error }
  }
}
