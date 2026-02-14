import { apiClient } from './client'

export interface FileUploadResponse {
  url: string
  type: 'image' | 'document'
  originalName: string
}

export interface VideoSignResponse {
  uploadUrl: string
  blobUrl: string
  blobName: string
}

export const uploadApi = {
  /**
   * Upload a generic file (image or document)
   */
  uploadFile: async (file: File, type?: 'post' | 'profile' | 'cv'): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    if (type) {
      formData.append('type', type)
    }

    return await apiClient.post<FileUploadResponse>('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * Upload a video using SAS token
   */
  uploadVideo: async (file: File): Promise<{ url: string; blobName: string }> => {
    // 1. Get SAS token
    const signResponse = await apiClient.post<VideoSignResponse>('/uploads/video/sign', {
      fileName: file.name,
    })

    const { uploadUrl, blobUrl, blobName } = signResponse

    // 2. Upload to Azure Blob Storage using the SAS URL
    // We use fetch directly here to avoid sending Auth headers to Azure (which SAS replaces)
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
      body: file,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload video: ${response.statusText}`)
    }

    return {
      url: blobUrl,
      blobName,
    }
  },
}
