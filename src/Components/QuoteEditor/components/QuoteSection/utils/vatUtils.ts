// Fonction pour formatter la TVA (nombre ou chaîne)
export const formatVatRate = (vatRate: number | string): string => {
  if (typeof vatRate === 'string') {
    return vatRate; // Afficher "MIX" ou autre chaîne tel quel
  }
  return `${vatRate}%`;
};