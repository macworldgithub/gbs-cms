export interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  icon: string;
  selected: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LanguageFormData {
  name: string;
  nativeName: string;
  code: string;
  icon: string;
  isActive: boolean;
}

export interface LanguageContextType {
  languages: Language[];
  selectedLanguage: Language | null;
  loading: boolean;
  error: string | null;
  addLanguage: (language: LanguageFormData) => Promise<void>;
  updateLanguage: (id: string, language: Partial<LanguageFormData>) => Promise<void>;
  deleteLanguage: (id: string) => Promise<void>;
  selectLanguage: (id: string) => Promise<void>;
  fetchLanguages: () => Promise<void>;
}