import { StyleSheet } from '@react-pdf/renderer';
import type { Company } from '../../entities/QuoteData';

export const createHeaderStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';
  
  return StyleSheet.create({
    // ===== EN-TÊTE PRINCIPAL - STRUCTURE IDENTIQUE À L'ÉDITEUR =====
    header: {
      position: 'absolute',
      top: 0,
      left: 30,
      right: 30,
      height: 85, // ✅ HAUTEUR AUGMENTÉE pour faire rentrer toutes les infos
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: 15,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: mainColor, // ✅ COULEUR DYNAMIQUE pour la bordure
    },
    
    // ===== SECTION GAUCHE : INFORMATIONS ENTREPRISE =====
    companyInfo: {
      flex: 1,
      marginRight: 30,
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'flex-start',
    },

    // 🖼️ LOGO - FACULTATIF ET CONDITIONNEL
    logo: {
      width: 60,
      height: 'auto',
      objectFit: 'contain',
      flexShrink: 0,
      alignSelf: 'center',
    },

    companyTextContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    },
    
    // 🏢 NOM DE L'ENTREPRISE - COULEUR DYNAMIQUE + TAILLE CORRECTE
    companyName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: mainColor,
      marginBottom: 2,
      lineHeight: 1.1,
    },
    
    // 📍 DÉTAILS ENTREPRISE - STRUCTURE IDENTIQUE
    companyDetails: {
      fontSize: 8,
      color: '#212529',
      lineHeight: 1.2,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    },
    
    // 📍 LIGNE D'ADRESSE
    addressLine: {
      marginBottom: 1,            // Espacement entre les lignes d'adresse
    },
    
    // 📞 LIGNE DE CONTACT
    contactLine: {
      marginTop: 2,               // Petit espacement avec l'adresse
    },
    
    // 📞 SÉPARATEUR TÉLÉPHONE|EMAIL - IDENTIQUE À L'ÉDITEUR
    phoneEmailSeparator: {
      color: '#6c757d',           // ✅ COULEUR MUTED comme l'éditeur
      marginHorizontal: 4,        // ✅ ESPACEMENT comme l'éditeur
    },
    
    // ===== SECTION DROITE : INFORMATIONS DEVIS =====
    quoteInfo: {
      textAlign: 'right',         // ✅ ALIGNEMENT À DROITE comme l'éditeur
      minWidth: 200,              // 🎯 RÉDUCTION : 220 → 200
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',     // ✅ ALIGNEMENT À DROITE
      gap: 1,                     // 🎯 RÉDUCTION : 3 → 1 pour compacter
      height: 60,                 // 🎯 RÉDUCTION : 65 → 60
    },
    
    // 📋 NUMÉRO DE DEVIS
    quoteNumber: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 1,
      lineHeight: 1.1,
      color: '#212529',
      textAlign: 'right',
    },
    
    // 🔄 VERSION DU DEVIS
    quoteVersion: {
      fontSize: 8,
      color: '#212529',
      marginBottom: 3,
      lineHeight: 1.1,
      textAlign: 'right',
    },
    
    // 📊 DÉTAILS DU DEVIS (Date, valable jusqu'au, référence)
    quoteDetails: {
      fontSize: 8,
      lineHeight: 1.2,
      color: '#212529',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    
    // 📄 LIGNE DE DÉTAIL INDIVIDUELLE
    detailRow: {
      marginBottom: 2,            // ✅ ESPACEMENT MANUEL entre les lignes
      textAlign: 'right',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      minHeight: 12,              // ✅ HAUTEUR SUFFISANTE pour les lignes
    },
    
    // 🏷️ LABEL DANS LES DÉTAILS (ex: "Date:", "Valable jusqu'au:")
    detailLabel: {
      fontWeight: 'bold',         // ✅ GRAS comme dans l'éditeur (strong)
      color: mainColor,           // ✅ COULEUR PRINCIPALE comme l'éditeur
      marginRight: 2,             // Espacement avant la valeur
    },
    
    // 💾 VALEUR DANS LES DÉTAILS (ex: "2024-06-11")
    detailValue: {
      color: '#212529',           // ✅ COULEUR TEXTE NORMALE
      fontWeight: 'normal',       // ✅ POIDS NORMAL
    },
    
    // 📅 STYLE SPÉCIAL POUR LA DATE DE VALIDITÉ EN GRAS
    validityValue: {
      color: '#212529',           // ✅ COULEUR TEXTE NORMALE
      fontWeight: 'bold',         // ✅ GRAS pour la date de validité
    },
  });
};