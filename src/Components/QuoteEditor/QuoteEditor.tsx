import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import './styles/print.css';
import { usePDFExport } from './hooks/usePDFExport';
import { useBackendPDFExport } from './hooks/useBackendPDFExport';
import { globalEventEmitter, EVENTS } from './utils/eventEmitter';
import type {
  QuoteEditorProps,
  QuoteEditorHandle,
  QuoteData,
  ComponentEvent,
} from './QuoteEditor.types';
import { useQuoteEditor } from './hooks/useQuoteEditor';
import { useColorTheme } from './hooks/useColorTheme';
import { useTranslation } from './i18n/translations';
import { QuotePage } from './components/QuotePage/QuotePage';
import { QuoteFlatView } from './components/QuotePage/QuoteFlatView';
import { QuoteEditorToolbar } from './components/shared/QuoteEditorToolbar';
import { QuoteTabs } from './components/QuoteTabs';
import { QuoteTabContent } from './components/QuoteTabs/QuoteTabContent';
import { validateQuoteData } from './utils/dataValidator';

const QuoteEditorBase = (props: QuoteEditorProps, ref: React.Ref<QuoteEditorHandle>) => {
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
    useTabs = true,
    usePDFV2 = false,
  } = props;

  const { t } = useTranslation(locale);

  const printMode = propPrintMode || propFlatMode;
  const flatMode = propFlatMode || propPrintMode;

  const [data, setData] = useState<QuoteData | null>(initialData || null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const initialDataRef = useRef<QuoteData | null>(initialData || null);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      if (!isInitialLoadRef.current) return;

      try {
        if (initialData) {
          const validation = validateQuoteData(initialData);
          if (!validation.valid) {
            console.warn('[QuoteEditor] Validation warnings:', validation.errors);
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
        console.error('[QuoteEditor] Load error:', err);
        const errorEvent: ComponentEvent = {
          type: 'error',
          code: 'LOAD_ERROR',
          message: t('errors.loadError'),
        };
        setError({ code: errorEvent.code, message: errorEvent.message });
        onEvent?.(errorEvent);
      }

      isInitialLoadRef.current = false;
    };

    loadData();
  }, [initialData, mock, onEvent, t]);

  const handleChange = useCallback((newData: QuoteData) => {
    // Ne pas mettre à jour data ici - useQuoteEditor gère son propre état interne
    // On émet juste l'événement pour notifier les parents
    onEvent?.({ type: 'change', path: '', value: newData, data: newData });
  }, [onEvent]);

  const handleSave = async (newData: QuoteData) => {
    onEvent?.({ type: 'save', data: newData });
  };

  const {
    data: currentData,
    updateData,
    saveState,
    saveData,
    canUndo,
    canRedo,
    undo,
    redo,
    isEditingField,
    hasPendingExternalChanges
  } = useQuoteEditor(data || {} as QuoteData, handleChange, handleSave, false);

  // Supprimé : cette logique est gérée par useQuoteEditor

  const { applyColorVariables } = useColorTheme(currentData?.company || { mainColor: '#4863ec' });
  const { exportToPDF, isGenerating } = usePDFExport(useTabs);
  const { exportToPDF: exportToPDFBackend, isLoading: isExportingBackend, error: backendError } = useBackendPDFExport();

  useImperativeHandle(ref, () => ({
    exportToPDF: async () => {
      try {
        await exportToPDF(currentData);
      } catch (error) {
        throw error;
      }
    },
    saveData: saveData || (() => Promise.resolve()),
    undo: undo || (() => {}),
    redo: redo || (() => {}),
    getData: () => currentData,
    canUndo: canUndo || false,
    canRedo: canRedo || false,
  }), [currentData, exportToPDF, saveData, undo, redo, canUndo, canRedo]);

  useEffect(() => {
    if (currentData?.company?.mainColor) {
      applyColorVariables();
    }
  }, [currentData?.company?.mainColor, applyColorVariables]);

  useEffect(() => {
    const handleGlobalPDFExport = async () => {
      try {
        await exportToPDF(currentData);
        onEvent?.({ type: 'export_pdf', data: currentData });
      } catch (error) {
        onEvent?.({
          type: 'error',
          code: 'EXPORT_ERROR',
          message: t('errors.exportError'),
        });
      }
    };

    globalEventEmitter.on(EVENTS.EXPORT_PDF, handleGlobalPDFExport);
    return () => {
      globalEventEmitter.off(EVENTS.EXPORT_PDF, handleGlobalPDFExport);
    };
  }, [currentData, exportToPDF, onEvent, t]);

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

  const handleAddSection = (): void => {
    if (readonly) return;

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

    onEvent?.({ type: 'action', name: 'add_section', payload: newSection });
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

    onEvent?.({ type: 'action', name: 'add_block', payload: newBlock });
  };

  const handleResetToInitial = (): void => {
    if (readonly) return;
    onEvent?.({ type: 'action', name: 'reset_clicked' });
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le devis ?')) {
      updateData(initialDataRef.current);
      onEvent?.({ type: 'action', name: 'reset_confirmed' });
    }
  };

  const handleSaveClick = (): void => {
    if (readonly) return;
    onEvent?.({ type: 'action', name: 'save_clicked', payload: currentData });
  };

  const handleExportPDF = async (): Promise<void> => {
    try {
      await exportToPDF(currentData);
      onEvent?.({ type: 'export_pdf', data: currentData });
    } catch (error) {
      onEvent?.({
        type: 'error',
        code: 'EXPORT_ERROR',
        message: t('errors.exportError'),
      });
    }
  };

  const handleExportPDFBackend = async (): Promise<void> => {
    try {
      await exportToPDFBackend(currentData);
      onEvent?.({ type: 'export_pdf', data: currentData });
    } catch (error) {
      onEvent?.({
        type: 'error',
        code: 'BACKEND_EXPORT_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'export PDF backend'
      });
    }
  };

  const handleUndo = () => {
    undo?.();
    onEvent?.({ type: 'undo', data: currentData });
  };

  const handleRedo = () => {
    redo?.();
    onEvent?.({ type: 'redo', data: currentData });
  };

  if (error) {
    return (
      <div
        data-quote-editor-scope
        className={clsx('tw-font-sans qe-bg-surface-0 tw-min-h-screen', theme === 'dark' && 'tw-bg-slate-900', className)}
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
        data-quote-editor-scope
        className={clsx('tw-font-sans qe-bg-surface-0 tw-min-h-screen', theme === 'dark' && 'tw-bg-slate-900', className)}
        data-theme={theme}
        aria-label={t('common.loading')}
      >
        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen">
          <p className="tw-text-gray-500">{t('common.loading')}</p>
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

  const [tabsData, setTabsData] = useState<any>(null);
  const setTabsDataRef = useRef(setTabsData);
  setTabsDataRef.current = setTabsData;

  return (
    <div
      data-quote-editor-scope
      className={clsx('tw-font-sans qe-bg-surface-0 tw-min-h-screen', theme === 'dark' && 'tw-bg-slate-900', className)}
      data-theme={theme}
    >
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
          onSave={handleSaveClick}
          onExportPDF={handleExportPDF}
          onExportPDFBackend={usePDFV2 ? handleExportPDFBackend : undefined}
          onAddSection={handleAddSection}
          onAddBlock={() => handleAddOptionBlock()}
          onReset={handleResetToInitial}
          blockTemplates={blockTemplates}
          onSelectTemplate={handleAddOptionBlock}
          tabs={useTabs ? tabsData : undefined}
        />
      )}

      {hasPendingExternalChanges && !printMode && (
        <div className="tw-bg-yellow-50 tw-border-l-4 tw-border-yellow-400 tw-p-3 tw-mx-4 tw-mt-2 tw-rounded tw-shadow-sm">
          <div className="tw-flex tw-items-center">
            <div className="tw-flex-shrink-0">
              <svg className="tw-h-5 tw-w-5 tw-text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="tw-ml-3">
              <p className="tw-text-sm tw-text-yellow-700 tw-font-medium">
                {t('notifications.pendingExternalChanges') || 'External changes are pending. They will be applied when you finish editing.'}
              </p>
            </div>
          </div>
        </div>
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
            enableTabManagement={!readonly}
            renderTabs={setTabsData}
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

export const QuoteEditor = forwardRef<QuoteEditorHandle, QuoteEditorProps>(QuoteEditorBase);
