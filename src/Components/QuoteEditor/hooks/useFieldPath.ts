import { useCallback } from 'react';
import type { QuoteData } from '../entities/QuoteData';

export const useFieldPath = () => {
  const getValueByPath = useCallback((data: QuoteData, path: string): string => {
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = data;
    
    for (const key of keys) {
      if (value === null || value === undefined) return '';
      
      // Handle array indices
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
        value = value[arrayKey]?.[index];
      } else {
        value = value[key];
      }
    }
    
    return value?.toString() || '';
  }, []);

  const setValueByPath = useCallback((data: QuoteData, path: string, newValue: string): QuoteData => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(data)); // Deep clone
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
        current = current[arrayKey][index];
      } else {
        current = current[key];
      }
    }
    
    const lastKey = keys[keys.length - 1];
    if (lastKey.includes('[') && lastKey.includes(']')) {
      const arrayKey = lastKey.substring(0, lastKey.indexOf('['));
      const index = parseInt(lastKey.substring(lastKey.indexOf('[') + 1, lastKey.indexOf(']')), 10);
      current[arrayKey][index] = newValue;
    } else {
      current[lastKey] = newValue;
    }
    
    return newData;
  }, []);

  return {
    getValueByPath,
    setValueByPath
  };
};