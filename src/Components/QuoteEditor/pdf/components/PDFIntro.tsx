import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { createIntroStyles } from '../styles/introStyles';
import { formatDateInFrench, formatTitle, markdownToPlainText } from '../utils/textFormatters';
import type { Quote, Recipient, Company, ClientSignature } from '../../entities/QuoteData';

interface PDFIntroProps {
  quote: Quote;
  recipient: Recipient;
  company: Company;
  clientSignature?: ClientSignature;
}

export const PDFIntro: React.FC<PDFIntroProps> = ({
  quote,
  recipient,
  company,
  clientSignature
}) => {
  const introStyles = createIntroStyles(company);
  
  // 🔧 CONCATÉNATION INTELLIGENTE : Ville + Date en UNE SEULE chaîne
  const buildLocationDateString = (): string => {
    const parts: string[] = [];
    
    // Ajouter la ville si présente et non vide
    if (quote.executionCity && quote.executionCity.trim()) {
      parts.push(quote.executionCity);
    }
    
    // Ajouter la date si présente et non vide
    if (quote.issueDate && quote.issueDate.trim()) {
      const formattedDate = formatDateInFrench(quote.issueDate);
      if (formattedDate) {
        parts.push(formattedDate);
      }
    }
    
    // Joindre avec une virgule + espace et ajouter virgule finale
    return parts.length > 0 ? `${parts.join(', ')},` : ' ';
  };

  return (
    <View style={introStyles.introSection}>
      {/* 🏙️ LIGNE VILLE ET DATE - CONCATÉNÉES EN UNE SEULE CHAÎNE */}
      {buildLocationDateString() && (
        <Text style={introStyles.quoteLocation}>
          {buildLocationDateString()}
        </Text>
      )}
      
      {/* 👤 CIVILITÉ DU CLIENT - SI PRÉSENTE ET NON VIDE */}
      {recipient.title && recipient.title.trim() && (
        <Text style={introStyles.clientTitle}>
          {formatTitle(recipient.title)}
        </Text>
      )}
      
      {/* 💬 TAGLINE D'INTRODUCTION - SI PRÉSENTE ET NON VIDE */}
      {quote.tagline && quote.tagline.trim() && (
        <Text style={introStyles.quoteTagline}>
          {markdownToPlainText(quote.tagline)}
        </Text>
      )}

      {/* 🖋️ SIGNATURE CLIENT - SI PRÉSENTE */}
      {clientSignature && (
        <View style={{ marginTop: 20 }}>
          {/* Texte de remerciements */}
          {clientSignature.tagline && clientSignature.tagline.trim() && (
            <Text style={introStyles.clientSignatureTagline}>
              {clientSignature.tagline}
            </Text>
          )}

          {/* Titre et nom */}
          {clientSignature.title && clientSignature.title.trim() && (
            <Text style={introStyles.clientSignatureTitle}>
              {clientSignature.title}
            </Text>
          )}
          {clientSignature.fullName && clientSignature.fullName.trim() && (
            <Text style={introStyles.clientSignatureName}>
              {clientSignature.fullName}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};