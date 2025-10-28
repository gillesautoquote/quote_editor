import { StyleSheet } from '@react-pdf/renderer';
import type { Company } from '../../entities/QuoteData';

export const createRecipientStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';
  
  return StyleSheet.create({
    // Container principal - aligné à DROITE comme l'éditeur
    recipientWrapper: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end', // ✅ ALIGNEMENT À DROITE comme l'éditeur
      marginBottom: 12,
    },
    
    // Carte destinataire - EXACTEMENT comme l'éditeur
    recipientCard: {
      width: '60%',              // ✅ ÉLARGI : 50% → 60%
      maxWidth: 280,             // ✅ ÉLARGI : 200 → 280 points
      backgroundColor: '#f8fafe', // ✅ Background dégradé simulé
      border: '1px solid #e1e5e9',
      borderLeftWidth: 3,        // ✅ Bordure gauche épaisse
      borderLeftColor: mainColor, // ✅ Couleur dynamique comme l'éditeur
      borderRadius: 4,
      padding: 12,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', // ✅ Ombre subtile
      position: 'relative',
    },
    
    // Titre "DESTINATAIRE" - EXACTEMENT comme l'éditeur
    recipientTitle: {
      fontWeight: 'bold',
      fontSize: 8,               // ✅ AUGMENTÉ de 7 à 8
      color: mainColor,          // ✅ Couleur dynamique
      marginBottom: 6,
      textTransform: 'uppercase', // ✅ MAJUSCULES comme l'éditeur
      letterSpacing: 0.5,        // ✅ Espacement lettres comme l'éditeur
      lineHeight: 1.1,
    },
    
    // Container des détails
    recipientDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,                  // ✅ Espacement entre les lignes
      lineHeight: 1.3,
    },
    
    // Organisation - Style GRAS + couleur principale
    recipientOrg: {
      fontWeight: 'bold',        // ✅ GRAS comme l'éditeur
      color: mainColor,          // ✅ Couleur principale dynamique
      fontSize: 9.5,             // ✅ AUGMENTÉ de 8.5 à 9.5
      marginBottom: 1,
      lineHeight: 1.2,
    },
    
    // Nom complet - Style moyen
    recipientName: {
      fontWeight: '500',         // ✅ Poids moyen comme l'éditeur
      fontSize: 9,               // ✅ AUGMENTÉ de 8 à 9
      color: '#212529',          // ✅ Couleur texte normale
      marginBottom: 1,
      lineHeight: 1.2,
    },
    
    // Adresse - Style normal
    recipientAddress: {
      fontSize: 8.5,             // ✅ AUGMENTÉ de 7.5 à 8.5
      color: '#212529',
      marginBottom: 0.5,
      lineHeight: 1.2,
    },
    
    // Code postal + Ville - Style normal
    recipientCity: {
      fontSize: 8.5,             // ✅ AUGMENTÉ de 7.5 à 8.5
      color: '#212529',
      lineHeight: 1.2,
    },
    
    // Contact (téléphone + email concaténés) - Style normal
    recipientContact: {
      fontSize: 8.5,             // ✅ AUGMENTÉ de 7.5 à 8.5
      color: '#212529',
      lineHeight: 1.2,
    },
  });
};