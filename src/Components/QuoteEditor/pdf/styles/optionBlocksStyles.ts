import { StyleSheet } from '@react-pdf/renderer';
import type { Company } from '../../entities/QuoteData';

export const createOptionBlocksStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';
  
  return StyleSheet.create({
    // ===== CONTAINER PRINCIPAL =====
    container: {
      marginTop: 15,
      marginBottom: 15,
    },
    
    // ✅ LIGNE FLEXBOX SIMPLE (sans gap ni wrap qui ne marchent pas dans React PDF)
    blocksRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%',
      marginBottom: 0, // L'espacement est géré par les marges des blocs
    },
    
    // ===== OPTION BLOCKS =====
    blockContainer: {
      border: '1px solid #e1e5e9',
      borderRadius: 4,
      borderLeftWidth: 3, // Bordure gauche colorée (sera surchargée)
      overflow: 'hidden',
      backgroundColor: 'white',
      // Les marges et largeurs sont définies dynamiquement
    },
    
    blockHeader: {
      padding: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#e1e5e9',
      // backgroundColor sera surchargée par la couleur du bloc
    },
    
    blockTitle: {
      fontSize: 10,              // ✅ AUGMENTÉ de 9 à 10
      fontWeight: 'bold',
      margin: 0,
      lineHeight: 1.2,
      // color sera surchargée par la couleur du bloc
    },
    
    blockContent: {
      padding: 6,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    },
    
    // ===== ÉLÉMENTS DE LISTE =====
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 2,
      paddingRight: 4, // Petit padding pour éviter que le texte touche le bord
    },
    
    bulletPoint: {
      fontSize: 9,               // ✅ AUGMENTÉ de 8 à 9
      fontWeight: 'bold',
      lineHeight: 1.2,
      width: 10,
      flexShrink: 0,
      marginRight: 4, // Espace entre la puce et le texte
      // color sera surchargée par la couleur du bloc
    },
    
    itemText: {
      fontSize: 9,               // ✅ AUGMENTÉ de 8 à 9
      lineHeight: 1.3,
      flex: 1,
      color: '#212529',
    },
    
    // ===== STYLES DE TEXTE =====
    boldText: {
      fontWeight: 'bold',
    },
    
    italicText: {
      fontStyle: 'italic',
    },
    
    underlineText: {
      textDecoration: 'underline',
    },
    
    // ===== SIGNATURE FRAME =====
    signatureFrameContainer: {
      border: '1px solid #e1e5e9',    // ✅ PETITE BORDURE pour l'instruction frame globale
      backgroundColor: 'white',        // ✅ FOND BLANC pour le cadre principal
      borderRadius: 4,
      padding: 8,
      display: 'flex',
      flexDirection: 'column',
      // Width et marginLeft sont définis dynamiquement
    },
    
    beforeSection: {
      marginBottom: 6,
      display: 'flex',
      flexDirection: 'column',
    },
    
    afterSection: {
      marginTop: 6,
      display: 'flex',
      flexDirection: 'column',
    },
    
    instructionLine: {
      fontSize: 9,               // ✅ AUGMENTÉ de 8 à 9
      color: '#212529',
      lineHeight: 1.3,
      marginBottom: 2,
    },
    
    signatureBox: {
      borderRadius: 4,
      backgroundColor: 'white',        // ✅ FOND BLANC pour le conteneur
      padding: 2,                      // ✅ ENCORE PLUS RÉDUIT : padding minimal
      marginVertical: 1,               // ✅ ENCORE PLUS RÉDUIT : marges vraiment minimales
    },
    
    signatureSpace: {
      height: 95,                      // ✅ ENCORE PLUS GRAND : 80 → 95 pour le premier encart
      backgroundColor: '#f5f5f5',      // ✅ GRIS TRÈS CLAIR, pas de bordure
      borderRadius: 4,
      // ✅ SUPPRIMÉ : display, alignItems, justifyContent (plus de centrage de texte)
    },
    
    fillSpace: {
      height: 60,                      // ✅ PLUS GRAND : 40 → 60
      backgroundColor: '#f5f5f5',      // ✅ GRIS TRÈS CLAIR, pas de bordure
      borderRadius: 4,
      marginTop: 1,                    // ✅ ENCORE PLUS RÉDUIT : marge vraiment minime au dessus
      // ✅ SUPPRIMÉ : border (plus de bordure)
    },
  });
};