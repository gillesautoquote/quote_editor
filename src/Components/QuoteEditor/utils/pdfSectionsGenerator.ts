import type { QuoteData, OptionBlock } from '../entities/QuoteData';

export interface PDFSection {
  id: string;
  label: string;
  enabled: boolean;
}

export const generatePDFSectionsList = (data: QuoteData): string => {
  const sections: PDFSection[] = [];

  const programmeBlock = data.optionBlocks?.find(
    (block: OptionBlock) => block.type === 'programme-voyage'
  );
  if (programmeBlock && programmeBlock.tripSteps && programmeBlock.tripSteps.length > 0) {
    sections.push({
      id: 'programme',
      label: 'Le **programme détaillé** de votre voyage',
      enabled: true
    });
  }

  if (data.sections && data.sections.length > 0) {
    sections.push({
      id: 'cotation',
      label: 'La **cotation précise** du trajet demandé',
      enabled: true
    });
  }

  const hasConditions = data.optionBlocks?.some(
    (block: OptionBlock) =>
      block.type === 'list' &&
      (block.id === 'included_fees' || block.id === 'excluded_fees') &&
      block.rows &&
      block.rows.length > 0
  );
  if (hasConditions) {
    sections.push({
      id: 'conditions',
      label: 'Nos **conditions générales de vente**',
      enabled: true
    });
  }

  if (sections.length === 0) {
    return '';
  }

  const sectionsList = sections
    .filter(s => s.enabled)
    .map(s => `- ${s.label}`)
    .join('\n');

  return `\n\nCe document comprend :\n${sectionsList}`;
};
