<template>
  <div class="flex flex-col w-full h-full gap-4 xl:gap-6">
    <div :class="`${record.status === 'loading' ? 'h-[calc(100vh-15.5rem)]' : ''}`">
      <SectionDefault :sectionStatus="record.status">
        <template v-if="record.data">
          <div class="flex flex-col flex-1 w-full gap-6 lg:flex-row lg:gap-8">
            <div class="flex flex-col w-full gap-6 lg:w-2/3">
              <CardDefault>
                <div class="flex flex-col gap-6 p-6">
                  <div class="flex flex-col gap-4 pb-6 border-b border-gray-200">
                    <h1
                      class="text-xl font-bold leading-tight text-gray-900 md:text-2xl lg:text-3xl"
                      v-html="getTitleHtml(record.data.title)"
                    ></h1>
                    <div class="flex flex-row flex-wrap items-center gap-3 text-gray-600">
                      <div class="flex items-center gap-2">
                        <div
                          class="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden bg-gray-100 rounded-full"
                        >
                          <img
                            :src="logoBssn"
                            alt="Logo BSSN"
                            class="object-contain w-full h-full p-1"
                          />
                        </div>
                        <div class="text-sm font-semibold text-gray-700">TIM BSSN</div>
                      </div>
                      <div class="hidden text-gray-400 md:block">•</div>
                      <div class="flex items-center gap-1 text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-4 h-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{{
                          readableDate(formatDateToDDMMYYYY(record.data.datePublished))
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="max-w-none leading-relaxed prose prose-lg article-content"
                    v-html="record.data.content"
                  ></div>

                  <div class="flex flex-col gap-4 pt-6 mt-6 border-t border-gray-200">
                    <div class="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      <h3 class="text-lg font-semibold text-gray-900">Bagikan</h3>
                    </div>
                    <div class="flex flex-wrap gap-3">
                      <button
                        type="button"
                        class="flex items-center justify-center w-8 h-8 text-white transition-all duration-200 transform bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105"
                        title="Share ke Facebook"
                        @click="shareToFacebook"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fill-rule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="flex items-center justify-center w-8 h-8 text-white transition-all duration-200 transform bg-black rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg hover:scale-105"
                        title="Share ke X (Twitter)"
                        @click="shareToTwitter"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="flex items-center justify-center w-8 h-8 text-white transition-all duration-200 transform bg-green-500 rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg hover:scale-105"
                        title="Share ke WhatsApp"
                        @click="shareToWhatsApp"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="flex items-center justify-center w-8 h-8 text-white transition-all duration-200 transform bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg hover:scale-105"
                        title="Copy Link"
                        @click="copyLink"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div v-if="copied" class="text-sm font-medium text-green-600 animate-pulse">
                      Link berhasil disalin!
                    </div>
                  </div>

                  <div ref="articleEndSentinel" class="w-full h-px" aria-hidden="true"></div>
                </div>
              </CardDefault>
            </div>

            <div class="flex flex-col w-full gap-6 lg:w-1/3">
              <CardDefault customClass="sticky top-4">
                <div class="p-6">
                  <div class="flex items-center gap-2 pb-4 mb-6 border-b border-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    <h2 class="text-xl font-bold text-gray-900">Berita Lainnya..</h2>
                  </div>

                  <div v-if="relatedItems.length > 0" class="flex flex-col gap-4">
                    <div
                      v-for="(item, index) in relatedItems"
                      :key="`${item.slug}-${index}`"
                      class="p-3 -m-3 transition-all duration-200 group hover:bg-gray-50 rounded-lg"
                    >
                      <router-link
                        :to="{
                          name: 'ppid.berita.detail',
                          params: { slug: item.slug }
                        }"
                        class="flex flex-row gap-4"
                      >
                        <div class="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                          <img
                            v-if="getThumbnail(item)"
                            class="object-cover w-full h-full transition-shadow duration-200 rounded-lg shadow-md group-hover:shadow-lg"
                            :src="getThumbnail(item)"
                            :alt="item.title"
                            :data-thumb-index="0"
                            @error="(e) => onRelatedThumbError(e, item)"
                          />
                          <div
                            v-else
                            class="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-8 h-8 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div class="flex flex-col flex-1 min-w-0 gap-2">
                          <div
                            class="text-sm font-semibold text-gray-900 transition-colors duration-200 md:text-base line-clamp-3 group-hover:text-primary-600"
                            v-html="getTitleHtml(item.title)"
                          ></div>
                          <div class="flex flex-col gap-1">
                            <div class="text-xs text-gray-500">
                              {{ readableDate(formatDateToDDMMYYYY(item.datePublished)) }}
                            </div>
                          </div>
                        </div>
                      </router-link>
                    </div>
                  </div>

                  <div v-else class="text-sm text-gray-500">
                    Belum ada berita lainnya untuk ditampilkan.
                  </div>
                </div>
              </CardDefault>
            </div>
          </div>
        </template>
      </SectionDefault>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CardDefault, readableDate, SectionDefault } from '@bssn/ui-kit-frontend'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import logoBssn from '@/assets/images/logo-bssn.png'
import { formatDateToDDMMYYYY } from '@/helpers/custom'
import { sanitizeInlineHtml } from '@/helpers/html'
import type { BeritaData } from '@/models/berita'
import { useBeritaStore } from '@/stores/beritaStore'
import { useSurveyStore } from '@/stores/surveyStore'

const route = useRoute()
const slug = route.params.slug as string

const store = useBeritaStore()
const surveyStore = useSurveyStore()
const record = computed(() => store.record)
const relatedFromApi = computed(() => store.related)
const recordsList = computed(() => store.records.data)
const copied = ref(false)

const articleEndSentinel = ref<HTMLElement | null>(null)
let surveyObserver: IntersectionObserver | null = null
let surveyTriggered = false

const getThumbnail = (item: BeritaData) => {
  const thumb = item?.image?.thumbnail || item?.image?.medium || item?.image?.large || ''
  return String(thumb || '').trim() === '' ? '' : String(thumb)
}

const getThumbCandidates = (item: BeritaData): string[] => {
  const candidates = [item?.image?.thumbnail, item?.image?.medium, item?.image?.large]
    .filter((x) => typeof x === 'string')
    .map((x) => String(x).trim())
    .filter(Boolean)
  return Array.from(new Set(candidates))
}

const onRelatedThumbError = (e: Event, item: BeritaData) => {
  const img = e.target as HTMLImageElement | null
  if (!img) return

  const candidates = getThumbCandidates(item)
  if (candidates.length === 0) return

  const currentIdx = Number(img.dataset.thumbIndex || '0')
  const nextIdx = currentIdx + 1
  if (nextIdx >= candidates.length) {
    img.style.display = 'none'
    return
  }

  img.dataset.thumbIndex = String(nextIdx)
  img.src = candidates[nextIdx]
}

const relatedItems = computed(() => {
  if (relatedFromApi.value && relatedFromApi.value.length > 0) {
    return relatedFromApi.value.slice(0, 6)
  }

  const list = recordsList.value || []
  return list.filter((x) => x?.slug && x.slug !== slug).slice(0, 6)
})

const getTitleHtml = (title: string) => sanitizeInlineHtml(title || '')

const getShareUrl = () => window.location.href
const getShareTitle = () => record.value.data?.title || ''

const shareToFacebook = () => {
  const url = encodeURIComponent(getShareUrl())
  const title = encodeURIComponent(getShareTitle())
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`,
    '_blank',
    'width=600,height=400'
  )
}

const shareToTwitter = () => {
  const url = encodeURIComponent(getShareUrl())
  const title = encodeURIComponent(getShareTitle())
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    '_blank',
    'width=600,height=400'
  )
}

const shareToWhatsApp = () => {
  const url = encodeURIComponent(getShareUrl())
  const text = encodeURIComponent(`${getShareTitle()} - ${url}`)
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(getShareUrl())
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = getShareUrl()
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 3000)
}

const loadRelatedFallback = async () => {
  if (!store.related || store.related.length === 0) {
    if (!store.records.data || store.records.data.length === 0) {
      await store.callRecords(1)
    }
  }
}

const onLoad = async () => {
  await store.callRecord(slug)
  await loadRelatedFallback()
}

watch(
  () => route.params.slug,
  async (newSlug) => {
    await store.callRecord(newSlug as string)
    await loadRelatedFallback()
  }
)

const cleanupSurveyObserver = () => {
  if (surveyObserver) {
    surveyObserver.disconnect()
    surveyObserver = null
  }
}

const setupSurveyObserver = () => {
  cleanupSurveyObserver()
  surveyTriggered = false
  const el = articleEndSentinel.value
  if (!el) return
  surveyObserver = new IntersectionObserver(
    (entries) => {
      const reachedBottom = entries.some((entry) => entry.isIntersecting)
      if (reachedBottom && !surveyTriggered) {
        surveyTriggered = true
        surveyStore.open()
        cleanupSurveyObserver()
      }
    },
    { threshold: 0.1 }
  )
  surveyObserver.observe(el)
}

watch(
  () => record.value.data,
  async (data) => {
    cleanupSurveyObserver()
    if (!data) return
    await nextTick()
    setupSurveyObserver()
  },
  { immediate: true }
)

onMounted(() => {
  onLoad()
})

onUnmounted(() => {
  cleanupSurveyObserver()
  store.clearRecord()
})
</script>

<style scoped>
.article-content {
  color: #374151;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
  text-align: justify;
  line-height: 1.8;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  font-weight: 700;
  color: #111827;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.article-content :deep(img) {
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 1.5rem 0;
  width: 100%;
  object-fit: cover;
}

.article-content :deep(a) {
  color: #f59e0b;
  text-decoration: underline;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
}

.article-content :deep(ul) {
  list-style-type: disc;
}

.article-content :deep(ol) {
  list-style-type: decimal;
}
</style>
