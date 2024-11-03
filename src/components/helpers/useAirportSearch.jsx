import { useState, useEffect, useCallback } from 'react';
import RannerApi from '../../../api';

/**
 * Custom hook for debounced airport search suggestions
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} - Search state and handlers
 */
export const useAirportSearch = (delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useCallback(async (value) => {
    if (value.length >= 3) {
      setIsLoading(true);
      setError(null);
      try {
        const res = await RannerApi.getAirportSuggestions(value);
        setSuggestions(res);
      } catch (err) {
        setError(err?.response?.data?.error?.message || 'Failed to load suggestions');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        debouncedSearch(searchTerm);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, delay, debouncedSearch]);

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const handleSuggestionClick = (iataCode) => {
    setSearchTerm(iataCode);
    setSuggestions([]);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setError(null);
  };

  return {
    searchTerm,
    suggestions,
    isLoading,
    error,
    handleChange,
    handleSuggestionClick,
    clearSearch,
    setError
  };
};