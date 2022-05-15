/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { api } from '../api'
import { handleError } from '../../utils/helpers/errors'
import { IError } from '../../interfaces/error'
import { IPatient, TPatientData } from '../../interfaces/patient'
import { IPagination, IPaginationMeta, ISorting } from '../../interfaces/api'

export interface IFetchPatientsParams
  extends Partial<IPagination>,
    Partial<ISorting> {
  name?: string | null | undefined
  cpf?: string | null | undefined
  motherName?: string | null | undefined
  primaryPhone?: string | null | undefined
  email?: string | null | undefined
}

interface IFetchPatientsAPIResponse {
  meta?: IPaginationMeta
  data: IPatient[]
}

interface IFetchPatientsResponse {
  meta: IPaginationMeta | null
  data: IPatient[] | null
  error: IError | null
}

interface IStoreOrUpdatePatientResponse {
  patient: IPatient | null
  error: IError | null
}

interface IDeletePatientResponse {
  success: boolean
  error?: IError | null
}

interface IDeletePatientAPIResponse {
  success: boolean
}

const isInstance = (data: any): data is IFetchPatientsAPIResponse => {
  return 'meta' in data
}

export const fetchPatients = async (
  params?: IFetchPatientsParams
): Promise<IFetchPatientsResponse> => {
  try {
    const response: AxiosResponse<IFetchPatientsAPIResponse | IPatient[]> =
      await api.get('/patient', { params: { ...params } })

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

export const storePatient = async (
  data: TPatientData
): Promise<IStoreOrUpdatePatientResponse> => {
  try {
    const response: AxiosResponse<IPatient> = await api.post('/patient', data)

    return { patient: response.data, error: null }
  } catch (err) {
    return { patient: null, error: handleError(err) }
  }
}

export const updatePatient = async (
  id: number,
  data: Partial<TPatientData>
): Promise<IStoreOrUpdatePatientResponse> => {
  try {
    const response: AxiosResponse<IPatient> = await api.put(
      `/patient/${id}`,
      data
    )

    return { patient: response.data, error: null }
  } catch (err) {
    return { patient: null, error: handleError(err) }
  }
}

export const deletePatient = async (
  id: number
): Promise<IDeletePatientResponse> => {
  try {
    const response: AxiosResponse<IDeletePatientAPIResponse> = await api.delete(
      `/patient/${id}`
    )

    return { success: response.data.success, error: null }
  } catch (err) {
    return { success: false, error: handleError(err) }
  }
}
