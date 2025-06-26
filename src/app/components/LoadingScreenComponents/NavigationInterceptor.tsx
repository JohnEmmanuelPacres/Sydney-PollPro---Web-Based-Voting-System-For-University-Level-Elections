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

  // Monitor for Next.js loader and trigger our loading screen
  useEffect(() => {
    // Watch for the Next.js loader element being added to DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Check if it's the Next.js loader
            if (element.hasAttribute?.('data-nextjs-loader') || 
                element.getAttribute?.('data-nextjs-loader') === 'true' ||
                (element.tagName === 'DIV' && 
                 element.getAttribute?.('style')?.includes('position: fixed') &&
                 element.getAttribute?.('style')?.includes('bottom') &&
                 element.getAttribute?.('style')?.includes('left'))) {
              
              if (!isNavigatingRef.current) {
                requestAnimationFrame(() => {
                  isNavigatingRef.current = true;
                  onNavigationStart();
                });
              }
            }
          }
        });
      });
    });

    // Start observing DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-nextjs-loader', 'style']
    });

    return () => observer.disconnect();
  }, [onNavigationStart]);

  // Intercept navigation attempts
  useEffect(() => {
    // Handle anchor clicks with immediate response
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
              // Defer execution to avoid useInsertionEffect conflicts
              requestAnimationFrame(() => {
                isNavigatingRef.current = true;
                onNavigationStart();
              });
            }
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    };

    // Intercept Next.js router events at the document level
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for Next.js Link components or any anchor with href
      if (target.tagName === 'A' || target.closest('a')) {
        const anchor = target.tagName === 'A' ? target as HTMLAnchorElement : target.closest('a') as HTMLAnchorElement;
        
        if (anchor?.href && !anchor.target && !e.defaultPrevented) {
          try {
            const url = new URL(anchor.href);
            const currentUrl = new URL(window.location.href);
            
            if (url.origin === currentUrl.origin && 
                (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)) {
              
              if (!isNavigatingRef.current) {
                requestAnimationFrame(() => {
                  isNavigatingRef.current = true;
                  onNavigationStart();
                });
              }
            }
          } catch (error) {
            // Invalid URL, ignore
          }
        }
      }
    };

    // Handle beforeunload - catches redirects and programmatic navigation
    const handleBeforeUnload = () => {
      if (!isNavigatingRef.current) {
        isNavigatingRef.current = true;
        onNavigationStart();
      }
    };

    // Handle visibility change - catches when page becomes hidden during navigation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isNavigatingRef.current) {
        isNavigatingRef.current = true;
        onNavigationStart();
      }
    };

    // Intercept history API calls
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(state, title, url) {
      const result = originalPushState.call(this, state, title, url);
      
      if (!isNavigatingRef.current && url && url !== window.location.pathname + window.location.search) {
        requestAnimationFrame(() => {
          isNavigatingRef.current = true;
          onNavigationStart();
        });
      }
      
      return result;
    };

    window.history.replaceState = function(state, title, url) {
      const result = originalReplaceState.call(this, state, title, url);
      
      if (!isNavigatingRef.current && url && url !== window.location.pathname + window.location.search) {
        requestAnimationFrame(() => {
          isNavigatingRef.current = true;
          onNavigationStart();
        });
      }
      
      return result;
    };

    // Handle browser back/forward buttons
    const handlePopState = (e: PopStateEvent) => {
      if (!isNavigatingRef.current) {
        requestAnimationFrame(() => {
          isNavigatingRef.current = true;
          onNavigationStart();
        });
      }
    };

    // Add event listeners with capture phase for earlier interception
    document.addEventListener('click', handleClick, true);
    document.addEventListener('click', handleDocumentClick, { capture: true, passive: true });
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also listen for form submissions that might trigger navigation
    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form?.action && !isNavigatingRef.current) {
        try {
          const url = new URL(form.action);
          const currentUrl = new URL(window.location.href);
          
          if (url.origin === currentUrl.origin && 
              (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)) {
            requestAnimationFrame(() => {
              isNavigatingRef.current = true;
              onNavigationStart();
            });
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    };

    document.addEventListener('submit', handleFormSubmit, true);

    const checkForLoader = () => {
      const loaderElements = document.querySelectorAll('[data-nextjs-loader], div[style*="position: fixed"][style*="bottom"][style*="left"]');
      if (loaderElements.length > 0 && !isNavigatingRef.current) {
        requestAnimationFrame(() => {
          isNavigatingRef.current = true;
          onNavigationStart();
        });
      }
    };

    const loaderCheckInterval = setInterval(checkForLoader, 100);

    return () => {
      clearInterval(loaderCheckInterval);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('submit', handleFormSubmit, true);
      
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [onNavigationStart]);

  return null;
}