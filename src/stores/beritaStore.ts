import {
  composeErrorMessage,
  paginatedRequestState,
  requestState,
  responseDataArrayFromJson,
  responseDataObjectFromJson,
  responseDataPaginationFromJson
} from '@bssn/ui-kit-frontend'
import { defineStore } from 'pinia'

import { beritaStore } from '@/const'
import { recordsBeritaDummy } from '@/dummies/berita'
import { isDummyMode, log } from '@/helpers/custom'
import { getRequest } from '@/helpers/request'
import {
  beritaDataFromJson,
  normalizeBeritaListJson,
  type BeritaData
} from '@/models/berita'
import { recordBeritaUrl, recordsBeritaUrl } from '@/urls/berita'

export const useBeritaStore = defineStore(beritaStore, {
  state: () => {
    return {
      records: paginatedRequestState<BeritaData[]>([]),
      record: requestState<BeritaData>(),
      related: [] as BeritaData[]
    }
  },
  actions: {
    async callRecords(page: number) {
      const url = recordsBeritaUrl(page)
      log(`url: ${url}`)
      this.records.status = 'loading'
      this.records.errorMessage = null
      try {
        let body: any
        if (isDummyMode()) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          body = recordsBeritaDummy()
        } else {
          body = (await getRequest(url)).data
        }
        const responseData = responseDataPaginationFromJson<BeritaData>(
          normalizeBeritaListJson(body, page),
          beritaDataFromJson
        )
        this.records.data = responseData.items
        this.records.meta = responseData.meta
        this.records.status = 'success'
      } catch (error) {
        log(error)
        this.records.status = 'error'
        this.records.errorMessage = composeErrorMessage(error)
      }
    },
    clearRecords() {
      this.records = paginatedRequestState<BeritaData[]>([])
    },
    async callRecord(slug: string) {
      const url = recordBeritaUrl(slug)
      log(`url: ${url}`)
      this.record.status = 'loading'
      this.record.errorMessage = null
      try {
        let body: any
        if (isDummyMode()) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const allData = recordsBeritaDummy().data
          const current = allData.find((item: BeritaData) => item.slug === slug)
          const related = allData.filter((item: BeritaData) => item.slug !== slug)
          body = {
            data: current,
            related: { data: related }
          }
        } else {
          body = (await getRequest(url)).data
        }

        const apiData = body
        const parsedRecord = apiData.data
          ? responseDataObjectFromJson<BeritaData>(apiData, beritaDataFromJson).item
          : beritaDataFromJson(apiData)
        const responseRelated = responseDataArrayFromJson<BeritaData>(
          apiData.related || { data: [] },
          beritaDataFromJson
        )

        this.record.data = parsedRecord
        this.related = responseRelated.items
        this.record.status = 'success'
      } catch (error) {
        log(error)
        this.record.status = 'error'
        this.record.errorMessage = composeErrorMessage(error)
      }
    },
    clearRecord() {
      this.record = requestState<BeritaData>()
      this.related = [] as BeritaData[]
    }
  }
})
