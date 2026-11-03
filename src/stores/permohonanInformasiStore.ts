import { composeErrorMessage, requestState } from '@bssn/ui-kit-frontend'
import { defineStore } from 'pinia'

import { permohonanInformasiStore } from '@/const'
import { isDummyMode, log } from '@/helpers/custom'
import { postRequest } from '@/helpers/request'
import { addPermohonanInformasiUrl } from '@/urls/permohonanInformasi'

export const usePermohonanInformasiStore = defineStore(permohonanInformasiStore, {
  state: () => {
    return {
      add: requestState()
    }
  },
  actions: {
    async callAdd(values: Record<string, any>) {
      const url = addPermohonanInformasiUrl()
      log(`url: ${url} | values: ${JSON.stringify(values)}`)
      this.add.status = 'loading'
      this.add.errorMessage = null
      try {
        if (isDummyMode()) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        } else {
          await postRequest(url, values)
        }
        this.add.status = 'success'
      } catch (error) {
        log(error)
        this.add.status = 'error'
        this.add.errorMessage = composeErrorMessage(error)
      }
    },
    clearAdd() {
      this.add = requestState()
    }
  }
})
