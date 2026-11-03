export interface InformasiData {
  id: string
  namaInformasi: string
  slug: string
  kategoriId: string
  jenisId: string
  jenisNama: string
  tahun: string
  link: string | null
  fileUpload: string
  abstraksi: string
  status: string
  createdAt: string
  updatedAt: string
}

export const informasiDataFromJson = (json: any): InformasiData => {
  return {
    id: String(json.id),
    namaInformasi: json.nama_informasi,
    slug: json.slug,
    kategoriId: String(json.id_kategori),
    jenisId: String(json.id_jenis),
    jenisNama: json.nama_jenis,
    tahun: json.tahun,
    link: json.link ?? null,
    fileUpload: json.file_upload,
    abstraksi: json.abstraksi,
    status: json.status,
    createdAt: json.created_at,
    updatedAt: json.updated_at
  }
}
