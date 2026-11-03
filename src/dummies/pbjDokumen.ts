import type { PbjDokumenData, PbjDokumenType } from '@/models/pbjDokumen'

const regulasiDummy: PbjDokumenData[] = [
  {
    id: '1',
    slug: 'dummy-pbj-1',
    namaDokumen: 'Peraturan Presiden tentang Pengadaan Barang/Jasa Pemerintah',
    kategori: 'Regulasi PBJ',
    jenis: 'Peraturan',
    tahun: '2021',
    fileUpload: '',
    link: null
  },
  {
    id: '2',
    slug: 'dummy-pbj-2',
    namaDokumen: 'Peraturan LKPP tentang Tata Cara Pelaksanaan PBJ',
    kategori: 'Regulasi PBJ',
    jenis: 'Peraturan',
    tahun: '2022',
    fileUpload: '',
    link: null
  },
  {
    id: '3',
    slug: 'dummy-pbj-3',
    namaDokumen: 'Pedoman Pengadaan Barang dan Jasa BSSN',
    kategori: 'Regulasi PBJ',
    jenis: 'Pedoman',
    tahun: '2023',
    fileUpload: '',
    link: null
  },
  {
    id: '4',
    slug: 'dummy-pbj-4',
    namaDokumen: 'Surat Edaran tentang Pelaksanaan Pengadaan Elektronik',
    kategori: 'Regulasi PBJ',
    jenis: 'Surat Edaran',
    tahun: '2024',
    fileUpload: '',
    link: null
  },
  {
    id: '5',
    slug: 'dummy-pbj-5',
    namaDokumen: 'Standar Dokumen Pengadaan (SDP) BSSN',
    kategori: 'Regulasi PBJ',
    jenis: 'Standar',
    tahun: '2024',
    fileUpload: '',
    link: null
  }
]

const dokumenDummy: PbjDokumenData[] = [
  {
    id: '1',
    slug: 'dummy-pbj-1',
    namaDokumen: 'Laporan Pelaksanaan Pengadaan Barang dan Jasa Tahun 2023',
    kategori: 'Dokumen PBJ',
    jenis: 'Laporan',
    tahun: '2023',
    fileUpload: '',
    link: null
  },
  {
    id: '2',
    slug: 'dummy-pbj-2',
    namaDokumen: 'Rekapitulasi Paket Pengadaan BSSN Tahun 2024',
    kategori: 'Dokumen PBJ',
    jenis: 'Rekapitulasi',
    tahun: '2024',
    fileUpload: '',
    link: null
  },
  {
    id: '3',
    slug: 'dummy-pbj-3',
    namaDokumen: 'Daftar Penyedia Terpilih Pengadaan Barang/Jasa',
    kategori: 'Dokumen PBJ',
    jenis: 'Daftar',
    tahun: '2024',
    fileUpload: '',
    link: null
  },
  {
    id: '4',
    slug: 'dummy-pbj-4',
    namaDokumen: 'Laporan Monitoring dan Evaluasi PBJ Semester I',
    kategori: 'Dokumen PBJ',
    jenis: 'Laporan',
    tahun: '2025',
    fileUpload: '',
    link: null
  },
  {
    id: '5',
    slug: 'dummy-pbj-5',
    namaDokumen: 'Dokumen Perencanaan Pengadaan Tahunan BSSN',
    kategori: 'Dokumen PBJ',
    jenis: 'Perencanaan',
    tahun: '2025',
    fileUpload: '',
    link: null
  },
  {
    id: '6',
    slug: 'dummy-pbj-6',
    namaDokumen: 'Notulensi Rapat Koordinasi Pengadaan',
    kategori: 'Dokumen PBJ',
    jenis: 'Notulensi',
    tahun: '2025',
    fileUpload: '',
    link: null
  }
]

export const recordsPbjDokumenDummy = (type: PbjDokumenType): PbjDokumenData[] => {
  return type === 'regulasi' ? regulasiDummy : dokumenDummy
}
