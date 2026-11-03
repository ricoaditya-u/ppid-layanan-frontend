export type PbjDokumenType = 'regulasi' | 'dokumen'

export interface PbjDokumenData {
  id: string
  namaDokumen: string
  slug: string
  kategori: string
  jenis: string
  tahun: string
  fileUpload: string
  link: string | null
}

export const pbjDokumenDataFromJson = (json: any, type: PbjDokumenType = 'regulasi'): PbjDokumenData => {
  const defaultKategori = type === 'dokumen' ? 'Dokumen PBJ' : 'Regulasi PBJ'

  return {
    id: String(json.id ?? ''),
    namaDokumen: json.nama_dokumen ?? json.namaDokumen ?? json.nama_informasi ?? '',
    slug: json.slug ?? '',
    kategori: json.kategori ?? json.nama_kategori ?? defaultKategori,
    jenis: json.jenis ?? json.nama_jenis ?? '',
    tahun: String(json.tahun ?? ''),
    fileUpload: json.file_upload ?? json.fileUpload ?? '',
    link: json.link ?? null
  }
}
