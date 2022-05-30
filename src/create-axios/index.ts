import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const requestInterceptor = (config: AxiosRequestConfig) => {
  if (config.method === 'patch' && config.headers) {
    config.headers['Content-Type'] = 'application/merge-patch+json'
  }

  return config
}

const createAxiosWithInterceptors = (
  responseInterceptor: (
    value: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>,
  errorInterceptor: ((error: any) => any) | undefined
) => {
  const instance = axios.create({
    withCredentials: true,
    headers: {
      Accept: 'application/ld+json',
    },
  })
  instance.interceptors.response.use(responseInterceptor, errorInterceptor)
  instance.interceptors.request.use(requestInterceptor)

  return instance
}

export default createAxiosWithInterceptors
