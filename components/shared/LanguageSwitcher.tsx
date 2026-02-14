'use client';

import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { supportedLanguages } = useLanguage();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  // Find current language name for tooltip or display if needed
  const currentLanguageCode = i18n.language; // or i18n.resolvedLanguage

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          title="Change Language"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {supportedLanguages?.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{lang.name}</span>
            {currentLanguageCode === lang.code && (
              <Check className="h-4 w-4 text-primary ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
