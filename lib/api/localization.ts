import { apiClient } from './client';
import { Language, LanguageResponse, UserLanguage, UpdateLanguageInput } from '@/types/localization';

export const localizationApi = {
  // Get all supported languages
  getSupportedLanguages: async (): Promise<Language[]> => {
    const response = await apiClient.get<LanguageResponse>('/profiles/languages');
    // Assuming the backend returns { data: [...] } structure based on the guide
    return response.data;
  },

  // Get current user's preference
  getUserLanguage: async (): Promise<UserLanguage> => {
    const response = await apiClient.get<UserLanguage>('/profiles/languages/me');
    return response;
  },

  // Update preference
  updateUserLanguage: async (data: UpdateLanguageInput): Promise<UserLanguage> => {
    const response = await apiClient.patch<UserLanguage>('/profiles/languages/me', data);
    return response;
  },
};
