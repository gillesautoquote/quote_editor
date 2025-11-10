import { useMemo } from 'react';
import { generateColorVariables, getContrastColor, getLightVariant, getDarkerVariant, hexToRgb } from '../utils/colorUtils';
import type { Company } from '../entities/QuoteData';

/**
 * Hook pour gérer le thème de couleur dynamique
 */
export const useColorTheme = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';

  const colorVariables = useMemo(() => {
    return generateColorVariables(mainColor);
  }, [mainColor]);

  const applyColorVariables = (scopeElement?: HTMLElement) => {
    const target = scopeElement || document.querySelector('[data-quote-editor-scope]') as HTMLElement || document.documentElement;
    Object.entries(colorVariables).forEach(([property, value]) => {
      target.style.setProperty(property, value);
    });
  };

  /**
   * Génère des styles inline pour garantir l'application de la couleur principale
   * en mode standalone (surcharge les styles Tailwind du projet parent)
   */
  const getInlineStyles = useMemo(() => {
    const rgb = hexToRgb(mainColor);
    const contrastColor = getContrastColor(mainColor);
    const lightVariant = getLightVariant(mainColor, 0.1);
    const darkerVariant = getDarkerVariant(mainColor, 0.8);

    return {
      // Styles pour les éléments avec texte de couleur primaire
      text: {
        color: `${mainColor} !important`
      } as React.CSSProperties,

      // Styles pour les backgrounds de couleur primaire
      bg: {
        backgroundColor: `${mainColor} !important`,
        color: `${contrastColor} !important`
      } as React.CSSProperties,

      // Styles pour les bordures de couleur primaire
      border: {
        borderColor: `${mainColor} !important`
      } as React.CSSProperties,

      // Styles pour les backgrounds légers
      bgLight: {
        backgroundColor: lightVariant
      } as React.CSSProperties,

      // Styles pour hover avec couleur primaire plus foncée
      hover: {
        '--hover-color': darkerVariant
      } as React.CSSProperties,

      // Couleurs brutes pour utilisation personnalisée
      colors: {
        main: mainColor,
        contrast: contrastColor,
        light: lightVariant,
        dark: darkerVariant,
        rgb: rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '0, 102, 204'
      }
    };
  }, [mainColor]);

  return {
    colorVariables,
    applyColorVariables,
    mainColor,
    inlineStyles: getInlineStyles
  };
};