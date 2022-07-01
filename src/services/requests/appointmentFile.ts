import { AxiosResponse } from 'axios'

import { api } from '../api'
import { IError } from '../../interfaces/error'
import { IAppointmentFile } from '../../interfaces/appointmentFile'
import { handleError } from '../../utils/helpers/errors'

interface IFetchAppointmentFilesResponse {
  data: IAppointmentFile[] | null
  error: IError | null
}

interface IDeleteAppointmentFileResponse {
  data: boolean
  error: IError | null
}

export const fetchAppointmentFiles = async (
  appointmentId: number
): Promise<IFetchAppointmentFilesResponse> => {
  try {
    const response: AxiosResponse<IAppointmentFile[]> = await api.get(
      `/appointment-file/${appointmentId}`
    )

    return { data: response.data, error: null }
  } catch (err) {
    return { data: null, error: handleError(err, false) }
  }
}

export const deleteAppointmentFile = async (
  fileId: number,
  all = false
): Promise<IDeleteAppointmentFileResponse> => {
  try {
    const config = {
      params: { all },
    }

    await api.delete(`/appointment-file/${fileId}`, config)
    return { data: true, error: null }
  } catch (err) {
    return { data: false, error: handleError(err, false) }
  }
}
