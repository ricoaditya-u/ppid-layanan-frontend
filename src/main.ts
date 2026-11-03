import './assets/css/index.css'

import {
  envSplit,
  FontAwesomeIcon,
  userLayananDataFromJson,
  type AxiosService,
  type LayananFrontendData,
  type UserLayananData
} from '@bssn/ui-kit-frontend'
import { createPinia } from 'pinia'
import { computed, createApp, type ComputedRef } from 'vue'

import App from './App.vue'
import { ppidFrontend } from './index.ts'
import router from './router'
import { createAxiosService } from './services/axiosService.ts'

interface AppConfigData {
  frontends: LayananFrontendData[]
}

const appConfig: AppConfigData = {
  frontends: [ppidFrontend]
}

let axiosService: AxiosService | null = null

export function initModule(): void {
  axiosService = createAxiosService([...appConfig.frontends.map(({ axiosConfig }) => axiosConfig)])

  const user = computed(() =>
    userLayananDataFromJson({
      guid: import.meta.env.VITE_TEST_USER_GUID,
      name: import.meta.env.VITE_TEST_USER_NAME,
      email: import.meta.env.VITE_TEST_USER_EMAIL,
      roles: envSplit(import.meta.env.VITE_TEST_USER_ROLES),
      permissions: envSplit(import.meta.env.VITE_TEST_USER_PERMISSIONS)
    })
  )

  initFrontends(axiosService, user)
}

const initFrontends = (axiosService: AxiosService, user: ComputedRef<UserLayananData | null>) => {
  for (const frontend of appConfig.frontends) {
    frontend.init({
      axiosInstance: axiosService.getAxios(frontend.axiosConfig.name),
      user
    })
  }
}

const app = createApp(App)

app.use(createPinia())

app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

initModule()

app.mount('#app')
