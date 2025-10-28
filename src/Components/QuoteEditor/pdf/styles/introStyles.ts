import { StyleSheet } from '@react-pdf/renderer';
import type { Company } from '../../entities/QuoteData';

export const createIntroStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';
  
  return StyleSheet.create({
    // Container principal de l'introduction
    introSection: {
      marginTop: 80,             // Positionner l'introduction à mi-hauteur de la page
      marginBottom: 15,          // Espacement avec la section suivante
      display: 'flex',
      flexDirection: 'column',
      gap: 0,                    // Pas d'espacement entre les éléments
    },
    
    // 🏙️ LIGNE VILLE ET DATE - STYLE GRAS
    quoteLocation: {
      fontWeight: 'bold',        // ✅ GRAS comme l'éditeur
      fontSize: 10,              // ✅ AUGMENTÉ de 9 à 10
      color: '#212529',          // ✅ Couleur texte normale
      marginBottom: 8,           // Espacement avec la civilité
      lineHeight: 1.3,
    },
    
    // 👤 CIVILITÉ - STYLE NORMAL
    clientTitle: {
      fontSize: 10,              // ✅ AUGMENTÉ de 9 à 10
      color: '#212529',          // ✅ Couleur texte normale
      fontWeight: 'normal',      // ✅ Style normal
      marginBottom: 0,           // Pas d'espacement avec la tagline
      lineHeight: 1.3,
    },
    
    // 💬 TAGLINE - STYLE NORMAL + LARGEUR COMPLÈTE
    quoteTagline: {
      fontSize: 10,              // ✅ AUGMENTÉ de 9 à 10
      color: '#212529',          // ✅ Couleur texte normale
      fontWeight: 'normal',      // ✅ Style normal
      lineHeight: 1.4,           // ✅ Interligne plus aéré pour la tagline
      marginTop: 0,              // Pas d'espacement avec la civilité
      width: '100%',             // ✅ Largeur complète comme l'éditeur
    },

    // 🖋️ SIGNATURE CLIENT - TAGLINE
    clientSignatureTagline: {
      fontSize: 9,
      color: '#212529',
      fontWeight: 'normal',
      lineHeight: 1.4,
      marginBottom: 8,
      width: '100%',
    },

    // 🖋️ SIGNATURE CLIENT - TITRE
    clientSignatureTitle: {
      fontSize: 9,
      color: '#212529',
      fontWeight: 'bold',
      lineHeight: 1.3,
      marginBottom: 2,
    },

    // 🖋️ SIGNATURE CLIENT - NOM
    clientSignatureName: {
      fontSize: 9,
      color: '#212529',
      fontWeight: 'normal',
      lineHeight: 1.3,
    },
  });
};