import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { createTableStyles } from '../styles/tableStyles';
import { formatDateFrench, formatVatRate } from '../utils/tableFormatters';
import type { QuoteSection, Company } from '../../entities/QuoteData';

interface PDFSectionsProps {
  sections: QuoteSection[];
  company: Company;
}

export const PDFSections: React.FC<PDFSectionsProps> = ({ sections, company }) => {
  const tableStyles = createTableStyles(company);

  const renderTableHeaders = () => (
    <View style={tableStyles.tableHeader}>
      <Text style={[tableStyles.headerCell, tableStyles.dateCol]}>Date</Text>
      <Text style={[tableStyles.headerCell, tableStyles.descriptionCol]}>Description</Text>
      <Text style={[tableStyles.headerCell, tableStyles.durationCol]}>Durée</Text>
      <Text style={[tableStyles.headerCell, tableStyles.paxCol]}>Pax</Text>
      <Text style={[tableStyles.headerCell, tableStyles.unitPriceCol]}>P.U.</Text>
      <Text style={[tableStyles.headerCell, tableStyles.quantityCol]}>Qté</Text>
      <Text style={[tableStyles.headerCell, tableStyles.htCol]}>HT</Text>
      <Text style={[tableStyles.headerCell, tableStyles.vatCol]}>TVA</Text>
      <Text style={[tableStyles.headerCell, tableStyles.ttcCol]}>TTC</Text>
    </View>
  );

  const renderTableRow = (line: any, isSubtotal = false, sectionTitle = '') => (
    <View 
      style={[tableStyles.tableRow, ...(isSubtotal ? [tableStyles.subtotalRow] : [])]}
      wrap={false}  // 🚀 EMPÊCHE LA COUPURE D'UNE LIGNE DE TABLEAU
      minPresenceAhead={15}  // 🚀 RÉSERVE DE L'ESPACE MINIMUM POUR LA LIGNE
    >
      <Text style={[tableStyles.dataCell, tableStyles.dateCol, tableStyles.centerAlign]}>
        {!isSubtotal ? formatDateFrench(line.date) : ' '}
      </Text>
      <Text style={[tableStyles.dataCell, tableStyles.descriptionCol, tableStyles.leftAlign]}>
        {isSubtotal ? `Sous-total ${sectionTitle}` : (line.description || ' ')}
      </Text>
      <Text style={[tableStyles.dataCell, tableStyles.durationCol, tableStyles.centerAlign]}>
        {!isSubtotal ? line.durationHours : ' '}
      </Text>
      <Text style={[tableStyles.dataCell, tableStyles.paxCol, tableStyles.centerAlign]}>
        {!isSubtotal ? line.pax : ' '}
      </Text>
      <Text style={[tableStyles.dataCell, tableStyles.unitPriceCol, tableStyles.rightAlign]}>
        {!isSubtotal ? line.unitPrice.toFixed(2) : ' '}
      </Text>
      <Text style={[tableStyles.dataCell, tableStyles.quantityCol, tableStyles.centerAlign]}>
        {!isSubtotal ? line.quantity : ' '}
      </Text>
      <Text style={[tableStyles.dataCell, tableStyles.htCol, tableStyles.rightAlign, tableStyles.calculatedField]}>
        {isSubtotal ? line.ht.toFixed(2) : line.priceHT.toFixed(2)}
      </Text>
      <Text style={[tableStyles.dataCell, tableStyles.vatCol, tableStyles.centerAlign]}>
        {!isSubtotal ? formatVatRate(line.vatRate) : ' '}
      </Text>
      <Text style={[tableStyles.dataCell, tableStyles.ttcCol, tableStyles.rightAlign, tableStyles.calculatedField]}>
        {isSubtotal ? line.ttc.toFixed(2) : line.priceTTC.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={tableStyles.sectionsContainer}>
      {sections.map((section, sectionIndex) => (
        <View 
          key={sectionIndex} 
          style={tableStyles.section}
          wrap={false}  // 🚀 EMPÊCHE LA COUPURE D'UNE SECTION COMPLÈTE
          minPresenceAhead={60}  // 🚀 RÉSERVE ASSEZ D'ESPACE POUR UNE SECTION (HEADER + AU MOINS 2 LIGNES)
        >
          {/* En-tête de section - TOUJOURS AVEC SON TABLEAU */}
          <View style={tableStyles.sectionHeader}>
            <Text style={tableStyles.sectionTitle}>{section.title || ' '}</Text>
          </View>
          
          {/* Tableau COMPLET - PROTÉGÉ CONTRE LES COUPURES */}
          <View 
            style={tableStyles.table}
            wrap={false}  // 🚀 EMPÊCHE LA COUPURE DU TABLEAU (HEADER + CONTENU)
            minPresenceAhead={40}  // 🚀 RÉSERVE DE L'ESPACE POUR LE TABLEAU COMPLET
          >
            {/* En-tête du tableau - TOUJOURS AVEC LES DONNÉES */}
            {renderTableHeaders()}
            
            {/* Corps du tableau - PROTÉGÉ */}
            <View
              wrap={false}  // 🚀 EMPÊCHE LA COUPURE ENTRE LES LIGNES DE DONNÉES
              minPresenceAhead={25}  // 🚀 RÉSERVE DE L'ESPACE POUR LES LIGNES
            >
              {/* Lignes de données */}
              {section.lines.map((line, lineIndex) => (
                <View key={lineIndex}>
                  {renderTableRow(line)}
                </View>
              ))}
              
              {/* Ligne de sous-total - TOUJOURS AVEC LES DONNÉES */}
              {renderTableRow(section.subTotal, true, section.title)}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};