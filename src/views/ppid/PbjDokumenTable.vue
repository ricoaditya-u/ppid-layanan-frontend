<template>
  <div class="flex flex-col w-full gap-4">
    <TableDefault>
      <template #header>
        <tr>
          <TableHeader alignment="center" customClass="w-0">No</TableHeader>
          <TableHeader alignment="center">Nama Dokumen</TableHeader>
          <TableHeader alignment="center">Kategori</TableHeader>
          <TableHeader alignment="center">Jenis</TableHeader>
          <TableHeader alignment="center">Tahun</TableHeader>
          <TableHeader alignment="center">Aksi</TableHeader>
        </tr>
      </template>
      <template #body>
        <template v-if="records.data!.length > 0">
          <tr v-for="(record, recordIndex) in records.data" :key="record.id">
            <TableData alignment="center" customClass="w-0">
              {{ (records.meta.currentPage - 1) * records.meta.perPage + 1 + recordIndex }}
            </TableData>
            <TableData>
              {{ record.namaDokumen }}
            </TableData>
            <TableData>
              {{ record.kategori }}
            </TableData>
            <TableData>
              {{ record.jenis }}
            </TableData>
            <TableData>
              {{ record.tahun }}
            </TableData>
            <TableData alignment="center" customClass="w-0">
              <div class="flex flex-row gap-2">
                <button
                  type="button"
                  class="flex flex-row justify-center items-center space-x-2 focus:ring-1 focus:outline-none rounded-sm px-2.5 py-1.5 text-info-600 hover:bg-info-50 focus:ring-info-300 border border-info-300 cursor-pointer hover:scale-105 transition-transform"
                  @click="emit('viewClick', record)"
                >
                  <font-awesome-icon :icon="['fad', 'eye']" class="w-5 h-5" />
                </button>
                <button
                  type="button"
                  class="flex flex-row justify-center items-center space-x-2 focus:ring-1 focus:outline-none rounded-sm px-2.5 py-1.5 text-success-600 hover:bg-success-50 focus:ring-success-300 border border-success-300 cursor-pointer hover:scale-105 transition-transform"
                  @click="emit('downloadClick', record)"
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
import type { PropType } from 'vue'

import type { PbjDokumenData } from '@/models/pbjDokumen'

defineProps({
  records: {
    type: Object as PropType<PaginatedRequestState<PbjDokumenData[]>>,
    required: true
  }
})

const emit = defineEmits<{
  viewClick: [record: PbjDokumenData]
  downloadClick: [record: PbjDokumenData]
}>()
</script>
