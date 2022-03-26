import { AxiosResponse } from 'axios'

import { IDoctor } from '../../interfaces/doctor'
import { IError } from '../../interfaces/error'
import { IInsurance } from '../../interfaces/insurance'
import { handleError } from '../../utils/helpers/errors'
import { api } from '../api'

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
