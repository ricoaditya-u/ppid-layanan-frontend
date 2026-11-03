<template>
  <div class="flex flex-col w-full h-full gap-4 xl:gap-6">
    <SectionDefault v-if="record.status === 'error'" sectionStatus="error" />
    <div v-else>
      <TitleSection
        v-if="record.data?.namaInformasi"
        variant="warning"
        class="mb-4 text-lg xl:text-xl xl:mb-6"
      >
        {{ record.data.namaInformasi }}
      </TitleSection>
      <div
        class="flex flex-col flex-1 w-full gap-4 overflow-hidden lg:flex-row xl:gap-6 lg:h-[calc(100vh-298px)] xl:h-[calc(100vh-336px)] mb-4 xl:mb-6"
      >
        <div class="w-full h-full overflow-hidden lg:flex-[7] lg:min-w-0 lg:basis-0">
          <CardDefault customClass="h-full overflow-hidden">
            <div class="flex flex-col w-full h-full gap-4 overflow-hidden pdf-viewer-container min-h-[60vh]">
              <embed
                v-if="pdfViewerSrc"
                class="w-full h-full min-h-[60vh]"
                :src="pdfViewerSrc"
                type="application/pdf"
                width="100%"
                height="100%"
              />
              <div
                v-else-if="showDocumentLoading"
                class="flex flex-col items-center justify-center gap-4 w-full h-full min-h-[60vh] bg-gray-100 rounded"
              >
                  <span
                    class="inline-block w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  <p class="text-gray-500">Sedang memuat dokumen</p>
                </div>
                <div
                  v-else
                  class="flex items-center justify-center w-full h-full min-h-[60vh] bg-gray-100 rounded"
                >
                  <p class="text-gray-500">Terjadi kesalahan saat memuat dokumen</p>
                </div>
              </div>
            </CardDefault>
          </div>
          <div class="w-full h-full overflow-hidden lg:flex-[3] lg:min-w-0 lg:basis-0">
            <CardDefault customClass="h-full overflow-hidden">
              <div class="flex flex-col w-full h-full">
                <div class="p-4 text-white rounded-tl rounded-tr bg-primary-500">
                  Informasi Detail
                </div>
                <div
                  class="flex flex-col flex-1 w-full h-full gap-4 overflow-auto border border-gray-300 rounded-bl rounded-br"
                >
                  <div class="grid grid-cols-1 gap-4 p-4">
                    <div class="flex flex-col gap-2">
                      <div class="text-sm font-semibold">Deskripsi</div>
                      <div class="p-3 text-sm bg-gray-100 rounded-sm">
                        {{ record.data?.abstraksi || '-' }}
                      </div>
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="text-sm font-semibold">Link</div>
                      <div class="p-3 text-sm bg-gray-100 rounded-sm">
                        <div
                          v-if="record.data?.link && record.data.link !== '#'"
                          @click="openNewTab(record.data.link)"
                          class="cursor-pointer text-info-500"
                        >
                          {{ record.data.link }}
                        </div>
                        <div v-else>-</div>
                      </div>
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="text-sm font-semibold">Tahun</div>
                      <div class="p-3 text-sm bg-gray-100 rounded-sm">
                        {{ record.data?.tahun || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-row items-center justify-between mt-4">
                  <ButtonDefault
                    variant="success"
                    @clicked="onDownload(record.data!.fileUpload, record.data!.namaInformasi)"
                    :disabled="!record.data?.fileUpload || download.status === 'loading'"
                    :loading="download.status === 'loading'"
                    customClass="py-2 w-full hover:scale-105 transition-transform"
                  >
                    <div class="flex flex-row items-center">
                      <font-awesome-icon :icon="['fad', 'download']" class="w-3.5 h-3.5 mr-2.5" />
                      <div>Unduh Dokumen</div>
                    </div>
                  </ButtonDefault>
                </div>
              </div>
            </CardDefault>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ButtonDefault,
  CardDefault,
  openNewTab,
  SectionDefault,
  TitleSection
} from '@bssn/ui-kit-frontend'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { getRequest } from '@/helpers/request'
import { useInformasiStore } from '@/stores/informasiStore'
import { downloadInformasiApiUrl } from '@/urls/informasi'

const route = useRoute()

const slug = route.params.slug as string

const store = useInformasiStore()
const record = computed(() => store.record)
const download = computed(() => store.download)

const pdfViewerSrc = ref('')
const pdfLoading = ref(false)
const pdfError = ref(false)
const showDocumentLoading = computed(
  () => record.value.status !== 'success' || pdfLoading.value
)
let pdfObjectUrl: string | null = null
let pdfLoadTimeout: ReturnType<typeof setTimeout> | null = null

const clearPdfLoadTimeout = () => {
  if (pdfLoadTimeout) {
    clearTimeout(pdfLoadTimeout)
    pdfLoadTimeout = null
  }
}

const cleanupPdfObjectUrl = () => {
  if (pdfObjectUrl) {
    URL.revokeObjectURL(pdfObjectUrl)
    pdfObjectUrl = null
  }
}

const onPdfFrameLoad = () => {
  clearPdfLoadTimeout()
  pdfLoading.value = false
}

const onPdfFrameError = () => {
  clearPdfLoadTimeout()
  pdfLoading.value = false
  pdfViewerSrc.value = ''
  pdfError.value = true
}

/**
 * Always fetch as blob with forced application/pdf.
 * Upstream (and prod nginx/kong) often serve download with wrong Content-Type,
 * so iframe streaming shows raw PDF text — Vite proxy only fixes this locally.
 */
const loadPdfForViewer = async (fileUpload: string) => {
  if (!fileUpload) {
    pdfViewerSrc.value = ''
    pdfLoading.value = false
    pdfError.value = false
    return
  }

  clearPdfLoadTimeout()
  cleanupPdfObjectUrl()
  pdfError.value = false
  pdfLoading.value = true
  pdfViewerSrc.value = ''

  try {
    const response = await getRequest(downloadInformasiApiUrl(fileUpload), {
      responseType: 'arraybuffer'
    })
    const data = response.data as ArrayBuffer
    if (!data || data.byteLength === 0) {
      throw new Error('PDF kosong')
    }
    const head = new TextDecoder('ascii').decode(data.slice(0, 4))
    if (head !== '%PDF') {
      throw new Error('Bukan file PDF')
    }
    const blob = new Blob([data], { type: 'application/pdf' })
    pdfObjectUrl = URL.createObjectURL(blob)
    pdfViewerSrc.value = `${pdfObjectUrl}#toolbar=1&view=FitH`
    pdfLoadTimeout = setTimeout(() => {
      pdfLoading.value = false
    }, 15000)
  } catch {
    pdfViewerSrc.value = ''
    pdfError.value = true
    pdfLoading.value = false
  }
}

watch(
  () => record.value.data?.fileUpload,
  (fileUpload) => loadPdfForViewer(fileUpload || ''),
  { immediate: true }
)

const onDownload = async (fileUpload: string, namaInformasi: string) => {
  await store.callDownload(fileUpload, namaInformasi)
  if (download.value.status === 'success') {
    store.clearDownload()
  }
}

const onLoad = async () => {
  await store.callRecord(slug)
}

// ================================================================================================
// Lifecycle
// ================================================================================================
onMounted(() => {
  onLoad()
})
onUnmounted(() => {
  clearPdfLoadTimeout()
  cleanupPdfObjectUrl()
  store.clearRecord()
})
</script>
