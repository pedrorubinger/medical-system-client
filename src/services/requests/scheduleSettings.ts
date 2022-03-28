import { AxiosResponse } from 'axios'

import { api } from '../api'
import { handleError } from '../../utils/helpers/errors'
import { IError } from '../../interfaces/error'
import { IScheduleSettings } from '../../interfaces/scheduleSettings'

interface IStoreOrUpdateScheduleSettingsResponse {
  schedule_settings: IScheduleSettings | null
  error: IError | null
}

interface IDayData {
  times: string[]
}

interface IScheduleSettingsData {
  sunday?: IDayData
  monday?: IDayData
  tuesday?: IDayData
  wednesday?: IDayData
  thursday?: IDayData
  friday?: IDayData
  saturday?: IDayData
}

export const updateScheduleSettings = async (
  id: number,
  data: IScheduleSettingsData
): Promise<IStoreOrUpdateScheduleSettingsResponse> => {
  try {
    const response: AxiosResponse<IScheduleSettings> = await api.put(
      `/schedule_settings/${id}`,
      data
    )

    return { schedule_settings: response.data, error: null }
  } catch (err) {
    return { schedule_settings: null, error: handleError(err) }
  }
}
