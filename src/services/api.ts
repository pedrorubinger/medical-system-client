import axios, { AxiosRequestConfig } from 'axios'

import { getToken } from '../utils/helpers/token'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
export const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${getToken()}`,
      ContentType: 'application/json',
    },
  }
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      return Promise.reject(error.response)
    }

    return Promise.reject(error)
  }
)
