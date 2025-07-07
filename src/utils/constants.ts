export const STORAGE_KEYS = {
  SELECTED_LANGUAGE: 'selectedLanguage',
  LANGUAGE_PREFERENCES: 'languagePreferences',
  USER_SETTINGS: 'userSettings',
} as const;

export const DEFAULT_LANGUAGES = [
  {
    id: '1',
    name: 'English',
    nativeName: 'English',
    code: 'en',
    icon: '/country-icon-1.svg',
    selected: true,
    isActive: true,
  },
  {
    id: '2',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    code: 'id',
    icon: '/country-icon.svg',
    selected: false,
    isActive: true,
  },
  {
    id: '3',
    name: 'Chinese',
    nativeName: '中国人',
    code: 'zh',
    icon: '/country-icon-2.svg',
    selected: false,
    isActive: true,
  },
  {
    id: '4',
    name: 'Korean',
    nativeName: '한국어',
    code: 'ko',
    icon: '/country-icon-3.svg',
    selected: false,
    isActive: true,
  },
] as const;

export const API_ENDPOINTS = {
  LANGUAGES: '/api/languages',
  LANGUAGE_BY_ID: (id: string) => `/api/languages/${id}`,
  SELECT_LANGUAGE: '/api/languages/select',
} as const;