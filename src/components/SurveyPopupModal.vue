<template>
  <Teleport to="body">
    <div
      v-if="surveyStore.isOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="survey-popup-title"
      @click.self="surveyStore.close()"
    >
      <div
        class="flex flex-col w-full max-w-[1000px] h-[86vh] bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <h2 id="survey-popup-title" class="text-sm font-semibold text-gray-900">
            Survei Kepuasan Penguna Layanan
          </h2>
          <button
            type="button"
            class="p-1 text-gray-500 transition-colors rounded hover:bg-gray-100 hover:text-gray-700"
            aria-label="Tutup survei"
            @click="surveyStore.close()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <iframe
          v-if="surveyStore.isOpen"
          :src="ppidSurveyUrl"
          class="flex-1 w-full border-0"
          title="Survei Kepuasan Layanan PPID BSSN"
          allow="fullscreen"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ppidSurveyUrl } from '@/helpers/survey'
import { useSurveyStore } from '@/stores/surveyStore'

const surveyStore = useSurveyStore()
</script>
