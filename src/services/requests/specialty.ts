/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { api } from '../api'
import { handleError } from '../../utils/helpers/errors'
import { IError } from '../../interfaces/error'
import { ISpecialty, ISpecialtyFormValues } from '../../interfaces/specialty'
import { IPagination, IPaginationMeta, ISorting } from '../../interfaces/api'

export interface IFetchSpecialtiesParams
  extends IPagination,
    Partial<ISorting> {
  name?: string | null
}

interface IFetchSpecialtiesAPIResponse {
  meta?: IPaginationMeta
  data: ISpecialty[]
}

interface IFetchSpecialtiesResponse {
  data: ISpecialty[] | null
  error: IError | null
  meta: IPaginationMeta | null
}

interface IStoreOrUpdateSpecialtyResponse {
  specialty: ISpecialty | null
  error: IError | null
}

interface IDeleteSpecialtyResponse {
  success: boolean
  error?: IError | null
}

interface IDeleteSpecialtyAPIResponse {
  success: boolean
}

const isInstance = (data: any): data is IFetchSpecialtiesAPIResponse => {
  return 'meta' in data
}

export const fetchSpecialties = async (
  params?: IFetchSpecialtiesParams
): Promise<IFetchSpecialtiesResponse> => {
  try {
    const response: AxiosResponse<IFetchSpecialtiesAPIResponse | ISpecialty[]> =
      await api.get('/specialty', { params: { ...params } })

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

export const storeSpecialty = async (
  data: ISpecialtyFormValues,
  doctorId?: number | undefined
): Promise<IStoreOrUpdateSpecialtyResponse> => {
  try {
    const response: AxiosResponse<ISpecialty> = await api.post('/specialty', {
      ...data,
      doctorId,
    })

    return { specialty: response.data, error: null }
  } catch (err) {
    return { specialty: null, error: handleError(err) }
  }
}

export const updateSpecialty = async (
  id: number,
  data: ISpecialtyFormValues
): Promise<IStoreOrUpdateSpecialtyResponse> => {
  try {
    const response: AxiosResponse<ISpecialty> = await api.put(
      `/specialty/${id}`,
      data
    )

    return { specialty: response.data, error: null }
  } catch (err) {
    return { specialty: null, error: handleError(err) }
  }
}

export const deleteSpecialty = async (
  id: number
): Promise<IDeleteSpecialtyResponse> => {
  try {
    const response: AxiosResponse<IDeleteSpecialtyAPIResponse> =
      await api.delete(`/specialty/${id}`)

    return { success: response.data.success, error: null }
  } catch (err) {
    return { success: false, error: handleError(err) }
  }
}
