/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { IDoctor } from '../../interfaces/doctor'
import { IError } from '../../interfaces/error'
import { IInsurance } from '../../interfaces/insurance'
import { handleError } from '../../utils/helpers/errors'
import { api } from '../api'

interface IFetchDoctorsAPIResponse {
  data: IDoctor[]
}

interface IFetchDoctorsResponse {
  data: IDoctor[] | null
  error: IError | null
}

interface IUpdateDoctorResponse {
  doctor?: IDoctor | null
  error?: IError | null
}

interface IUpdateDoctorInsuranceResponse {
  insurances?: IInsurance[] | null
  error?: IError | null
}

interface IUpdateDoctorData {
  id: number
  crm?: string
  specialties?: number[]
  payment_methods?: number[]
  private_appointment_price?: number
  appointment_follow_up_limit?: number
}

export type TManageDoctorInsuranceFlag = 'attach' | 'dettach'

interface IManageDoctorInsuranceData {
  id: number
  flag?: TManageDoctorInsuranceFlag
  insurances: {
    insurance_id: number
    price: number
  }[]
}

const isInstance = (data: any): data is IFetchDoctorsAPIResponse => {
  return 'meta' in data
}

export const fetchDoctors = async (): Promise<IFetchDoctorsResponse> => {
  try {
    const response: AxiosResponse<IFetchDoctorsAPIResponse | IDoctor[]> =
      await api.get('/doctor')

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

export const updateDoctor = async (
  data: IUpdateDoctorData
): Promise<IUpdateDoctorResponse> => {
  try {
    const response: AxiosResponse<IDoctor> = await api.put(
      `/doctor/${data.id}`,
      data
    )

    return { doctor: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { doctor: null, error }
  }
}

export const manageDoctorInsurance = async (
  data: IManageDoctorInsuranceData
): Promise<IUpdateDoctorInsuranceResponse> => {
  try {
    const response: AxiosResponse<IInsurance[]> = await api.put(
      `/doctor/insurance/${data.id}`,
      data
    )

    return { insurances: response.data, error: null }
  } catch (err) {
    const error = handleError(err)

    return { insurances: null, error }
  }
}
