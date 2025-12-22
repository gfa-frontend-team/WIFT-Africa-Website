import { apiClient } from './client'
import type { AuthResponse, User } from '@/types'

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface VerifyEmailInput {
  token: string
}

export const authApi = {
  // Register new user
  register: async (data: RegisterInput) => {
    const response = await apiClient.post<{ message: string; user: User }>('/auth/register', data)
    return response
  },

  // Login
  login: async (data: LoginInput) => {
    const response = await apiClient.post<{ message: string; user: User; tokens: { accessToken: string; refreshToken: string } }>('/auth/login', data)
    // Store tokens
    apiClient.setTokens(response.tokens.accessToken, response.tokens.refreshToken)
    return response
  },

  // Verify email
  verifyEmail: async (data: VerifyEmailInput) => {
    const response = await apiClient.post<{ message: string; user: User }>('/auth/verify-email', data)
    return response
  },

  // Logout
  logout: async (refreshToken: string) => {
    const response = await apiClient.post<{ message: string }>('/auth/logout', { refreshToken })
    // Clear tokens
    apiClient.clearTokens()
    return response
  },

  // Check if email exists
  checkEmail: async (email: string) => {
    const response = await apiClient.get<{ exists: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`)
    return response
  },

  // Request password reset
  forgotPassword: async (email: string) => {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email })
    return response
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', { token, newPassword })
    return response
  },

  // Resend verification email
  resendVerificationEmail: async (email: string) => {
    const response = await apiClient.post<{ message: string }>('/auth/resend-verification', { email })
    return response
  },

  // Google OAuth
  googleAuth: async (idToken: string) => {
    const response = await apiClient.post<{ message: string; user: User; tokens: { accessToken: string; refreshToken: string } }>('/auth/google', { idToken })
    // Store tokens
    apiClient.setTokens(response.tokens.accessToken, response.tokens.refreshToken)
    return response
  },

  // Change password (for authenticated users)
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.post<{ message: string }>('/auth/change-password', { 
      currentPassword, 
      newPassword 
    })
    return response
  },

  // Get active sessions
  getActiveSessions: async () => {
    const response = await apiClient.get<{ sessions: Array<{ id: string; deviceInfo: string; lastActive: string; current: boolean }> }>('/auth/sessions')
    return response
  },

  // Logout from all devices
  logoutAllDevices: async () => {
    const response = await apiClient.post<{ message: string }>('/auth/logout-all')
    // Clear tokens
    apiClient.clearTokens()
    return response
  },

  // Logout from specific session
  logoutSession: async (sessionId: string) => {
    const response = await apiClient.delete<{ message: string }>(`/auth/sessions/${sessionId}`)
    return response
  },
}
