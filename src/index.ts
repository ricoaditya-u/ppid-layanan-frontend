import './assets/css/style.css'

import {
  type AxiosServiceConfig,
  type LayananFrontendContext,
  type LayananFrontendData,
  type UserLayananData
} from '@bssn/ui-kit-frontend'
import type { AxiosInstance } from 'axios'
import type { ComputedRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import ProjectConst from './const.ts'
import { ppidRoutes } from './router/main/ppid.ts'

// ================================================================================================
// Axios Configuration
// ================================================================================================
export const axiosConfig: AxiosServiceConfig = {
  name: ProjectConst.slug,
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  apiKey: import.meta.env.VITE_API_KEY
}

// ================================================================================================
// Frontend Context
// ================================================================================================
let frontendContext: LayananFrontendContext
const getContext = () => {
  if (!frontendContext) {
    throw new Error(`${ProjectConst.name} frontend has not been initialized.`)
  }
  return frontendContext
}
export const getApi = (): AxiosInstance => getContext().axiosInstance
export const getUser = (): ComputedRef<UserLayananData | null> => getContext().user
export const isAuthorized = (permission: string) =>
  getUser().value?.permissions.includes(permission) ?? false

// ================================================================================================
// Frontend Definition
// ================================================================================================
export const ppidFrontend: LayananFrontendData & {
  routes: {
    custom: RouteRecordRaw[]
  }
} = {
  name: ProjectConst.name,
  axiosConfig: axiosConfig,
  init(context: LayananFrontendContext) {
    frontendContext = context
  },
  routes: {
    custom: ppidRoutes
  }
}
