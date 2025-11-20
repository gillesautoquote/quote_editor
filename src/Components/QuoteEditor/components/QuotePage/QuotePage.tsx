import React, { useRef } from 'react';
import { useEffect, useMemo } from 'react';
import type { QuoteData } from '../../entities/QuoteData';
import { QuoteSection as QuoteSectionComponent } from '../QuoteSection/QuoteSection';
import { SignatureSection } from '../SignatureSection/SignatureSection';
import { BlocksContainer } from '../shared/BlocksContainer';
import { QuotePageHeader } from './components/QuotePageHeader';
import { QuotePageRecipient } from './components/QuotePageRecipient';
import { QuotePageIntro } from './components/QuotePageIntro';
import { QuotePageTotals } from './components/QuotePageTotals';
import { QuotePageFooter } from './components/QuotePageFooter';
import { CarbonImpact } from '../CarbonImpact/CarbonImpact';
import { EditableField } from '../EditableField/EditableField';
import { useFieldPath } from '../../hooks/useFieldPath';
import { useColorTheme } from '../../hooks/useColorTheme';
import { formatCopyright, formatUrl } from './utils/textFormatters';
import { calculateGlobalTotals, calculateVATBreakdownFromProps } from '../../utils/calculationUtils';
import { createProgrammeVoyageBlock } from '../../utils/itineraryConverters';

interface PageContentConfig {
  sections: number[];
  optionBlocks: number[];
  showRecipient: boolean;
  showTotals: boolean;
  showSignature: boolean;
}

interface QuotePageProps {
  data: QuoteData;
  onUpdateData: (newData: QuoteData) => void;
  contentConfig: PageContentConfig;
  readonly?: boolean;
  allowWidthControl?: boolean;
  printMode?: boolean;
}

export const QuotePage: React.FC<QuotePageProps> = ({
  data,
  onUpdateData,
  contentConfig,
  readonly = false,
  allowWidthControl = true,
  printMode = false
}) => {
  const { setValueByPath } = useFieldPath();
  const { applyColorVariables } = useColorTheme(data.company);

  // Stocker le breakdown initial provenant des props
  const initialVatBreakdownRef = useRef(calculateVATBreakdownFromProps(data.sections));

  console.log('[QuotePage] Rendering with data:', {
    hasItinerary: !!data?.itinerary,
    itineraryLength: data?.itinerary?.length,
    itinerary: data?.itinerary
  });

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

  // Supprimé : Ce useEffect créait une boucle infinie
  // La logique de création du programme voyage est maintenant gérée dans le render
  // Si le programme voyage doit être ajouté, cela sera fait lors de la première modification par l'utilisateur

  if (!dataWithProgrammeVoyage || !dataWithProgrammeVoyage.sections || !dataWithProgrammeVoyage.optionBlocks) {
    return <div>Chargement des données...</div>;
  }

  useEffect(() => {
    applyColorVariables();
  }, [dataWithProgrammeVoyage.company.mainColor, applyColorVariables]);

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

  const handleRemoveOptionBlock = (blockIndex: number): void => {
    if (readonly) return;
    const realIndex = contentConfig.optionBlocks[blockIndex];
    const newBlocks = dataWithProgrammeVoyage.optionBlocks.filter((_, index) => index !== realIndex);
    const newData = { ...dataWithProgrammeVoyage, optionBlocks: newBlocks };
    onUpdateData(newData);
  };

  const handleRemoveSection = (sectionIndex: number): void => {
    if (readonly) return;
    const newSections = dataWithProgrammeVoyage.sections.filter((_, index) => index !== sectionIndex);

    const newTotals = calculateGlobalTotals(newSections, dataWithProgrammeVoyage.totals?.vatBreakdown);

    const newData = { ...dataWithProgrammeVoyage, sections: newSections, totals: newTotals };
    onUpdateData(newData);
  };

  return (
    <div
      data-quote-editor-scope
      className="tw-w-full tw-max-w-[min(1000px,calc(100vw-2rem))] tw-bg-white tw-shadow-page tw-px-12 tw-py-8 tw-mx-auto tw-relative tw-flex tw-flex-col qe-text-text tw-min-h-auto tw-rounded-lg tw-border tw-border-black/10 md:tw-px-6 md:tw-py-6 md:tw-rounded md:tw-shadow-sm print:tw-shadow-none print:tw-m-0 print:tw-rounded-none print:tw-border-none print:tw-w-[21cm]"
      data-component="quote-page"
      data-print-mode={printMode}
    >
      <QuotePageHeader
        company={dataWithProgrammeVoyage.company}
        quote={dataWithProgrammeVoyage.quote}
        onFieldUpdate={handleFieldUpdate}
        readonly={readonly}
        printMode={printMode}
      />

      <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-between">
        <div className="tw-flex-1">
          {contentConfig.showRecipient && (
            <QuotePageRecipient
              recipient={dataWithProgrammeVoyage.recipient}
              onFieldUpdate={handleFieldUpdate}
              readonly={readonly}
              printMode={printMode}
              company={data.company}
            />
          )}

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

          <div className="tw-mb-4">
            {(contentConfig.sections || []).map((sectionIndex) => (
              <QuoteSectionComponent
                key={sectionIndex}
                section={dataWithProgrammeVoyage.sections[sectionIndex]}
                sectionIndex={sectionIndex}
                onUpdateSection={(updatedSection) => {
                  const newSections = [...dataWithProgrammeVoyage.sections];
                  newSections[sectionIndex] = updatedSection;

                  const newTotals = calculateGlobalTotals(newSections, initialVatBreakdownRef.current);

                  const newData = { ...dataWithProgrammeVoyage, sections: newSections };
                  newData.totals = newTotals;
                  onUpdateData(newData);
                }}
                onRemoveSection={() => handleRemoveSection(sectionIndex)}
                readonly={readonly}
                printMode={printMode}
              />
            ))}
          </div>

          {contentConfig.showTotals && (
            <QuotePageTotals
              totals={dataWithProgrammeVoyage.totals}
              mainColor={dataWithProgrammeVoyage.company.mainColor}
              printMode={printMode}
            />
          )}

          <div className="tw-flex tw-justify-end tw-mb-4">
            <EditableField
              value={dataWithProgrammeVoyage.validityNotice || ''}
              onSave={(value) => handleFieldUpdate('validityNotice', value)}
              disabled={readonly}
              className="tw-text-sm qe-text-text-muted tw-italic"
              printMode={printMode}
            />
          </div>

          <BlocksContainer
            optionBlocks={(contentConfig.optionBlocks || []).map(i => dataWithProgrammeVoyage.optionBlocks[i] || null).filter(Boolean)}
            signatureFrame={dataWithProgrammeVoyage.signatureFrame}
            selectDefinitions={dataWithProgrammeVoyage.selectDefinitions}
            onUpdateOptionBlock={(blockIndex, updatedBlock) => {
              const realIndex = contentConfig.optionBlocks[blockIndex];
              const newBlocks = [...dataWithProgrammeVoyage.optionBlocks];
              newBlocks[realIndex] = updatedBlock;
              const newData = { ...dataWithProgrammeVoyage, optionBlocks: newBlocks };
              onUpdateData(newData);
            }}
            onRemoveOptionBlock={handleRemoveOptionBlock}
            onReorderBlocks={(newBlocks) => {
              const newData = { ...dataWithProgrammeVoyage, optionBlocks: newBlocks };
              onUpdateData(newData);
            }}
            onUpdateSignatureFrame={(frame) => {
              const newData = { ...dataWithProgrammeVoyage, signatureFrame: frame };
              onUpdateData(newData);
            }}
            readonly={readonly}
            showBlockControls={true}
            allowWidthControl={allowWidthControl}
            printMode={printMode}
          />
        </div>

        {contentConfig.showSignature && (
          <>
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
          </>
        )}

        {dataWithProgrammeVoyage.carbonImpact && (
          <CarbonImpact
            carbonImpact={dataWithProgrammeVoyage.carbonImpact}
            onUpdateCarbonImpact={(carbonImpact) =>
              onUpdateData({ ...dataWithProgrammeVoyage, carbonImpact })
            }
            readonly={readonly}
            printMode={printMode}
            mainColor={dataWithProgrammeVoyage.company?.mainColor}
          />
        )}
      </div>

      <QuotePageFooter
        footer={dataWithProgrammeVoyage.footer}
        onFieldUpdate={handleFieldUpdate}
        onCompanyNameUpdate={handleCompanyNameUpdate}
        onWebsiteUpdate={handleWebsiteUpdate}
        readonly={readonly}
        printMode={printMode}
      />
    </div>
  );
};
