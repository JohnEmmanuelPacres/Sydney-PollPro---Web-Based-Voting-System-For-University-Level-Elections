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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    
    // Only consider it a navigation if the path or query params actually changed
    const isSamePath = currentPathname === previousPathnameRef.current;
    const isSameParams = currentSearchParams === previousSearchParamsRef.current;
    
    if (isNavigatingRef.current) {
      // Clear any existing timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }

      if (!isSamePath || !isSameParams) {
        // Actual navigation occurred
        timerRef.current = setTimeout(() => {
          onNavigationComplete();
          isNavigatingRef.current = false;
        }, 150);
      } else {
        // Same path navigation - complete immediately
        onNavigationComplete();
        isNavigatingRef.current = false;
      }

      previousPathnameRef.current = currentPathname;
      previousSearchParamsRef.current = currentSearchParams;

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (fallbackTimerRef.current) {
          clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
        }
      };
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

        // Set a fallback timer to prevent infinite loading
        // This will trigger if no route change occurs within 500ms
        if (fallbackTimerRef.current) {
          clearTimeout(fallbackTimerRef.current);
        }
        
        fallbackTimerRef.current = setTimeout(() => {
          if (isNavigatingRef.current) {
            console.log('Navigation fallback timer triggered');
            onNavigationComplete();
            isNavigatingRef.current = false;
          }
        }, 500);
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
            // Normalize URLs by removing trailing slashes and hash fragments
            const normalizeUrl = (urlString: string) => {
              const u = new URL(urlString);
              return u.pathname.replace(/\/$/, '') + u.search;
            };
            
            const targetPath = normalizeUrl(url.href);
            const currentPath = normalizeUrl(currentUrl.href);
            
            if (targetPath !== currentPath) {
              // Only trigger loading for actual navigation to different pages
              handleNavigationStart();
            }
            // If same page - do nothing, don't trigger loading
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
        // Only trigger if it's a different path
        const [state, , url] = args;
        if (!isNavigatingRef.current && url && url !== window.location.href) {
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
          
          if (url.origin === currentUrl.origin && 
              (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)) {
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
      
      // Clear any pending timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [onNavigationStart, onNavigationComplete]);

  return null;
}