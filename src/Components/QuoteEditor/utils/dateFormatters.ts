/**
 * Utilitaires pour le formatage des dates
 */

/**
 * Formate une date au format français DD/MM/YYYY
 * @param dateString - Date en format ISO (YYYY-MM-DD) ou tout autre format
 * @returns Date formatée DD/MM/YYYY ou chaîne vide si invalide
 */
export const formatDateDDMMYYYY = (dateString: string): string => {
  if (!dateString || dateString.trim() === '') return '';
  
  try {
    const date = new Date(dateString);
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
};

/**
 * Fonction pour formater la date en français (pour les intros)
 */
export const formatDateInFrench = (dateString: string): string => {
  if (!dateString) return '';
  
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
    return dateString;
  }
};

/**
 * Fonction pour formater la date avec virgule finale
 */
export const formatDateWithComma = (dateString: string): string => {
  const formatted = formatDateInFrench(dateString);
  return formatted ? `${formatted},` : '';
};

/**
 * Fonction pour formater la civilité avec virgule
 */
export const formatTitle = (title: string): string => {
  if (!title) return '';
  return title.endsWith(',') ? title : `${title},`;
};

/**
 * Fonction pour formater la tagline avec virgule
 */
export const formatTagline = (tagline: string): string => {
  if (!tagline) return '';
  return tagline.endsWith(',') || tagline.endsWith('.') ? tagline : `${tagline},`;
};