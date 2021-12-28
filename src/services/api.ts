import axios, { AxiosRequestConfig } from 'axios'

import { API_BASE_URL } from '../utils/constants/urls'
import { getToken } from '../utils/helpers/token'

export const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  return {
    ...config,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ContentType: 'application/json',
    },
  }
})

/** TO DO: Implement appropriate interceptor to axios response... */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      return Promise.reject(error.response)
    }

    return Promise.reject(error)
  }
)
