/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { api } from '../api'
import { handleError } from '../../utils/helpers/errors'
import { IError } from '../../interfaces/error'
import { IAppointment, TAppointmentData } from '../../interfaces/appointment'

export interface IFetchAppointmentsParams {
  datetime?: string | null | undefined
  date?: string | null | undefined
  doctor?: number | null | undefined
}

interface IFetchAppointmentsAPIResponse {
  data: IAppointment[]
}

interface IFetchAppointmentsResponse {
  data: IAppointment[] | null
  error: IError | null
}

interface IStoreOrUpdateAppointmentResponse {
  appointment: IAppointment | null
  error: IError | null
}

interface IDeleteAppointmentResponse {
  success: boolean
  error?: IError | null | undefined
}

interface IDeleteAppointmentAPIResponse {
  success: boolean
}

interface IConfirmAppointmentResponse {
  appointment: IAppointment | null
  error?: IError | null | undefined
}

const isInstance = (data: any): data is IFetchAppointmentsAPIResponse => {
  return 'meta' in data
}

export const fetchAppointments = async (
  params?: IFetchAppointmentsParams
): Promise<IFetchAppointmentsResponse> => {
  try {
    const response: AxiosResponse<
      IFetchAppointmentsAPIResponse | IAppointment[]
    > = await api.get('/appointment', { params: { ...params } })

    return isInstance(response.data)
      ? {
          data: response.data.data,
          error: null,
        }
      : { data: response.data, error: null }
  } catch (err) {
    return { data: null, error: handleError(err) }
  }
}

export const storeAppointment = async (
  data: TAppointmentData
): Promise<IStoreOrUpdateAppointmentResponse> => {
  try {
    const response: AxiosResponse<IAppointment> = await api.post(
      '/appointment',
      data
    )

    return { appointment: response.data, error: null }
  } catch (err) {
    return { appointment: null, error: handleError(err) }
  }
}

export const updateAppointment = async (
  id: number,
  data: Partial<TAppointmentData>
): Promise<IStoreOrUpdateAppointmentResponse> => {
  try {
    const response: AxiosResponse<IAppointment> = await api.put(
      `/appointment/${id}`,
      data
    )

    return { appointment: response.data, error: null }
  } catch (err) {
    return { appointment: null, error: handleError(err) }
  }
}

export const deleteAppointment = async (
  id: number
): Promise<IDeleteAppointmentResponse> => {
  try {
    const response: AxiosResponse<IDeleteAppointmentAPIResponse> =
      await api.delete(`/appointment/${id}`)

    return { success: response.data.success, error: null }
  } catch (err) {
    return { success: false, error: handleError(err) }
  }
}

export const confirmAppointment = async (
  id: number,
  data: Partial<TAppointmentData>
): Promise<IConfirmAppointmentResponse> => {
  try {
    const response: AxiosResponse<IAppointment> = await api.put(
      `/appointment/${id}`,
      data
    )

    return { appointment: response.data, error: null }
  } catch (err) {
    return { appointment: null, error: handleError(err) }
  }
}
