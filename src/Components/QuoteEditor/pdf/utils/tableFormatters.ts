/**
 * Utilitaires pour le formatage des tableaux dans le PDF
 */

/**
 * Formate une date ISO en format français DD/MM/YY
 */
export const formatDateFrench = (dateString: string): string => {
  if (!dateString) return ' ';

  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2); // Format YY (2 chiffres)
    return `${day}/${month}/${year}`;
  } catch {
    return dateString || ' ';
  }
};

/**
 * Formate le taux de TVA (nombre ou chaîne comme "MIX")
 */
export const formatVatRate = (vatRate: number | string): string => {
  if (typeof vatRate === 'string') {
    return vatRate || ' '; // Afficher "MIX" ou autre chaîne tel quel, ou espace si vide
  }
  return vatRate !== undefined && vatRate !== null ? `${vatRate}%` : ' ';
};

/**
 * Formate un montant en euros avec 2 décimales
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} €`;
};

/**
 * Formate la durée (peut être un nombre ou une chaîne comme "1h")
 */
export const formatDuration = (duration: number | string): string => {
  if (typeof duration === 'string') {
    return duration; // Retourner tel quel si c'est déjà une chaîne
  }
  return duration.toString(); // Convertir en chaîne si c'est un nombre
};