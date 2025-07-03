import { useEffect, useRef, useCallback, useState } from 'react';

const ACTIVITY_EVENTS = [
  'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'focus', 'input', 'change'
];

export function useAFKTimeout({
  timeoutMinutes = 2,
  warningSeconds = 30,
  onTimeout,
  onWarning
}: {
  timeoutMinutes?: number;
  warningSeconds?: number;
  onTimeout: () => void;
  onWarning?: () => void;
}) {
  const [remaining, setRemaining] = useState(timeoutMinutes * 60);
  const [isWarningActive, setIsWarningActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimeout = useCallback(() => {
    setRemaining(timeoutMinutes * 60);
    setIsWarningActive(false);
    lastActivityRef.current = Date.now();
  }, [timeoutMinutes]);

  // Activity event handler
  const handleActivity = useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  // Set up activity listeners
  useEffect(() => {
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  // Timer countdown
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (onTimeout) onTimeout();
          return 0;
        }
        if (prev - 1 === warningSeconds) {
          setIsWarningActive(true);
          if (onWarning) onWarning();
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onTimeout, onWarning, warningSeconds]);

  return {
    remaining,
    isWarningActive,
    resetTimeout
  };
} 