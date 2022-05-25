import axios, { AxiosRequestConfig } from 'axios'

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

export const createAxiosInstance = (
  baseUrl = '',
  responseInterceptor,
  errorInterceptor
) => {
  const repository = axios.create(createAxiosConfig(baseUrl))
  repository.interceptors.response.use(responseInterceptor, errorInterceptor)
  repository.interceptors.request.use(requestInterceptor)

  return repository
}
