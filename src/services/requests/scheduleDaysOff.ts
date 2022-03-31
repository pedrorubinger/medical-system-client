/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { api } from '../api'
import { handleError } from '../../utils/helpers/errors'
import { IError } from '../../interfaces/error'
import { IPagination, IPaginationMeta } from '../../interfaces/api'
import {
  IScheduleDaysOff,
  IScheduleDaysOffFormValues,
} from '../../interfaces/scheduleDaysOff'

interface IUpdateScheduleDaysOffData extends IScheduleDaysOffFormValues {
  doctorId: number
}

interface IFetchScheduleDaysOffByDoctorParams extends IPagination {
  doctorId: number
}

interface IFetchScheduleDaysOffAPIResponse {
  meta?: IPaginationMeta
  data: IScheduleDaysOff[]
}

interface IFetchScheduleDaysOffResponse {
  meta: IPaginationMeta | null
  data: IScheduleDaysOff[] | null
  error: IError | null
}

interface IStoreOrUpdateScheduleDayOffResponse {
  schedule_days_off: IScheduleDaysOff | null
  error: IError | null
}

interface IDeleteScheduleDayOffResponse {
  success: boolean
  error?: IError | null
}

interface IDeleteScheduleDayOffAPIResponse {
  success: boolean
}

const isInstance = (data: any): data is IFetchScheduleDaysOffAPIResponse => {
  return 'meta' in data
}

export const fetchScheduleDaysOffByDoctor = async (
  params?: IFetchScheduleDaysOffByDoctorParams
): Promise<IFetchScheduleDaysOffResponse> => {
  try {
    const response: AxiosResponse<
      IFetchScheduleDaysOffAPIResponse | IScheduleDaysOff[]
    > = await api.get('/schedule_days_off', { params: { ...params } })

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

export const storeScheduleDayOff = async (
  data: IScheduleDaysOffFormValues
): Promise<IStoreOrUpdateScheduleDayOffResponse> => {
  try {
    const response: AxiosResponse<IScheduleDaysOff> = await api.post(
      '/schedule_days_off',
      data
    )

    return { schedule_days_off: response.data, error: null }
  } catch (err) {
    return { schedule_days_off: null, error: handleError(err) }
  }
}

export const updateScheduleDayOff = async (
  id: number,
  data: IUpdateScheduleDaysOffData
): Promise<IStoreOrUpdateScheduleDayOffResponse> => {
  try {
    const response: AxiosResponse<IScheduleDaysOff> = await api.put(
      `/schedule_days_off/${id}`,
      data
    )

    return { schedule_days_off: response.data, error: null }
  } catch (err) {
    return { schedule_days_off: null, error: handleError(err) }
  }
}

export const deleteScheduleDayOff = async (
  id: number
): Promise<IDeleteScheduleDayOffResponse> => {
  try {
    const response: AxiosResponse<IDeleteScheduleDayOffAPIResponse> =
      await api.delete(`/schedule_days_off/${id}`)

    return { success: response.data.success, error: null }
  } catch (err) {
    return { success: false, error: handleError(err) }
  }
}
