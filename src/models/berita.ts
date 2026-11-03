export interface AuthorData {
  name: string
}

export const authorDataFromJson = (json: any): AuthorData => {
  return {
    name: json.name
  }
}

export interface CategoryData {
  name: string
  slug: string
}

export const categoryDataFromJson = (json: any): CategoryData => {
  return {
    name: json.name,
    slug: json.slug
  }
}

export interface ImageData {
  thumbnail: string
  medium: string
  large: string
}

export const imageDataFromJson = (json: any): ImageData => {
  return {
    thumbnail: json.thumbnail,
    medium: json.medium,
    large: json.large
  }
}

export interface BeritaData {
  id: string
  slug: string
  title: string
  author: AuthorData
  image: ImageData
  datePublished: string
  excerpt: string
  category: CategoryData
  link: string
  content: string
}

export const normalizeBeritaListJson = (body: any, page: number) => {
  if (body.meta) return body

  const perPage = body.data?.length ?? 5
  return {
    data: body.data ?? [],
    meta: {
      current_page: page,
      last_page: Number(body.pagination?.totalPages ?? 1),
      per_page: perPage,
      total: Number(body.pagination?.total ?? body.data?.length ?? 0)
    }
  }
}

export const beritaDataFromJson = (json: any): BeritaData => {
  const content =
    typeof json.content === 'string' ? json.content : (json.content?.rendered ?? '')
  const title = typeof json.title === 'string' ? json.title : (json.title?.rendered ?? '')
  const excerptRaw =
    typeof json.excerpt === 'string' ? json.excerpt : (json.excerpt?.rendered ?? '')

  const author =
    typeof json.author === 'object' && json.author !== null
      ? authorDataFromJson(json.author)
      : authorDataFromJson(json._embedded?.author?.[0] ?? { name: '' })

  const category = json.category
    ? categoryDataFromJson(json.category)
    : categoryDataFromJson(json._embedded?.['wp:term']?.[0]?.[0] ?? { name: '', slug: '' })

  let image: ImageData
  if (json.image) {
    image = imageDataFromJson(json.image)
  } else {
    const src = content.match(/<img[^>]+src="([^"]+)"/)?.[1] ?? ''
    image = { thumbnail: src, medium: src, large: src }
  }

  return {
    id: String(json.id),
    slug: json.slug,
    title,
    author,
    image,
    datePublished: json.date_published ?? json.date ?? '',
    excerpt: excerptRaw.replace(/<[^>]*>/g, '').trim(),
    category,
    link: json.link ?? '',
    content
  }
}
