import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localizationApi } from '../api/localization';
import { Language, UpdateLanguageInput } from '@/types/localization';
import i18n from '../i18n';

const LANGUAGE_KEYS = {
  all: ['languages'] as const,
  supported: () => [...LANGUAGE_KEYS.all, 'supported'] as const,
  user: () => [...LANGUAGE_KEYS.all, 'user'] as const,
};

export function useLanguage() {
  const queryClient = useQueryClient();

  // Fetch supported languages
  const supportedLanguagesQuery = useQuery({
    queryKey: LANGUAGE_KEYS.supported(),
    queryFn: localizationApi.getSupportedLanguages,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    initialData: [
      { code: 'en', name: 'English', default: true },
      { code: 'sw', name: 'Swahili' },
      { code: 'fr', name: 'French' },
      { code: 'ar', name: 'Arabic' },
      { code: 'ha', name: 'Hausa' },
      { code: 'zu', name: 'Zulu' },
    ] as Language[], // Fallback/Initial data
  });

  // Fetch user preference (only enabled if we need it, mostly we rely on local state + background sync)
  const userLanguageQuery = useQuery({
    queryKey: LANGUAGE_KEYS.user(),
    queryFn: localizationApi.getUserLanguage,
    enabled: false, // We usually just want to sync on mount or change, handled by Provider
  });

  // Update user preference
  const updateLanguageMutation = useMutation({
    mutationFn: (data: UpdateLanguageInput) => localizationApi.updateUserLanguage(data),
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(LANGUAGE_KEYS.user(), data);
      // Ensure i18n is synced just in case (though UI should drive this)
      if (i18n.language !== data.language_code) {
        i18n.changeLanguage(data.language_code);
      }
    },
  });

  return {
    supportedLanguages: supportedLanguagesQuery.data,
    isLoadingSupported: supportedLanguagesQuery.isLoading,
    
    updateUserLanguage: updateLanguageMutation.mutateAsync,
    isUpdating: updateLanguageMutation.isPending,
  };
}
