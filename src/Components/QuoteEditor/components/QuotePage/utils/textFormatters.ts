/**
 * Utilitaires pour le formatage du texte
 */

/**
 * Extrait le nom de l'entreprise à partir du texte de copyright
 */
export const extractCompanyName = (copyright: string): string => {
  return copyright
    .replace('© 2025 ', '')
    .replace(' — Tous droits réservés', '')
    .trim();
};

/**
 * Formate un nom d'entreprise en texte de copyright
 */
export const formatCopyright = (companyName: string): string => {
  return `© 2025 ${companyName} — Tous droits réservés`;
};

/**
 * Nettoie une URL en supprimant les protocoles si présents
 */
export const cleanUrl = (url: string): string => {
  return url.replace(/^https?:\/\//, '');
};

/**
 * Formate une URL en ajoutant le protocole HTTPS si nécessaire
 */
export const formatUrl = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};