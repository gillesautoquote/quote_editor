import React, { useMemo } from 'react';
// Import explicite des styles scoped pour garantir qu'ils sont présents
// même dans le mode print (/print) qui n'utilise pas directement QuoteEditor/index.ts
import '../../styles/quote-editor-scoped.css';
import '../../styles/quote-editor-utilities.css';
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
import { BusServicesBlock } from '../BusServices/BusServicesBlock';
import { EditableField } from '../EditableField/EditableField';
import { useFieldPath } from '../../hooks/useFieldPath';
import { formatCopyright, formatUrl } from './utils/textFormatters';
import { calculateGlobalTotals } from '../../utils/calculationUtils';
import { createProgrammeVoyageBlock } from '../../utils/itineraryConverters';
import { useEffect } from 'react';
import { useColorTheme } from '../../hooks/useColorTheme';

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
  const { applyColorVariables } = useColorTheme(data.company);

  useEffect(() => {
    if (data?.company?.mainColor) {
      applyColorVariables();
    }
  }, [data?.company?.mainColor, applyColorVariables]);

  const dataWithProgrammeVoyage = useMemo(() => {
    if (!data || !data.sections || !data.optionBlocks) {
      return data;
    }

    if (data.itinerary && data.itinerary.length > 0) {
      const hasProgrammeVoyageBlock = data.optionBlocks.some(
        block => block.type === 'programme-voyage'
      );

      if (!hasProgrammeVoyageBlock) {
        const programmeTitle = data.labels?.pageTitles?.programme;
        const programmeVoyageBlock = createProgrammeVoyageBlock(
          data.itinerary,
          data.company.mainColor,
          data.defaultProgrammeFilters,
          programmeTitle
        );
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
    const newTotals = calculateGlobalTotals(newSections, dataWithProgrammeVoyage.totals?.vatBreakdown);
    const newData = { ...dataWithProgrammeVoyage, sections: newSections, totals: newTotals };
    onUpdateData(newData);
  };

  const programmeBlock = dataWithProgrammeVoyage.optionBlocks.find(block => block.type === 'programme-voyage');
  const conditionBlocks = dataWithProgrammeVoyage.optionBlocks.filter(block => block.type !== 'programme-voyage');

  const isTabVisible = (tabId: string): boolean => {
    if (!dataWithProgrammeVoyage.visibleTabIds || dataWithProgrammeVoyage.visibleTabIds.length === 0) {
      return true;
    }
    return dataWithProgrammeVoyage.visibleTabIds.includes(tabId);
  };

  const getOrderedTabIds = (): string[] => {
    if (!dataWithProgrammeVoyage.visibleTabIds || dataWithProgrammeVoyage.visibleTabIds.length === 0) {
      return ['introduction', 'programme', 'services', 'cotation', 'conditions', 'signature'];
    }
    return dataWithProgrammeVoyage.visibleTabIds;
  };

  const renderSection = (tabId: string) => {
    if (!isTabVisible(tabId)) return null;

    switch (tabId) {
      case 'introduction':
        return null;

      case 'programme':
        if (programmeBlock && programmeBlock.type === 'programme-voyage' && programmeBlock.tripSteps) {
          const programmeTitle = dataWithProgrammeVoyage.labels?.pageTitles?.programme || programmeBlock.title || 'Programme de voyage';
          return (
            <div key="programme" className="tw-mb-4 page-break-inside-avoid" data-section="programme">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4 qe-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="programme">
                {programmeTitle}
              </h2>
              <TripProgramBlock
                steps={programmeBlock.tripSteps}
                filters={programmeBlock.tripFilters || dataWithProgrammeVoyage.defaultProgrammeFilters || {
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
                companyColor={dataWithProgrammeVoyage.company.mainColor}
                blockId={programmeBlock.id}
              />
            </div>
          );
        }
        return null;

      case 'services':
        return (
          <React.Fragment key="services">
            {dataWithProgrammeVoyage.busServices && (
              <div className="tw-mb-4 page-break-inside-avoid" data-section="services">
                <h2 className="tw-text-xl tw-font-semibold tw-mb-4 qe-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="services">
                  {dataWithProgrammeVoyage.labels?.pageTitles?.services || 'Services à l\'intérieur'}
                </h2>
                <BusServicesBlock
                  busServices={dataWithProgrammeVoyage.busServices}
                  onUpdateServices={(services) => {
                    const newData = { ...dataWithProgrammeVoyage, busServices: services };
                    onUpdateData(newData);
                  }}
                  companyColor={dataWithProgrammeVoyage.company.mainColor}
                  readonly={readonly}
                  showOnlyAvailable={true}
                />
              </div>
            )}
            {dataWithProgrammeVoyage.carbonImpact && (
              <div className="tw-mb-4 page-break-inside-avoid" data-section="carbon-impact">
                <h2 className="tw-text-xl tw-font-semibold tw-mb-4 qe-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="carbon-impact">
                  Impact carbone
                </h2>
                <CarbonImpact
                  carbonImpact={dataWithProgrammeVoyage.carbonImpact}
                  onUpdateCarbonImpact={(carbonImpact) =>
                    onUpdateData({ ...dataWithProgrammeVoyage, carbonImpact })
                  }
                  readonly={readonly}
                  printMode={printMode}
                  mainColor={dataWithProgrammeVoyage.company?.mainColor}
                />
              </div>
            )}
          </React.Fragment>
        );

      case 'cotation':
        return (
          <React.Fragment key="cotation">
            <div className="tw-mb-4" data-section="cotation">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4 qe-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="cotation">
                {dataWithProgrammeVoyage.labels?.pageTitles?.cotation || 'Cotation détaillée'}
              </h2>
              {(dataWithProgrammeVoyage.sections || []).map((section, sectionIndex) => (
                <QuoteSectionComponent
                  key={sectionIndex}
                  section={section}
                  sectionIndex={sectionIndex}
                  onUpdateSection={(updatedSection) => {
                    const newSections = [...dataWithProgrammeVoyage.sections];
                    newSections[sectionIndex] = updatedSection;
                    const newTotals = calculateGlobalTotals(newSections, dataWithProgrammeVoyage.totals?.vatBreakdown);
                    const newData = { ...dataWithProgrammeVoyage, sections: newSections, totals: newTotals };
                    onUpdateData(newData);
                  }}
                  onRemoveSection={() => handleRemoveSection(sectionIndex)}
                  readonly={readonly}
                  printMode={printMode}
                />
              ))}
            </div>
            <QuotePageTotals
              totals={dataWithProgrammeVoyage.totals}
              mainColor={dataWithProgrammeVoyage.company.mainColor}
              printMode={printMode}
            />
            <div className="tw-flex tw-justify-end tw-mb-4">
              <EditableField
                value={dataWithProgrammeVoyage.validityNotice || ''}
                onSave={(value) => handleFieldUpdate('validityNotice', value)}
                disabled={readonly}
                className="tw-text-sm qe-text-text-muted tw-italic"
                printMode={printMode}
              />
            </div>
          </React.Fragment>
        );

      case 'conditions':
        return (
          <div key="conditions" className="tw-mb-4" data-section="conditions">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4 qe-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="conditions">
              {dataWithProgrammeVoyage.labels?.pageTitles?.conditions || 'Conditions générales'}
            </h2>
            <BlocksContainer
              optionBlocks={conditionBlocks}
              signatureFrame={dataWithProgrammeVoyage.signatureFrame}
              selectDefinitions={dataWithProgrammeVoyage.selectDefinitions}
              onUpdateOptionBlock={(blockIndex, updatedBlock) => {
                const targetBlock = conditionBlocks[blockIndex];
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
              companyColor={dataWithProgrammeVoyage.company.mainColor}
            />
          </div>
        );

      case 'signature':
        return (
          <div key="signature" className="tw-mb-4" data-section="signature">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4 qe-text-primary print:tw-text-lg print:tw-mb-2" data-section-title="order-form">
              {dataWithProgrammeVoyage.labels?.pageTitles?.signature || 'Bon de commande'}
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
            <div className="tw-flex tw-justify-center tw-mb-4">
              <EditableField
                value={dataWithProgrammeVoyage.termsNotice || ''}
                onSave={(value) => handleFieldUpdate('termsNotice', value)}
                disabled={readonly}
                className="tw-text-sm qe-text-text-muted tw-italic"
                printMode={printMode}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      data-quote-editor-scope
      className="tw-w-full tw-max-w-[21cm] tw-bg-white tw-shadow-page tw-px-12 tw-py-8 tw-mx-auto tw-relative tw-flex tw-flex-col qe-text-text tw-min-h-auto tw-rounded-lg tw-border tw-border-black/10 print:tw-shadow-none print:tw-m-0 print:tw-rounded-none print:tw-border-none print:tw-w-[21cm] print:tw-px-[1.5cm] print:tw-py-0"
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
            company={data.company}
          />

          <QuotePageIntro
            quote={dataWithProgrammeVoyage.quote}
            recipient={dataWithProgrammeVoyage.recipient}
            clientSignature={dataWithProgrammeVoyage.clientSignature}
            onFieldUpdate={handleFieldUpdate}
            readonly={readonly}
            printMode={printMode}
            data={dataWithProgrammeVoyage}
            visibleTabIds={dataWithProgrammeVoyage.visibleTabIds}
          />

          {getOrderedTabIds().map(tabId => renderSection(tabId))}
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
