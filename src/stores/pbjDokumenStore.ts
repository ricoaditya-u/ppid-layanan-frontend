import {
  composeErrorMessage,
  paginatedRequestState,
  responseDataPaginationFromJson
} from '@bssn/ui-kit-frontend'
import { defineStore } from 'pinia'

import { pbjDokumenStore } from '@/const'
import { recordsPbjDokumenDummy } from '@/dummies/pbjDokumen'
import { isDummyMode, log } from '@/helpers/custom'
import { getRequest } from '@/helpers/request'
import {
  pbjDokumenDataFromJson,
  type PbjDokumenData,
  type PbjDokumenType
} from '@/models/pbjDokumen'
import { recordsPbjDokumenUrl } from '@/urls/pbjDokumen'

const PER_PAGE = 10

export const usePbjDokumenStore = defineStore(pbjDokumenStore, {
  state: () => {
    return {
      type: 'regulasi' as PbjDokumenType,
      keyword: '',
      jenis: '',
      records: paginatedRequestState<PbjDokumenData[]>([])
    }
  },
  actions: {
    async callRecords(type: PbjDokumenType, keyword: string, jenis: string, page: number) {
      const url = recordsPbjDokumenUrl(type, keyword, jenis, page)
      log(`url: ${url}`)
      this.type = type
      this.keyword = keyword
      this.jenis = jenis
      this.records.status = 'loading'
      this.records.errorMessage = null

      try {
        let response: any
        if (isDummyMode()) {
          await new Promise((resolve) => setTimeout(resolve, 300))
          const filtered = recordsPbjDokumenDummy(type).filter((item) => {
            const matchKeyword =
              !keyword || item.namaDokumen.toLowerCase().includes(keyword.toLowerCase())
            const matchJenis = !jenis || item.jenis === jenis
            return matchKeyword && matchJenis
          })
          const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
          const currentPage = Math.min(Math.max(page, 1), lastPage)
          const start = (currentPage - 1) * PER_PAGE
          response = {
            data: filtered.slice(start, start + PER_PAGE),
            meta: {
              current_page: currentPage,
              last_page: lastPage,
              per_page: PER_PAGE,
              total: filtered.length
            }
          }
        } else {
          response = await getRequest(url)
        }

        const responseData = responseDataPaginationFromJson<PbjDokumenData>(
          response.data ?? response,
          (json) => pbjDokumenDataFromJson(json, type)
        )
        this.records.data = responseData.items
        this.records.meta = responseData.meta
        this.records.status = 'success'
      } catch (error: any) {
        log(error)
        const message = error?.response?.data?.message ?? ''
        const isNotFound =
          error?.response?.status === 404 || /tidak ditemukan/i.test(String(message))

        if (isNotFound) {
          this.records.data = []
          this.records.meta = {
            currentPage: page,
            lastPage: 1,
            perPage: PER_PAGE,
            total: 0
          }
          this.records.status = 'success'
          this.records.errorMessage = null
          return
        }

        this.records.status = 'error'
        this.records.errorMessage = composeErrorMessage(error)
      }
    },
    clearRecords() {
      this.records = paginatedRequestState<PbjDokumenData[]>([])
    }
  }
})
