import ProjectConst from './projectConst'

export default ProjectConst

// Store Definitions
const storeEntities: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['', ['Berita', 'Informasi', 'PermohonanInformasi', 'PermohonanKeberatan', 'PbjDokumen']]
] as const

const createStoreName = (role: string, entity: string) =>
  `store${ProjectConst.name}${role}${entity}`

const storeDefinitions = Object.fromEntries(
  storeEntities.flatMap(([role, entities]) =>
    entities.map((entity) => {
      const key = role
        ? `${role.charAt(0).toLowerCase()}${role.slice(1)}${entity}Store`
        : `${entity.charAt(0).toLowerCase()}${entity.slice(1)}Store`
      return [key, createStoreName(role, entity)]
    })
  )
) as Record<string, string>

export const {
  beritaStore,
  informasiStore,
  permohonanInformasiStore,
  permohonanKeberatanStore,
  pbjDokumenStore
} = storeDefinitions

export const kategoriOptions = [
  { label: 'Informasi Berkala', value: '1' },
  { label: 'Informasi Serta Merta', value: '2' },
  { label: 'Informasi Tersedia Setiap Saat', value: '3' }
]

export const jenisBerkalaOptions = [
  { label: 'Berita Edukasi Siber Sosial Terkini (BESTI)', value: '1' },
  { label: 'Cyber Blitz', value: '2' },
  { label: 'Laporan Bulanan Monitoring Kamsiber', value: '3' },
  { label: 'Laporan Kinerja', value: '4' },
  { label: 'Laporan Survey Kepuasan Masyarakat', value: '5' },
  { label: 'Laporan Survey Kesadaran Kamsiber', value: '6' },
  { label: 'Laporan Tahunan Honeynet', value: '7' },
  { label: 'Laporan Tahunan Monioring Kamsiber', value: '8' },
  { label: 'Majalah Sanapati', value: '9' },
  { label: 'Manual Indikator Kinerja Utama (IKU)', value: '10' },
  { label: 'Pemetaan Perilaku Ruang Siber', value: '11' },
  { label: 'Perjanjian Kinerja', value: '12' },
  { label: 'Rencana Strategis', value: '13' }
]

export const jenisSertaMertaOptions = [
  { label: 'Imbauan Keamanan', value: '14' },
  { label: 'Panduan Keamanan', value: '15' },
  { label: 'Pengumuman', value: '16' },
  { label: 'Press Release', value: '17' }
]

export const jenisSetiapSaatOptions = [
  { label: 'Standar Layanan', value: '18' },
  { label: 'Maklumat Layanan', value: '19' },
  { label: 'Katalog Layanan', value: '20' }
]

export const standarLayananSlug = 'standar-layanan-ppid-S1jCl'
export const maklumatLayananSlug = 'maklumat-layanan-ppid-xWRgv'

const layananBaseUrl = (() => {
  const apiBaseUrl = (import.meta.env?.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  if (/^https?:\/\//.test(apiBaseUrl)) {
    return new URL(apiBaseUrl).origin
  }
  return ''
})()

export const standarLayananUrl = `${layananBaseUrl}/ppid/informasi/${standarLayananSlug}`
export const maklumatLayananUrl = `${layananBaseUrl}/ppid/informasi/${maklumatLayananSlug}`

const regulasiItems = [
  {
    title: 'Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik',
    slug: 'a27640d3-fcef-11f0-b493-005056be7571'
  },
  {
    title:
      'Peraturan Pemerintah Nomor 61 Tahun 2010 tentang Pelaksanaan Undang-Undang Keterbukaan Informasi Publik',
    slug: 'a278ed33-fcef-11f0-b493-005056be7571'
  },
  {
    title: 'Undang-Undang Nomor 25 Tahun 2009 tentang Pelayanan Publik',
    slug: 'a278ee89-fcef-11f0-b493-005056be7571'
  },
  {
    title:
      'Peraturan Badan Siber dan Sandi Negara Nomor 12 Tahun 2018 tentang Organisasi Pengelola Informasi dan Dokumentasi',
    slug: 'a2781b65-fcef-11f0-b493-005056be7571'
  },
  {
    title:
      'Peraturan Badan Siber dan Sandi Negara Nomor 2 Tahun 2018 tentang Organisasi dan Tata Kerja Badan Siber dan Sandi Negara',
    slug: 'a2781235-fcef-11f0-b493-005056be7571'
  },
  {
    title:
      'Peraturan Badan Siber dan Sandi Negara Nomor 6 Tahun 2021 tentang Organisasi dan Tata Kerja Badan Siber dan Sandi Negara.',
    slug: 'a2784d85-fcef-11f0-b493-005056be7571'
  },
  {
    title:
      'Peraturan Badan Siber dan Sandi Negara Nomor 4 Tahun 2023 tetang Perubahan atas Peraturan Badan Siber dan Sandi Negara Nomor 6 Tahun 2021 tetang Organisasi dan Tata Kerja Badan Siber dan Sandi Negara.',
    slug: 'a278681d-fcef-11f0-b493-005056be7571'
  },
  {
    title:
      'Peraturan Komisi Informasi Republik Indonesia Nomor 1 Tahun 2021 tentang Standar layanan Informasi Publik',
    slug: 'a27847ab-fcef-11f0-b493-005056be7571'
  }
] as const

export const regulasiSlugs = regulasiItems.map((item) => ({
  ...item,
  url: `${layananBaseUrl}/jdih/peraturan/${item.slug}`
}))
