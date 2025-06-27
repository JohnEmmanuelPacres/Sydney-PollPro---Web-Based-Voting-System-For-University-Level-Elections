// ClientLayout.tsx
'use client';

import { useNavigationLoading } from './NavigationLoading';
import LoadingScreen from './LoadingScreen';
import NavigationInterceptor from './NavigationInterceptor';
import { useEffect, useState } from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isLoading, startLoading, stopLoading } = useNavigationLoading();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
      stopLoading();
    }, 800);

    return () => clearTimeout(timer);
  }, [stopLoading]);

  // Ensure loading screen stays visible during navigation
  useEffect(() => {
    if (isLoading) {
      setInitialLoad(false);
    }
  }, [isLoading]);

  const showLoading = isLoading || initialLoad;

  return (
    <>
      <NavigationInterceptor 
        onNavigationStart={startLoading}
        onNavigationComplete={stopLoading}
      />
      <LoadingScreen isLoading={showLoading} />
      <div 
        className={`transition-opacity duration-300 ${
          showLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </div>
    </>
  );
}