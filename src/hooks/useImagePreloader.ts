'use client';

import { useState, useEffect } from 'react';

/**
 * Preloads a list of image URLs and returns a Set of loaded URLs.
 * Components can check `loadedImages.has(url)` to decide whether
 * to show a skeleton or the actual background.
 */
export function useImagePreloader(urls: string[]): Set<string> {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!urls || urls.length === 0) return;

    const pending: HTMLImageElement[] = [];

    urls.forEach((url) => {
      if (!url || loadedImages.has(url)) return;

      const img = new window.Image();
      img.src = url;

      if (img.complete) {
        // Already cached by browser
        setLoadedImages((prev) => {
          const next = new Set(prev);
          next.add(url);
          return next;
        });
      } else {
        img.onload = () => {
          setLoadedImages((prev) => {
            const next = new Set(prev);
            next.add(url);
            return next;
          });
        };
        img.onerror = () => {
          // Mark as "loaded" so skeleton goes away even on error
          setLoadedImages((prev) => {
            const next = new Set(prev);
            next.add(url);
            return next;
          });
        };
        pending.push(img);
      }
    });

    return () => {
      pending.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls.join(',')]);

  return loadedImages;
}
