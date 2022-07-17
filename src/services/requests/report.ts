/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'

import { api } from '../api'
import { IError } from '../../interfaces/error'
import { IReport, IReportPermission } from '../../interfaces/report'
import { handleError } from '../../utils/helpers/errors'

interface IFetchReportsParams {
  permission: IReportPermission
  doctorId?: number
  initialDate?: string
  finalDate?: string
}

interface IFetchReportsAPIResponse {
  result: IReport
}

interface IFetchReportsResponse {
  data: IReport | null
  error: IError | null
}

export const fetchReports = async (
  params?: IFetchReportsParams
): Promise<IFetchReportsResponse> => {
  try {
    const response: AxiosResponse<IFetchReportsAPIResponse> = await api.get(
      '/report',
      {
        params,
      }
    )

    return { data: response.data.result, error: null }
  } catch (err) {
    return { data: null, error: handleError(err) }
  }
}
