import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import clsx from 'clsx';
import { usePDFExport } from './hooks/usePDFExport';
import { useBackendPDFExport } from './hooks/useBackendPDFExport';
import { globalEventEmitter, EVENTS } from './utils/eventEmitter';
import type { QuoteEditorProps as LegacyQuoteEditorProps, QuoteEditorHandle as LegacyQuoteEditorHandle } from './entities/QuoteData';
import type { QuoteEditorProps, QuoteEditorHandle, QuoteData, ComponentEvent } from './QuoteEditor.types';
import { useQuoteEditor } from './hooks/useQuoteEditor';
import { useColorTheme } from './hooks/useColorTheme';
import { useTranslation } from './i18n/translations';
import { QuotePage } from './components/QuotePage/QuotePage';
import { QuoteFlatView } from './components/QuotePage/QuoteFlatView';
import { QuoteEditorToolbar } from './components/shared/QuoteEditorToolbar';
import { QuoteTabs } from './components/QuoteTabs';
import { QuoteTabContent } from './components/QuoteTabs/QuoteTabContent';
import { validateQuoteData } from './utils/dataValidator';
import { createProgrammeVoyageBlock } from './utils/itineraryConverters';

type CombinedQuoteEditorProps = QuoteEditorProps | (Partial<LegacyQuoteEditorProps> & {
  data: any;
  onChange?: (data: any) => void | any;
  onSave?: ((data: any) => Promise<void>) | any;
  autoSave?: boolean;
  [key: string]: any;
});

const QuoteEditorBase = (props: CombinedQuoteEditorProps, ref: any) => {
  const isStandaloneMode = 'onEvent' in props || 'mock' in props || 'locale' in props;
  const legacyProps = 'onChange' in props ? props as any : null;
  const standaloneProps = isStandaloneMode ? props as QuoteEditorProps : null;

  console.log('[QuoteEditor] Render - Mode:', isStandaloneMode ? 'Standalone' : 'Legacy', 'Props keys:', Object.keys(props));

  const {
    data: initialData,
    mock = false,
    locale = 'fr',
    theme = 'light',
    readonly = false,
    printMode: propPrintMode = false,
    flatMode: propFlatMode = false,
    previewMode = false,
    className = '',
    onEvent,
    showToolbar = true,
    showAddSection = false,
    showAddBlock = false,
    showReset = false,
    showTemplateSelector = false,
    allowWidthControl = true,
    showHeader = true,
    showFooter = true,
  } = standaloneProps || {
    data: legacyProps?.data,
    readonly: legacyProps?.readonly ?? false,
    printMode: legacyProps?.printMode ?? false,
    flatMode: legacyProps?.flatMode ?? false,
    previewMode: legacyProps?.previewMode ?? false,
    className: legacyProps?.className ?? '',
    showToolbar: legacyProps?.showToolbar ?? true,
    showAddSection: legacyProps?.showAddSection ?? false,
    showAddBlock: legacyProps?.showAddBlock ?? false,
    showReset: legacyProps?.showReset ?? false,
    showTemplateSelector: legacyProps?.showTemplateSelector ?? false,
    allowWidthControl: legacyProps?.allowWidthControl ?? true,
    showHeader: legacyProps?.showHeader ?? true,
    showFooter: legacyProps?.showFooter ?? true,
  };

  const useTabs = legacyProps?.useTabs ?? true;
  const printMode = propPrintMode || propFlatMode;
  const flatMode = propFlatMode || propPrintMode;

  const onChange = legacyProps?.onChange;
  const onSave = legacyProps?.onSave;
  const autoSave = legacyProps?.autoSave ?? true;

  const { t } = useTranslation(locale);

  // ✅ Initialiser directement avec initialData au lieu de null
  const [data, setData] = useState<QuoteData | null>(initialData || null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  useEffect(() => {
    if (data?.company?.mainColor) {
      const root = document.documentElement;
      const mainColor = data.company.mainColor;
      console.log('[QuoteEditor] Applying theme color:', mainColor);

      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const lightenColor = (hex: string, amount: number) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount));
        const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount));
        const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount));
        return `${r}, ${g}, ${b}`;
      };

      const darkenColor = (hex: string, amount: number) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        const r = Math.max(0, Math.floor(rgb.r * (1 - amount)));
        const g = Math.max(0, Math.floor(rgb.g * (1 - amount)));
        const b = Math.max(0, Math.floor(rgb.b * (1 - amount)));
        return `${r}, ${g}, ${b}`;
      };

      const rgb = hexToRgb(mainColor);
      if (rgb) {
        const primaryValue = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        const hoverValue = darkenColor(mainColor, 0.15);
        const lightValue = lightenColor(mainColor, 0.85);
        const lighterValue = lightenColor(mainColor, 0.92);
        const darkValue = darkenColor(mainColor, 0.15);

        console.log('[QuoteEditor] Setting CSS variables:', {
          primary: primaryValue,
          hover: hoverValue,
          light: lightValue,
          lighter: lighterValue,
          dark: darkValue
        });

        root.style.setProperty('--color-primary', primaryValue);
        root.style.setProperty('--color-primary-hover', hoverValue);
        root.style.setProperty('--color-primary-light', lightValue);
        root.style.setProperty('--color-primary-lighter', lighterValue);
        root.style.setProperty('--color-primary-dark', darkValue);
      }
    }
  }, [data?.company?.mainColor]);

  const initialDataRef = useRef<QuoteData | null>(initialData || null);

  useEffect(() => {
    const loadData = async () => {
      console.log('[QuoteEditor] Loading data - isStandaloneMode:', isStandaloneMode, 'initialData:', initialData);

      if (isStandaloneMode) {
        try {
          if (initialData) {
            const validation = validateQuoteData(initialData);
            if (!validation.valid) {
              const errorEvent: ComponentEvent = {
                type: 'error',
                code: 'INVALID_DATA',
                message: validation.errors.join(', '),
              };
              setError({ code: errorEvent.code, message: errorEvent.message });
              onEvent?.(errorEvent);
              return;
            }
            setData(initialData);
            initialDataRef.current = initialData;
          } else if (mock) {
            const mockData = await import('./mocks/data.mock.json');
            setData(mockData.default as QuoteData);
            initialDataRef.current = mockData.default as QuoteData;
          } else {
            const errorEvent: ComponentEvent = {
              type: 'error',
              code: 'NO_DATA',
              message: t('errors.noData'),
            };
            setError({ code: errorEvent.code, message: errorEvent.message });
            onEvent?.(errorEvent);
            return;
          }
          onEvent?.({ type: 'ready' });
        } catch (err) {
          const errorEvent: ComponentEvent = {
            type: 'error',
            code: 'LOAD_ERROR',
            message: t('errors.loadError'),
          };
          setError({ code: errorEvent.code, message: errorEvent.message });
          onEvent?.(errorEvent);
        }
      } else {
        console.log('[QuoteEditor] Legacy mode - setting data directly');
        if (initialData) {
          console.log('[QuoteEditor] InitialData sections:', initialData.sections?.length, 'optionBlocks:', initialData.optionBlocks?.length);
          setData(initialData);
          initialDataRef.current = initialData;
        } else {
          console.error('[QuoteEditor] No initialData provided in legacy mode!');
        }
      }
    };
    loadData();
  }, [initialData, mock, onEvent, t, isStandaloneMode]);

  const handleChange = (newData: QuoteData) => {
    setData(newData);
    if (onChange) onChange(newData);
  };

  const handleSaveWrapper = async (newData: QuoteData) => {
    if (isStandaloneMode) {
      onEvent?.({ type: 'save', data: newData });
    }
    if (onSave) {
      await onSave(newData);
    }
  };

  const {
    data: currentData,
    updateData,
    saveState,
    saveData,
    canUndo,
    canRedo,
    undo,
    redo
  } = useQuoteEditor(data || {} as QuoteData, handleChange, handleSaveWrapper, autoSave);

  const { applyColorVariables } = useColorTheme(currentData?.company || { mainColor: '#4863ec' });
  const { exportToPDF, isGenerating } = usePDFExport(useTabs);
  const { exportToPDF: exportToPDFBackend, isLoading: isExportingBackend, error: backendError } = useBackendPDFExport();

  // Expose les méthodes via le ref avec protection
  useImperativeHandle(ref, () => ({
    exportToPDF: async () => {
      try {
        console.log('[QuoteEditor] Export PDF using V1 engine');
        return await exportToPDF(currentData);
      } catch (error) {
        console.error('Export PDF error:', error);
        throw error;
      }
    },
    saveData: saveData || (() => Promise.resolve()),
    undo: undo || (() => {}),
    redo: redo || (() => {}),
    getData: () => currentData,
    canUndo: canUndo || false,
    canRedo: canRedo || false
  }), [currentData, exportToPDF, saveData, undo, redo, canUndo, canRedo]);
  
  // Appliquer les variables de couleur
  useEffect(() => {
    if (currentData?.company?.mainColor) {
      applyColorVariables();
    }
  }, [currentData?.company?.mainColor, applyColorVariables]);
  
  useEffect(() => {
    const handleGlobalPDFExport = async () => {
      try {
        console.log('[QuoteEditor] PDF export via global event using V1 engine');
        await exportToPDF(currentData);
        console.log('[QuoteEditor] PDF exported successfully');
      } catch (error) {
        console.error('[QuoteEditor] PDF export error:', error);
      }
    };

    globalEventEmitter.on(EVENTS.EXPORT_PDF, handleGlobalPDFExport);

    return () => {
      globalEventEmitter.off(EVENTS.EXPORT_PDF, handleGlobalPDFExport);
    };
  }, [currentData, exportToPDF]);

  const blockTemplates = useMemo(() => {
    const templates = [
      {
        id: 'empty',
        name: 'Bloc vide',
        template: {
          id: `block_${Date.now()}`,
          title: 'Nouveau bloc',
          color: '#0066cc',
          columns: 3,
          showTitle: true,
          allowWidthControl: true,
          type: 'list' as const,
          rows: [{
            id: `row_${Date.now()}`,
            label: 'Nouvelle ligne',
            style: 'normal' as const
          }]
        }
      }
    ];

    // Ajouter les templates existants s'ils existent
    if (initialDataRef.current?.optionBlocks) {
      const existingTemplates = [
        { id: 'included_fees', name: 'Ces tarifs comprennent' },
        { id: 'excluded_fees', name: 'Ces tarifs ne comprennent pas' },
        { id: 'nota_bene', name: 'Nota Bene' }
      ];

      existingTemplates.forEach(({ id, name }) => {
        const template = initialDataRef.current.optionBlocks?.find((b: any) => b.id === id);
        if (template) {
          templates.push({ id, name, template });
        }
      });
    }

    return templates.filter(t => t.template !== null);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // 🎯 HANDLERS SIMPLIFIÉS
  // ═══════════════════════════════════════════════════════════════

  const handleSave = async (): Promise<void> => {
    if (currentData && saveData) {
      try {
        await saveData();
      } catch (error) {
        if (isStandaloneMode) {
          onEvent?.({
            type: 'error',
            code: 'SAVE_ERROR',
            message: t('errors.saveError'),
          });
        }
      }
    }
  };

  const handleAddSection = (): void => {
    if (readonly) return;
    
    // ✅ Section avec toutes les valeurs par défaut sécurisées
    const newSection = {
      title: 'Nouvelle section',
      columns: undefined,
      missionsLines: [],
      simplesLinesSelect: [],
      lines: [{
        date: new Date().toISOString().split('T')[0],
        description: 'Nouvelle prestation',
        durationHours: 1,
        pax: 1,
        unitPrice: 0,
        priceHT: 0,
        vatRate: 20,
        vatAmount: 0,
        quantity: 1,
        priceTTC: 0,
        calculable: true
      }],
      subTotal: { ht: 0, tva: 0, ttc: 0 }
    };
    
    // ✅ Calculer les nouveaux totaux de manière sécurisée
    const currentSections = currentData.sections || [];
    const newSections = [...currentSections, newSection];
    
    const newTotals = newSections.reduce(
      (acc, section) => {
        const sectionSubTotal = section.subTotal || { ht: 0, tva: 0, ttc: 0 };
        return {
          ht: (acc.ht || 0) + (sectionSubTotal.ht || 0),
          tva: (acc.tva || 0) + (sectionSubTotal.tva || 0),
          ttc: (acc.ttc || 0) + (sectionSubTotal.ttc || 0)
        };
      },
      { ht: 0, tva: 0, ttc: 0 }
    );

    updateData({
      ...currentData,
      sections: newSections,
      totals: newTotals
    });
  };

  const handleAddOptionBlock = (templateId?: string): void => {
    if (readonly) return;
    
    let newBlock: any;
    
    if (templateId) {
      const templateInfo = blockTemplates.find(t => t.id === templateId);
      if (templateInfo?.template) {
        newBlock = {
          ...templateInfo.template,
          id: `${templateInfo.id}_${Date.now()}`
        };
      } else {
        return;
      }
    } else {
      newBlock = blockTemplates[0]?.template || {
        id: `block_${Date.now()}`,
        title: 'Nouveau bloc',
        color: '#0066cc',
        columns: 3,
        showTitle: true,
        allowWidthControl: true,
        type: 'list',
        rows: []
      };
    }
    
    updateData({
      ...currentData,
      optionBlocks: [...(currentData.optionBlocks || []), newBlock],
    });
  };
  
  const handleResetToInitial = (): void => {
    if (readonly) return;
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le devis ?')) {
      updateData(initialDataRef.current);
    }
  };
  
  const handleExportPDF = async (): Promise<void> => {
    try {
      await exportToPDF(currentData);
      if (isStandaloneMode) {
        onEvent?.({ type: 'export_pdf', data: currentData });
      }
    } catch (error) {
      if (isStandaloneMode) {
        onEvent?.({
          type: 'error',
          code: 'EXPORT_ERROR',
          message: t('errors.exportError'),
        });
      }
    }
  };

  const handleExportPDFBackend = async (): Promise<void> => {
    try {
      console.log('[QuoteEditor] Exporting PDF via backend...');
      await exportToPDFBackend(currentData);
      console.log('[QuoteEditor] Backend PDF export successful');
      if (isStandaloneMode) {
        onEvent?.({ type: 'export_pdf', data: currentData });
      }
    } catch (error) {
      console.error('[QuoteEditor] Backend PDF export error:', error);
      if (isStandaloneMode) {
        onEvent?.({
          type: 'error',
          code: 'BACKEND_EXPORT_ERROR',
          message: error instanceof Error ? error.message : 'Erreur lors de l\'export PDF backend'
        });
      }
    }
  };


  const handleUndo = () => {
    undo?.();
    if (isStandaloneMode) {
      onEvent?.({ type: 'undo', data: currentData });
    }
  };

  const handleRedo = () => {
    redo?.();
    if (isStandaloneMode) {
      onEvent?.({ type: 'redo', data: currentData });
    }
  };

  if (error && isStandaloneMode) {
    return (
      <div
        className={clsx('tw-font-sans tw-bg-surface-0 tw-min-h-screen', theme === 'dark' && 'tw-bg-slate-900', className)}
        data-theme={theme}
        role="alert"
        aria-live="assertive"
      >
        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-p-8">
          <div className="tw-bg-red-500 tw-text-white tw-rounded-2xl tw-p-6 tw-shadow-md tw-max-w-md">
            <h2 className="tw-text-lg tw-font-semibold tw-mb-2">{error.code}</h2>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !currentData) {
    return (
      <div
        className={clsx('tw-font-sans tw-bg-surface-0 tw-min-h-screen', theme === 'dark' && 'tw-bg-slate-900', className)}
        data-theme={theme}
        aria-label={isStandaloneMode ? t('common.loading') : 'Chargement...'}
      >
        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen">
          <p className="tw-text-gray-500">{isStandaloneMode ? t('common.loading') : 'Chargement des données...'}</p>
        </div>
      </div>
    );
  }

  if (!currentData.sections || !currentData.optionBlocks) {
    return <div className="tw-p-4 tw-text-center">Chargement des données...</div>;
  }

  const toolbarTitle = `${readonly ? t('toolbar.readonly') : t('toolbar.title')} - ${
    currentData?.quote?.number || ''
  }`;

  return (
    <div className={clsx('tw-font-sans tw-bg-surface-0 tw-min-h-screen', theme === 'dark' && 'tw-bg-slate-900', className)} data-theme={theme}>
      {/* Toolbar optionnelle et propre */}
      {showToolbar && (
        <QuoteEditorToolbar
          title={toolbarTitle}
          readonly={readonly}
          showAddSection={showAddSection && !readonly}
          showAddBlock={showAddBlock && !readonly}
          showReset={showReset && !readonly}
          showTemplateSelector={showTemplateSelector && !readonly}
          saveState={saveState}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={onSave ? handleSave : undefined}
          onExportPDF={handleExportPDF}
          onExportPDFBackend={handleExportPDFBackend}
          onAddSection={handleAddSection}
          onAddBlock={() => handleAddOptionBlock()}
          onReset={handleResetToInitial}
          blockTemplates={blockTemplates}
          onSelectTemplate={handleAddOptionBlock}
        />
      )}

      <div className="tw-flex-1 tw-flex tw-flex-col tw-items-center tw-py-12 tw-px-8 tw-gap-6 tw-overflow-y-auto tw-bg-gradient-to-br tw-from-gray-50 tw-to-gray-200 md:tw-px-4 lg:tw-px-16 max-md:tw-px-2 max-md:tw-py-8 max-md:tw-gap-4 max-md:tw-bg-gray-50 print:tw-p-0 print:tw-gap-0 print:tw-bg-white">
        {flatMode ? (
          <QuoteFlatView
            data={currentData}
            onUpdateData={updateData}
            readonly={readonly}
            printMode={printMode}
            allowWidthControl={allowWidthControl}
            showHeader={showHeader}
            showFooter={showFooter}
          />
        ) : useTabs ? (
          <QuoteTabs
            data={currentData}
            onUpdateData={updateData}
            readonly={readonly}
            allowWidthControl={allowWidthControl}
            enableTabManagement={true}
          >
            {(activeTab, visibleTabIds) => (
              <QuoteTabContent
                activeTab={activeTab}
                visibleTabIds={visibleTabIds}
                data={currentData}
                onUpdateData={updateData}
                readonly={readonly}
                allowWidthControl={allowWidthControl}
              />
            )}
          </QuoteTabs>
        ) : (
          <QuotePage
            data={currentData}
            onUpdateData={updateData}
            contentConfig={{
              sections: (currentData.sections || []).map((_: any, index: number) => index),
              optionBlocks: (currentData.optionBlocks || []).map((_: any, index: number) => index),
              showRecipient: true,
              showTotals: true,
              showSignature: true
            }}
            readonly={readonly}
            printMode={printMode}
            allowWidthControl={allowWidthControl}
          />
        )}
      </div>
    </div>
  );
};

export const QuoteEditor = forwardRef<QuoteEditorHandle | LegacyQuoteEditorHandle, CombinedQuoteEditorProps>(QuoteEditorBase);