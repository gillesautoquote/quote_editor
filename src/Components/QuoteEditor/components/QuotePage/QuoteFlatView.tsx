import React, { useMemo } from 'react';
import type { QuoteData } from '../../entities/QuoteData';
import { QuoteSection as QuoteSectionComponent } from '../QuoteSection/QuoteSection';
import { SignatureSection } from '../SignatureSection/SignatureSection';
import { BlocksContainer } from '../shared/BlocksContainer';
import { TripProgramBlock } from '../OptionBlock/components/TripProgramBlock';
import { InstructionsFrame } from '../InstructionsFrame/InstructionsFrame';
import { QuotePageHeader } from './components/QuotePageHeader';
import { QuotePageRecipient } from './components/QuotePageRecipient';
import { QuotePageIntro } from './components/QuotePageIntro';
import { QuotePageTotals } from './components/QuotePageTotals';
import { QuotePageFooter } from './components/QuotePageFooter';
import { CarbonImpact } from '../CarbonImpact/CarbonImpact';
import { useFieldPath } from '../../hooks/useFieldPath';
import { formatCopyright, formatUrl } from './utils/textFormatters';
import { calculateGlobalTotals } from '../../utils/calculationUtils';
import { createProgrammeVoyageBlock } from '../../utils/itineraryConverters';

interface QuoteFlatViewProps {
  data: QuoteData;
  onUpdateData: (newData: QuoteData) => void;
  readonly?: boolean;
  printMode?: boolean;
  allowWidthControl?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const QuoteFlatView: React.FC<QuoteFlatViewProps> = ({
  data,
  onUpdateData,
  readonly = false,
  printMode = false,
  allowWidthControl = true,
  showHeader = true,
  showFooter = true
}) => {
  const { setValueByPath } = useFieldPath();

  const dataWithProgrammeVoyage = useMemo(() => {
    if (!data || !data.sections || !data.optionBlocks) {
      return data;
    }

    if (data.itinerary && data.itinerary.length > 0) {
      const hasProgrammeVoyageBlock = data.optionBlocks.some(
        block => block.type === 'programme-voyage'
      );

      if (!hasProgrammeVoyageBlock) {
        const programmeVoyageBlock = createProgrammeVoyageBlock(data.itinerary, data.company.mainColor);
        return {
          ...data,
          optionBlocks: [programmeVoyageBlock, ...data.optionBlocks]
        };
      }
    }

    return data;
  }, [data]);

  if (!dataWithProgrammeVoyage || !dataWithProgrammeVoyage.sections || !dataWithProgrammeVoyage.optionBlocks) {
    return <div>Chargement des données...</div>;
  }

  const handleFieldUpdate = (path: string, value: string): void => {
    if (readonly) return;
    const newData = setValueByPath(dataWithProgrammeVoyage, path, value);
    onUpdateData(newData);
  };

  const handleCompanyNameUpdate = (value: string): void => {
    if (readonly) return;
    const newCopyright = formatCopyright(value);
    handleFieldUpdate('footer.copyright', newCopyright);
  };

  const handleWebsiteUpdate = (value: string): void => {
    if (readonly) return;
    const formattedUrl = formatUrl(value);
    handleFieldUpdate('footer.website', formattedUrl);
  };

  const handleRemoveSection = (sectionIndex: number): void => {
    if (readonly) return;
    const newSections = dataWithProgrammeVoyage.sections.filter((_, index) => index !== sectionIndex);
    const newTotals = calculateGlobalTotals(newSections);
    const newData = { ...dataWithProgrammeVoyage, sections: newSections, totals: newTotals };
    onUpdateData(newData);
  };

  const programmeBlock = dataWithProgrammeVoyage.optionBlocks.find(block => block.type === 'programme-voyage');
  const conditionBlocks = dataWithProgrammeVoyage.optionBlocks.filter(block => block.type !== 'programme-voyage');
  const busServicesBlock = conditionBlocks.find(block => block.id === 'bus_services' || block.title?.toLowerCase().includes('service'));

  return (
    <div
      className="tw-w-full tw-max-w-[21cm] tw-bg-white tw-shadow-page tw-px-12 tw-py-8 tw-mx-auto tw-relative tw-flex tw-flex-col tw-text-text tw-min-h-auto tw-rounded-lg tw-border tw-border-black/10 print:tw-shadow-none print:tw-m-0 print:tw-rounded-none print:tw-border-none print:tw-w-[21cm] print:tw-px-[1.5cm] print:tw-py-0"
      data-component="quote-flat-view"
      data-print-mode={printMode}
    >
      {showHeader && (
        <QuotePageHeader
          company={dataWithProgrammeVoyage.company}
          quote={dataWithProgrammeVoyage.quote}
          onFieldUpdate={handleFieldUpdate}
          readonly={readonly}
          printMode={printMode}
        />
      )}

      <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-between">
        <div className="tw-flex-1">
          <QuotePageRecipient
            recipient={dataWithProgrammeVoyage.recipient}
            onFieldUpdate={handleFieldUpdate}
            readonly={readonly}
            printMode={printMode}
          />

          <QuotePageIntro
            quote={dataWithProgrammeVoyage.quote}
            recipient={dataWithProgrammeVoyage.recipient}
            clientSignature={dataWithProgrammeVoyage.clientSignature}
            onFieldUpdate={handleFieldUpdate}
            readonly={readonly}
            printMode={printMode}
          />

          {programmeBlock && programmeBlock.type === 'programme-voyage' && programmeBlock.tripSteps && (
            <div className="tw-mb-4 page-break-inside-avoid" data-section="programme">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="programme">
                {programmeBlock.title || 'Programme de voyage'}
              </h2>
              <TripProgramBlock
                steps={programmeBlock.tripSteps}
                filters={programmeBlock.tripFilters || {
                  depart: true,
                  arrivee: true,
                  mise_en_place: true,
                  retour: false,
                  excludeDepot: true
                }}
                onUpdateSteps={(steps) => {
                  const realIndex = dataWithProgrammeVoyage.optionBlocks.findIndex(b => b.id === programmeBlock.id);
                  const newBlocks = [...dataWithProgrammeVoyage.optionBlocks];
                  newBlocks[realIndex] = { ...programmeBlock, tripSteps: steps };
                  const newData = { ...dataWithProgrammeVoyage, optionBlocks: newBlocks };
                  onUpdateData(newData);
                }}
                onUpdateFilters={(filters) => {
                  const realIndex = dataWithProgrammeVoyage.optionBlocks.findIndex(b => b.id === programmeBlock.id);
                  const newBlocks = [...dataWithProgrammeVoyage.optionBlocks];
                  newBlocks[realIndex] = { ...programmeBlock, tripFilters: filters };
                  const newData = { ...dataWithProgrammeVoyage, optionBlocks: newBlocks };
                  onUpdateData(newData);
                }}
                readonly={readonly}
                printMode={printMode}
                blockColor={programmeBlock.color || dataWithProgrammeVoyage.company.mainColor}
              />
            </div>
          )}

          {busServicesBlock && (
            <div className="tw-mb-4 page-break-inside-avoid" data-section="services">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="services">
                {busServicesBlock.title || 'Services'}
              </h2>
              <BlocksContainer
                optionBlocks={[busServicesBlock]}
                signatureFrame={dataWithProgrammeVoyage.signatureFrame}
                selectDefinitions={dataWithProgrammeVoyage.selectDefinitions}
                onUpdateOptionBlock={(blockIndex, updatedBlock) => {
                  const realIndex = dataWithProgrammeVoyage.optionBlocks.findIndex(b => b.id === busServicesBlock.id);
                  const newBlocks = [...dataWithProgrammeVoyage.optionBlocks];
                  newBlocks[realIndex] = updatedBlock;
                  const newData = { ...dataWithProgrammeVoyage, optionBlocks: newBlocks };
                  onUpdateData(newData);
                }}
                onRemoveOptionBlock={() => {}}
                onReorderBlocks={() => {}}
                onUpdateSignatureFrame={() => {}}
                readonly={readonly}
                showBlockControls={false}
                allowWidthControl={allowWidthControl}
                printMode={printMode}
              />
            </div>
          )}

          {dataWithProgrammeVoyage.carbonImpact && (
            <div className="tw-mb-4 page-break-inside-avoid" data-section="carbon-impact">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="carbon-impact">
                Impact carbone
              </h2>
              <CarbonImpact
                carbonImpact={dataWithProgrammeVoyage.carbonImpact}
                onUpdateCarbonImpact={(carbonImpact) =>
                  onUpdateData({ ...dataWithProgrammeVoyage, carbonImpact })
                }
                readonly={readonly}
                printMode={printMode}
              />
            </div>
          )}

          <div className="tw-mb-4" data-section="cotation">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="cotation">
              Cotation détaillée
            </h2>
            {(dataWithProgrammeVoyage.sections || []).map((section, sectionIndex) => (
              <QuoteSectionComponent
                key={sectionIndex}
                section={section}
                sectionIndex={sectionIndex}
                onUpdateSection={(updatedSection) => {
                  const newSections = [...dataWithProgrammeVoyage.sections];
                  newSections[sectionIndex] = updatedSection;
                  const newTotals = calculateGlobalTotals(newSections);
                  const newData = { ...dataWithProgrammeVoyage, sections: newSections, totals: newTotals };
                  onUpdateData(newData);
                }}
                onRemoveSection={() => handleRemoveSection(sectionIndex)}
                readonly={readonly}
                printMode={printMode}
              />
            ))}
          </div>

          <QuotePageTotals totals={dataWithProgrammeVoyage.totals} />

          <div className="tw-mb-4" data-section="conditions">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="conditions">
              Conditions générales
            </h2>
            <BlocksContainer
              optionBlocks={conditionBlocks.filter(b => b.id !== busServicesBlock?.id)}
              signatureFrame={dataWithProgrammeVoyage.signatureFrame}
              selectDefinitions={dataWithProgrammeVoyage.selectDefinitions}
              onUpdateOptionBlock={(blockIndex, updatedBlock) => {
                const filteredBlocks = conditionBlocks.filter(b => b.id !== busServicesBlock?.id);
                const targetBlock = filteredBlocks[blockIndex];
                const realIndex = dataWithProgrammeVoyage.optionBlocks.findIndex(b => b.id === targetBlock.id);
                const newBlocks = [...dataWithProgrammeVoyage.optionBlocks];
                newBlocks[realIndex] = updatedBlock;
                const newData = { ...dataWithProgrammeVoyage, optionBlocks: newBlocks };
                onUpdateData(newData);
              }}
              onRemoveOptionBlock={() => {}}
              onReorderBlocks={(newBlocks) => {
                const newData = { ...dataWithProgrammeVoyage, optionBlocks: newBlocks };
                onUpdateData(newData);
              }}
              onUpdateSignatureFrame={(frame) => {
                const newData = { ...dataWithProgrammeVoyage, signatureFrame: frame };
                onUpdateData(newData);
              }}
              readonly={readonly}
              showBlockControls={false}
              allowWidthControl={allowWidthControl}
              printMode={printMode}
            />
          </div>

          <div className="page-break-inside-avoid" data-section="order-form">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="order-form">
              Bon de commande
            </h2>
            <InstructionsFrame
              signatureFrame={dataWithProgrammeVoyage.signatureFrame}
              onUpdateSignatureFrame={(frame) => {
                const newData = { ...dataWithProgrammeVoyage, signatureFrame: frame };
                onUpdateData(newData);
              }}
              recipient={dataWithProgrammeVoyage.recipient}
              onUpdateRecipient={(recipient) => {
                const newData = { ...dataWithProgrammeVoyage, recipient };
                onUpdateData(newData);
              }}
              readonly={readonly}
            />
            <SignatureSection
              clientSignature={dataWithProgrammeVoyage.clientSignature}
              onUpdateClientSignature={(signature) => {
                const newData = { ...dataWithProgrammeVoyage, clientSignature: signature };
                onUpdateData(newData);
              }}
              readonly={readonly}
              printMode={printMode}
            />
          </div>
        </div>

        {showFooter && (
          <QuotePageFooter
            footer={dataWithProgrammeVoyage.footer}
            onFieldUpdate={handleFieldUpdate}
            onCompanyNameUpdate={handleCompanyNameUpdate}
            onWebsiteUpdate={handleWebsiteUpdate}
            readonly={readonly}
            printMode={printMode}
          />
        )}
      </div>
    </div>
  );
};
