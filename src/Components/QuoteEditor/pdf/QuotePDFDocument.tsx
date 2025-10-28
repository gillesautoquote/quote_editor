import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { PDFHeader } from './components/PDFHeader';
import { PDFRecipient } from './components/PDFRecipient';
import { PDFIntro } from './components/PDFIntro';
import { PDFSections } from './components/PDFSections';
import { PDFTotals } from './components/PDFTotals';
import { PDFCarbonImpact } from './components/PDFCarbonImpact';
import { PDFBusServices } from './components/PDFBusServices';
import { PDFOptionBlocks } from './components/PDFOptionBlocks';
import { PDFClientSignature } from './components/PDFClientSignature';
import { PDFOrderForm } from './components/PDFOrderForm';
import { PDFFooter } from './components/PDFFooter';
import { createPageStyles } from './styles/pageStyles';
import type { QuoteData } from '../entities/QuoteData';

interface QuotePDFDocumentProps {
  data: QuoteData;
  useTabs?: boolean;
}

export const QuotePDFDocument: React.FC<QuotePDFDocumentProps> = ({ data, useTabs = true }) => {
  const pageStyles = createPageStyles(data.company);

  const programmeBlock = data.optionBlocks.find(block => block.type === 'programme-voyage');
  const otherBlocks = data.optionBlocks.filter(block => block.type !== 'programme-voyage');

  if (!useTabs) {
    return (
      <Document>
        <Page size="A4" style={pageStyles.page}>
          <PDFHeader company={data.company} quote={data.quote} />
          <PDFFooter footer={data.footer} company={data.company} />
          <View style={pageStyles.content}>
            <PDFRecipient recipient={data.recipient} company={data.company} />
            <PDFIntro quote={data.quote} recipient={data.recipient} company={data.company} clientSignature={data.clientSignature} />
            <PDFSections sections={data.sections} company={data.company} />
            <PDFTotals totals={data.totals} company={data.company} />
            <PDFOptionBlocks
              optionBlocks={data.optionBlocks}
              signatureFrame={data.signatureFrame}
              company={data.company}
            />
            {data.busServices && (
              <PDFBusServices
                busServices={data.busServices}
                companyColor={data.company.mainColor}
              />
            )}
            <PDFClientSignature clientSignature={data.clientSignature} company={data.company} />
            {data.carbonImpact && <PDFCarbonImpact carbonImpact={data.carbonImpact} />}
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {/* PAGE 1: INTRODUCTION - Destinataire et introduction du devis */}
      <Page size="A4" style={pageStyles.page} wrap>
        <PDFHeader company={data.company} quote={data.quote} />
        <PDFFooter footer={data.footer} company={data.company} />
        <View style={pageStyles.content}>
          <PDFRecipient recipient={data.recipient} company={data.company} />
          <PDFIntro quote={data.quote} recipient={data.recipient} company={data.company} clientSignature={data.clientSignature} />
        </View>
      </Page>

      {/* PAGE 2: PROGRAMME - Programme de voyage, services bus et impact carbone */}
      <Page size="A4" style={pageStyles.page} wrap>
        <PDFHeader company={data.company} quote={data.quote} />
        <PDFFooter footer={data.footer} company={data.company} />
        <View style={pageStyles.content}>
          {programmeBlock && (
            <PDFOptionBlocks
              optionBlocks={[programmeBlock]}
              signatureFrame={undefined}
              company={data.company}
            />
          )}
          {data.busServices && (
            <PDFBusServices
              busServices={data.busServices}
              companyColor={data.company.mainColor}
            />
          )}
          {data.carbonImpact && <PDFCarbonImpact carbonImpact={data.carbonImpact} />}
        </View>
      </Page>

      {/* PAGE 3: COTATION - Détail des prix et totaux */}
      <Page size="A4" style={pageStyles.page} wrap>
        <PDFHeader company={data.company} quote={data.quote} />
        <PDFFooter footer={data.footer} company={data.company} />
        <View style={pageStyles.content}>
          <PDFSections sections={data.sections} company={data.company} />
          <PDFTotals totals={data.totals} company={data.company} />
        </View>
      </Page>

      {/* PAGE 4: CONDITIONS - Ce qui est compris / non compris */}
      <Page size="A4" style={pageStyles.page} wrap>
        <PDFHeader company={data.company} quote={data.quote} />
        <PDFFooter footer={data.footer} company={data.company} />
        <View style={pageStyles.content}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: data.company.mainColor || '#0066cc',
            marginBottom: 20,
            letterSpacing: 0.3,
          }}>
            Conditions générales
          </Text>
          <PDFOptionBlocks
            optionBlocks={otherBlocks}
            signatureFrame={undefined}
            company={data.company}
            neutralStyle={true}
          />
        </View>
      </Page>

      {/* PAGE 5: BON DE COMMANDE - Signature et validation */}
      <Page size="A4" style={pageStyles.page} wrap>
        <PDFHeader company={data.company} quote={data.quote} />
        <PDFFooter footer={data.footer} company={data.company} />
        <View style={pageStyles.content}>
          <PDFOrderForm
            signatureFrame={data.signatureFrame}
            recipient={data.recipient}
            company={data.company}
          />
        </View>
      </Page>
    </Document>
  );
};
