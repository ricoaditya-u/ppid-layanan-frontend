import { mapMultipartRequestOptions, mapRequestOptions } from '@bssn/ui-kit-frontend'

import { getApi } from '..'

export const getRequest = async (url: string, options: Record<string, any> = {}) => {
  return await getApi().get(url, mapRequestOptions(options))
}

export const postRequest = async (
  url: string,
  values: Record<string, any>,
  options: Record<string, any> = {}
) => {
  return await getApi().post(url, values, mapRequestOptions(options))
}

export const postMultipartRequest = async (
  url: string,
  formData: FormData,
  options: Record<string, any> = {}
) => {
  return await getApi().post(url, formData, mapMultipartRequestOptions(options))
}

export const patchRequest = async (
  url: string,
  values: Record<string, any>,
  options: Record<string, any> = {}
) => {
  return await getApi().patch(url, values, mapRequestOptions(options))
}

export const patchMultipartRequest = async (
  url: string,
  formData: FormData,
  options: Record<string, any> = {}
) => {
  formData.append('_method', 'PATCH')
  return await getApi().post(url, formData, mapMultipartRequestOptions(options))
}

export const putRequest = async (
  url: string,
  values: Record<string, any>,
  options: Record<string, any> = {}
) => {
  return await getApi().put(url, values, mapRequestOptions(options))
}

export const putMultipartRequest = async (
  url: string,
  formData: FormData,
  options: Record<string, any> = {}
) => {
  formData.append('_method', 'PUT')
  return await getApi().post(url, formData, mapMultipartRequestOptions(options))
}

export const deleteRequest = async (
  url: string,
  values: Record<string, any> = {},
  options: Record<string, any> = {}
) => {
  return await getApi().delete(url, {
    ...mapRequestOptions(options),
    data: values
  })
}
