import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AppContextType } from '../types';
import { userService } from '../services/userService';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user from localStorage or default to first user
        const savedUserId = localStorage.getItem('currentUserId');
        const userId = savedUserId || '1';
        
        const user = await userService.getUserById(userId);
        setCurrentUser(user);
        
        if (user && !savedUserId) {
          localStorage.setItem('currentUserId', user.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize app');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUserId', user.id);
    } else {
      localStorage.removeItem('currentUserId');
    }
  };

  // Check if user has specific permission
  const hasPermission = (resource: string, action: string): boolean => {
    if (!currentUser) return false;
    
    return currentUser.roles.some(role =>
      role.permissions.some(permission =>
        permission.resource === resource && 
        permission.action === action && 
        permission.isActive
      )
    );
  };

  // Check if user has specific role
  const hasRole = (roleName: string): boolean => {
    if (!currentUser) return false;
    
    return currentUser.roles.some(role => 
      role.name === roleName && role.isActive
    );
  };

  const value: AppContextType = {
    currentUser,
    setCurrentUser: handleSetCurrentUser,
    loading,
    error,
    hasPermission,
    hasRole,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};