import { StyleSheet } from '@react-pdf/renderer';
import type { Company } from '../../entities/QuoteData';

export const createFooterStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';
  
  return StyleSheet.create({
    // FOOTER PRINCIPAL
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 30,
      right: 30,
      height: 50,
      paddingTop: 8,
      paddingBottom: 8,
      borderTopWidth: 0.5,
      borderTopColor: mainColor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    
    // LIGNE PRINCIPALE : 3 COLONNES
    mainRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flex: 1,
      gap: 12,
    },
    
    // COLONNE GAUCHE : 33% de largeur
    leftColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      height: '100%',
    },
    
    // COLONNE CENTRE : 34% de largeur
    centerColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textAlign: 'center',
      height: '100%',
    },
    
    // COLONNE DROITE : 33% de largeur
    rightColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      textAlign: 'right',
      height: '100%',
    },
    
    // LIGNE INDIVIDUELLE DANS CHAQUE COLONNE
    footerLine: {
      fontSize: 7,
      color: '#6c757d',
      lineHeight: 1.2,
      marginBottom: 1,
      minHeight: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start', // ✅ Utilise une valeur valide au lieu de 'inherit'
    },
    
    // STYLES POUR LE TEXTE
    companyName: {
      fontWeight: 'bold',
      color: '#212529',
    },

    separator: {
      color: '#6c757d',
      fontWeight: 'normal',
    },
    
    // LIGNE DE PAGINATION (en bas à droite)
    paginationRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      fontSize: 7,
      color: '#6c757d',
      fontWeight: 'normal',
      marginTop: 4,
    },
  });
};