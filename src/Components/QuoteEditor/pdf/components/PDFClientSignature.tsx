import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { createClientSignatureStyles } from '../styles/clientSignatureStyles';
import { formatTitle } from '../utils/textFormatters';
import type { ClientSignature, Company } from '../../entities/QuoteData';

interface PDFClientSignatureProps {
  clientSignature: ClientSignature;
  company: Company;
}

export const PDFClientSignature: React.FC<PDFClientSignatureProps> = ({ 
  clientSignature, 
  company 
}) => {
  const signatureStyles = createClientSignatureStyles(company);
  
  // ✅ GESTION DE L'ABSENCE D'INFORMATIONS
  const hasTagline = clientSignature.tagline && clientSignature.tagline.trim() !== '';
  const hasTitle = clientSignature.title && clientSignature.title.trim() !== '';
  const hasName = clientSignature.fullName && clientSignature.fullName.trim() !== '';
  const hasSignatureInfo = hasTitle || hasName;
  
  // Si aucune information de signature, ne rien afficher
  if (!hasTagline && !hasSignatureInfo) {
    return null;
  }

  return (
    <View 
      style={signatureStyles.signatureWrapper}
      wrap={false}  // 🚀 EMPÊCHE LA COUPURE DE LA SIGNATURE SUR PLUSIEURS PAGES
      minPresenceAhead={30}  // 🚀 S'ASSURE QU'IL Y A ASSEZ D'ESPACE POUR LA SIGNATURE COMPLÈTE
    >
      {/* 💬 TAGLINE DE CONCLUSION - ALIGNÉE À GAUCHE (optionnelle) */}
      {hasTagline && (
        <View style={signatureStyles.conclusionSection}>
          <Text style={signatureStyles.conclusionText}>
            {clientSignature.tagline}
          </Text>
        </View>
      )}
      
      {/* ✍️ SIGNATURE SIMPLE - ALIGNÉE À DROITE (optionnelle) */}
      {hasSignatureInfo && (
        <View style={signatureStyles.signatureSection}>
          {/* Titre/Fonction du signataire (ex: "Le Service Commercial,") */}
          {hasTitle && (
            <Text style={signatureStyles.signatoryTitle}>
              {formatTitle(clientSignature.title)}
            </Text>
          )}
          
          {/* Nom complet du signataire */}
          {hasName && (
            <Text style={signatureStyles.signatoryName}>
              {clientSignature.fullName}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};