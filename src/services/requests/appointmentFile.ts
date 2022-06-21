import { AxiosResponse } from 'axios'

import { api } from '../api'
import { handleError } from '../../utils/helpers/errors'
import { IError } from '../../interfaces/error'

interface IFetchAppointmentFilesResponse {
  data: string[] | null
  error: IError | null
}

export const fetchAppointmentFiles = async (
  appointmentId: number
): Promise<IFetchAppointmentFilesResponse> => {
  try {
    const response: AxiosResponse<string[]> = await api.get(
      `/appointment-file/${appointmentId}`
    )

    return { data: response.data, error: null }
  } catch (err) {
    return { data: null, error: handleError(err, false) }
  }
}
