<template>
  <div class="flex flex-col w-full h-full gap-4 xl:gap-6">
    <div class="text-center">
      <div class="text-xl font-bold md:text-2xl lg:text-3xl lg:font-extrabold">{{ title }}</div>
      <div class="text-xl font-bold md:text-2xl lg:text-3xl lg:font-extrabold">
        Badan Siber dan Sandi Negara
      </div>
    </div>
    <div class="flex flex-col w-full gap-4 xl:gap-6">
      <div class="flex flex-col justify-end w-full gap-4 md:items-center md:flex-row">
        <FieldSearch
          name="filter.keyword"
          placeholder="Cari Dokumen"
          @update:value="onFilterKeywordUpdated"
        />
        <FieldSelect
          v-if="jenisOptions.length > 0"
          initialValue=""
          name="filter.jenis"
          :required="false"
          :options="jenisOptions"
          :placeholder="`Semua Jenis`"
          @update:value="onFilterJenisUpdated"
          class="w-auto md:w-40"
        />
      </div>
      <SectionDefault :sectionStatus="records.status">
        <div class="flex flex-col w-full gap-4 mb-2 xl:gap-6">
          <template v-if="records.data!.length > 0">
            <CardDefault>
              <PbjDokumenTable
                :records="records"
                @viewClick="onViewClick"
                @downloadClick="onDownloadClick"
              />
            </CardDefault>
          </template>
          <template v-else>
            <StateWarning message="Data tidak ditemukan" />
          </template>
          <TablePagination :pagination="records.meta" @update:page="onPageChange" />
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
  openNewTab,
  SectionDefault,
  StateWarning,
  TablePagination,
  type OptionData
} from '@bssn/ui-kit-frontend'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import PbjDokumenTable from './PbjDokumenTable.vue'

import type { PbjDokumenData, PbjDokumenType } from '@/models/pbjDokumen'
import { useInformasiStore } from '@/stores/informasiStore'
import { usePbjDokumenStore } from '@/stores/pbjDokumenStore'

const props = withDefaults(
  defineProps<{
    type: PbjDokumenType
    title: string
    jenisOptions?: OptionData[]
  }>(),
  {
    jenisOptions: () => []
  }
)

const router = useRouter()
const store = usePbjDokumenStore()
const informasiStore = useInformasiStore()
const records = computed(() => store.records)
const currentPage = ref(1)

const onFilterKeywordUpdated = (value: string) => {
  store.keyword = value
  currentPage.value = 1
  onLoad()
}

const onFilterJenisUpdated = (value: string) => {
  store.jenis = value
  currentPage.value = 1
  onLoad()
}

const onPageChange = (page: number) => {
  currentPage.value = page
  onLoad()
}

const onLoad = async () => {
  await store.callRecords(props.type, store.keyword, store.jenis, currentPage.value)
}

const onViewClick = (record: PbjDokumenData) => {
  if (record.slug) {
    router.push({
      name: 'ppid.informasi.detail',
      params: { slug: record.slug }
    })
    return
  }
  if (record.link && record.link !== '#' && record.link !== 'test') {
    openNewTab(record.link)
  }
}

const onDownloadClick = async (record: PbjDokumenData) => {
  if (!record.fileUpload) return
  if (/^https?:\/\//.test(record.fileUpload)) {
    openNewTab(record.fileUpload)
    return
  }
  await informasiStore.callDownload(record.fileUpload, record.namaDokumen)
  if (informasiStore.download.status === 'success') {
    informasiStore.clearDownload()
  }
}

onMounted(() => {
  onLoad()
})

onUnmounted(() => {
  store.keyword = ''
  store.jenis = ''
  store.clearRecords()
})
</script>
