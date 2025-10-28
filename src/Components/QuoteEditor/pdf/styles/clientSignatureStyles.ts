import { StyleSheet } from '@react-pdf/renderer';
import type { Company } from '../../entities/QuoteData';

export const createClientSignatureStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';
  
  return StyleSheet.create({
    // ===== WRAPPER PRINCIPAL =====
    signatureWrapper: {
      marginTop: 'auto',          // 🚀 POUSSE LA SIGNATURE EN BAS DE LA PAGE !
      marginBottom: 10,           // ✅ Petit espacement avant le footer
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    
    // ===== SECTION TAGLINE DE CONCLUSION =====
    conclusionSection: {
      width: '100%',              // ✅ LARGEUR COMPLÈTE comme l'éditeur
      marginBottom: 12,           // ✅ Espacement avec la signature
    },
    
    conclusionText: {
      fontSize: 10,               // ✅ AUGMENTÉ de 9 à 10
      lineHeight: 1.4,            // ✅ Interligne comme l'éditeur
      color: '#212529',           // ✅ Couleur texte normale (pas la couleur principale)
      textAlign: 'left',          // ✅ ALIGNÉ À GAUCHE comme l'éditeur
      width: '100%',
    },
    
    // ===== SECTION SIGNATURE =====
    signatureSection: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',     // ✅ ALIGNÉ À DROITE comme l'éditeur
      gap: 2,                     // ✅ Petit espacement entre titre et nom
    },
    
    // ===== TITRE/FONCTION DU SIGNATAIRE =====
    signatoryTitle: {
      fontSize: 9.5,              // ✅ AUGMENTÉ de 8.5 à 9.5
      fontWeight: 'normal',       // ✅ Poids normal comme l'éditeur
      color: '#212529',           // 🔧 COULEUR NORMALE pour le titre (correction demandée)
      textAlign: 'right',         // ✅ Aligné à droite
      marginBottom: 2,
      lineHeight: 1.2,
    },
    
    // ===== NOM COMPLET DU SIGNATAIRE =====
    signatoryName: {
      fontSize: 10.5,             // ✅ AUGMENTÉ de 9.5 à 10.5 (toujours plus gros que le titre)
      fontWeight: 'bold',         // 🔧 GRAS pour le nom (correction demandée)
      color: mainColor,           // 🔧 COULEUR PRINCIPALE pour le nom (correction demandée)
      textAlign: 'right',         // ✅ Aligné à droite
      lineHeight: 1.2,
    },
  });
};