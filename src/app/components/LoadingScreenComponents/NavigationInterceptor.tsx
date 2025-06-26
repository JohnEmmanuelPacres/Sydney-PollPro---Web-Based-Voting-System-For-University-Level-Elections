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

  // Enhanced route change detection
  useEffect(() => {
    const currentPathname = pathname;
    const currentSearchParams = searchParams?.toString();
    
    if (!mountedRef.current) {
      mountedRef.current = true;
      previousPathnameRef.current = currentPathname;
      previousSearchParamsRef.current = currentSearchParams;
      return;
    }
    
    if (isNavigatingRef.current && 
        (currentPathname !== previousPathnameRef.current || 
         currentSearchParams !== previousSearchParamsRef.current)) {
      
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

  // Comprehensive navigation interception
  useEffect(() => {
    const handleNavigationStart = () => {
      if (!isNavigatingRef.current) {
        isNavigatingRef.current = true;
        requestAnimationFrame(() => {
          onNavigationStart();
        });
      }
    };

    // Next.js router events
    const handleRouteChangeStart = () => handleNavigationStart();
    window.addEventListener('routeChangeStart', handleRouteChangeStart);

    // Link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor?.href && !anchor.target && !e.defaultPrevented) {
        try {
          const url = new URL(anchor.href);
          const currentUrl = new URL(window.location.href);
          
          if (url.origin === currentUrl.origin) {
            handleNavigationStart();
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    };
    document.addEventListener('click', handleClick, true);

    // History API - properly typed wrapper
    const wrapHistoryMethod = <T extends (...args: any[]) => void>(
      originalMethod: T
    ): T => {
      return ((...args: Parameters<T>) => {
        const result = originalMethod.apply(window.history, args);
        if (!isNavigatingRef.current) {
          handleNavigationStart();
        }
        return result;
      }) as T;
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = wrapHistoryMethod(originalPushState);
    window.history.replaceState = wrapHistoryMethod(originalReplaceState);

    // Popstate (back/forward)
    const handlePopState = () => {
      if (!isNavigatingRef.current) {
        handleNavigationStart();
      }
    };
    window.addEventListener('popstate', handlePopState);

    // Form submissions
    const handleSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form?.action) {
        try {
          const url = new URL(form.action);
          const currentUrl = new URL(window.location.href);
          
          if (url.origin === currentUrl.origin) {
            handleNavigationStart();
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    };
    document.addEventListener('submit', handleSubmit, true);

    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('submit', handleSubmit, true);
      
      // Restore original history methods
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [onNavigationStart]);

  return null;
}