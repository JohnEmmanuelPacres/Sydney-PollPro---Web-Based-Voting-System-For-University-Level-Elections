'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface NavigationInterceptorProps {
  onNavigationStart: () => void;
  onNavigationComplete: () => void;
}

export default function NavigationInterceptor({ 
  onNavigationStart,
  onNavigationComplete
}: NavigationInterceptorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNavigatingRef = useRef(false);
  const previousPathnameRef = useRef(pathname);
  const previousSearchParamsRef = useRef(searchParams?.toString());
  const mountedRef = useRef(false);

  // Handle route change completion
  useEffect(() => {
    const currentPathname = pathname;
    const currentSearchParams = searchParams?.toString();
    
    // Skip the first mount
    if (!mountedRef.current) {
      mountedRef.current = true;
      previousPathnameRef.current = currentPathname;
      previousSearchParamsRef.current = currentSearchParams;
      return;
    }
    
    // Check if we were navigating and the route actually changed
    if (isNavigatingRef.current && 
        (currentPathname !== previousPathnameRef.current || 
         currentSearchParams !== previousSearchParamsRef.current)) {
      
      // Small delay to ensure page is ready
      const timer = setTimeout(() => {
        onNavigationComplete();
        isNavigatingRef.current = false;
      }, 150);

      previousPathnameRef.current = currentPathname;
      previousSearchParamsRef.current = currentSearchParams;

      return () => clearTimeout(timer);
    }

    previousPathnameRef.current = currentPathname;
    previousSearchParamsRef.current = currentSearchParams;
  }, [pathname, searchParams, onNavigationComplete]);

  // Intercept navigation attempts
  useEffect(() => {
    // Handle anchor clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor?.href && !anchor.target && !e.defaultPrevented) {
        try {
          const url = new URL(anchor.href);
          const currentUrl = new URL(window.location.href);
          
          // Check if it's internal navigation to a different route
          if (url.origin === currentUrl.origin && 
              (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)) {
            
            if (!isNavigatingRef.current) {
              setTimeout(() => {
                isNavigatingRef.current = true;
                onNavigationStart();
              }, 0);
            }
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(state, title, url) {
      const result = originalPushState.call(this, state, title, url);
      
      if (!isNavigatingRef.current && url && url !== window.location.pathname + window.location.search) {
        setTimeout(() => {
          isNavigatingRef.current = true;
          onNavigationStart();
        }, 0);
      }
      
      return result;
    };

    window.history.replaceState = function(state, title, url) {
      const result = originalReplaceState.call(this, state, title, url);
      
      if (!isNavigatingRef.current && url && url !== window.location.pathname + window.location.search) {
        setTimeout(() => {
          isNavigatingRef.current = true;
          onNavigationStart();
        }, 0);
      }
      
      return result;
    };

    // Handle browser back/forward buttons
    const handlePopState = (e: PopStateEvent) => {
      if (!isNavigatingRef.current) {
        setTimeout(() => {
          isNavigatingRef.current = true;
          onNavigationStart();
        }, 0);
      }
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [onNavigationStart]);

  return null;
}