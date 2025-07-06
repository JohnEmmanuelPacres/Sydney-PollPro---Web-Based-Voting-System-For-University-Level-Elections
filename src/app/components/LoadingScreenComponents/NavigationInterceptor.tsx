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

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const nextjsLoader = document.querySelector('[data-nextjs-router-state-elements]');
          if (nextjsLoader && !isNavigatingRef.current) {
            onNavigationStart();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [onNavigationStart]);

  useEffect(() => {
    const currentPathname = pathname;
    const currentSearchParams = searchParams?.toString();
    
    if (!mountedRef.current) {
      mountedRef.current = true;
      previousPathnameRef.current = currentPathname;
      previousSearchParamsRef.current = currentSearchParams;
      return;
    }
    
    const isSamePath = currentPathname === previousPathnameRef.current;
    const isSameParams = currentSearchParams === previousSearchParamsRef.current;
    
    if (isNavigatingRef.current) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }

      if (!isSamePath || !isSameParams) {
        timerRef.current = setTimeout(() => {
          onNavigationComplete();
          isNavigatingRef.current = false;
        }, 150);
      } else {
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

  useEffect(() => {
    const handleNavigationStart = () => {
      if (!isNavigatingRef.current) {
        isNavigatingRef.current = true;
        requestAnimationFrame(() => {
          onNavigationStart();
        });

        if (fallbackTimerRef.current) {
          clearTimeout(fallbackTimerRef.current);
        }
        
        fallbackTimerRef.current = setTimeout(() => {
          if (isNavigatingRef.current) {
            onNavigationComplete();
            isNavigatingRef.current = false;
          }
        }, 500);
      }
    };

    const handleRouteChangeStart = () => handleNavigationStart();
    window.addEventListener('routeChangeStart', handleRouteChangeStart);

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor?.href && !anchor.target && !e.defaultPrevented) {
        try {
          const url = new URL(anchor.href);
          const currentUrl = new URL(window.location.href);
          
          if (url.origin === currentUrl.origin) {
            const normalizeUrl = (urlString: string) => {
              const u = new URL(urlString);
              return u.pathname.replace(/\/$/, '') + u.search;
            };
            
            const targetPath = normalizeUrl(url.href);
            const currentPath = normalizeUrl(currentUrl.href);
            
            if (targetPath !== currentPath) {
              handleNavigationStart();
            }
          }
        } catch (error) {
          // Ignore invalid URLs
        }
      }
    };
    document.addEventListener('click', handleClick, true);

    const wrapHistoryMethod = <T extends (...args: any[]) => void>(
      originalMethod: T
    ): T => {
      return ((...args: Parameters<T>) => {
        const result = originalMethod.apply(window.history, args);
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

    const handlePopState = () => {
      if (!isNavigatingRef.current) {
        handleNavigationStart();
      }
    };
    window.addEventListener('popstate', handlePopState);

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
          // Ignore invalid URLs
        }
      }
    };
    document.addEventListener('submit', handleSubmit, true);

    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('submit', handleSubmit, true);
      
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      
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