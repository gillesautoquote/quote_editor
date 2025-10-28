import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { createFooterStyles } from '../styles/footerStyles';
import { extractCompanyName, cleanUrl } from '../../utils/textUtils';
import type { Footer, Company } from '../../entities/QuoteData';

interface PDFFooterProps {
  footer: Footer;
  company: Company;
}

export const PDFFooter: React.FC<PDFFooterProps> = ({ footer, company }) => {
  const footerStyles = createFooterStyles(company);
  
  return (
    <View fixed style={footerStyles.footer}>
      {/* LIGNE PRINCIPALE : 3 COLONNES × 3 LIGNES CHACUNE */}
      <View style={footerStyles.mainRow}>
        
        {/* COLONNE GAUCHE : RCS / SIRET / TVA */}
        <View style={footerStyles.leftColumn}>
          {/* Ligne 1 : RCS - afficher seulement s'il existe */}
          {footer.rcs && footer.rcs.trim() && (
            <View style={footerStyles.footerLine}>
              <Text>RCS {footer.rcs || ' '}</Text>
            </View>
          )}
          
          {/* Ligne 2 : SIRET - afficher seulement s'il existe */}
          {footer.siret && footer.siret.trim() && (
            <View style={footerStyles.footerLine}>
              <Text>SIRET {footer.siret || ' '}</Text>
            </View>
          )}
          
          {/* Ligne 3 : TVA - afficher seulement s'il existe */}
          {footer.tva && footer.tva.trim() && (
            <View style={footerStyles.footerLine}>
              <Text>TVA {footer.tva || ' '}</Text>
            </View>
          )}
        </View>
        
        {/* COLONNE CENTRE : COPYRIGHT+TEL / SITE WEB / IBAN */}
        <View style={footerStyles.centerColumn}>
          {/* Ligne 1 : COPYRIGHT + TÉLÉPHONE - afficher seulement si au moins un existe */}
          {((footer.copyright && footer.copyright.trim()) || (footer.phone && footer.phone.trim())) && (
            <View style={footerStyles.footerLine}>
              {footer.copyright && footer.copyright.trim() && (
                <Text style={footerStyles.companyName}>
                  {extractCompanyName(footer.copyright)}
                </Text>
              )}
              {footer.copyright && footer.copyright.trim() && footer.phone && footer.phone.trim() && (
                <Text style={footerStyles.separator}> • </Text>
              )}
              {footer.phone && footer.phone.trim() && (
                <Text>{footer.phone || ' '}</Text>
              )}
            </View>
          )}
          
          {/* Ligne 2 : SITE WEB - afficher seulement s'il existe */}
          {footer.website && footer.website.trim() && (
            <View style={footerStyles.footerLine}>
              <Text>{cleanUrl(footer.website) || ' '}</Text>
            </View>
          )}
          
          {/* Ligne 3 : IBAN - afficher seulement s'il existe */}
          {footer.iban && footer.iban.trim() && (
            <View style={footerStyles.footerLine}>
              <Text>IBAN: {footer.iban || ' '}</Text>
            </View>
          )}
        </View>
        
        {/* COLONNE DROITE : ADRESSE / CODE+VILLE / BIC */}
        <View style={footerStyles.rightColumn}>
          {/* Ligne 1 : ADRESSE - afficher seulement si elle existe */}
          {footer.address && footer.address.trim() && (
            <View style={footerStyles.footerLine}>
              <Text>{footer.address || ' '}</Text>
            </View>
          )}
          
          {/* Ligne 2 : CODE POSTAL + VILLE - afficher seulement si au moins un existe */}
          {((footer.postalCode && footer.postalCode.trim()) || (footer.city && footer.city.trim())) && (
            <View style={footerStyles.footerLine}>
              <Text>
                {[
                  footer.postalCode && footer.postalCode.trim(),
                  footer.city && footer.city.trim()
                ].filter(Boolean).join(' ') || ' '}
              </Text>
            </View>
          )}
          
          {/* Ligne 3 : BIC - afficher seulement s'il existe */}
          {footer.bic && footer.bic.trim() && (
            <View style={footerStyles.footerLine}>
              <Text>BIC: {footer.bic || ' '}</Text>
            </View>
          )}
        </View>
        
      </View>
      
      {/* PAGINATION À DROITE */}
      <View style={footerStyles.paginationRow}>
        <Text render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber}/${totalPages}`
        } />
      </View>
    </View>
  );
};