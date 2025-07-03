'use client';

import { useNavigationLoading } from './NavigationLoading';
import LoadingScreen from './LoadingScreen';
import NavigationInterceptor from './NavigationInterceptor';
import { useEffect, useState } from 'react';
import AFKWarningModal from '../../../components/AFKWarningModal';
import { useAFKTimeout } from '@/utils/useAFKTimeout';
import { supabase } from '@/utils/supabaseClient';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isLoading, startLoading, stopLoading } = useNavigationLoading();
  const [initialLoad, setInitialLoad] = useState(true);
  const [nextJsLoading, setNextJsLoading] = useState(false);

  // AFK Timeout logic
  const { remaining, isWarningActive, resetTimeout } = useAFKTimeout({
    timeoutMinutes: 2,
    warningSeconds: 30,
    onTimeout: async () => {
      await supabase.auth.signOut();
      window.location.href = '/'; // Redirect to main landing page
    },
    onWarning: () => {
      // Optionally, you can add a sound or extra effect here
    }
  });

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

  // Workaround: sign out on tab/browser close
  useEffect(() => {
    const handleUnload = () => {
      supabase.auth.signOut();
    };
    window.addEventListener('unload', handleUnload);
    return () => window.removeEventListener('unload', handleUnload);
  }, []);

  const showLoading = isLoading || initialLoad || nextJsLoading;

  return (
    <>
      <NavigationInterceptor 
        onNavigationStart={startLoading}
        onNavigationComplete={stopLoading}
      />
      <LoadingScreen isLoading={showLoading} />
      <AFKWarningModal isOpen={isWarningActive} remaining={remaining} onStay={resetTimeout} />
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