import { useState, useEffect } from 'react';

const MAX_RECENT_PRODUCTS = 10;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    // Load recently viewed products from localStorage
    const stored = localStorage.getItem('recentlyViewedProducts');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recently viewed products:', error);
        setRecentlyViewed([]);
      }
    }
  }, []);

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => {
      // Remove product if it already exists
      const filtered = prev.filter((p) => p.id !== product.id);

      // Add product to the beginning
      const updated = [product, ...filtered].slice(0, MAX_RECENT_PRODUCTS);

      // Save to localStorage
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(updated));

      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewedProducts');
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
};