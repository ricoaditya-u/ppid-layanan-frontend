import type { AxiosService, AxiosServiceConfig } from '@bssn/ui-kit-frontend'
import axios, { type AxiosInstance } from 'axios'

import { log } from '@/helpers/custom'

export const createAxiosService = (configs: AxiosServiceConfig[]): AxiosService => {
  if (configs.length === 0) {
    throw new Error('At least one AxiosServiceConfig must be provided')
  }

  const instances = new Map<string, AxiosInstance>()

  for (const config of configs) {
    if (instances.has(config.name)) {
      throw new Error(`Duplicate Axios instance name '${config.name}'`)
    }

    const instance = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(config.apiKey ? { apikey: config.apiKey } : {})
      }
    })

    instance.interceptors.request.use(async (config) => {
      const token = import.meta.env.VITE_TEST_AUTH_ACCESS_TOKEN
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    }, Promise.reject)

    instances.set(config.name, instance)

    log(
      `Created Axios instance '${config.name}' | Base URL: ${config.baseURL} | API Key: ${config.apiKey}`
    )
  }

  const defaultName = configs[0].name

  return {
    getAxios(name = defaultName): AxiosInstance {
      const instance = instances.get(name)

      if (!instance) {
        throw new Error(
          `Axios instance '${name}' not found. Available: ${Array.from(instances.keys()).join(', ')}`
        )
      }

      return instance
    }
  }
}
