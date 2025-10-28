/**
 * Utilitaires pour le formatage du texte dans le PDF
 */

/**
 * Formate une date au format français DD/MM/YYYY
 */
export const formatDateDDMMYYYY = (dateString: string): string => {
  if (!dateString || dateString.trim() === '') return ' ';

  try {
    const date = new Date(dateString);
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return ' ';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch {
    return ' ';
  }
};

/**
 * Fonction pour formater la date en français
 */
export const formatDateInFrench = (dateString: string): string => {
  if (!dateString) return ' ';

  try {
    const date = new Date(dateString);
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `le ${dayName} ${day} ${month} ${year}`;
  } catch {
    return dateString || ' ';
  }
};

/**
 * Fonction pour formater la civilité avec virgule
 */
export const formatTitle = (title: string): string => {
  if (!title) return ' ';
  return title.endsWith(',') ? title : `${title},`;
};

/**
 * Fonction pour formater la tagline avec virgule/point
 */
export const formatTagline = (tagline: string): string => {
  if (!tagline) return ' ';
  return tagline.endsWith(',') || tagline.endsWith('.') ? tagline : `${tagline},`;
};

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
 * Nettoie une URL en supprimant les protocoles si présents
 */
export const cleanUrl = (url: string): string => {
  return url.replace(/^https?:\/\//, '');
};

/**
 * Fonction pour nettoyer le markdown et le convertir en texte simple pour le PDF
 */
export const markdownToPlainText = (text: string): string => {
  if (!text) return ' ';

  let plain = text;

  // Supprimer le gras: **texte** -> texte
  plain = plain.replace(/\*\*(.*?)\*\*/g, '$1');

  // Supprimer l'italique: *texte* -> texte
  plain = plain.replace(/\*(.*?)\*/g, '$1');

  // Supprimer les séparateurs: ---
  plain = plain.replace(/^---$/gm, '');

  // Nettoyer les listes: - item -> item
  plain = plain.replace(/^- (.+)$/gm, '• $1');

  // Nettoyer les lignes vides multiples
  plain = plain.replace(/\n{3,}/g, '\n\n');

  return plain.trim();
};