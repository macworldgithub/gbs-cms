import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SaveIcon, XIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageFormData } from '../types/language';
import { Button } from './ui/button';
import { Card } from './ui/card';

export const LanguageManager: React.FC = () => {
  const { languages, addLanguage, updateLanguage, deleteLanguage, loading, error } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LanguageFormData>({
    name: '',
    nativeName: '',
    code: '',
    icon: '',
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      nativeName: '',
      code: '',
      icon: '',
      isActive: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateLanguage(editingId, formData);
      } else {
        await addLanguage(formData);
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save language:', err);
    }
  };

  const handleEdit = (language: any) => {
    setFormData({
      name: language.name,
      nativeName: language.nativeName,
      code: language.code,
      icon: language.icon,
      isActive: language.isActive,
    });
    setEditingId(language.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this language?')) {
      try {
        await deleteLanguage(id);
      } catch (err) {
        console.error('Failed to delete language:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec2227]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Language Management</h1>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isAdding && (
        <Card className="p-6 mb-6 border-2 border-[#ec2227]">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Language' : 'Add New Language'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Native Name
                </label>
                <input
                  type="text"
                  value={formData.nativeName}
                  onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  placeholder="e.g., en, es, fr"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flag Icon URL
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  placeholder="/country-icon.svg"
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
                disabled={loading}
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
              >
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {languages.map((language) => (
          <Card key={language.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={language.icon}
                  alt={`${language.name} flag`}
                  className="w-8 h-8 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/country-icon-1.svg';
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{language.name}</h3>
                  <p className="text-sm text-gray-600">{language.nativeName}</p>
                  <p className="text-xs text-gray-500">Code: {language.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  language.selected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {language.selected ? 'Selected' : 'Available'}
                </span>
                <Button
                  onClick={() => handleEdit(language)}
                  variant="outline"
                  size="sm"
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(language.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};