<template>
  <div class="flex flex-col w-full h-full gap-8 xl:gap-12">
    <div class="text-center">
      <div class="text-2xl font-bold md:text-4xl lg:text-5xl lg:font-extrabold lg:leading-16">
        Selamat Datang di Layanan Informasi Publik
      </div>
      <div class="text-2xl font-bold md:text-4xl lg:text-5xl lg:font-extrabold lg:leading-16">
        Badan Siber dan Sandi Negara
      </div>

      <p class="mt-4 font-normal text-gray-500 md:text-lg lg:text-xl">
        Laman ini merupakan media bagi pemohon informasi publik kepada Badan Siber dan Sandi Negara
      </p>
    </div>

    <!-- Search Widget -->
    <div>
      <SearchWidget />
    </div>

    <div class="grid grid-cols-1 gap-4 px-4 mt-4 sm:px-6 md:px-8 lg:px-4 md:grid-cols-2 lg:gap-8">
      <router-link :to="{ name: 'ppid.permohonan-informasi.index' }">
        <div
          class="flex flex-col items-center p-4 text-gray-900 border border-gray-200 rounded-lg shadow-sm cursor-pointer group justify-evenly bg-primary-50 hover:text-primary-500"
        >
          <IconClipboard
            class="w-16 h-16 text-primary-100 group-hover:text-yellow-500 mb-2.5 group-hover:scale-105 transition-transform"
          />
          <div>
            <div class="font-bold">Permohonan Informasi</div>
          </div>
        </div>
      </router-link>
      <router-link :to="{ name: 'ppid.permohonan-keberatan.index' }">
        <div
          class="flex flex-col items-center p-4 text-gray-900 border border-gray-200 rounded-lg shadow-sm cursor-pointer group justify-evenly bg-primary-50 hover:text-primary-500"
        >
          <IconClipboardCheck
            class="w-16 h-16 text-primary-100 group-hover:text-yellow-500 mb-2.5 group-hover:scale-105 transition-transform"
          />
          <div>
            <div class="font-bold">Permohonan Keberatan</div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchWidget from './SearchWidget.vue'
import IconClipboard from '../custom-icons/IconClipboard.vue'
import IconClipboardCheck from '../custom-icons/IconClipboardCheck.vue'
</script>
