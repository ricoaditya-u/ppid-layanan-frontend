<template>
  <div
    class="flex flex-col w-full h-full min-h-screen antialiased min-w-80 bg-gray-50 bg-[url('@/assets/images/hero-pattern.svg')] bg-repeat bg-top bg-auto"
  >
    <!-- Nav -->
    <nav class="sticky top-0 z-40">
      <!-- Header -->
      <div class="bg-primary-500">
        <div class="max-w-screen-xl px-4 py-4 m-auto">
          <div class="flex flex-row items-center justify-between gap-4">
            <router-link :to="{ name: 'ppid' }" class="flex items-center gap-4">
              <LogoBssn />
              <div class="flex-1 flex flex-col items-start gap-0.5 text-white pt-1.5">
                <div class="block sm:hidden">
                  <div class="font-medium tracking-wide uppercase opacity-90 ppid-logo-title">
                    PPID
                  </div>
                  <div class="text-lg font-bold tracking-tight">BSSN</div>
                </div>
                <div class="hidden sm:block">
                  <div class="font-medium tracking-wide uppercase opacity-90 ppid-logo-title">
                    Pejabat Pengelola Informasi dan Dokumentasi
                  </div>
                  <div class="text-lg font-bold tracking-tight">BADAN SIBER DAN SANDI NEGARA</div>
                </div>
              </div>
            </router-link>
            <ButtonMenu @click="toggleMobileMenu" customClass="lg:hidden" />
          </div>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:block bg-[#ECF0F9] border-b border-gray-200">
        <div class="flex flex-row w-full max-w-screen-xl m-auto overflow-visible">
          <template v-for="(menu, menuIndex) in menus" :key="menu.name">
            <!-- Dropdown Menu -->
            <div
              v-if="menu.children"
              class="relative z-[60]"
              @mouseleave="
                () => {
                  openMenuIndex = null
                  openSubMenuIndex = null
                }
              "
            >
              <button
                @click="openMenuIndex = openMenuIndex === menuIndex ? null : menuIndex"
                @mouseenter="openMenuIndex = menuIndex"
                class="flex items-center gap-2 px-6 py-4 text-sm font-semibold tracking-wide text-gray-500 uppercase transition-all duration-200 cursor-pointer hover:text-primary-600 hover:bg-warning-500 whitespace-nowrap"
              >
                <span>{{ menu.label }}</span>
                <font-awesome-icon
                  :icon="['fas', openMenuIndex === menuIndex ? 'angle-up' : 'angle-down']"
                  class="w-4 h-4 ml-1"
                />
              </button>
              <div
                v-show="openMenuIndex === menuIndex"
                class="absolute left-0 top-full min-w-[240px] bg-white border border-gray-200 shadow-lg z-[100]"
              >
                <template v-for="(child, childIndex) in menu.children" :key="child.name">
                  <!-- Level 2 with Level 3 children -->
                  <div
                    v-if="child.children"
                    class="relative"
                    @mouseenter="() => (openSubMenuIndex = childIndex)"
                    @mouseleave="() => (openSubMenuIndex = null)"
                  >
                    <div
                      class="flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-500 transition-all duration-200 cursor-pointer hover:text-primary-600 hover:bg-warning-500"
                    >
                      <span>{{ child.label }}</span>
                      <font-awesome-icon :icon="['fas', 'angle-right']" class="w-3.5 h-3.5" />
                    </div>
                    <!-- Level 3 Dropdown (appears to the right) -->
                    <div
                      v-show="openSubMenuIndex === childIndex"
                      class="absolute left-full top-0 min-w-[380px] bg-white border border-gray-200 shadow-lg z-[110] ml-[-1px]"
                    >
                      <router-link
                        v-for="grandchild in child.children"
                        :key="grandchild.name"
                        :to="{ name: grandchild.name }"
                        class="block px-6 py-3 text-sm font-medium text-gray-500 transition-all duration-200 hover:text-primary-600 hover:bg-warning-500"
                        @click="
                          () => {
                            openMenuIndex = null
                            openSubMenuIndex = null
                          }
                        "
                      >
                        {{ grandchild.label }}
                      </router-link>
                    </div>
                  </div>
                  <!-- Level 2 without children -->
                  <router-link
                    v-else
                    :to="{ name: child.name }"
                    class="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 transition-all duration-200 hover:text-primary-600 hover:bg-warning-500 whitespace-nowrap"
                    @click="openMenuIndex = null"
                  >
                    {{ child.label }}
                  </router-link>
                </template>
              </div>
            </div>
            <!-- External Menu -->
            <a
              v-else-if="menu.href"
              :href="menu.href"
              class="flex items-center gap-2 px-6 py-4 text-sm font-semibold tracking-wide text-gray-500 uppercase transition-all duration-200 hover:text-primary-600 hover:bg-warning-500 whitespace-nowrap"
            >
              <span>{{ menu.label }}</span>
            </a>
            <!-- Regular Menu -->
            <router-link
              v-else
              :to="{ name: menu.name }"
              class="flex items-center gap-2 px-6 py-4 text-sm font-semibold tracking-wide text-gray-500 uppercase transition-all duration-200 hover:text-primary-600 hover:bg-warning-500 whitespace-nowrap"
            >
              <span>{{ menu.label }}</span>
            </router-link>
          </template>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden absolute left-0 right-0 top-full z-50 bg-[#ECF0F9] border-b border-gray-200 max-h-[calc(100vh-80px)] overflow-y-auto"
      >
        <div class="flex flex-col w-full">
          <template v-for="(menu, menuIndex) in menus" :key="menu.name">
            <!-- Dropdown Menu Mobile -->
            <div v-if="menu.children" class="flex flex-col">
              <button
                @click="openMenuIndexMobile = openMenuIndexMobile === menuIndex ? null : menuIndex"
                class="flex items-center justify-between gap-2 px-6 py-4 text-sm font-semibold tracking-wide text-gray-500 uppercase transition-all duration-200 border-b border-gray-200 cursor-pointer hover:text-primary-600 hover:bg-warning-500 whitespace-nowrap"
              >
                <div class="flex items-center gap-2">
                  <span>{{ menu.label }}</span>
                </div>
                <font-awesome-icon
                  :icon="['fas', openMenuIndexMobile === menuIndex ? 'angle-up' : 'angle-down']"
                  class="w-4 h-4"
                />
              </button>
              <div v-if="openMenuIndexMobile === menuIndex" class="bg-[#F3F6FC]">
                <template v-for="(child, childIndex) in menu.children" :key="child.name">
                  <!-- Level 2 with Level 3 children -->
                  <div v-if="child.children" class="flex flex-col">
                    <button
                      @click="
                        openSubMenuIndexMobile =
                          openSubMenuIndexMobile === childIndex ? null : childIndex
                      "
                      class="flex items-center justify-between gap-2 px-8 py-3 text-sm font-medium text-gray-500 transition-all duration-200 border-b border-gray-200 cursor-pointer hover:text-primary-600 hover:bg-warning-500"
                    >
                      <span>{{ child.label }}</span>
                      <font-awesome-icon
                        :icon="[
                          'fas',
                          openSubMenuIndexMobile === childIndex ? 'angle-up' : 'angle-down'
                        ]"
                        class="w-4 h-4"
                      />
                    </button>
                    <!-- Level 3 Dropdown -->
                    <div v-if="openSubMenuIndexMobile === childIndex" class="bg-[#F8FAFF]">
                      <router-link
                        v-for="grandchild in child.children"
                        :key="grandchild.name"
                        :to="{ name: grandchild.name }"
                        class="block px-12 py-3 text-sm font-medium text-gray-500 transition-all duration-200 border-b border-gray-200 hover:text-primary-600 hover:bg-warning-500"
                        @click="closeMobileMenu"
                      >
                        {{ grandchild.label }}
                      </router-link>
                    </div>
                  </div>
                  <!-- Level 2 without children -->
                  <router-link
                    v-else
                    :to="{ name: child.name }"
                    class="flex items-center gap-2 px-8 py-3 text-sm font-medium text-gray-500 transition-all duration-200 border-b border-gray-200 hover:text-primary-600 hover:bg-warning-500 whitespace-nowrap"
                    @click="closeMobileMenu"
                  >
                    {{ child.label }}
                  </router-link>
                </template>
              </div>
            </div>
            <!-- External Menu Mobile -->
            <a
              v-else-if="menu.href"
              :href="menu.href"
              class="flex items-center gap-2 px-6 py-4 text-sm font-semibold tracking-wide text-gray-500 uppercase transition-all duration-200 border-b border-gray-200 hover:text-primary-600 hover:bg-warning-500 whitespace-nowrap"
              @click="closeMobileMenu"
            >
              <span>{{ menu.label }}</span>
            </a>
            <!-- Regular Menu Mobile -->
            <router-link
              v-else
              :to="{ name: menu.name }"
              class="flex items-center gap-2 px-6 py-4 text-sm font-semibold tracking-wide text-gray-500 uppercase transition-all duration-200 border-b border-gray-200 hover:text-primary-600 hover:bg-warning-500 whitespace-nowrap"
              @click="closeMobileMenu"
            >
              <span>{{ menu.label }}</span>
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- Main -->
    <main class="flex flex-row flex-1 w-full max-w-screen-xl px-4 py-8 m-auto xl:px-6 xl:py-12">
      <RouterView />
    </main>

    <SurveyPopupModal />

    <!-- Tautan Terkait (beranda only) -->
    <section
      v-if="currentName === 'ppid.beranda.index'"
      class="flex flex-col items-center w-full gap-3 px-4 py-5 xl:gap-4"
    >
      <h2 class="text-base font-semibold text-center text-gray-900 md:text-lg">Tautan Terkait</h2>
      <div
        class="flex flex-wrap items-start justify-center w-full max-w-screen-xl gap-x-4 gap-y-3 sm:gap-x-6"
      >
        <a
          v-for="link in tautanTerkait"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center w-16 gap-1 text-center transition-transform sm:w-20 hover:scale-105"
        >
          <img
            :src="link.image"
            :alt="link.label"
            class="object-contain w-10 h-10 sm:w-12 sm:h-12"
          />
          <span class="text-xs font-medium leading-snug text-primary-600">{{ link.label }}</span>
        </a>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="p-4 text-xs text-center text-gray-400 bg-primary-500">
        Hak Cipta © 2026
        <a href="https://www.bssn.go.id/" class="hover:underline">Badan Siber dan Sandi Negara</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ButtonMenu } from '@bssn/ui-kit-frontend'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import SurveyPopupModal from '@/components/SurveyPopupModal.vue'
import imgBsre from '@/assets/images/bsre.jpeg'
import imgInaproc from '@/assets/images/inaproc.png'
import imgJdihn from '@/assets/images/jdihn.png'
import imgLapor from '@/assets/images/lapor.png'
import imgBssn from '@/assets/images/logo-bssn.png'
import imgPoltekssn from '@/assets/images/poltekssn.png'
import imgPusbangsdm from '@/assets/images/pusbangsdm.jpeg'

import LogoBssn from '../logo/LogoBssn.vue'

interface MenuItemLevel3 {
  name: string
  label: string
}

interface MenuItemLevel2 {
  name: string
  label: string
  children?: MenuItemLevel3[]
}

interface MenuItem {
  name: string
  label: string
  href?: string
  children?: MenuItemLevel2[]
}

const router = useRouter()
const currentName = computed(() => router.currentRoute.value.name)

// 'main.index' only exists when mounted inside the host layanan-frontend app
const mainRouteName = 'main.index'
const mainDomainUrl =
  import.meta.env.VITE_MAIN_DOMAIN_URL ||
  (router.hasRoute(mainRouteName) ? undefined : window.location.origin)

const tautanTerkait = [
  { label: 'BSSN', href: 'https://www.bssn.go.id/', image: imgBssn },
  { label: 'BSrE', href: 'https://bsre.bssn.go.id/', image: imgBsre },
  { label: 'Poltek SSN', href: 'https://poltekssn.ac.id/', image: imgPoltekssn },
  { label: 'Pusbang SDM', href: 'https://pusbangsdm.bssn.go.id/', image: imgPusbangsdm },
  { label: 'JDIH Nasional', href: 'https://jdihn.go.id/', image: imgJdihn },
  { label: 'INAPROC', href: 'https://inaproc.id/', image: imgInaproc },
  { label: 'LAPOR!', href: 'https://www.lapor.go.id/', image: imgLapor }
]

const isMobileMenuOpen = ref(false)
const openMenuIndex = ref<number | null>(null)
const openMenuIndexMobile = ref<number | null>(null)
const openSubMenuIndex = ref<number | null>(null)
const openSubMenuIndexMobile = ref<number | null>(null)

const menus: MenuItem[] = [
  { name: 'ppid.beranda.index', label: 'Beranda' },
  { name: 'ppid.profil.index', label: 'Profil' },
  {
    name: 'ppid.layanan',
    label: 'Layanan Informasi Publik',
    children: [
      { name: 'ppid.informasi-berkala.index', label: 'Informasi Berkala' },
      { name: 'ppid.informasi-serta-merta.index', label: 'Informasi Serta Merta' },
      { name: 'ppid.informasi-tersedia-setiap-saat.index', label: 'Informasi Tersedia Setiap Saat' }
    ]
  },
  { name: 'ppid.pengadaan.index', label: 'Pengadaan Barang dan Jasa' },
  { name: 'ppid.berita.index', label: 'Berita' },
  { name: mainRouteName, label: 'Layanan Lainnya', href: mainDomainUrl }
]

const isMenuActive = (menu: MenuItem) => {
  if (menu.children) {
    return menu.children.some((child) => {
      if (child.children) {
        return child.children.some((grandchild) => currentName.value === grandchild.name)
      }
      return currentName.value === child.name
    })
  }
  return currentName.value === menu.name
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    const activeMenuIndex = menus.findIndex((m) => isMenuActive(m))
    if (activeMenuIndex !== -1 && menus[activeMenuIndex].children) {
      openMenuIndexMobile.value = activeMenuIndex

      const activeMenu = menus[activeMenuIndex]
      if (activeMenu.children) {
        const activeChildIndex = activeMenu.children.findIndex((child) => {
          if (child.children) {
            return child.children.some((grandchild) => currentName.value === grandchild.name)
          }
          return currentName.value === child.name
        })

        if (activeChildIndex !== -1 && activeMenu.children[activeChildIndex].children) {
          openSubMenuIndexMobile.value = activeChildIndex
        }
      }
    }
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  openMenuIndexMobile.value = null
  openSubMenuIndexMobile.value = null
}
</script>

<style scoped>
.ppid-logo-title {
  font-family: 'Rockwell';
}
</style>
