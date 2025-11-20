/**
 * Utilitaires pour la manipulation de texte
 */

/**
 * Extrait le nom de l'entreprise à partir du texte de copyright
 * @param copyright - Le texte de copyright complet
 * @returns Le nom de l'entreprise extrait
 */
export const extractCompanyName = (copyright: string): string => {
  const result = copyright
    .replace('© 2025 ', '')
    .replace(' — Tous droits réservés', '')
    .trim();
  return result || ' ';
};

/**
 * Formate un nom d'entreprise en texte de copyright
 * @param companyName - Le nom de l'entreprise
 * @returns Le texte de copyright formaté
 */
export const formatCopyright = (companyName: string): string => {
  return `© 2025 ${companyName} — Tous droits réservés`;
};

/**
 * Nettoie une URL en supprimant les protocoles si présents
 * @param url - L'URL à nettoyer
 * @returns L'URL sans protocole
 */
export const cleanUrl = (url: string): string => {
  const result = url.replace(/^https?:\/\//, '');
  return result || ' ';
};

/**
 * Formate une URL en ajoutant le protocole HTTPS si nécessaire
 * @param url - L'URL à formater
 * @returns L'URL avec protocole HTTPS
 */
export const formatUrl = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

/**
 * Formate un numéro de téléphone (fonction utilitaire pour le futur)
 * @param phone - Le numéro de téléphone
 * @returns Le numéro formaté
 */
export const formatPhone = (phone: string): string => {
  // Pour l'instant, retourne tel quel, mais peut être étendu
  return phone.trim();
};

/**
 * Valide un email (fonction utilitaire basique)
 * @param email - L'email à valider
 * @returns true si l'email semble valide
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formate un code postal français
 * @param postalCode - Le code postal
 * @returns Le code postal formaté
 */
export const formatPostalCode = (postalCode: string): string => {
  // Supprime les espaces et formate en 5 chiffres
  const cleaned = postalCode.replace(/\s/g, '');
  if (cleaned.length === 5 && /^\d+$/.test(cleaned)) {
    return cleaned;
  }
  return postalCode; // Retourne tel quel si pas au bon format
};

/**
 * Convertit le Markdown en HTML
 * @param text - Le texte Markdown
 * @returns Le HTML généré
 */
export const markdownToHtml = (text: string): string => {
  let html = text;

  // Gras **texte** ou __texte__
  html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italique *texte* ou _texte_
  html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Souligné (non-standard Markdown, mais utile)
  html = html.replace(/~~([^~]+)~~/g, '<u>$1</u>');

  return html;
};

/**
 * Objet contenant tous les utilitaires de texte
 */
export const textUtils = {
  extractCompanyName,
  formatCopyright,
  cleanUrl,
  formatUrl,
  formatPhone,
  isValidEmail,
  formatPostalCode,
  markdownToHtml
};