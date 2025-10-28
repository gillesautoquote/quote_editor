import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { CarbonImpact } from '../../entities/QuoteData';

interface PDFCarbonImpactProps {
  carbonImpact: CarbonImpact;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 10,
    textAlign: 'center',
  },
  impactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#e8f5f0',
    border: '2px solid #b8dccf',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    maxWidth: 450,
  },
  dataBox: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    border: '1px solid #b8dccf',
  },
  labelText: {
    fontSize: 7,
    color: '#00796b',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b',
    lineHeight: 1,
  },
  unitText: {
    fontSize: 9,
    color: '#4a4a4a',
    marginTop: 2,
  },
  equalsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  description: {
    fontSize: 8,
    color: '#4a4a4a',
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 450,
    lineHeight: 1.4,
  },
});

export const PDFCarbonImpact: React.FC<PDFCarbonImpactProps> = ({ carbonImpact }) => {
  return (
    <View style={styles.container} wrap={false}>
      <Text style={styles.title}>Impact environnemental du trajet</Text>

      <View style={styles.impactBox}>
        <View style={styles.dataBox}>
          <Text style={styles.valueText}>{carbonImpact.equivalentKm || ' '}</Text>
          <Text style={styles.unitText}>kilomètres</Text>
        </View>

        <Text style={styles.equalsText}>=</Text>

        <View style={styles.dataBox}>
          <Text style={styles.valueText}>{carbonImpact.co2Amount || ' '}</Text>
          <Text style={styles.unitText}>{carbonImpact.unit || 'kg CO₂'}</Text>
        </View>
      </View>

      {carbonImpact.description && (
        <Text style={styles.description}>{carbonImpact.description}</Text>
      )}
    </View>
  );
};
