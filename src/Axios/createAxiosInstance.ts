import axios, { AxiosRequestConfig } from 'axios'
import { handleAndShowError } from '../Mixins/Errors'
import { showWriteRequestSuccess } from '../Mixins/FlashMessages'

const writeMethodNames = ['post', 'put', 'patch', 'delete']
const urlsToIgnoreSuccess = ['/api/login']
const isWriteMethod = (method: string) => writeMethodNames.includes(method)
const shouldIgnoreSuccess = (url: string) => urlsToIgnoreSuccess.includes(url)

const handleResponse = (response) => {
  if (
    isWriteMethod(response.config.method) &&
    !shouldIgnoreSuccess(response.config.url)
  ) {
    showWriteRequestSuccess(response.config.method)
  }
  return response
}

const createAxiosConfig = (baseURL: string) => ({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/ld+json',
  },
})

const requestInterceptor = (config: AxiosRequestConfig) => {
  if (config.method === 'patch' && config.headers) {
    config.headers['Content-Type'] = 'application/merge-patch+json'
  }

  return config
}

const createAxiosInstance = (baseUrl = '') => {
  const repository = axios.create(createAxiosConfig(baseUrl))
  repository.interceptors.response.use(handleResponse, handleAndShowError)
  repository.interceptors.request.use(requestInterceptor)

  return repository
}

export const createInitialAxiosInstance = (resource = '') => {
  const baseUrl = `/api/${resource}`
  return createAxiosInstance(baseUrl)
}

export const baseAxios = createAxiosInstance()
