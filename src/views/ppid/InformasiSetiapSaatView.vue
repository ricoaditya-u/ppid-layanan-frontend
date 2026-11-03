<template>
  <div class="flex flex-col w-full h-full gap-4 xl:gap-6">
    <div class="text-center">
      <div class="text-xl font-bold md:text-2xl lg:text-3xl lg:font-extrabold">
        Informasi Tersedia Setiap Saat
      </div>
      <div class="text-xl font-bold md:text-2xl lg:text-3xl lg:font-extrabold">
        Badan Siber dan Sandi Negara
      </div>
    </div>
    <div class="flex flex-col w-full gap-4 xl:gap-6">
      <div class="flex flex-col justify-end w-full gap-4 md:items-center md:flex-row">
        <FieldSearch
          name="filter.keyword"
          placeholder="Cari Informasi"
          @update:value="onFilterKeywordUpdated"
        />
        <FieldSelect
          initialValue=""
          name="filter.jenisId"
          :required="false"
          :options="jenisOptions"
          :placeholder="`Semua Jenis`"
          @update:value="onFilterJenisIdUpdated"
          class="w-auto md:w-40"
        />
      </div>
      <SectionDefault :sectionStatus="records.status">
        <div class="flex flex-col w-full gap-4 mb-2 xl:gap-6">
          <template v-if="records.data!.length > 0">
            <CardDefault>
              <InformasiTable
                :records="records"
                @pageChange="onPageChange"
                @viewClick="onViewClick"
              />
            </CardDefault>
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
  CardDefault,
  FieldSearch,
  FieldSelect,
  SectionDefault,
  StateWarning,
  TablePagination,
  type OptionData
} from '@bssn/ui-kit-frontend'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import InformasiTable from './InformasiTable.vue'

import type { InformasiData } from '@/models/informasi'
import { useInformasiStore } from '@/stores/informasiStore'

const router = useRouter()

const store = useInformasiStore()
const records = computed(() => store.records)
const jenisOptions = computed(() => store.jenisOptions)

const currentYear = new Date().getFullYear()
const tahunOptions = ref<OptionData[]>([])
for (let year = currentYear; year >= 2001; year--) {
  tahunOptions.value.push({ label: year.toString(), value: year.toString() })
}

const currentPage = ref<number>(1)

const onFilterKeywordUpdated = (value: string) => {
  store.keyword = value
  currentPage.value = 1
  onLoad()
}

const onFilterJenisIdUpdated = (value: string) => {
  store.jenisId = value
  currentPage.value = 1
  onLoad()
}

const onPageChange = (page: number) => {
  currentPage.value = page
  onLoad()
}

const onLoad = async () => {
  await store.callRecords(
    'setiap-saat',
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
onMounted(async () => {
  store.kategoriId = '3'
  await store.callJenisOptions('3')
  onLoad()
})
onUnmounted(() => {
  store.keyword = ''
  store.kategoriId = ''
  store.jenisId = ''
  store.clearJenisOptions()
  store.clearRecords()
})
</script>
