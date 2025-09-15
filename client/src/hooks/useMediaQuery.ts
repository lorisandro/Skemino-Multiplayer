import { useState, useEffect } from 'react';

/**
 * Custom hook for media query detection that's zoom-resistant
 * Uses CSS media queries which are not affected by browser zoom
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Initial check
    setMatches(media.matches);

    // Listener for changes (not affected by zoom)
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use the modern addEventListener approach
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        // Fallback for older browsers
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Pre-defined breakpoint hooks for Skèmino gaming
 */
export const useBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px) and (max-width: 1439px)');
  const is2K = useMediaQuery('(min-width: 1440px) and (max-width: 1919px)');
  const isUltrawide = useMediaQuery('(min-width: 1920px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    is2K,
    isUltrawide,
    // Helper to get current breakpoint name
    currentBreakpoint: isMobile ? 'mobile'
      : isTablet ? 'tablet'
      : isDesktop ? 'desktop'
      : is2K ? '2k'
      : 'ultrawide'
  };
};