import { AxiosResponse } from 'axios'

import { IError } from '../../interfaces/error'

import { ITenant } from '../../interfaces/tenant'
import { TRole } from '../../interfaces/roles'
import { IPagination, ISorting } from '../../interfaces/api'
import { handleError } from '../../utils/helpers/errors'
import { api } from '../api'
import {
  IFetchUsersAPIResponse,
  IFetchUsersResponse,
  IStoreUserData,
} from './user'

export interface IFetchTenantUserParams extends IPagination, Partial<ISorting> {
  cpf?: string | null
  name?: string | null
  email?: string | null
  role?: TRole | null
  filterOwn?: boolean | null
}

interface ITenantHeader {
  ownerTenant: boolean
  id?: number
}

interface IStoreTenantUserData extends IStoreUserData {
  owner_tenant: boolean
  tenant_name?: string
  tenant_id?: number
}

interface IStoreOrUpdateTenantResponse {
  tenant?: ITenant | null
  error?: IError | null
}

interface IDeleteTenantUserResponse {
  success: boolean
  error?: IError | null
}

interface IDeleteTenantUserAPIResponse {
  success: boolean
}

export const storeTenantUser = async (
  data: IStoreTenantUserData
): Promise<IStoreOrUpdateTenantResponse> => {
  try {
    const response: AxiosResponse<ITenant> = await api.post('/tenant_user', {
      ...data,
    })

    return { tenant: response.data, error: null }
  } catch (err) {
    return { tenant: null, error: handleError(err) }
  }
}

export const fetchTenantUsers = async (
  params: IFetchTenantUserParams,
  tenant: ITenantHeader
): Promise<IFetchUsersResponse> => {
  try {
    const config = {
      headers: { tenant_id: '', owner_tenant: tenant?.ownerTenant?.toString() },
      params: { ...params, filterOwn: true },
    }

    if (tenant?.id) {
      config.headers.tenant_id = tenant?.id.toString()
    }

    const response: AxiosResponse<IFetchUsersAPIResponse> = await api.get(
      '/tenant_user',
      config
    )

    return { data: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { data: null, error }
  }
}

export const deleteTenantUser = async (
  id: number,
  tenant: ITenantHeader
): Promise<IDeleteTenantUserResponse> => {
  try {
    const config = {
      headers: { tenant_id: '', owner_tenant: tenant?.ownerTenant?.toString() },
    }

    if (tenant?.id) {
      config.headers.tenant_id = tenant?.id.toString()
    }

    const response: AxiosResponse<IDeleteTenantUserAPIResponse> =
      await api.delete(`/tenant_user/${id}`, config)

    return { success: response.data.success, error: null }
  } catch (err) {
    const error = handleError(err)

    return { success: false, error }
  }
}
