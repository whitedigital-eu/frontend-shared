import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry'

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
): AxiosInstance => {
  const instance = axios.create({
    withCredentials: true,
    headers: {
      Accept: 'application/ld+json',
    },
  })
  axiosRetry(instance, {
    retries: 3,
    retryCondition: function (error) {
      return (
        isNetworkOrIdempotentRequestError(error) ||
        error.code === 'ECONNABORTED'
      )
    },
  })
  instance.interceptors.response.use(responseInterceptor, errorInterceptor)
  instance.interceptors.request.use(requestInterceptor)

  return instance
}

export const requestTimeoutMs = 5000

export default createAxiosWithInterceptors
