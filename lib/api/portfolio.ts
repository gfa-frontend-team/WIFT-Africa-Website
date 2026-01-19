import { apiClient } from './client'

export interface PortfolioItem {
  id: string
  _id?: string
  title: string
  year: number
  role: string
  mediaType: 'IMAGE' | 'VIDEO' | 'EXTERNAL'
  mediaUrl: string
  description?: string
  thumbnailUrl?: string
  visibility?: 'PUBLIC' | 'CONNECTIONS'
}

export const portfolioApi = {
  /**
   * List user portfolio
   */
  getPortfolio: async (userId: string): Promise<{ items: PortfolioItem[], count: number }> => {
    return await apiClient.get<{ items: PortfolioItem[], count: number }>(`/portfolios/${userId}`)
  },

  /**
   * Add portfolio item
   */
  addPortfolioItem: async (data: any): Promise<{ message: string, portfolio: PortfolioItem }> => {
    return await apiClient.post<{ message: string, portfolio: PortfolioItem }>('/portfolios', data)
  },

  /**
   * Update portfolio item
   */
  updatePortfolioItem: async (id: string, data: any): Promise<{ message: string, portfolio: PortfolioItem }> => {
    return await apiClient.put<{ message: string, portfolio: PortfolioItem }>(`/portfolios/${id}`, data)
  },

  /**
   * Delete portfolio item
   */
  deletePortfolioItem: async (id: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/portfolios/${id}`)
  }
}
