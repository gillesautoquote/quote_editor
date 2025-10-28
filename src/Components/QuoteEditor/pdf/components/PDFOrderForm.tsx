import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { SignatureFrame, Recipient, Company } from '../../entities/QuoteData';

interface PDFOrderFormProps {
  signatureFrame: SignatureFrame;
  recipient: Recipient;
  company: Company;
}

const createOrderFormStyles = (company: Company) => {
  const mainColor = company.mainColor || '#0066cc';

  return StyleSheet.create({
    container: {
      marginTop: 20,
      marginBottom: 10,
    },
    pageTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: mainColor,
      marginBottom: 16,
      textAlign: 'center',
    },
    formGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginBottom: 12,
    },
    formRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    formRowDouble: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
    },
    formField: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    formLabel: {
      fontSize: 8,
      color: '#374151',
      fontWeight: 'medium',
    },
    formInput: {
      flex: 1,
      borderBottomWidth: 1,
      borderBottomStyle: 'dotted',
      borderBottomColor: '#d1d5db',
      paddingBottom: 2,
      minHeight: 12,
    },
    formInputText: {
      fontSize: 8,
      color: '#6b7280',
    },
    acceptationText: {
      fontSize: 9,
      color: '#374151',
      marginBottom: 6,
    },
    cachetText: {
      fontSize: 9,
      fontWeight: 'bold',
      color: '#374151',
      marginBottom: 8,
    },
    signatureBox: {
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: mainColor,
      backgroundColor: `${mainColor}08`,
      borderRadius: 4,
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    emptyLine: {
      borderBottomWidth: 1,
      borderBottomStyle: 'dotted',
      borderBottomColor: '#d1d5db',
      minHeight: 12,
      marginBottom: 4,
    },
  });
};

export const PDFOrderForm: React.FC<PDFOrderFormProps> = ({
  signatureFrame,
  recipient,
  company
}) => {
  const styles = createOrderFormStyles(company);

  return (
    <View style={styles.container} wrap={false}>
      {/* Titre de la page */}
      <Text style={styles.pageTitle}>BON DE COMMANDE</Text>

      {/* Formulaire client */}
      <View style={styles.formGrid}>
        {/* Ligne 1: Nom du client + Code client */}
        <View style={styles.formRowDouble}>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Nom du client :</Text>
            <View style={styles.formInput}>
              {recipient.organization && (
                <Text style={styles.formInputText}>{recipient.organization}</Text>
              )}
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Code client :</Text>
            <View style={styles.formInput}>
              {recipient.clientReference && (
                <Text style={styles.formInputText}>{recipient.clientReference}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Ligne 2: Nom du responsable */}
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Nom du responsable (lors du voyage) :</Text>
          <View style={styles.formInput}>
            {recipient.fullName && (
              <Text style={styles.formInputText}>{recipient.fullName}</Text>
            )}
          </View>
        </View>

        {/* Ligne 3: Téléphone + Mail */}
        <View style={styles.formRowDouble}>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Tél. portable :</Text>
            <View style={styles.formInput}>
              {recipient.phone && (
                <Text style={styles.formInputText}>{recipient.phone}</Text>
              )}
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Mail :</Text>
            <View style={styles.formInput}>
              {recipient.email && (
                <Text style={styles.formInputText}>{recipient.email}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Ligne 4: Adresse de facturation */}
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Adresse de facturation :</Text>
          <View style={styles.formInput}>
            {(() => {
              const address = [recipient.address, recipient.postalCode, recipient.city]
                .filter(Boolean)
                .join(', ');
              return address ? (
                <Text style={styles.formInputText}>{address}</Text>
              ) : null;
            })()}
          </View>
        </View>

        {/* Ligne vide */}
        <View style={styles.emptyLine} />

        {/* Ligne 5: SIRET + TVA */}
        <View style={styles.formRowDouble}>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>SIRET :</Text>
            <View style={styles.formInput}>
              {signatureFrame.siret && (
                <Text style={styles.formInputText}>{signatureFrame.siret}</Text>
              )}
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>N° TVA intracommunautaire :</Text>
            <View style={styles.formInput}>
              {signatureFrame.intraCommunityVat && (
                <Text style={styles.formInputText}>{signatureFrame.intraCommunityVat}</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Texte d'acceptation */}
      <Text style={styles.acceptationText}>
        Acceptation du devis et des conditions générales de vente
      </Text>

      {/* Cachet et signature */}
      <Text style={styles.cachetText}>
        Cachet et signature avec la mention "lu et accepté"
      </Text>

      {/* Encart de signature */}
      <View style={styles.signatureBox} />
    </View>
  );
};
