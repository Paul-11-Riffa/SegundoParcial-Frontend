import { useState, useEffect } from 'react';

/**
 * Custom hook para implementar debouncing en búsquedas y filtros
 * @param {*} value - Valor a debouncer
 * @param {number} delay - Retraso en milisegundos (default: 500ms)
 * @returns {*} - Valor debounced
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configurar el timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timer si el valor cambia antes de que termine el delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
