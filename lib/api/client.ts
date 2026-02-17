import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../env'
import type { ApiError } from '@/types'

// Rate limiting and retry configuration
const RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff: 1s, 2s, 4s
const MAX_RETRIES = 3

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  headers: any // Relaxing headers type for ease of use with newer Axios types
}

class ApiClient {
  private client: AxiosInstance
  private requestQueue: Array<() => Promise<unknown>> = []
  private isProcessingQueue = false
  private lastRequestTime = 0
  private minRequestInterval = 0 // Removed artificial bottleneck

  // Token refresh queue
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: any) => void
  }> = []

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for cookies
      timeout: 35000, // 35 second timeout
    })

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage (or you can use cookies)
        const token = this.getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle errors, token refresh, and rate limiting
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as CustomRequestConfig

        // Handle rate limiting (429)
        if (error.response?.status === 429) {
          // Do not retry 429s automatically to prevent storming
          console.error('❌ Rate limited (429). Fetch prevented.');
          return Promise.reject(error);
        }


        // Check for "No token provided" error (should be treated as 401)
        const isNoTokenError = error.response?.data?.error === 'No token provided' ||
          error.response?.data?.message === 'No token provided'

        // If 401 or "No token provided" and we haven't retried yet
        if ((error.response?.status === 401 || isNoTokenError) && originalRequest && !originalRequest._retry) {

          if (this.isRefreshing) {
            // If already refreshing, add to queue
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
                return this.client(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshToken = this.getRefreshToken()

            if (!refreshToken) {
              throw new Error('No refresh token available')
            }

            // Call refresh endpoint using a fresh axios instance to avoid interceptors
            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            })

            const { accessToken, refreshToken: newRefreshToken } = data.tokens
            this.setTokens(accessToken, newRefreshToken)

            // Update header for the original request
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

            // Process queue
            this.processFailedQueue(null, accessToken)

            return this.client(originalRequest)
          } catch (refreshError) {
            this.processFailedQueue(refreshError, null)
            this.clearTokens()
            this.forceLogout()
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private processFailedQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })

    this.failedQueue = []
  }

  // Request throttling to prevent rate limiting
  private async throttleRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const now = Date.now()
          const timeSinceLastRequest = now - this.lastRequestTime

          if (timeSinceLastRequest < this.minRequestInterval) {
            const delay = this.minRequestInterval - timeSinceLastRequest
            await new Promise(resolve => setTimeout(resolve, delay))
          }

          this.lastRequestTime = Date.now()
          const result = await requestFn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return
    }

    this.isProcessingQueue = true

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (request) {
        // Execute without awaiting completion, allowing concurrent requests
        request().catch(console.error)
      }
    }

    this.isProcessingQueue = false
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refreshToken')
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  private forceLogout(): void {
    if (typeof window === 'undefined') return

    // Clear tokens immediately explicitly
    this.clearTokens()

    // Clear user from Zustand store
    // We need to import and use the store directly since we're in the API client
    import('../stores/userStore').then(({ useUserStore }) => {
      useUserStore.getState().clearUser()
    })

    // Redirect to login
    // Use window.location only if we are not already on a public page
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/', '/verify-email']

    // Check if current path starts with any public path (to cover sub-routes if any)
    const isPublic = publicPaths.some(path =>
      window.location.pathname === path ||
      (path !== '/' && window.location.pathname.startsWith(path + '/'))
    )

    if (!isPublic) {
      window.location.href = '/login'
    }
  }

  // HTTP methods with throttling
  async get<T>(url: string, config = {}) {
    return this.throttleRequest(async () => {
      const response = await this.client.get<T>(url, config)
      return response.data
    })
  }

  async post<T>(url: string, data?: unknown, config = {}) {
    return this.throttleRequest(async () => {
      const response = await this.client.post<T>(url, data, config)
      return response.data
    })
  }

  async put<T>(url: string, data?: unknown, config = {}) {
    return this.throttleRequest(async () => {
      const response = await this.client.put<T>(url, data, config)
      return response.data
    })
  }

  async patch<T>(url: string, data?: unknown, config = {}) {
    return this.throttleRequest(async () => {
      const response = await this.client.patch<T>(url, data, config)
      return response.data
    })
  }

  async delete<T>(url: string, config = {}) {
    return this.throttleRequest(async () => {
      const response = await this.client.delete<T>(url, config)
      return response.data
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
