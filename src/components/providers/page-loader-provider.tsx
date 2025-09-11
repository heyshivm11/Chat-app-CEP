
"use client";

import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';

interface PageLoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const PageLoaderContext = createContext<PageLoaderContextType | undefined>(undefined);

export function PageLoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hide loader on route change
    hideLoader();
  }, [pathname]);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);
  
  const value = { isLoading, showLoader, hideLoader };

  return (
    <PageLoaderContext.Provider value={value}>
        {children}
    </PageLoaderContext.Provider>
  );
}

export const usePageLoader = () => {
  const context = useContext(PageLoaderContext);
  if (context === undefined) {
    throw new Error('usePageLoader must be used within a PageLoaderProvider');
  }
  return context;
};
