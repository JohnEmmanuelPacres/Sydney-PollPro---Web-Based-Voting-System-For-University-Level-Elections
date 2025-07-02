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
  const [nextJsLoading, setNextJsLoading] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const loader = document.querySelector('[data-nextjs-router-state-elements]');
      setNextJsLoading(!!loader);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const timer = setTimeout(() => {
      setInitialLoad(false);
      stopLoading();
    }, 800);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [stopLoading]);

  useEffect(() => {
    if (nextJsLoading && !isLoading) {
      startLoading();
    } else if (!nextJsLoading && isLoading) {
      stopLoading();
    }
  }, [nextJsLoading, isLoading, startLoading, stopLoading]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        stopLoading();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopLoading]);

  const showLoading = isLoading || initialLoad || nextJsLoading;

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