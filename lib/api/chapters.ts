import { apiClient } from './client'
import { Chapter, PaginatedResponse } from '@/types'

interface GetChaptersParams {
  page?: number
  limit?: number
  country?: string
  city?: string
  search?: string
}

interface ChaptersResponse {
  status: string
  results: number
  data: {
    chapters: Chapter[]
  }
}

interface ChapterResponse {
  chapter: Chapter
}

export const chaptersApi = {
  // Get all chapters with optional filtering
  getChapters: async (params: GetChaptersParams = {}) => {
    const response = await apiClient.get<ChaptersResponse>('/chapters', { params })
    return {
      ...response,
      data: {
        ...response.data,
        chapters: response.data.chapters.map((chapter: any) => ({
          ...chapter,
          id: chapter._id || chapter.id,
        })),
      },
    }
  },

  // Get single chapter details
  getChapter: async (id: string) => {
    const response = await apiClient.get<ChapterResponse>(`/chapters/${id}`)
    const chapter: any = response.chapter
    return {
      ...response,
      chapter: {
        ...chapter,
        id: chapter._id || chapter.id,
      },
    }
  },
}
