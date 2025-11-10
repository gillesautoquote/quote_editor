import type { QuoteData, OptionBlock, DocumentSectionLabel } from '../entities/QuoteData';

export interface PDFSection {
  id: string;
  label: string;
  enabled: boolean;
}

const DEFAULT_SECTION_LABELS: Record<string, string> = {
  programme: 'Le **programme détaillé** de votre voyage',
  cotation: 'La **cotation précise** du trajet demandé',
  conditions: 'Nos **conditions générales de vente**',
  services: 'Les **services disponibles** à bord',
  impact: 'L\'**impact carbone** de votre trajet',
  bon_commande: 'Un **bon de commande** à retourner signé'
};

export const generatePDFSectionsList = (data: QuoteData, visibleTabIds?: string[]): string => {
  const sections: PDFSection[] = [];

  const customLabels: Record<string, string> = {};
  if (data.labels?.introductionSections) {
    data.labels.introductionSections.forEach((section: DocumentSectionLabel) => {
      customLabels[section.id] = section.label;
    });
  }

  const getLabel = (id: string): string => {
    return customLabels[id] || DEFAULT_SECTION_LABELS[id] || '';
  };

  const isTabVisible = (tabId: string) => {
    if (!visibleTabIds || visibleTabIds.length === 0) return true;
    return visibleTabIds.includes(tabId);
  };

  const programmeBlock = data.optionBlocks?.find(
    (block: OptionBlock) => block.type === 'programme-voyage'
  );
  if (isTabVisible('programme') && programmeBlock && programmeBlock.tripSteps && programmeBlock.tripSteps.length > 0) {
    sections.push({
      id: 'programme',
      label: getLabel('programme'),
      enabled: true
    });
  }

  if (isTabVisible('cotation') && data.sections && data.sections.length > 0) {
    sections.push({
      id: 'cotation',
      label: getLabel('cotation'),
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
  if (isTabVisible('conditions') && hasConditions) {
    sections.push({
      id: 'conditions',
      label: getLabel('conditions'),
      enabled: true
    });
  }

  const hasServices = data.busServices && data.busServices.services && data.busServices.services.length > 0;
  const hasImpact = data.carbonImpact && data.carbonImpact.co2Amount;
  if (isTabVisible('services') && (hasServices || hasImpact)) {
    if (hasServices) {
      const availableServices = data.busServices.services.filter(service => service.available);
      if (availableServices.length > 0) {
        sections.push({
          id: 'services',
          label: getLabel('services'),
          enabled: true
        });
      }
    }
    if (hasImpact) {
      sections.push({
        id: 'impact',
        label: getLabel('impact'),
        enabled: true
      });
    }
  }

  if (isTabVisible('signature') && data.signatureFrame) {
    sections.push({
      id: 'bon_commande',
      label: getLabel('bon_commande'),
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
