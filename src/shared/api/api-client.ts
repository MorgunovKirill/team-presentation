import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type { ZodSchema } from 'zod'
import { ApiClientError } from './api-client-error'

interface RequestConfig<T> extends AxiosRequestConfig {
  schema: ZodSchema<T>
}

class ApiClient {
  private readonly baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async get<T>(url: string, config: RequestConfig<T>): Promise<T> {
    const { schema, ...axiosConfig } = config
    try {
      const response = await axios.get(`${this.baseURL}${url}`, axiosConfig)
      return schema.parse(response.data)
    } catch (error) {
      throw new ApiClientError(error)
    }
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL ?? '')
