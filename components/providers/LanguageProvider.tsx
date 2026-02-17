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
  
  const handleLanguageChanged = (lng: string) => {
    document.documentElement.lang = lng;
    // CHANGE THIS: Hardcode to 'ltr' instead of using i18n.dir(lng)
    document.documentElement.dir = 'ltr'; 

    if (isAuthenticated) {
      updateUserLanguage({ language_code: lng }).catch(err => {
          console.error('Failed to sync language preference', err);
      });
    }
  };

  if (i18n.resolvedLanguage) {
      document.documentElement.lang = i18n.resolvedLanguage;
      // CHANGE THIS: Hardcode to 'ltr' here too
      document.documentElement.dir = 'ltr';
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
