export const ppidRoutes = [
  {
    path: '/ppid',
    name: 'ppid',
    component: () => import('@/views/foundation/layout/LayoutPpid.vue'),
    redirect: { name: 'ppid.beranda.index' },
    meta: {
      title: 'PPID'
    },
    children: [
      {
        path: 'beranda',
        name: 'ppid.beranda.index',
        component: () => import('@/views/ppid/BerandaView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'cari',
        name: 'ppid.cari.index',
        component: () => import('@/views/ppid/InformasiView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'permohonan-informasi',
        name: 'ppid.permohonan-informasi.index',
        component: () => import('@/views/ppid/PermohonanInformasiView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'permohonan-keberatan',
        name: 'ppid.permohonan-keberatan.index',
        component: () => import('@/views/ppid/PermohonanKeberatanView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'profil',
        name: 'ppid.profil.index',
        component: () => import('@/views/ppid/ProfilView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'informasi-berkala',
        name: 'ppid.informasi-berkala.index',
        component: () => import('@/views/ppid/InformasiBerkalaView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'informasi-serta-merta',
        name: 'ppid.informasi-serta-merta.index',
        component: () => import('@/views/ppid/InformasiSertaMertaView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'informasi-tersedia-setiap-saat',
        name: 'ppid.informasi-tersedia-setiap-saat.index',
        component: () => import('@/views/ppid/InformasiSetiapSaatView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'informasi/:slug',
        name: 'ppid.informasi.detail',
        component: () => import('@/views/ppid/InformasiDetailView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'pengadaan-barang-dan-jasa',
        name: 'ppid.pengadaan.index',
        component: () => import('@/views/ppid/PengadaanView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'pengadaan-barang-dan-jasa/regulasi',
        name: 'ppid.pengadaan.regulasi',
        component: () => import('@/views/ppid/RegulasiPbjView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'pengadaan-barang-dan-jasa/dokumen',
        name: 'ppid.pengadaan.dokumen',
        component: () => import('@/views/ppid/DokumenPbjView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'berita',
        name: 'ppid.berita.index',
        component: () => import('@/views/ppid/BeritaView.vue'),
        meta: { authRequired: false }
      },
      {
        path: 'berita/:slug',
        name: 'ppid.berita.detail',
        component: () => import('@/views/ppid/BeritaDetailView.vue'),
        meta: { authRequired: false }
      }
    ]
  }
]
