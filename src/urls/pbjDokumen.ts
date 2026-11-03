const buildUrl = (path: string, params: URLSearchParams) => {
  const query = params.toString()
  return query ? `${path}?${query}` : path
}

export const recordsPbjDokumenUrl = (
  type: string,
  keyword: string,
  jenis: string,
  page: number
) => {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', page.toString())
  if (keyword) params.set('nama_informasi', keyword)
  if (jenis) params.set('jenis', jenis)

  return buildUrl(`/LayananGetPbj/${type}`, params)
}
