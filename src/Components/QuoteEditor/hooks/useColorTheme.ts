import { useMemo } from 'react';
import { generateColorVariables } from '../utils/colorUtils';
import type { Company } from '../entities/QuoteData';

/**
 * Hook pour gérer le thème de couleur dynamique
 */
export const useColorTheme = (company: Company) => {
  const colorVariables = useMemo(() => {
    return generateColorVariables(company.mainColor || '#0066cc');
  }, [company.mainColor]);

  const applyColorVariables = (element: HTMLElement = document.documentElement) => {
    Object.entries(colorVariables).forEach(([property, value]) => {
      element.style.setProperty(property, value);
    });
  };

  return {
    colorVariables,
    applyColorVariables,
    mainColor: company.mainColor || '#0066cc'
  };
};