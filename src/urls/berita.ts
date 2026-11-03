export const recordsBeritaUrl = (page: number) => {
  return `/berita?page=${page}`
}
export const recordBeritaUrl = (slug: string) => {
  return `/berita/${slug}`
}
