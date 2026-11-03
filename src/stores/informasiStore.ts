import {
  composeErrorMessage,
  generateSlug,
  paginatedRequestState,
  requestState,
  responseDataObjectFromJson,
  responseDataPaginationFromJson,
  type OptionData
} from '@bssn/ui-kit-frontend'
import { defineStore } from 'pinia'

import { informasiStore } from '@/const'
import { recordsInformasiDummy } from '@/dummies/informasi'
import { isDummyMode, log } from '@/helpers/custom'
import { getRequest } from '@/helpers/request'
import { informasiDataFromJson, type InformasiData } from '@/models/informasi'
import { useSurveyStore } from '@/stores/surveyStore'
import {
  downloadInformasiApiUrl,
  downloadInformasiPath,
  jenisByKategoriUrl,
  recordInformasiUrl,
  recordsInformasiUrl
} from '@/urls/informasi'

export const useInformasiStore = defineStore(informasiStore, {
  state: () => {
    return {
      keyword: '',
      kategoriId: '',
      jenisId: '',
      jenisOptions: [] as OptionData[],
      records: paginatedRequestState<InformasiData[]>([]),
      record: requestState<InformasiData>(),
      download: requestState()
    }
  },
  actions: {
    async callJenisOptions(kategoriId: string) {
      const url = jenisByKategoriUrl(kategoriId)
      log(`url: ${url}`)
      try {
        let items: any[] = []
        if (isDummyMode()) {
          await new Promise((resolve) => setTimeout(resolve, 300))
          const allData = recordsInformasiDummy().data
          const seen = new Set<string>()
          items = allData
            .filter((item: any) => String(item.id_kategori) === String(kategoriId))
            .filter((item: any) => {
              const slug = String(item.nama_jenis ?? '')
              if (!slug || seen.has(slug)) return false
              seen.add(slug)
              return true
            })
            .map((item: any) => ({
              slug: item.nama_jenis,
              nama_jenis: item.nama_jenis
            }))
        } else {
          const response = await getRequest(url)
          const body = response.data ?? response
          items = Array.isArray(body) ? body : (body.data ?? [])
        }
        this.jenisOptions = items.map((item: any) => ({
          label: String(item.nama_jenis ?? ''),
          value: String(item.slug ?? '')
        }))
      } catch (error) {
        log(error)
        this.jenisOptions = []
      }
    },
    clearJenisOptions() {
      this.jenisOptions = []
    },
    async callRecords(
      type: string,
      keyword: string,
      kategoriId: string,
      jenisId: string,
      page: number
    ) {
      const url = recordsInformasiUrl(type, keyword, kategoriId, jenisId, page)
      log(`url: ${url}`)
      this.records.status = 'loading'
      this.records.errorMessage = null
      try {
        this.keyword = keyword
        this.kategoriId = kategoriId
        this.jenisId = jenisId
        let response: any
        if (isDummyMode()) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const allData = recordsInformasiDummy().data
          const filterData = allData.filter((item: any) => {
            const matchKeyword =
              !keyword || item.nama_informasi.toLowerCase().includes(keyword.toLowerCase())
            const matchKategori = !kategoriId || String(item.id_kategori) === kategoriId
            const matchJenis =
              !jenisId ||
              String(item.id_jenis) === jenisId ||
              String(item.nama_jenis) === jenisId
            return matchKeyword && matchKategori && matchJenis
          })
          response = {
            data: filterData,
            meta: {
              current_page: 1,
              last_page: Math.ceil(filterData.length / 10),
              per_page: 10,
              total: filterData.length
            }
          }
        } else {
          response = await getRequest(url)
        }
        const responseData = responseDataPaginationFromJson<InformasiData>(
          response.data ?? response,
          informasiDataFromJson
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
            perPage: 10,
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
      this.records = paginatedRequestState<InformasiData[]>([])
    },
    async callRecord(slug: string) {
      const url = recordInformasiUrl(slug)
      log(`url: ${url}`)
      this.record.status = 'loading'
      this.record.errorMessage = null
      try {
        let response: any
        if (isDummyMode()) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const allData = recordsInformasiDummy().data
          const findData = allData.find((item: any) => item.slug === slug)
          response = {
            data: findData ?? allData[0]
          }
        } else {
          response = await getRequest(url)
        }
        const body = response.data ?? response
        const responseData = responseDataObjectFromJson<InformasiData>(
          { data: body.data ?? body },
          informasiDataFromJson
        )
        this.record.data = responseData.item
        this.record.status = 'success'
      } catch (error) {
        log(error)
        this.record.status = 'error'
        this.record.errorMessage = composeErrorMessage(error)
      }
    },
    clearRecord() {
      this.record = requestState<InformasiData>()
    },
    async callDownload(fileUpload: string, namaInformasi: string) {
      const url = downloadInformasiApiUrl(fileUpload)
      log(`url: ${url}`)
      this.download.status = 'loading'
      this.download.errorMessage = null
      try {
        if (isDummyMode()) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        } else {
          const response = await getRequest(url, {
            responseType: 'blob'
          })

          const disposition = response.headers['content-disposition']
          let filename = generateSlug(namaInformasi)
          if (disposition) {
            const match = disposition.match(/filename="?([^"]+)"?/)
            if (match && match[1]) {
              filename = match[1]
            }
          }

          const blob = new Blob([response.data], { type: response.headers['content-type'] })
          const windowUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')

          link.href = windowUrl
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()

          window.URL.revokeObjectURL(windowUrl)
          document.body.removeChild(link)
        }
        this.download.status = 'success'
        useSurveyStore().open()
      } catch (error) {
        log(error)
        this.download.status = 'error'
        this.download.errorMessage = composeErrorMessage(error)
      }
    },
    clearDownload() {
      this.download = requestState()
    },
    getDownloadUrl(fileUpload: string): string {
      if (!fileUpload) return ''
      return downloadInformasiPath(fileUpload)
    }
  }
})
