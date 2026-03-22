import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook to wrap API calls with automatic retry logic for Render cold starts.
 * @param {Function} apiFunc - The API function from services/api.js to call.
 * @returns {Object} - { execute, loading, error, isWakingUp, countdown }
 */
export function useEnhancedApi(apiFunc) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError('');
    setIsWakingUp(false);
    setCountdown(0);
    
    if (timerRef.current) clearInterval(timerRef.current);

    const attempt = async (retryCount) => {
      if (!isMounted.current) return { success: false, error: 'Component unmounted' };

      try {
        const result = await apiFunc(...args);
        
        if (result.success) {
          if (isMounted.current) {
            setLoading(false);
            setIsWakingUp(false);
          }
          return result;
        } else {
          // Check for Render cold start error message
          // This matches the string returned by backend/index.js
          const isColdStart = result.error && (
            result.error.toLowerCase().includes('waking up') || 
            result.error.toLowerCase().includes('cold start')
          );

          if (isColdStart && retryCount < 10) {
            if (isMounted.current) {
              setIsWakingUp(true);
              setCountdown(8); // Wait 8 seconds before retrying
            }

            return new Promise((resolve) => {
              timerRef.current = setInterval(() => {
                if (!isMounted.current) {
                  clearInterval(timerRef.current);
                  resolve({ success: false, error: 'Component unmounted' });
                  return;
                }

                setCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(timerRef.current);
                    resolve(attempt(retryCount + 1));
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
            });
          }

          if (isMounted.current) {
            setError(result.error || 'Unknown Error');
            setLoading(false);
            setIsWakingUp(false);
          }
          return result;
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.message || 'Network Error');
          setLoading(false);
          setIsWakingUp(false);
        }
        return { success: false, error: err.message };
      }
    };

    return attempt(0);
  }, [apiFunc]);

  return { execute, loading, error, isWakingUp, countdown };
}
