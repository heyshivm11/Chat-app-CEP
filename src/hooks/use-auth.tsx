"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  department: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (name: string, department: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cep-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('cep-user');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((name: string, department: string) => {
    const newUser = { name, department };
    localStorage.setItem('cep-user', JSON.stringify(newUser));
    setUser(newUser);
    router.push(`/scripts/${department}`);
  },[router]);

  const logout = useCallback(() => {
    localStorage.removeItem('cep-user');
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = useMemo(() => ({
    user,
    isLoading,
    login,
    logout
  }), [user, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
