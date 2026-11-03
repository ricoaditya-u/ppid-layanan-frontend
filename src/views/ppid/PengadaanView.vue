<template>
  <div class="pengadaan-page">
    <h1 class="pengadaan-page__title">Pengadaan Barang dan Jasa</h1>
    <div class="pengadaan-page__grid">
      <component
        :is="app.external ? 'a' : 'router-link'"
        v-for="app in apps"
        :key="app.id"
        class="pengadaan-card"
        :class="app.external ? 'pengadaan-card--external' : 'pengadaan-card--local'"
        v-bind="
          app.external
            ? {
                href: app.href,
                target: '_blank',
                rel: 'noopener noreferrer'
              }
            : { to: { name: app.routeName } }
        "
      >
        <component :is="app.icon" class="pengadaan-card__icon" />
        <span class="pengadaan-card__label">{{ app.label }}</span>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

import IconDaftarHitam from '@/views/custom-icons/pbj/IconDaftarHitam.vue'
import IconDashboardPbj from '@/views/custom-icons/pbj/IconDashboardPbj.vue'
import IconDokumenPbj from '@/views/custom-icons/pbj/IconDokumenPbj.vue'
import IconKontrakPbj from '@/views/custom-icons/pbj/IconKontrakPbj.vue'
import IconLpse from '@/views/custom-icons/pbj/IconLpse.vue'
import IconPermohonanPbj from '@/views/custom-icons/pbj/IconPermohonanPbj.vue'
import IconRegulasiPbj from '@/views/custom-icons/pbj/IconRegulasiPbj.vue'
import IconRencanaUmumPbj from '@/views/custom-icons/pbj/IconRencanaUmumPbj.vue'

interface PbjAppItem {
  id: string
  label: string
  icon: Component
  external?: boolean
  href?: string
  routeName?: string
}

const apps: PbjAppItem[] = [
  {
    id: 'regulasi-pbj',
    label: 'Regulasi PBJ',
    routeName: 'ppid.pengadaan.regulasi',
    icon: IconRegulasiPbj
  },
  {
    id: 'rencana-umum-pbj',
    label: 'Rencana Umum PBJ',
    href: 'https://sirup.inaproc.id/sirup/rekap/klpd/L39',
    external: true,
    icon: IconRencanaUmumPbj
  },
  {
    id: 'lpse',
    label: 'Layanan Pengadaan Sistem Elektronik (LPSE)',
    href: 'https://spse.inaproc.id/bssn/',
    external: true,
    icon: IconLpse
  },
  {
    id: 'dashboard-pbj',
    label: 'Dashboard PBJ',
    href: 'https://data.inaproc.id/profil-pengadaan?tahun=2026&jenis=2&instansi=L39&view=Nilai',
    external: true,
    icon: IconDashboardPbj
  },
  {
    id: 'dokumen-pbj',
    label: 'Dokumen PBJ',
    routeName: 'ppid.pengadaan.dokumen',
    icon: IconDokumenPbj
  },
  {
    id: 'kontrak-pbj',
    label: 'Daftar Dokumen Kontrak PBJ',
    href: 'https://data.inaproc.id/realisasi?tahun=2026&jenis_klpd=2&instansi=L39&eselon=00',
    external: true,
    icon: IconKontrakPbj
  },
  {
    id: 'daftar-hitam',
    label: 'Daftar Hitam Penyedia',
    href: 'https://daftar-hitam.inaproc.id',
    external: true,
    icon: IconDaftarHitam
  },
  {
    id: 'permohonan-pbj',
    label: 'Permohonan Informasi PBJ',
    href: 'https://layanan.bssn.go.id/ppid/permohonan-informasi',
    external: true,
    icon: IconPermohonanPbj
  }
]
</script>

<style scoped>
.pengadaan-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0 1rem;
}

.pengadaan-page__title {
  margin: 0 0 2rem;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #1e293b;
  text-align: center;
  text-transform: uppercase;
}

@media (min-width: 768px) {
  .pengadaan-page__title {
    font-size: 1.5rem;
  }
}

.pengadaan-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 56rem;
}

@media (min-width: 768px) {
  .pengadaan-page__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

.pengadaan-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  min-height: 9.5rem;
  padding: 1.25rem 0.85rem;
  text-align: center;
  text-decoration: none;
  color: #334155;
  background: #fff;
  border-style: dashed;
  border-width: 2px;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.pengadaan-card--external {
  border-color: #0f172a;
}

.pengadaan-card--local {
  border-color: #eab308;
}

.pengadaan-card:hover {
  background: #f8fafc;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}

.pengadaan-card--external:hover {
  border-color: #000;
}

.pengadaan-card--local:hover {
  border-color: #ca8a04;
}

.pengadaan-card__icon {
  width: 3.75rem;
  height: 3.75rem;
  flex-shrink: 0;
}

.pengadaan-card__label {
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
