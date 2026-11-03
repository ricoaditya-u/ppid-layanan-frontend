const buildUrl = (path: string, params: URLSearchParams) => {
  const query = params.toString()
  return query ? `${path}?${query}` : path
}

export const recordsInformasiUrl = (
  type: string,
  keyword: string,
  kategoriId: string,
  jenisId: string,
  page: number
) => {
  if (['berkala', 'serta-merta', 'setiap-saat'].includes(type)) {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    if (keyword) params.set('nama_informasi', keyword)
    if (jenisId) params.set('slug_jenis', jenisId)

    if (type === 'berkala') {
      return buildUrl('/LayananGetInformasi/berkala', params)
    }
    if (type === 'serta-merta') {
      return buildUrl('/LayananGetInformasi/sertamerta', params)
    }
    return buildUrl('/LayananGetInformasi/setiapsaat', params)
  }

  const searchParams = new URLSearchParams()
  if (page > 1) searchParams.set('page', page.toString())
  if (keyword) searchParams.set('keyword', keyword)
  if (kategoriId) searchParams.set('kategoriId', kategoriId)
  if (jenisId) searchParams.set('jenisId', jenisId)

  return buildUrl('/GetListInfoByJudul', searchParams)
}

export const recordInformasiUrl = (slug: string) => {
  return `/GetDetailInfo/${slug}`
}

export const jenisByKategoriUrl = (kategoriId: string | number) => {
  return `/GetJenisByKategori/${kategoriId}`
}

const encodeFileUploadPath = (fileUpload: string) =>
  fileUpload
    .split('/')
    .map((s) => encodeURIComponent(s))
    .join('/')

/** Absolute or relative API root from env, without trailing slash. */
export const getApiBaseUrl = () =>
  (import.meta.env?.VITE_API_BASE_URL ?? '').replace(/\/$/, '')


export const downloadInformasiApiUrl = (fileUpload: string) => {
  return `/download/${encodeFileUploadPath(fileUpload)}`
}

export const downloadInformasiPath = (fileUpload: string) => {
  return `${getApiBaseUrl()}${downloadInformasiApiUrl(fileUpload)}`
}
