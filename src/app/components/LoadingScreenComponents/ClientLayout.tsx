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

  // Handle initial page load
  useEffect(() => {
    // Show loading screen briefly on initial mount
    const timer = setTimeout(() => {
      setInitialLoad(false);
      stopLoading();
    }, 800); // Show for 800ms on initial load

    return () => clearTimeout(timer);
  }, [stopLoading]);

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