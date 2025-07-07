import { Language, LanguageFormData } from '../types/language';

// Mock API service - replace with actual API calls
class LanguageService {
  private languages: Language[] = [
    {
      id: '1',
      name: 'English',
      nativeName: 'English',
      code: 'en',
      icon: '/country-icon-1.svg',
      selected: true,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Indonesian',
      nativeName: 'Bahasa Indonesia',
      code: 'id',
      icon: '/country-icon.svg',
      selected: false,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Chinese',
      nativeName: '中国人',
      code: 'zh',
      icon: '/country-icon-2.svg',
      selected: false,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '4',
      name: 'Korean',
      nativeName: '한국어',
      code: 'ko',
      icon: '/country-icon-3.svg',
      selected: false,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  async getAllLanguages(): Promise<Language[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.languages.filter(lang => lang.isActive);
  }

  async getLanguageById(id: string): Promise<Language | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.languages.find(lang => lang.id === id) || null;
  }

  async createLanguage(languageData: LanguageFormData): Promise<Language> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newLanguage: Language = {
      id: Date.now().toString(),
      ...languageData,
      selected: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.languages.push(newLanguage);
    return newLanguage;
  }

  async updateLanguage(id: string, languageData: Partial<LanguageFormData>): Promise<Language> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.languages.findIndex(lang => lang.id === id);
    if (index === -1) {
      throw new Error('Language not found');
    }

    this.languages[index] = {
      ...this.languages[index],
      ...languageData,
      updatedAt: new Date(),
    };

    return this.languages[index];
  }

  async deleteLanguage(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.languages.findIndex(lang => lang.id === id);
    if (index === -1) {
      throw new Error('Language not found');
    }

    // Soft delete - mark as inactive
    this.languages[index].isActive = false;
    this.languages[index].updatedAt = new Date();
  }

  async selectLanguage(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Deselect all languages
    this.languages.forEach(lang => {
      lang.selected = false;
      lang.updatedAt = new Date();
    });

    // Select the specified language
    const language = this.languages.find(lang => lang.id === id);
    if (language) {
      language.selected = true;
      language.updatedAt = new Date();
      
      // Store in localStorage for persistence
      localStorage.setItem('selectedLanguage', id);
    }
  }

  getSelectedLanguage(): string | null {
    return localStorage.getItem('selectedLanguage');
  }
}

export const languageService = new LanguageService();