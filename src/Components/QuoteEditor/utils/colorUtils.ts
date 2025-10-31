/**
 * Utilitaires pour la gestion des couleurs et du contraste
 */

/**
 * Convertit une couleur hexadécimale en valeurs RGB
 * @param hex - Couleur hexadécimale (avec ou sans #)
 * @returns Objet avec les valeurs r, g, b
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calcule la luminance relative d'une couleur RGB
 * @param r - Rouge (0-255)
 * @param g - Vert (0-255)  
 * @param b - Bleu (0-255)
 * @returns Luminance relative (0-1)
 */
export const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Détermine si le texte doit être noir ou blanc pour un bon contraste
 * @param backgroundColor - Couleur de fond en hexadécimal
 * @returns 'white' ou 'black'
 */
export const getContrastColor = (backgroundColor: string): 'white' | 'black' => {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return 'black'; // Fallback
  
  // ✅ CAS SPÉCIAL : couleurs grises claires
  if (backgroundColor.toLowerCase() === '#f8f9fa' || 
      backgroundColor.toLowerCase() === '#e9ecef' ||
      backgroundColor.toLowerCase() === '#dee2e6') {
    return 'black'; // Forcer le texte noir pour les gris clairs
  }

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  
  // ✅ SEUIL AJUSTÉ : plus strict pour éviter le blanc sur gris clair
  return luminance < 0.3 ? 'white' : 'black';
};

/**
 * Génère une version plus claire d'une couleur pour les backgrounds
 * @param hex - Couleur hexadécimale
 * @param opacity - Opacité (0-1)
 * @returns Couleur RGBA
 */
export const getLightVariant = (hex: string, opacity: number = 0.1): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0, 102, 204, ${opacity})`; // Fallback
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

/**
 * Génère une version plus foncée d'une couleur
 * @param hex - Couleur hexadécimale
 * @param factor - Facteur d'assombrissement (0-1, 0.8 = 20% plus foncé)
 * @returns Couleur hexadécimale
 */
export const getDarkerVariant = (hex: string, factor: number = 0.8): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#004499'; // Fallback
  
  const darker = {
    r: Math.round(rgb.r * factor),
    g: Math.round(rgb.g * factor),
    b: Math.round(rgb.b * factor)
  };
  
  return `#${darker.r.toString(16).padStart(2, '0')}${darker.g.toString(16).padStart(2, '0')}${darker.b.toString(16).padStart(2, '0')}`;
};

/**
 * Génère les variables CSS pour les couleurs dynamiques
 * @param mainColor - Couleur principale de l'entreprise
 * @returns Objet avec les variables CSS
 */
export const generateColorVariables = (mainColor: string) => {
  const contrastColor = getContrastColor(mainColor);
  const lightVariant = getLightVariant(mainColor, 0.1);
  const lighterVariant = getLightVariant(mainColor, 0.05);
  const darkerVariant = getDarkerVariant(mainColor, 0.8);
  const rgb = hexToRgb(mainColor) || { r: 75, g: 85, b: 99 }; // gris de repli

  const toTriplet = (r: number, g: number, b: number) => `${r} ${g} ${b}`;
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const darken = (factor: number) => toTriplet(clamp(rgb.r * factor), clamp(rgb.g * factor), clamp(rgb.b * factor));
  const lighten = (amount: number) => toTriplet(
    clamp(rgb.r + (255 - rgb.r) * amount),
    clamp(rgb.g + (255 - rgb.g) * amount),
    clamp(rgb.b + (255 - rgb.b) * amount)
  );
  
  return {
    '--dynamic-primary-color': mainColor,
    '--dynamic-primary-contrast': contrastColor,
    '--dynamic-primary-light': lightVariant,
    '--dynamic-primary-lighter': lighterVariant,
    '--dynamic-primary-dark': darkerVariant,
    '--dynamic-primary-rgb': hexToRgb(mainColor) ? 
      `${hexToRgb(mainColor)!.r}, ${hexToRgb(mainColor)!.g}, ${hexToRgb(mainColor)!.b}` : 
      '0, 102, 204',

    // Variables consommées par Tailwind
    '--color-primary': toTriplet(rgb.r, rgb.g, rgb.b),
    '--color-primary-hover': darken(0.85),
    '--color-primary-light': lighten(0.85),
    '--color-primary-lighter': lighten(0.92),
    '--color-primary-dark': darken(0.75)
  };
};