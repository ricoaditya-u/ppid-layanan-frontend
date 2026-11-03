import { defineStore } from 'pinia'

import { ppidSurveyUrl } from '@/helpers/survey'

export const useSurveyStore = defineStore('surveyPpid', {
  state: () => ({
    isOpen: false
  }),
  actions: {
    open() {
      if (!ppidSurveyUrl) return
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    }
  }
})
