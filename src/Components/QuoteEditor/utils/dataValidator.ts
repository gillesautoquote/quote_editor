/**
 * Utilitaires pour valider et normaliser les données QuoteData
 */
import type { QuoteData, QuoteSection, OptionBlock } from '../entities/QuoteData';

/**
 * Normalise les données QuoteData pour s'assurer que toutes les propriétés requises existent
 */
export const normalizeQuoteData = (data: Partial<QuoteData>): QuoteData => {
  const defaultQuoteData: QuoteData = {
    company: {
      logoUrl: '',
      name: '',
      address: '',
      postalCode: '',
      city: '',
      country: '',
      phone: '',
      email: '',
      website: '',
      mainColor: '#0066cc'
    },
    recipient: {
      fullName: '',
      title: '',
      organization: '',
      address: '',
      postalCode: '',
      city: '',
      country: '',
      email: '',
      phone: '',
      clientReference: ''
    },
    quote: {
      number: '',
      version: '1.0',
      issueDate: new Date().toISOString().split('T')[0],
      executionCity: '',
      tagline: '',
      validUntil: '',
      reference: ''
    },
    sections: [],
    totals: { ht: 0, tva: 0, ttc: 0 },
    validityNotice: 'Les prix sont valables 30 jours à compter de la date d\'émission.',
    optionBlocks: [],
    signatureFrame: {
      beforeLines: [],
      afterLines: []
    },
    clientSignature: {
      tagline: '',
      title: '',
      fullName: ''
    },
    termsNotice: 'Conditions générales disponibles sur notre site web.',
    footer: {
      copyright: '',
      confidentialNotice: 'Document confidentiel — reproduction interdite.',
      address: '',
      postalCode: '',
      city: '',
      country: '',
      phone: '',
      rcs: '',
      siret: '',
      tva: '',
      website: '',
      iban: '',
      bic: ''
    },
    selectDefinitions: {}
  };

  // ✅ Normaliser les sections individuellement
  const normalizedSections = (data.sections || []).map(section => normalizeSection(section));
  
  // ✅ Normaliser les blocs d'options individuellement
  const normalizedOptionBlocks = (data.optionBlocks || []).map(block => normalizeOptionBlock(block));

  return {
    ...defaultQuoteData,
    ...data,
    // ✅ Assurer que les tableaux existent toujours
    sections: normalizedSections,
    optionBlocks: normalizedOptionBlocks,
    // ✅ Normaliser les objets imbriqués
    company: { ...defaultQuoteData.company, ...data.company },
    recipient: { ...defaultQuoteData.recipient, ...data.recipient },
    quote: { ...defaultQuoteData.quote, ...data.quote },
    totals: { ...defaultQuoteData.totals, ...data.totals },
    signatureFrame: {
      beforeLines: data.signatureFrame?.beforeLines || [],
      afterLines: data.signatureFrame?.afterLines || []
    },
    clientSignature: { ...defaultQuoteData.clientSignature, ...data.clientSignature },
    footer: { ...defaultQuoteData.footer, ...data.footer },
    selectDefinitions: data.selectDefinitions || {}
  };
};

/**
 * Valide qu'une QuoteData a toutes les propriétés nécessaires
 */
export const validateQuoteData = (data: any): data is QuoteData => {
  try {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.sections) &&
      Array.isArray(data.optionBlocks) &&
      data.company &&
      data.recipient &&
      data.quote &&
      data.totals &&
      data.signatureFrame &&
      data.clientSignature &&
      data.footer
    );
  } catch {
    return false;
  }
};

/**
 * Assure qu'une section a toutes les propriétés nécessaires
 */
export const normalizeSection = (section: Partial<QuoteSection>): QuoteSection => {
  return {
    title: section.title || 'Section sans titre',
    lines: section.lines || [],
    subTotal: section.subTotal || { ht: 0, tva: 0, ttc: 0 },
    columns: section.columns,
    missionsLines: section.missionsLines || [],
    simplesLinesSelect: section.simplesLinesSelect || []
  };
};

/**
 * Assure qu'un bloc d'option a toutes les propriétés nécessaires
 */
export const normalizeOptionBlock = (block: Partial<OptionBlock>): OptionBlock => {
  const normalized: OptionBlock = {
    id: block.id || `block_${Date.now()}`,
    title: block.title || 'Bloc sans titre',
    color: block.color || '#0066cc',
    columns: block.columns || 3,
    showTitle: block.showTitle !== false,
    allowWidthControl: block.allowWidthControl !== false,
    type: block.type || 'list',
    rows: block.rows || [],
    notes: block.notes || []
  };

  if (block.type === 'programme-voyage') {
    normalized.tripSteps = block.tripSteps || [];
    normalized.tripFilters = block.tripFilters;
    normalized.defaultFilters = block.defaultFilters;
  }

  return normalized;
};