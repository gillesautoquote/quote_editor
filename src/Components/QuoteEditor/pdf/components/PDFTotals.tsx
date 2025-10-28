import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { createTotalsStyles } from '../styles/totalsStyles';
import type { Company } from '../../entities/QuoteData';

interface VATBreakdown {
  rate: number;
  amount: number;
}

interface PDFTotalsProps {
  totals: {
    ht: number;
    tva: number;
    ttc: number;
    vatBreakdown?: VATBreakdown[];
  };
  company: Company;
}

export const PDFTotals: React.FC<PDFTotalsProps> = ({ totals, company }) => {
  const totalsStyles = createTotalsStyles(company);

  return (
    <View 
      style={totalsStyles.totalsSection}
      wrap={false}  // 🚀 EMPÊCHE LA COUPURE DU TABLEAU DES TOTAUX COMPLET
      minPresenceAhead={40}  // 🚀 RÉSERVE ASSEZ D'ESPACE POUR LES 3 LIGNES DE TOTAUX
    >
      <View 
        style={totalsStyles.totalsTable}
        wrap={false}  // 🚀 DOUBLE PROTECTION : LE TABLEAU NE SE COUPE JAMAIS
        minPresenceAhead={35}  // 🚀 ESPACE MINIMUM POUR TOUTES LES LIGNES
      >
        {/* Total HT - PROTÉGÉ INDIVIDUELLEMENT */}
        <View
          style={totalsStyles.totalRow}
          wrap={false}  // 🚀 UNE LIGNE DE TOTAL NE SE COUPE JAMAIS
        >
          <Text style={[totalsStyles.totalLabel, { width: '70%' }]}>
            Total HT
          </Text>
          <Text style={[totalsStyles.totalValue, { width: '30%' }]}>
            {totals.ht.toFixed(2)} €
          </Text>
        </View>

        {/* Détail TVA par taux */}
        {totals.vatBreakdown && totals.vatBreakdown.length > 0 && (
          <>
            {totals.vatBreakdown.map((vat, index) => (
              <View
                key={index}
                style={[totalsStyles.totalRow, { backgroundColor: '#f9fafb' }]}
                wrap={false}
              >
                <Text style={[totalsStyles.totalLabel, { width: '70%', paddingLeft: 15 }]}>
                  dont TVA à {vat.rate} %
                </Text>
                <Text style={[totalsStyles.totalValue, { width: '30%' }]}>
                  {vat.amount.toFixed(2)} €
                </Text>
              </View>
            ))}
          </>
        )}

        {/* TVA Total - PROTÉGÉ INDIVIDUELLEMENT */}
        <View
          style={totalsStyles.totalRow}
          wrap={false}  // 🚀 UNE LIGNE DE TOTAL NE SE COUPE JAMAIS
        >
          <Text style={[totalsStyles.totalLabel, { width: '70%' }]}>
            Total TVA
          </Text>
          <Text style={[totalsStyles.totalValue, { width: '30%' }]}>
            {totals.tva.toFixed(2)} €
          </Text>
        </View>
        
        {/* Total TTC - LIGNE FINALE PROTÉGÉE */}
        <View 
          style={[totalsStyles.totalRow, totalsStyles.finalTotalRow]}
          wrap={false}  // 🚀 LA LIGNE FINALE NE SE COUPE JAMAIS
        >
          <Text style={[totalsStyles.totalLabel, totalsStyles.finalTotalLabel, { width: '70%' }]}>
            Total TTC
          </Text>
          <Text style={[totalsStyles.totalValue, totalsStyles.finalTotalValue, { width: '30%' }]}>
            {totals.ttc.toFixed(2)} €
          </Text>
        </View>
      </View>
    </View>
  );
};