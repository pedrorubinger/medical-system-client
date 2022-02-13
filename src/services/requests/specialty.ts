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
  data: IFetchSpecialtiesAPIResponse | null
  error: IError | null
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

export const fetchSpecialties = async (
  params: IFetchSpecialtiesParams
): Promise<IFetchSpecialtiesResponse> => {
  try {
    const response: AxiosResponse<IFetchSpecialtiesAPIResponse> = await api.get(
      '/specialty',
      { params: { ...params } }
    )

    return { data: response.data, error: null }
  } catch (err) {
    return { data: null, error: handleError(err) }
  }
}

export const storeSpecialty = async (
  data: ISpecialtyFormValues
): Promise<IStoreOrUpdateSpecialtyResponse> => {
  try {
    const response: AxiosResponse<ISpecialty> = await api.post(
      '/specialty',
      data
    )

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
