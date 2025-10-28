import { StyleSheet } from '@react-pdf/renderer';
import { getContrastColor } from '../../utils/colorUtils';
import type { Company } from '../../entities/QuoteData';

export const createTableStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';
  const contrastColor = getContrastColor(mainColor);

  return StyleSheet.create({
    sectionsContainer: {
      marginBottom: 15,
      gap: 8,
    },
    
    section: {
      marginBottom: 8,
      border: '1px solid #dee2e6',
      borderRadius: 4,
      overflow: 'hidden',
    },
    
    sectionHeader: {
      padding: 5,
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#dee2e6',
    },
    
    sectionTitle: {
      fontSize: 11,              // ✅ AUGMENTÉ de 10 à 11
      fontWeight: 'bold',
      color: mainColor,
      margin: 0,
      lineHeight: 1.2,
    },
    
    table: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    
    // ===== EN-TÊTE DU TABLEAU =====
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: mainColor,
      borderBottomWidth: 1,
      borderBottomColor: mainColor,
    },
    
    headerCell: {
      padding: 3,
      fontSize: 8,               // ✅ AUGMENTÉ de 7 à 8
      fontWeight: 'bold',
      textAlign: 'center',
      color: contrastColor,
      borderRightWidth: 1,
      borderRightColor: mainColor,
      lineHeight: 1.1,
    },
    
    // ===== LIGNES DE DONNÉES =====
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#dee2e6',
    },
    
    dataCell: {
      padding: 2.5,
      fontSize: 8.5,             // ✅ AUGMENTÉ de 7.5 à 8.5
      borderRightWidth: 1,
      borderRightColor: '#dee2e6',
      lineHeight: 1.2,
      color: '#212529',
    },
    
    // ===== LARGEURS DES COLONNES (identiques à l'éditeur) =====
    dateCol: { width: '12%' },
    descriptionCol: { width: '38%' },
    durationCol: { width: '8%' },
    paxCol: { width: '6%' },
    unitPriceCol: { width: '10%' },
    quantityCol: { width: '6%' },
    htCol: { width: '10%' },
    vatCol: { width: '6%' },
    ttcCol: { width: '10%' },
    
    // ===== ALIGNEMENTS =====
    leftAlign: { textAlign: 'left' },
    centerAlign: { textAlign: 'center' },
    rightAlign: { textAlign: 'right' },
    
    // ===== STYLES SPÉCIAUX =====
    calculatedField: {
      backgroundColor: '#f8f9fa',
      fontWeight: 'bold',
      color: mainColor,
    },
    
    // ===== LIGNE DE SOUS-TOTAL =====
    subtotalRow: {
      backgroundColor: '#e9ecef',
      fontWeight: 'bold',
      fontSize: 9,               // ✅ AUGMENTÉ de 8 à 9
    },
  });
};