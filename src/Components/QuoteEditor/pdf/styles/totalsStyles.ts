import { StyleSheet } from '@react-pdf/renderer';
import { getContrastColor } from '../../utils/colorUtils';
import type { Company } from '../../entities/QuoteData';

export const createTotalsStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';
  const contrastColor = getContrastColor(mainColor);

  return StyleSheet.create({
    totalsSection: {
      marginTop: 10,
      marginBottom: 15,
      alignItems: 'flex-end', // Aligné à droite comme l'éditeur
    },
    
    totalsTable: {
      width: 200, // Largeur fixe comme l'éditeur
      border: '1px solid #dee2e6',
      borderRadius: 4,
      overflow: 'hidden',
    },
    
    totalRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#dee2e6',
      minHeight: 25,
      alignItems: 'center',
    },
    
    totalLabel: {
      padding: 5,
      fontSize: 9.5,             // ✅ AUGMENTÉ de 8.5 à 9.5
      fontWeight: 'bold',
      color: '#212529',
      textAlign: 'left',
    },
    
    totalValue: {
      padding: 5,
      fontSize: 9.5,             // ✅ AUGMENTÉ de 8.5 à 9.5
      fontWeight: 'bold',
      color: '#212529',
      textAlign: 'right',
    },
    
    // ===== LIGNE FINALE (Total TTC) =====
    finalTotalRow: {
      backgroundColor: mainColor,
      borderBottomWidth: 0,
    },
    
    finalTotalLabel: {
      color: contrastColor,
      fontSize: 10,              // ✅ AUGMENTÉ de 9 à 10
    },
    
    finalTotalValue: {
      color: contrastColor,
      fontSize: 10,              // ✅ AUGMENTÉ de 9 à 10
    },
  });
};