# Frontend Localization Implementation Guide

This document outlines the integration strategy for the Multi-Language and Localization features of the WIFT Africa platform.

## 1. Overview

The backend exposes endpoints to retrieve supported languages and to get/set the user's preferred language. The frontend should persist this preference and use a localization library (e.g., `react-i18next` or `next-intl`) to translate the UI.

## 2. API Reference

All endpoints are relative to the base API URL (e.g., `/api/v1`).

### 2.1 Get Supported Languages
Returns the list of languages enabled in the system.

- **Endpoint:** `GET /profiles/languages`
- **Access:** Public
- **Response:**
  ```json
  {
    "data": [
      { "code": "en", "name": "English", "default": true },
      { "code": "fr", "name": "French" },
      { "code": "sw", "name": "Swahili" }
    ]
  }
  ```

### 2.2 Get User Language
Returns the authenticated user's saved language preference.

- **Endpoint:** `GET /profiles/languages/me`
- **Access:** Private (Bearer Token required)
- **Response:**
  ```json
  {
    "language_code": "fr",
    "language_name": "French"
  }
  ```

### 2.3 Update User Language
Updates the authenticated user's language preference.

- **Endpoint:** `PATCH /profiles/languages/me`
- **Access:** Private (Bearer Token required)
- **Body:**
  ```json
  { "language_code": "sw" }
  ```
- **Response:**
  ```json
  {
    "message": "Language updated successfully",
    "language_code": "sw"
  }
  ```

---

## 3. Frontend Types (TypeScript)

Use these interfaces to ensure type safety.

```typescript
export interface Language {
  code: string;
  name: string;
  default?: boolean;
}

export interface LanguageResponse {
  data: Language[];
}

export interface UserLanguage {
  language_code: string;
  language_name: string;
}
```

---

## 4. Service Implementation (Axios Example)

Suggested implementation for the API service layer.

```typescript
import axios from 'axios';
import { Language, UserLanguage } from '@/types/localization'; // Adjust path

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export const LocalizationService = {
  // Get all supported languages
  getSupportedLanguages: async (): Promise<Language[]> => {
    const response = await api.get<{ data: Language[] }>('/profiles/languages');
    return response.data.data;
  },

  // Get current user's preference
  getUserLanguage: async (): Promise<UserLanguage> => {
    const response = await api.get<UserLanguage>('/profiles/languages/me');
    return response.data;
  },

  // Update preference
  updateUserLanguage: async (code: string): Promise<UserLanguage> => {
    const response = await api.patch<UserLanguage>('/profiles/languages/me', {
      language_code: code,
    });
    return response.data;
  },
};
```

---

## 5. State Management & Initialization Logic

### Recommended Flow
1.  **App Mount:** Fetch `getSupportedLanguages()` and store them in a global store (Redux/Zustand/Context).
2.  **Session Init:**
    *   **If User Logged In:** Fetch `getUserLanguage()` and set the app locale.
    *   **If Guest:** Check `localStorage` for a saved preference. If none, check `navigator.language` against the supported list. Fallback to the default (English).
3.  **Language Switch:**
    *   User selects a new language.
    *   Update local state and `localStorage` immediately.
    *   Update the i18n library instance.
    *   **If User Logged In:** Call `updateUserLanguage(code)` in the background to persist the setting.

### Context Example (React)

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizationService } from '@/services/localization';

const LanguageContext = createContext({
  currentLanguage: 'en',
  changeLanguage: (code: string) => {},
});

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load user preference on auth load (pseudo-code)
  // const { user } = useAuth(); 

  const changeLanguage = async (code: string) => {
    // 1. Update UI immediately
    setCurrentLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem('app_lang', code);

    // 2. Persist to backend if logged in
    // if (user) {
       try {
         await LocalizationService.updateUserLanguage(code);
       } catch (error) {
         console.error('Failed to sync language preference', error);
       }
    // }
  };

  useEffect(() => {
    // Initialize from localStorage or Browser
    const saved = localStorage.getItem('app_lang') || navigator.language.split('-')[0];
    if (saved) {
        changeLanguage(saved);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

---

## 6. Language Switcher Component

A simple UI component to toggle languages.

```tsx
import { useLocalization } from '@/hooks/useLocalization'; // Your hook

export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLocalization();

  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => changeLanguage(e.target.value)}
      className="border rounded p-2"
    >
      {supportedLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};
```
