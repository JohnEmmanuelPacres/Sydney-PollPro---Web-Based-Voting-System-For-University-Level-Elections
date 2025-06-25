'use client';

import { useState, useCallback, useRef } from 'react';

export const useNavigationLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingRef = useRef(false);

  const startLoading = useCallback(() => {
    // Prevent multiple simultaneous loading states
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsLoading(true);
    
    // Safety timeout - maximum 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      loadingRef.current = false;
      timeoutRef.current = null;
    }, 5000);
  }, []);

  const stopLoading = useCallback(() => {
    loadingRef.current = false;
    
    // Clear the safety timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsLoading(false);
  }, []);

  return { isLoading, startLoading, stopLoading };
};