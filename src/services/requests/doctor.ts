import { AxiosResponse } from 'axios'

import { IDoctor } from '../../interfaces/doctor'
import { IError } from '../../interfaces/error'
import { handleError } from '../../utils/helpers/errors'
import { api } from '../api'

interface UpdateDoctorResponse {
  doctor?: IDoctor | null
  error?: IError | null
}

interface IUpdateDoctorData {
  id: number
  crm?: string
  specialties?: number[]
  insurances?: {
    id: number
    price: number
  }[]
}

export const updateDoctor = async (
  data: IUpdateDoctorData
): Promise<UpdateDoctorResponse> => {
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
