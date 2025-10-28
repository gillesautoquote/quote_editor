import { StyleSheet } from '@react-pdf/renderer';
import type { Company } from '../../entities/QuoteData';

const HEADER_HEIGHT = 85;   // ✅ HAUTEUR AUGMENTÉE pour l'en-tête complète
const FOOTER_HEIGHT = 50;   // hauteur en points

export const createPageStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';
  
  return StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 10,
      paddingTop: 100,                // ✅ ENCORE PLUS D'ESPACE pour l'en-tête complète
      paddingBottom: FOOTER_HEIGHT,   // RÉSERVE L'ESPACE pour le pied de page
      paddingHorizontal: 30,
      backgroundColor: 'white',
      lineHeight: 1.3,
      // ✅ IMPORTANT : Le PDF garde la taille A4 standard (21cm)
      // L'élargissement ne concerne que l'éditeur, pas l'export PDF
    },
    
    content: {
      // Le contenu principal qui s'étend sur plusieurs pages sans jamais recouvrir header/footer
      flex: 1,
      display: 'flex',            // 🚀 FLEX pour permettre marginTop: 'auto'
      flexDirection: 'column',    // 🚀 DIRECTION VERTICALE pour la signature en bas
    },
    
    // Styles pour l'en-tête FIXE
    header: {
      position: 'absolute',           // HORS DU FLUX normal
      top: 0, 
      left: 30, 
      right: 30, 
      height: HEADER_HEIGHT, // ✅ CORRESPONDRE à la hauteur de l'en-tête complète
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: 15,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: mainColor,
    },
    
    // Styles pour le pied de page FIXE
    footer: {
      position: 'absolute',           // HORS DU FLUX normal
      bottom: 0, 
      left: 30, 
      right: 30, 
      height: FOOTER_HEIGHT,
      paddingTop: 8,
      paddingBottom: 10,
      borderTopWidth: 0.5,
      borderTopColor: '#dee2e6',
    },
  });
};