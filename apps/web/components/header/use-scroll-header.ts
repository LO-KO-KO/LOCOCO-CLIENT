import { useEffect, useState, useRef, useCallback } from 'react';

export const useScrollHeader = () => {
  const [headerMarginTop, setHeaderMarginTop] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateHeaderPosition = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY.current;

    setHeaderMarginTop((prevMarginTop) => {
      // 스크롤을 올릴 때 (scrollDelta < 0)
      if (scrollDelta < 0) {
        const newMarginTop = Math.max(-72, prevMarginTop + scrollDelta);
        return newMarginTop;
      }
      // 스크롤을 내릴 때 (scrollDelta > 0)
      else if (scrollDelta > 0) {
        return 0;
      }

      return prevMarginTop;
    });

    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateHeaderPosition);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateHeaderPosition]);

  return { headerMarginTop };
};
