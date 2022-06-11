/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { api } from '../api'
import { IPaginationMeta } from '../../interfaces/api'
import { IError } from '../../interfaces/error'
import {
  ICompletePatient,
  IMyPatient,
  IPatient,
} from '../../interfaces/patient'
import { handleError } from '../../utils/helpers/errors'
import { IFetchPatientsParams } from './patient'

interface IUpdateMyPatientResponse {
  patient: IPatient | null
  error: IError | null
}

interface IFetchMyPatientsResponse {
  meta: IPaginationMeta | null
  data: ICompletePatient[] | null
  error: IError | null
}

interface IFetchMyPatientsAPIResponse {
  meta?: IPaginationMeta | undefined | null
  data: ICompletePatient[]
}

const isInstance = (data: any): data is IFetchMyPatientsAPIResponse => {
  return 'meta' in data
}

export const fetchMyPatients = async (
  doctorId: number,
  params?: IFetchPatientsParams
): Promise<IFetchMyPatientsResponse> => {
  try {
    const response: AxiosResponse<
      IFetchMyPatientsAPIResponse | ICompletePatient[]
    > = await api.get('/my-patient', { params: { ...params, doctorId } })

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

export const updateMyPatient = async (
  id: number,
  data: IMyPatient
): Promise<IUpdateMyPatientResponse> => {
  try {
    const response: AxiosResponse<IPatient> = await api.put(
      `/my-patient/${id}`,
      data
    )

    return { patient: response.data, error: null }
  } catch (err) {
    return { patient: null, error: handleError(err) }
  }
}
