<template>
  <div class="flex flex-col w-full h-full gap-4 xl:gap-6">
    <div class="text-center">
      <div class="text-xl font-bold md:text-2xl lg:text-3xl lg:font-extrabold">Berita PPID</div>
      <div class="text-xl font-bold md:text-2xl lg:text-3xl lg:font-extrabold">
        Badan Siber dan Sandi Negara
      </div>
    </div>
    <div :class="`${beritaRecords.status === 'loading' ? 'h-[calc(100vh-24rem)]' : ''}`">
      <SectionDefault :sectionStatus="beritaRecords.status">
        <div class="flex flex-col w-full gap-6 mb-2 xl:gap-8">
          <div class="grid w-full grid-cols-1 gap-4 items-stretch xl:gap-6 xl:grid-cols-2">
            <div
              v-for="(record, recordIndex) in beritaRecords.data"
              :key="recordIndex"
              class="flex w-full"
            >
              <CardDefault class="w-full h-full transition-shadow duration-200 hover:shadow-md">
                <div class="flex gap-4 min-h-24 md:min-h-28 lg:min-h-36">
                  <div
                    class="w-24 h-24 shrink-0 overflow-hidden bg-gray-100 rounded md:w-28 md:h-28 lg:w-36 lg:h-36"
                  >
                    <img
                      class="object-cover w-full h-full"
                      :src="record.image.thumbnail"
                      :alt="record.title"
                    />
                  </div>
                  <div class="flex flex-col flex-1 min-w-0 gap-3">
                    <router-link
                      :to="{
                        name: 'ppid.berita.detail',
                        params: { slug: record.slug }
                      }"
                      class="text-base font-semibold text-gray-900 transition-colors md:text-lg line-clamp-3 hover:text-primary-600"
                    >
                      {{ record.title }}
                    </router-link>
                    <div class="pt-3 mt-auto border-t border-gray-200">
                      <div class="text-sm text-gray-500">
                        {{ readableDate(formatDateToDDMMYYYY(record.datePublished)) }}
                        <template v-if="record.author?.name">
                          <span class="mx-1.5 text-gray-300">|</span>
                          {{ record.author.name }}
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </CardDefault>
            </div>
          </div>
          <TablePagination :pagination="beritaRecords.meta" @update:page="onPageChange">
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
import { CardDefault, readableDate, SectionDefault, TablePagination } from '@bssn/ui-kit-frontend'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { formatDateToDDMMYYYY } from '@/helpers/custom'
import { useBeritaStore } from '@/stores/beritaStore'

const beritaStore = useBeritaStore()
const beritaRecords = computed(() => beritaStore.records)

const currentPage = ref<number>(1)

const onPageChange = (page: number) => {
  currentPage.value = page
  onLoad()
}

const onLoad = async () => {
  await beritaStore.callRecords(currentPage.value)
}

// ================================================================================================
// Lifecycle
// ================================================================================================
onMounted(() => {
  onLoad()
})
onUnmounted(() => {
  beritaStore.clearRecords()
})
</script>
