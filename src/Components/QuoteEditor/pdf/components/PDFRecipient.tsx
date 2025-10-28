import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { createRecipientStyles } from '../styles/recipientStyles';
import type { Recipient, Company } from '../../entities/QuoteData';

interface PDFRecipientProps {
  recipient: Recipient;
  company: Company;
}

export const PDFRecipient: React.FC<PDFRecipientProps> = ({ 
  recipient, 
  company 
}) => {
  const recipientStyles = createRecipientStyles(company);
  
  return (
    <View style={recipientStyles.recipientWrapper}>
      <View style={recipientStyles.recipientCard}>
        {/* Titre "DESTINATAIRE" */}
        <Text style={recipientStyles.recipientTitle}>
          DESTINATAIRE
        </Text>
        
        {/* Détails du destinataire */}
        <View style={recipientStyles.recipientDetails}>
          {/* Organisation - afficher seulement si elle existe */}
          {recipient.organization && recipient.organization.trim() && (
            <Text style={recipientStyles.recipientOrg}>
              {recipient.organization}
            </Text>
          )}
          
          {/* Nom complet - afficher seulement s'il existe */}
          {recipient.fullName && recipient.fullName.trim() && (
            <Text style={recipientStyles.recipientName}>
              {recipient.fullName}
            </Text>
          )}
          
          {/* Adresse - afficher seulement si elle existe */}
          {recipient.address && recipient.address.trim() && (
            <Text style={recipientStyles.recipientAddress}>
              {recipient.address}
            </Text>
          )}
          
          {/* Code postal + Ville - afficher seulement si au moins un existe */}
          {((recipient.postalCode && recipient.postalCode.trim()) || (recipient.city && recipient.city.trim())) && (
            <Text style={recipientStyles.recipientCity}>
              {[
                recipient.postalCode && recipient.postalCode.trim(),
                recipient.city && recipient.city.trim()
              ].filter(Boolean).join(' ') || ' '}
            </Text>
          )}
          
          {/* Téléphone + Email - afficher seulement si au moins un existe */}
          {((recipient.phone && recipient.phone.trim()) || (recipient.email && recipient.email.trim())) && (
            <Text style={recipientStyles.recipientContact}>
              {[
                recipient.phone && recipient.phone.trim(),
                recipient.email && recipient.email.trim()
              ].filter(Boolean).join(' | ') || ' '}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};