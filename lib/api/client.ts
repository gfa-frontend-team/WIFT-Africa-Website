import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_BASE_URL } from '../env'
import type { ApiError } from '@/types'

// Rate limiting and retry configuration
const RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff: 1s, 2s, 4s
const MAX_RETRIES = 3

class ApiClient {
  private client: AxiosInstance
  private requestQueue: Array<() => Promise<any>> = []
  private isProcessingQueue = false
  private lastRequestTime = 0
  private minRequestInterval = 100 // Minimum 100ms between requests

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for cookies
      timeout: 10000, // 10 second timeout
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
        const originalRequest = error.config

        // Handle rate limiting (429)
        if (error.response?.status === 429 && originalRequest && !originalRequest.headers['X-Retry-Count']) {
          const retryCount = parseInt(originalRequest.headers['X-Retry-Count'] as string || '0')
          
          if (retryCount < MAX_RETRIES) {
            const delay = RETRY_DELAYS[retryCount] || RETRY_DELAYS[RETRY_DELAYS.length - 1]
            console.log(`🔄 Rate limited, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`)
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay))
            
            // Add retry count header
            originalRequest.headers['X-Retry-Count'] = (retryCount + 1).toString()
            
            return this.client(originalRequest)
          } else {
            console.error('❌ Max retries exceeded for rate limited request')
            // Return a more user-friendly error for rate limiting
            const rateLimitError = new Error('Server is busy. Please try again in a few moments.')
            rateLimitError.name = 'RateLimitError'
            return Promise.reject(rateLimitError)
          }
        }

        // Check for "No token provided" error (should be treated as 401)
        const isNoTokenError = error.response?.data?.error === 'No token provided' || 
                              error.response?.data?.message === 'No token provided'

        // If 401 or "No token provided" and we haven't tried to refresh yet
        if ((error.response?.status === 401 || isNoTokenError) && originalRequest && !originalRequest.headers['X-Retry']) {
          try {
            // Try to refresh token
            const refreshToken = this.getRefreshToken()
            if (refreshToken) {
              const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              })

              // Save new tokens
              this.setTokens(data.tokens.accessToken, data.tokens.refreshToken)

              // Retry original request with new token
              originalRequest.headers['Authorization'] = `Bearer ${data.tokens.accessToken}`
              originalRequest.headers['X-Retry'] = 'true'
              return this.client(originalRequest)
            } else {
              // No refresh token available, clear any remaining tokens and force logout
              this.clearTokens()
              this.forceLogout()
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.clearTokens()
            this.forceLogout()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
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
        await request()
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
    
    // Clear user from Zustand store
    // We need to import and use the store directly since we're in the API client
    import('../stores/userStore').then(({ useUserStore }) => {
      useUserStore.getState().clearUser()
    })
    
    // Redirect to login
    window.location.href = '/login'
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
