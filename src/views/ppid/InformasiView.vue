<template>
  <div class="flex flex-col w-full h-full gap-4 xl:gap-6">
    <SearchWidget />
    <div>
      <SectionDefault :sectionStatus="records.status">
        <div class="flex flex-col w-full gap-6 mb-2 xl:gap-8">
          <div class="flex flex-col gap-2">
            <div class="font-semibold">
              Berikut adalah hasil pencarian Anda berdasarkan kriteria:
            </div>
            <div class="flex flex-wrap gap-2">
              <BadgeDefault>Kata Kunci: {{ store.keyword }}</BadgeDefault>
              <BadgeDefault>
                Kategori:
                {{ kategoriOptions.find((item) => item.value === store.kategoriId)?.label }}
              </BadgeDefault>
              <BadgeDefault>
                Jenis:
                {{ jenisLabel }}
              </BadgeDefault>
            </div>
          </div>
          <template v-if="records.data!.length > 0">
            <div class="flex flex-col w-full gap-4 xl:gap-6">
              <CardDefault>
                <InformasiTable :records="records" @viewClick="onViewClick" />
              </CardDefault>
            </div>
          </template>
          <template v-else>
            <StateWarning message="Data tidak ditemukan" />
          </template>
          <TablePagination :pagination="records.meta" @update:page="onPageChange">
            <template #action>
              <slot name="action"></slot>
            </template>
          </TablePagination>
        </div>
      </SectionDefault>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BadgeDefault,
  CardDefault,
  SectionDefault,
  StateWarning,
  TablePagination
} from '@bssn/ui-kit-frontend'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import InformasiTable from './InformasiTable.vue'
import SearchWidget from './SearchWidget.vue'

import {
  jenisBerkalaOptions,
  jenisSertaMertaOptions,
  jenisSetiapSaatOptions,
  kategoriOptions
} from '@/const'
import type { InformasiData } from '@/models/informasi'
import { useInformasiStore } from '@/stores/informasiStore'

const router = useRouter()

const jenisLabel = computed(() => {
  const map: Record<string, Array<{ value: string; label: string }>> = {
    '1': jenisBerkalaOptions,
    '2': jenisSertaMertaOptions,
    '3': jenisSetiapSaatOptions
  }

  return map[store.kategoriId]?.find((item) => item.value === store.jenisId)?.label ?? ''
})

const store = useInformasiStore()
const records = computed(() => store.records)

const currentPage = ref<number>(1)

const onPageChange = (page: number) => {
  currentPage.value = page
  onLoad()
}

const onLoad = async () => {
  await store.callRecords(
    'general',
    store.keyword,
    store.kategoriId,
    store.jenisId,
    currentPage.value
  )
}

const onViewClick = (record: InformasiData) => {
  router.push({
    name: 'ppid.informasi.detail',
    params: { slug: record.slug }
  })
}

// ================================================================================================
// Lifecycle
// ================================================================================================
onMounted(() => {
  onLoad()
})
onUnmounted(() => {
  store.clearRecords()
})
</script>
