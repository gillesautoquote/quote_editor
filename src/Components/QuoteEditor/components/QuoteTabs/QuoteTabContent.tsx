import React, { useMemo, useEffect } from 'react';
import type { QuoteData } from '../../entities/QuoteData';
import { QuotePageHeader } from '../QuotePage/components/QuotePageHeader';
import { QuotePageRecipient } from '../QuotePage/components/QuotePageRecipient';
import { QuotePageIntro } from '../QuotePage/components/QuotePageIntro';
import { QuotePageTotals } from '../QuotePage/components/QuotePageTotals';
import { QuotePageFooter } from '../QuotePage/components/QuotePageFooter';
import { QuoteSection as QuoteSectionComponent } from '../QuoteSection/QuoteSection';
import { SignatureSection } from '../SignatureSection/SignatureSection';
import { InstructionsFrame } from '../InstructionsFrame/InstructionsFrame';
import { CarbonImpact } from '../CarbonImpact/CarbonImpact';
import { BusServicesBlock } from '../BusServices/BusServicesBlock';
import { BlocksContainer } from '../shared/BlocksContainer';
import { TripProgramBlock } from '../OptionBlock/components/TripProgramBlock';
import { EditableField } from '../EditableField/EditableField';
import { calculateGlobalTotals } from '../../utils/calculationUtils';
import { formatCopyright, formatUrl } from '../QuotePage/utils/textFormatters';
import { useFieldPath } from '../../hooks/useFieldPath';
import { createProgrammeVoyageBlock } from '../../utils/itineraryConverters';

interface QuoteTabContentProps {
  activeTab: string;
  visibleTabIds: string[];
  data: QuoteData;
  onUpdateData: (newData: QuoteData) => void;
  readonly?: boolean;
  allowWidthControl?: boolean;
}

export const QuoteTabContent: React.FC<QuoteTabContentProps> = ({
  activeTab,
  visibleTabIds,
  data,
  onUpdateData,
  readonly = false,
  allowWidthControl = true
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

  useEffect(() => {
    if (dataWithProgrammeVoyage !== data) {
      onUpdateData(dataWithProgrammeVoyage);
    }
  }, [dataWithProgrammeVoyage, data, onUpdateData]);

  const currentData = dataWithProgrammeVoyage;

  const handleFieldUpdate = (path: string, value: string): void => {
    if (readonly) return;
    const newData = setValueByPath(currentData, path, value);
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
    const newSections = currentData.sections.filter((_, index) => index !== sectionIndex);
    const newTotals = calculateGlobalTotals(newSections);
    const newData = { ...currentData, sections: newSections, totals: newTotals };
    onUpdateData(newData);
  };

  const programmeBlock = currentData.optionBlocks.find(block => block.type === 'programme-voyage');
  const otherBlocks = currentData.optionBlocks.filter(block => block.type !== 'programme-voyage');

  const renderPageContainer = (children: React.ReactNode, showFooter = true) => (
    <div className="tw-w-full tw-max-w-[min(1000px,calc(100vw-2rem))] tw-bg-white tw-shadow-page tw-px-12 tw-py-8 tw-mx-auto tw-relative tw-flex tw-flex-col tw-text-text tw-min-h-auto tw-rounded-lg tw-border tw-border-black/10 md:tw-px-6 md:tw-py-6 md:tw-rounded md:tw-shadow-sm print:tw-shadow-none print:tw-m-0 print:tw-rounded-none print:tw-border-none print:tw-w-[21cm]" data-screen-a4="true">
      <QuotePageHeader
        company={currentData.company}
        quote={currentData.quote}
        onFieldUpdate={handleFieldUpdate}
        readonly={readonly}
      />
      <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-between">
        <div className="tw-flex-1">
          {children}
        </div>
      </div>
      {showFooter && (
        <QuotePageFooter
          footer={currentData.footer}
          onFieldUpdate={handleFieldUpdate}
          onCompanyNameUpdate={handleCompanyNameUpdate}
          onWebsiteUpdate={handleWebsiteUpdate}
          readonly={readonly}
        />
      )}
    </div>
  );

  switch (activeTab) {
    case 'introduction':
      return renderPageContainer(
        <>
          <QuotePageRecipient
            recipient={currentData.recipient}
            onFieldUpdate={handleFieldUpdate}
            readonly={readonly}
          />
          <QuotePageIntro
            quote={currentData.quote}
            recipient={currentData.recipient}
            clientSignature={currentData.clientSignature}
            onFieldUpdate={handleFieldUpdate}
            readonly={readonly}
            data={currentData}
            visibleTabIds={visibleTabIds}
          />
        </>
      );

    case 'programme':
      return renderPageContainer(
        <>
          <h2 className="tw-text-xl tw-font-bold tw-mb-4" style={{ color: currentData.company.mainColor }}>
            Programme de voyage
          </h2>
          {programmeBlock && programmeBlock.type === 'programme-voyage' && programmeBlock.tripSteps ? (
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
                const updatedBlock = {
                  ...programmeBlock,
                  tripSteps: steps
                };
                const newBlocks = currentData.optionBlocks.map(b =>
                  b.id === updatedBlock.id ? updatedBlock : b
                );
                onUpdateData({ ...currentData, optionBlocks: newBlocks });
              }}
              onUpdateFilters={(filters) => {
                const updatedBlock = {
                  ...programmeBlock,
                  tripFilters: filters
                };
                const newBlocks = currentData.optionBlocks.map(b =>
                  b.id === updatedBlock.id ? updatedBlock : b
                );
                onUpdateData({ ...currentData, optionBlocks: newBlocks });
              }}
              readonly={readonly}
              printMode={false}
              blockColor={currentData.company.mainColor}
            />
          ) : (
            <div className="tw-bg-gray-50 tw-rounded-lg tw-border tw-border-gray-200 tw-p-6 tw-text-center tw-text-sm tw-text-gray-500">
              Aucun programme de voyage disponible
            </div>
          )}

          <div className="tw-mt-6">
            <CarbonImpact
              carbonImpact={currentData.carbonImpact}
              onUpdate={(impact) => onUpdateData({ ...currentData, carbonImpact: impact })}
              readonly={readonly}
            />
          </div>
        </>
      );

    case 'services':
      return renderPageContainer(
        <>
          <h2 className="tw-text-xl tw-font-bold tw-mb-6" style={{ color: currentData.company.mainColor }}>
            Services à l'intérieur
          </h2>
          {currentData.busServices && (
            <BusServicesBlock
              busServices={currentData.busServices}
              companyColor={currentData.company.mainColor}
              readonly={readonly}
              onUpdateServices={(services) => {
                onUpdateData({ ...currentData, busServices: services });
              }}
            />
          )}
        </>
      );

    case 'cotation':
      return renderPageContainer(
        <>
          <div className="tw-mb-4">
            {currentData.sections.map((section, sectionIndex) => (
              <QuoteSectionComponent
                key={sectionIndex}
                section={section}
                sectionIndex={sectionIndex}
                onUpdateSection={(updatedSection) => {
                  const newSections = [...currentData.sections];
                  newSections[sectionIndex] = updatedSection;
                  const newTotals = calculateGlobalTotals(newSections);
                  const newData = { ...currentData, sections: newSections, totals: newTotals };
                  onUpdateData(newData);
                }}
                onRemoveSection={() => handleRemoveSection(sectionIndex)}
                readonly={readonly}
              />
            ))}
          </div>
          <QuotePageTotals totals={currentData.totals} />
          <div className="tw-flex tw-justify-end tw-mb-4">
            <EditableField
              value={currentData.validityNotice || ''}
              onSave={(value) => handleFieldUpdate('validityNotice', value)}
              disabled={readonly}
              className="tw-text-sm tw-text-text-muted tw-italic"
            />
          </div>
        </>
      );

    case 'conditions':
      const hasIncludedBlock = currentData.optionBlocks.some(block =>
        block.title.toLowerCase().includes('ces tarifs comprennent')
      );
      const hasExcludedBlock = currentData.optionBlocks.some(block =>
        block.title.toLowerCase().includes('ces tarifs ne comprennent pas')
      );

      return renderPageContainer(
        <>
          <h2 className="tw-text-xl tw-font-bold tw-mb-6" style={{ color: currentData.company.mainColor }}>
            Conditions générales
          </h2>

          {/* Boutons d'ajout de blocs de conditions */}
          {!readonly && (
            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-gap-2">
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const newBlock = {
                    id: `block_${now}`,
                    title: 'Nouveau bloc',
                    color: currentData.company.mainColor,
                    columns: 6,
                    showTitle: true,
                    allowWidthControl: true,
                    type: 'list' as const,
                    rows: [
                      {
                        id: `row_${now}`,
                        label: 'Nouvelle ligne',
                        style: 'normal' as const
                      }
                    ]
                  };
                  onUpdateData({ ...currentData, optionBlocks: [...currentData.optionBlocks, newBlock] });
                }}
                className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-text-white tw-bg-primary tw-border tw-border-primary tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-primary-dark hover:tw-shadow-primary"
                title="Ajouter un bloc de conditions"
              >
                + Ajouter un bloc
              </button>

              {!hasIncludedBlock && (
                <button
                  type="button"
                  onClick={() => {
                    const now = Date.now();
                    const includedBlock = {
                      id: 'included_fees',
                      title: 'Ces tarifs comprennent :',
                      color: '#28a745',
                      columns: 6,
                      showTitle: true,
                      allowWidthControl: true,
                      type: 'list' as const,
                      rows: [
                        {
                          id: `row_${now}_1`,
                          label: 'Autocars Grand Tourisme',
                          type: 'a',
                          style: 'normal' as const
                        },
                        {
                          id: `row_${now}_2`,
                          label: 'Mise à disposition',
                          type: 'b',
                          style: 'normal' as const
                        }
                      ]
                    };
                    onUpdateData({ ...currentData, optionBlocks: [...currentData.optionBlocks, includedBlock] });
                  }}
                  className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-text-white tw-bg-green-600 tw-border tw-border-green-600 tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-green-700"
                  title="Ajouter le bloc 'Ces tarifs comprennent'"
                >
                  + Ces tarifs comprennent
                </button>
              )}

              {!hasExcludedBlock && (
                <button
                  type="button"
                  onClick={() => {
                    const now = Date.now();
                    const excludedBlock = {
                      id: 'excluded_fees',
                      title: 'Ces tarifs ne comprennent pas :',
                      color: '#dc3545',
                      columns: 6,
                      showTitle: true,
                      allowWidthControl: true,
                      type: 'list' as const,
                      rows: [
                        {
                          id: `row_${now}_1`,
                          label: 'Heure supplémentaire',
                          type: 'd',
                          style: 'normal' as const
                        },
                        {
                          id: `row_${now}_2`,
                          label: 'Frais de péages',
                          type: 'c',
                          style: 'normal' as const
                        }
                      ]
                    };
                    onUpdateData({ ...currentData, optionBlocks: [...currentData.optionBlocks, excludedBlock] });
                  }}
                  className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-text-white tw-bg-red-600 tw-border tw-border-red-600 tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-red-700"
                  title="Ajouter le bloc 'Ces tarifs ne comprennent pas'"
                >
                  + Ces tarifs ne comprennent pas
                </button>
              )}
            </div>
          )}

          <BlocksContainer
            optionBlocks={otherBlocks}
            signatureFrame={currentData.signatureFrame}
            selectDefinitions={currentData.selectDefinitions}
            onUpdateOptionBlock={(blockIndex, updatedBlock) => {
              const newBlocks = [...currentData.optionBlocks];
              const realIndex = currentData.optionBlocks.findIndex(b => b.id === updatedBlock.id);
              if (realIndex !== -1) {
                newBlocks[realIndex] = updatedBlock;
                onUpdateData({ ...currentData, optionBlocks: newBlocks });
              }
            }}
            onRemoveOptionBlock={(blockIndex) => {
              const blockToRemove = otherBlocks[blockIndex];
              const newBlocks = currentData.optionBlocks.filter(b => b.id !== blockToRemove.id);
              onUpdateData({ ...currentData, optionBlocks: newBlocks });
            }}
            onReorderBlocks={(reorderedBlocks) => {
              const includedBlock = currentData.optionBlocks.find(b =>
                b.title.toLowerCase().includes('ces tarifs comprennent')
              );
              const excludedBlock = currentData.optionBlocks.find(b =>
                b.title.toLowerCase().includes('ces tarifs ne comprennent pas')
              );

              const newBlocks = [...reorderedBlocks];
              if (includedBlock) newBlocks.push(includedBlock);
              if (excludedBlock) newBlocks.push(excludedBlock);

              onUpdateData({ ...currentData, optionBlocks: newBlocks });
            }}
            onUpdateSignatureFrame={() => {}}
            readonly={readonly}
            showBlockControls={true}
            allowWidthControl={true}
            companyColor={currentData.company.mainColor}
          />
        </>
      );

    case 'signature':
      return renderPageContainer(
        <>
          <h2 className="tw-text-xl tw-font-bold tw-mb-6" style={{ color: currentData.company.mainColor }}>
            Bon de commande
          </h2>
          <InstructionsFrame
            signatureFrame={currentData.signatureFrame}
            onUpdateSignatureFrame={(frame) => {
              onUpdateData({ ...currentData, signatureFrame: frame });
            }}
            recipient={currentData.recipient}
            onUpdateRecipient={(recipient) => {
              onUpdateData({ ...currentData, recipient });
            }}
            readonly={readonly}
          />
          <SignatureSection
            clientSignature={currentData.clientSignature}
            onUpdateClientSignature={(signature) => {
              onUpdateData({ ...currentData, clientSignature: signature });
            }}
            readonly={readonly}
          />
          <div className="tw-flex tw-justify-center tw-mb-4">
            <EditableField
              value={currentData.termsNotice || ''}
              onSave={(value) => handleFieldUpdate('termsNotice', value)}
              disabled={readonly}
              className="tw-text-sm tw-text-text-muted tw-italic"
            />
          </div>
        </>,
        true
      );

    default:
      return null;
  }
};
