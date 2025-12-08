'use client';

import { useState, useEffect } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    
    // Set the initial state
    setIsMobile(mediaQuery.matches);

    // Create a handler for media query changes
    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Add the listener
    mediaQuery.addEventListener('change', handler);

    // Clean up the listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return isMobile;
}
