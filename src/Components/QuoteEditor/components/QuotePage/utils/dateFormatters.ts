/**
 * Utilitaires pour le formatage des dates
 */

/**
 * Fonction pour formater la date en français
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

/**
 * Fonction pour convertir le markdown simple en HTML
 */
export const markdownToHtml = (text: string): string => {
  if (!text) return '';

  let html = text;

  // Gras: **texte** -> <strong>texte</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>');

  // Italique: *texte* -> <em>texte</em>
  html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');

  // Séparateur: --- -> <hr>
  html = html.replace(/^---$/gm, '<hr style="margin: 1rem 0; border: 0; border-top: 1px solid #d1d5db;" />');

  // Listes: - item -> <li>item</li>
  html = html.replace(/^- (.+)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.25rem;">$1</li>');

  // Entourer les groupes de <li> avec <ul>
  html = html.replace(/(<li.*?<\/li>\n?)+/g, (match) => {
    return '<ul style="list-style-type: disc; margin: 0.5rem 0; padding-left: 1.5rem;">' + match + '</ul>';
  });

  // Paragraphes: double saut de ligne -> <p>
  html = html.split('\n\n').map(para => {
    if (para.trim() === '') return '';
    // Ne pas mettre de <p> si c'est déjà une balise HTML
    if (para.trim().startsWith('<')) return para;
    return '<p style="margin-bottom: 0.5rem;">' + para.replace(/\n/g, '<br />') + '</p>';
  }).join('\n');

  return html;
};