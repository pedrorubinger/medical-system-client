/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { api } from '../api'
import { handleError } from '../../utils/helpers/errors'
import { IError } from '../../interfaces/error'
import { IPagination, IPaginationMeta, ISorting } from '../../interfaces/api'
import {
  IAppointment,
  IMyAppointment,
  TAppointmentData,
} from '../../interfaces/appointment'

export interface IFetchAppointmentsParams
  extends Partial<IPagination>,
    Partial<ISorting> {
  datetime?: string | null | undefined
  date?: string | null | undefined
  doctor?: number | null | undefined
}

interface IFetchAppointmentsAPIResponse {
  data: IAppointment[]
  /** @default undefined */
  meta?: IPaginationMeta | undefined | null
}

interface IFetchAppointmentsResponse {
  data: IAppointment[] | null
  meta: IPaginationMeta | null
  error: IError | null
}

export interface IFetchMyAppointmentsParams
  extends Partial<IPagination>,
    Partial<ISorting> {
  datetime?: string | null | undefined
  patient_name?: string | null | undefined
  patientId?: number | null | undefined
  doctor?: number | null | undefined
}

interface IFetchMyAppointmentsAPIResponse {
  data: IMyAppointment[]
  /** @default undefined */
  meta?: IPaginationMeta | undefined | null
}

interface IFetchMyAppointmentsResponse {
  data: IMyAppointment[] | null
  meta: IPaginationMeta | null
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

const isInstance = (
  data: any
): data is IFetchAppointmentsAPIResponse | IFetchMyAppointmentsAPIResponse => {
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
          meta: response.data.meta || null,
          error: null,
        }
      : { data: response.data, error: null, meta: null }
  } catch (err) {
    return { data: null, meta: null, error: handleError(err) }
  }
}

export const fetchMyAppointments = async (
  doctorId: number,
  params?: IFetchMyAppointmentsParams
): Promise<IFetchMyAppointmentsResponse> => {
  try {
    const response: AxiosResponse<
      IFetchMyAppointmentsAPIResponse | IMyAppointment[]
    > = await api.get('/appointment', {
      params: { ...params, doctor: doctorId }, // status: 'confirmed'
    })

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
