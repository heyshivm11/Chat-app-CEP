
'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { usePageLoader } from '@/components/providers/page-loader-provider';

// Simplified User interface
export interface AppUser {
  displayName: string;
  department: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (name: string, department: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'cep_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (name: string, department: string) => {
    const newUser: AppUser = { displayName: name, department: department };
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Failed to save user to localStorage', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Failed to remove user from localStorage', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
