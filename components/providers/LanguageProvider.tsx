'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/hooks/useLanguage';

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { updateUserLanguage } = useLanguage();

  useEffect(() => {
    setMounted(true);
    
    // Listen for language changes to sync with backend
    const handleLanguageChanged = (lng: string) => {
      // 1. Update Document Attributes for RTL/LTR and Lang
      document.documentElement.lang = lng;
      document.documentElement.dir = i18n.dir(lng);

      if (isAuthenticated) {
        // optimistically update backend (fire and forget mostly, handled by mutation)
        updateUserLanguage({ language_code: lng }).catch(err => {
            console.error('Failed to sync language preference', err);
        });
      }
      // Persist to local storage is handled by i18next detector
    };

    // Initial setup on mount
    if (i18n.resolvedLanguage) {
        document.documentElement.lang = i18n.resolvedLanguage;
        document.documentElement.dir = i18n.dir(i18n.resolvedLanguage);
    }

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [isAuthenticated, updateUserLanguage]);

  if (!mounted) {
    return <>{children}</>; // Render children without translation to avoid hydration mismatch if possible, or blocking
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
