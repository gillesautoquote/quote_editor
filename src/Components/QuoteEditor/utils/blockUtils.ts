/**
 * Utilitaires pour la gestion des blocs d'options
 */

/**
 * Détermine le type d'un bloc d'option basé sur son titre
 * @param title - Le titre du bloc
 * @returns Le type du bloc (included, excluded, observations, notes, default)
 */
export const getBlockType = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('comprennent') && !lowerTitle.includes('ne comprennent pas')) {
    return 'included';
  }
  
  if (lowerTitle.includes('ne comprennent pas')) {
    return 'excluded';
  }
  
  if (lowerTitle.includes('observation')) {
    return 'observations';
  }
  
  if (lowerTitle.includes('nota')) {
    return 'notes';
  }
  
  return 'default';
};

/**
 * Obtient les styles CSS pour un type de bloc donné
 * @param blockType - Le type du bloc
 * @returns Un objet avec les classes CSS pour le bloc
 */
export const getBlockStyles = (blockType: string) => {
  const baseStyles = {
    block: 'optionBlock',
    header: 'optionBlockHeader',
    title: 'optionBlockTitle',
    bullet: 'optionBullet'
  };

  const typeSpecificStyles = {
    included: {
      block: `${baseStyles.block} includedBlock`,
      header: `${baseStyles.header} includedHeader`,
      title: `${baseStyles.title} includedTitle`,
      bullet: `${baseStyles.bullet} includedBullet`
    },
    excluded: {
      block: `${baseStyles.block} excludedBlock`,
      header: `${baseStyles.header} excludedHeader`,
      title: `${baseStyles.title} excludedTitle`,
      bullet: `${baseStyles.bullet} excludedBullet`
    },
    observations: {
      block: `${baseStyles.block} observationsBlock`,
      header: `${baseStyles.header} observationsHeader`,
      title: `${baseStyles.title} observationsTitle`,
      bullet: `${baseStyles.bullet} observationsBullet`
    },
    notes: {
      block: `${baseStyles.block} notesBlock`,
      header: `${baseStyles.header} notesHeader`,
      title: `${baseStyles.title} notesTitle`,
      bullet: `${baseStyles.bullet} notesBullet`
    },
    default: {
      block: `${baseStyles.block} defaultBlock`,
      header: `${baseStyles.header} defaultHeader`,
      title: `${baseStyles.title} defaultTitle`,
      bullet: `${baseStyles.bullet} defaultBullet`
    }
  };

  return typeSpecificStyles[blockType as keyof typeof typeSpecificStyles] || typeSpecificStyles.default;
};