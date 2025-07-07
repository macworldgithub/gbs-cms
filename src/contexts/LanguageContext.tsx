import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, LanguageContextType, LanguageFormData } from '../types/language';
import { languageService } from '../services/languageService';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedLanguages = await languageService.getAllLanguages();
      setLanguages(fetchedLanguages);
      
      // Set selected language
      const selected = fetchedLanguages.find(lang => lang.selected);
      setSelectedLanguage(selected || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
    } finally {
      setLoading(false);
    }
  };

  const addLanguage = async (languageData: LanguageFormData) => {
    try {
      setLoading(true);
      setError(null);
      const newLanguage = await languageService.createLanguage(languageData);
      setLanguages(prev => [...prev, newLanguage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add language');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLanguage = async (id: string, languageData: Partial<LanguageFormData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedLanguage = await languageService.updateLanguage(id, languageData);
      setLanguages(prev => prev.map(lang => lang.id === id ? updatedLanguage : lang));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update language');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLanguage = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await languageService.deleteLanguage(id);
      setLanguages(prev => prev.filter(lang => lang.id !== id));
      
      // If deleted language was selected, clear selection
      if (selectedLanguage?.id === id) {
        setSelectedLanguage(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete language');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectLanguage = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await languageService.selectLanguage(id);
      
      // Update local state
      setLanguages(prev => prev.map(lang => ({
        ...lang,
        selected: lang.id === id
      })));
      
      const selected = languages.find(lang => lang.id === id);
      setSelectedLanguage(selected || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select language');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const value: LanguageContextType = {
    languages,
    selectedLanguage,
    loading,
    error,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    selectLanguage,
    fetchLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};