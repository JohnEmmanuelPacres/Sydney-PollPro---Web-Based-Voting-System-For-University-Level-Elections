'use client';

import { useState, useCallback, useRef } from 'react';

export const useNavigationLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingRef = useRef(false);

  const startLoading = useCallback(() => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsLoading(true);
    }, 50);
  }, []);

  const stopLoading = useCallback(() => {
    loadingRef.current = false;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsLoading(false);
  }, []);

  return { isLoading, startLoading, stopLoading };
};