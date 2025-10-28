import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { createHeaderStyles } from '../styles/headerStyles';
import { formatDateDDMMYYYY } from '../../utils/dateFormatters';
import type { Company, Quote } from '../../entities/QuoteData';

interface PDFHeaderProps {
  company: Company;
  quote: Quote;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ company, quote }) => {
  const headerStyles = createHeaderStyles(company);

  return (
    <View fixed style={headerStyles.header}>
      {/* ===== SECTION GAUCHE : INFORMATIONS ENTREPRISE ===== */}
      <View style={headerStyles.companyInfo}>
        {/* 🖼️ LOGO - FACULTATIF ET CONDITIONNEL comme l'éditeur */}
        {company.logoUrl && company.logoUrl.trim() !== '' && (
          <Image
            src={company.logoUrl}
            style={headerStyles.logo}
            cache={false}
          />
        )}

        <View style={headerStyles.companyTextContainer}>
          {/* 🏢 NOM DE L'ENTREPRISE - COULEUR DYNAMIQUE EXACTE */}
          <Text style={headerStyles.companyName}>
            {company.name}
          </Text>

          {/* 📍 DÉTAILS DE L'ENTREPRISE - STRUCTURE IDENTIQUE À L'ÉDITEUR */}
          <View style={headerStyles.companyDetails}>
            {/* Ligne 1 : Adresse */}
            <Text style={headerStyles.addressLine}>
              {company.address || ' '}
            </Text>

            {/* Ligne 2 : Code postal + Ville */}
            <Text style={headerStyles.addressLine}>
              {[company.postalCode, company.city].filter(Boolean).join(' ') || ' '}
            </Text>

            {/* Ligne 3 : Téléphone */}
            <Text style={headerStyles.contactLine}>
              {company.phone || ' '}
            </Text>

            {/* Ligne 4 : Email */}
            <Text style={headerStyles.addressLine}>
              {company.email || ' '}
            </Text>
          </View>
        </View>
      </View>
      
      {/* ===== SECTION DROITE : INFORMATIONS DEVIS ===== */}
      <View style={headerStyles.quoteInfo}>
        {/* 📋 NUMÉRO DE DEVIS - FORMATAGE EXACT */}
        <Text style={headerStyles.quoteNumber}>
          Devis N° {quote.number}
        </Text>
        
        {/* 🔄 VERSION - FORMATAGE EXACT */}
        <Text style={headerStyles.quoteVersion}>
          Version: {quote.version}
        </Text>
        
        {/* 📊 DÉTAILS DU DEVIS - TOUTES LES INFORMATIONS RESTAURÉES ! */}
        <View style={headerStyles.quoteDetails}>
          {/* Date - AFFICHER SEULEMENT SI ELLE EXISTE */}
          {quote.issueDate && quote.issueDate.trim() && (
            <View style={headerStyles.detailRow}>
              <Text style={headerStyles.detailLabel}>Date: </Text>
              <Text style={headerStyles.detailValue}>{formatDateDDMMYYYY(quote.issueDate)}</Text>
            </View>
          )}
          
          {/* Valable jusqu'au - AFFICHER SEULEMENT SI ELLE EXISTE */}
          {quote.validUntil && quote.validUntil.trim() && (
            <View style={headerStyles.detailRow}>
              <Text style={headerStyles.detailLabel}>Valable jusqu'au: </Text>
              <Text style={headerStyles.validityValue}>{formatDateDDMMYYYY(quote.validUntil)}</Text>
            </View>
          )}
          
          {/* Référence - AFFICHER SEULEMENT SI ELLE EXISTE */}
          {quote.reference && quote.reference.trim() && (
            <View style={headerStyles.detailRow}>
              <Text style={headerStyles.detailLabel}>Référence: </Text>
              <Text style={headerStyles.detailValue}>{quote.reference || ' '}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};