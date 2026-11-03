<template>
  <div class="flex flex-col w-full gap-4">
    <TableDefault>
      <template #header>
        <tr>
          <TableHeader alignment="center" customClass="w-0">No</TableHeader>
          <TableHeader alignment="center">Nama Informasi</TableHeader>
          <TableHeader alignment="center">Kategori</TableHeader>
          <TableHeader alignment="center">Jenis</TableHeader>
          <TableHeader alignment="center">Tahun</TableHeader>
          <TableHeader alignment="center">Aksi</TableHeader>
        </tr>
      </template>
      <template #body>
        <template v-if="records.data!.length > 0">
          <tr v-for="(record, recordIndex) in records.data" :key="recordIndex">
            <TableData alignment="center" customClass="w-0">
              {{ (records.meta.currentPage - 1) * records.meta.perPage + 1 + recordIndex }}
            </TableData>
            <TableData>
              {{ record.namaInformasi }}
            </TableData>
            <TableData>
              {{ kategoriOptions.find((item) => item.value === record.kategoriId)?.label }}
            </TableData>
            <TableData>
              {{ getJenis(record.kategoriId, record.jenisId) }}
            </TableData>
            <TableData>
              {{ record.tahun }}
            </TableData>
            <TableData alignment="center" customClass="w-0">
              <div class="flex flex-row gap-2">
                <button
                  type="button"
                  class="flex flex-row justify-center items-center space-x-2 focus:ring-1 focus:outline-none rounded-sm px-2.5 py-1.5 text-info-600 hover:bg-info-50 focus:ring-info-300 border border-info-300 cursor-pointer hover:scale-105 transition-transform"
                  @click="viewClick(record)"
                >
                  <font-awesome-icon :icon="['fad', 'eye']" class="w-5 h-5" />
                </button>
                <button
                  type="button"
                  :class="getDownloadClasses(record.id)"
                  :disabled="download.status === 'loading' && currentDownload === record.id"
                  @click="downloadClick(record)"
                >
                  <font-awesome-icon :icon="['fad', 'download']" class="w-5 h-5" />
                </button>
              </div>
            </TableData>
          </tr>
        </template>
        <template v-else>
          <tr>
            <TableDataNone />
          </tr>
        </template>
      </template>
    </TableDefault>
  </div>
</template>

<script setup lang="ts">
import {
  TableData,
  TableDataNone,
  TableDefault,
  TableHeader,
  type PaginatedRequestState
} from '@bssn/ui-kit-frontend'
import { computed, ref, type PropType } from 'vue'

import {
  jenisBerkalaOptions,
  jenisSertaMertaOptions,
  jenisSetiapSaatOptions,
  kategoriOptions
} from '@/const'
import type { InformasiData } from '@/models/informasi'
import { useInformasiStore } from '@/stores/informasiStore'

// ================================================================================================
// Props & Emits
// ================================================================================================
defineProps({
  records: {
    type: Object as PropType<PaginatedRequestState<InformasiData[]>>,
    required: true
  }
})
const emit = defineEmits(['viewClick'])

// ================================================================================================
// Methods
// ================================================================================================
const downloadClick = async (record: InformasiData) => {
  currentDownload.value = record.id
  try {
    await store.callDownload(record.fileUpload, record.namaInformasi)
    if (download.value.status === 'success') {
      store.clearDownload()
    }
  } finally {
    currentDownload.value = null
  }
}
const viewClick = (record: InformasiData) => {
  emit('viewClick', record)
}

const getDownloadClasses = (recordId: string) => {
  const isLoading = download.value.status === 'loading' && currentDownload.value === recordId

  return [
    'flex flex-row justify-center items-center space-x-2 focus:ring-1 focus:outline-none rounded-sm px-2.5 py-1.5',
    isLoading
      ? 'text-success-300 bg-success-50 border border-success-100 cursor-not-allowed'
      : 'text-success-600 hover:bg-success-50 focus:ring-success-300 border border-success-300 cursor-pointer hover:scale-105 transition-transform'
  ].join(' ')
}

const store = useInformasiStore()
const download = computed(() => store.download)

const currentDownload = ref<string | null>(null)

const getJenis = (kategoriId: string, jenisId: string) => {
  const map: Record<string, Array<{ value: string; label: string }>> = {
    '1': jenisBerkalaOptions,
    '2': jenisSertaMertaOptions,
    '3': jenisSetiapSaatOptions
  }

  return map[kategoriId]?.find((item) => item.value === jenisId)?.label ?? ''
}
</script>
