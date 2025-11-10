import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import clsx from 'clsx';
import { usePDFExport } from './hooks/usePDFExport';
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
import { QuoteEditorToolbar } from './components/shared/QuoteEditorToolbar';
import { validateQuoteData } from './utils/dataValidator';

const styles = { 'quote-editor': 'tw-font-sans tw-bg-surface-0 tw-min-h-screen', 'quote-page-container': 'tw-flex-1 tw-flex tw-flex-col tw-items-center tw-py-12 tw-px-8 tw-gap-6 tw-overflow-y-auto' };

const QuoteEditorBase = (props: QuoteEditorProps, ref: React.Ref<QuoteEditorHandle>) => {
  const {
    data: initialData,
    mock = false,
    locale = 'fr',
    theme = 'light',
    readonly = false,
    className = '',
    onEvent,
    showToolbar = true,
    showAddSection = false,
    showAddBlock = false,
    showReset = false,
    showTemplateSelector = false,
    allowWidthControl = true,
  } = props;

  const { t } = useTranslation(locale);
  const [data, setData] = useState<QuoteData | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const initialDataRef = useRef<QuoteData | null>(null);

  useEffect(() => {
    const loadData = async () => {
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
    };

    loadData();
  }, [initialData, mock, onEvent, t]);

  const handleChange = (newData: QuoteData) => {
    setData(newData);
  };

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
  } = useQuoteEditor(data || {} as QuoteData, handleChange, handleSave, false);

  const { applyColorVariables } = useColorTheme(currentData?.company || { mainColor: '#4863ec' });
  const { exportToPDF } = usePDFExport();

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

  const blockTemplates = useMemo(() => {
    const templates = [
      {
        id: 'empty',
        name: t('common.add'),
        template: {
          id: `block_${Date.now()}`,
          title: 'Nouveau bloc',
          color: '#4863ec',
          columns: 3,
          showTitle: true,
          allowWidthControl: true,
          type: 'list' as const,
          rows: [{
            id: `row_${Date.now()}`,
            label: 'Nouvelle ligne',
            style: 'normal' as const,
          }],
        },
      },
    ];

    if (initialDataRef.current?.optionBlocks) {
      const existingTemplates = [
        { id: 'included_fees', name: 'Ces tarifs comprennent' },
        { id: 'excluded_fees', name: 'Ces tarifs ne comprennent pas' },
        { id: 'nota_bene', name: 'Nota Bene' },
      ];

      existingTemplates.forEach(({ id, name }) => {
        const template = initialDataRef.current!.optionBlocks?.find((b) => b.id === id);
        if (template) {
          templates.push({ id, name, template });
        }
      });
    }

    return templates.filter((t) => t.template !== null);
  }, [t]);

  const handleAddSection = () => {
    if (readonly || !data) return;

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
        calculable: true,
      }],
      subTotal: { ht: 0, tva: 0, ttc: 0 },
    };

    const newData = {
      ...currentData,
      sections: [...(currentData.sections || []), newSection],
    };
    updateData(newData);
    onEvent?.({ type: 'action', name: 'add_section', payload: newSection });
  };

  const handleAddOptionBlock = (templateId?: string) => {
    if (readonly || !data) return;

    let newBlock: any;

    if (templateId) {
      const templateInfo = blockTemplates.find((t) => t.id === templateId);
      if (templateInfo?.template) {
        newBlock = {
          ...templateInfo.template,
          id: `${templateInfo.id}_${Date.now()}`,
        };
      } else {
        return;
      }
    } else {
      newBlock = blockTemplates[0]?.template || {
        id: `block_${Date.now()}`,
        title: 'Nouveau bloc',
        color: '#4863ec',
        columns: 3,
        showTitle: true,
        allowWidthControl: true,
        type: 'list',
        rows: [],
      };
    }

    const newData = {
      ...currentData,
      optionBlocks: [...(currentData.optionBlocks || []), newBlock],
    };
    updateData(newData);
    onEvent?.({ type: 'action', name: 'add_block', payload: newBlock });
  };

  const handleResetToInitial = () => {
    if (readonly || !initialDataRef.current) return;
    if (window.confirm(t('common.confirm'))) {
      updateData(initialDataRef.current);
      onEvent?.({ type: 'action', name: 'reset' });
    }
  };

  const handleExportPDF = async () => {
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
        className={clsx(styles['quote-editor'], className)}
        data-theme={theme}
        role="alert"
        aria-live="assertive"
      >
        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-p-8">
          <div className="tw-bg-error tw-text-white tw-rounded-2xl tw-p-6 tw-shadow-md tw-max-w-md">
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
        className={clsx(styles['quote-editor'], className)}
        data-theme={theme}
        aria-label={t('common.loading')}
      >
        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen">
          <p className="tw-text-muted-color">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const toolbarTitle = `${readonly ? t('toolbar.readonly') : t('toolbar.title')} - ${
    currentData?.quote?.number || ''
  }`;

  return (
    <div data-quote-editor-scope className={clsx(styles['quote-editor'], className)} data-theme={theme}>
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
          onSave={undefined}
          onExportPDF={handleExportPDF}
          onAddSection={handleAddSection}
          onAddBlock={() => handleAddOptionBlock()}
          onReset={handleResetToInitial}
          blockTemplates={blockTemplates}
          onSelectTemplate={handleAddOptionBlock}
        />
      )}

      <div className={styles['quote-page-container']}>
        <QuotePage
          data={currentData}
          onUpdateData={updateData}
          contentConfig={{
            sections: (currentData.sections || []).map((_, index) => index),
            optionBlocks: (currentData.optionBlocks || []).map((_, index) => index),
            showRecipient: true,
            showTotals: true,
            showSignature: true,
          }}
          readonly={readonly}
          allowWidthControl={allowWidthControl}
        />
      </div>
    </div>
  );
};

export const QuoteEditor = forwardRef<QuoteEditorHandle, QuoteEditorProps>(QuoteEditorBase);
