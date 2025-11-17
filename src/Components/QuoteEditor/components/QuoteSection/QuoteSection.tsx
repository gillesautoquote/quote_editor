import React, { useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import type { QuoteSection as QuoteSectionType, QuoteLine } from '../../entities/QuoteData';
import { EditableField } from '../EditableField/EditableField';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import { SectionActions } from './components/SectionActions';
import { DropIndicator } from './components/DropIndicator';
import { SubtotalRow } from './components/SubtotalRow';
import {
  calculateSectionSubTotal,
  recalculateQuoteLine,
  normalizeQuoteLine
} from '../../utils/calculationUtils';
import { formatDateFrench, parseDateFrench } from './utils/dateUtils';
import { formatVatRate } from './utils/vatUtils';

interface QuoteSectionProps {
  section: QuoteSectionType;
  sectionIndex: number;
  onUpdateSection: (section: QuoteSectionType) => void;
  onRemoveSection?: () => void;
  readonly?: boolean;
  printMode?: boolean;
}

interface DragState {
  isDragging: boolean;
  dragIndex: number | null;
  dropIndex: number | null;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  section,
  sectionIndex,
  onUpdateSection,
  onRemoveSection,
  readonly = false,
  printMode = false
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragIndex: null,
    dropIndex: null
  });

  if (!section.lines) {
    console.warn('Section.lines est undefined, utilisation d\'un tableau vide');
  }

  const calculateSubTotal = calculateSectionSubTotal;

  const handleTitleUpdate = (newTitle: string): void => {
    if (readonly) return;
    onUpdateSection({ ...section, title: newTitle });
  };

  const handleLineUpdate = (lineIndex: number, field: keyof QuoteLine, value: string | number): void => {
    if (readonly) return;

    const newLines = [...section.lines];
    const line = newLines[lineIndex];

    if (field === 'date' && typeof value === 'string') {
      const isoDate = parseDateFrench(value);
      newLines[lineIndex] = { ...newLines[lineIndex], [field]: isoDate };
    } else {
      newLines[lineIndex] = { ...newLines[lineIndex], [field]: value };
    }

    if (['quantity', 'unitPrice', 'vatRate'].includes(field)) {
      newLines[lineIndex] = recalculateQuoteLine(newLines[lineIndex]);
    }

    const subTotal = calculateSubTotal(newLines);
    onUpdateSection({ ...section, lines: newLines, subTotal });
  };

  const handleAddLine = (): void => {
    if (readonly) return;

    const newLine = normalizeQuoteLine({
      description: 'Nouvelle prestation'
    });

    const newLines = [...section.lines, newLine];
    const subTotal = calculateSubTotal(newLines);
    onUpdateSection({ ...section, lines: newLines, subTotal });
  };

  const handleAddSimpleLine = (simpleLine: QuoteLine): void => {
    if (readonly) return;

    const newLine = recalculateQuoteLine({
      ...simpleLine,
      calculable: true
    });

    const newLines = [...section.lines, newLine];
    const subTotal = calculateSubTotal(newLines);
    onUpdateSection({ ...section, lines: newLines, subTotal });
  };

  const handleAddMissionLine = (missionLine: QuoteLine): void => {
    if (readonly) return;

    const newLine = normalizeQuoteLine({
      ...missionLine,
      calculable: false
    });

    const newLines = [...section.lines, newLine];
    const subTotal = calculateSubTotal(newLines);
    onUpdateSection({ ...section, lines: newLines, subTotal });
  };

  const handleRemoveLine = (lineIndex: number): void => {
    if (readonly) return;

    const newLines = section.lines.filter((_, index) => index !== lineIndex);
    const subTotal = calculateSubTotal(newLines);
    onUpdateSection({ ...section, lines: newLines, subTotal });
  };

  const handleDragStart = useCallback((e: React.DragEvent, index: number): void => {
    if (readonly) return;
    setDragState({ isDragging: true, dragIndex: index, dropIndex: null });
    e.dataTransfer.setData('text/plain', JSON.stringify({ index, sectionIndex, type: 'quoteLine' }));
    e.currentTarget.classList.add('dragging');
  }, [readonly, sectionIndex]);

  const handleDragEnd = useCallback((e: React.DragEvent): void => {
    e.currentTarget.classList.remove('dragging');
    setDragState({ isDragging: false, dragIndex: null, dropIndex: null });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent): void => {
    e.preventDefault();

    if (!dragState.isDragging) return;

    const target = e.currentTarget as HTMLTableRowElement;
    const tbody = target.parentElement;
    if (!tbody) return;

    const rows = Array.from(tbody.children).filter(child =>
      child.classList.contains('quoteLine') || child.hasAttribute('data-line-index')
    );
    const targetIndex = rows.indexOf(target);

    if (targetIndex !== -1 && targetIndex !== dragState.dropIndex) {
      setDragState(prev => ({ ...prev, dropIndex: targetIndex }));
    }
  }, [dragState.isDragging, dragState.dropIndex]);

  const handleDragLeave = useCallback((e: React.DragEvent): void => {
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number): void => {
    if (readonly) return;

    e.preventDefault();
    setDragState({ isDragging: false, dragIndex: null, dropIndex: null });

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (dragData.sectionIndex !== sectionIndex || dragData.type !== 'quoteLine') return;

      const sourceIndex = dragData.index;
      if (sourceIndex === dropIndex) return;

      const newLines = [...section.lines];
      const [draggedItem] = newLines.splice(sourceIndex, 1);
      newLines.splice(dropIndex, 0, draggedItem);

      const subTotal = calculateSubTotal(newLines);
      onUpdateSection({ ...section, lines: newLines, subTotal });
    } catch (error) {
      console.error('Error handling drop:', error);
      setDragState({ isDragging: false, dragIndex: null, dropIndex: null });
    }
  }, [readonly, sectionIndex, section, onUpdateSection]);

  const shouldShowDropIndicator = (lineIndex: number): 'before' | 'after' | null => {
    if (!dragState.isDragging || dragState.dragIndex === null || dragState.dropIndex === null) {
      return null;
    }

    const { dragIndex, dropIndex } = dragState;

    if (dropIndex > dragIndex) {
      return lineIndex === dropIndex ? 'after' : null;
    } else if (dropIndex < dragIndex) {
      return lineIndex === dropIndex ? 'before' : null;
    }

    return null;
  };

  return (
    <div
      className="tw-mb-6 tw-border qe-border-border tw-rounded-lg tw-overflow-hidden tw-bg-white tw-shadow-sm page-break-inside-avoid print:tw-shadow-none print:tw-mb-4 print:tw-rounded-none"
      data-component="quote-section"
      data-section-index={sectionIndex}
      data-section-title={section.title}
    >
      <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-py-3 tw-px-4 qe-bg-surface-gray-50 tw-border-b qe-border-border print:tw-py-2 print:tw-px-3">
        {!readonly && !printMode && onRemoveSection && (
          <button
            type="button"
            onClick={onRemoveSection}
            className="tw-inline-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-p-0 tw-border qe-border-danger-light tw-rounded tw-bg-white qe-text-danger tw-cursor-pointer tw-transition-all tw-duration-200 hover:qe-bg-danger/10 hover:qe-border-danger hover:tw-scale-105 print:tw-hidden"
            title="Supprimer cette section"
          >
            <Trash2 size={14} />
          </button>
        )}
        <EditableField
          value={section.title}
          onSave={handleTitleUpdate}
          disabled={readonly}
          as="h3"
          className="tw-text-lg tw-font-semibold qe-text-primary print:tw-text-base"
          printMode={printMode}
        />
        {!printMode && (
          <SectionActions
            onAddLine={handleAddLine}
            onAddSimpleLine={handleAddSimpleLine}
            onAddMissionLine={handleAddMissionLine}
            simplesLinesSelect={section.simplesLinesSelect || []}
            missionsLines={section.missionsLines || []}
            readonly={readonly}
          />
        )}
      </div>

      <div className="tw-overflow-x-auto" style={{ width: '85%' }}>
        <table className="tw-w-full tw-border-collapse tw-text-[0.8rem] print:tw-text-xs">
          <TableHeader readonly={readonly} printMode={printMode} />
          <tbody>
            {(section.lines || []).map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {!printMode && (
                  <DropIndicator
                    show={shouldShowDropIndicator(lineIndex) === 'before'}
                    colSpan={readonly ? 9 : 11}
                  />
                )}

                <TableRow
                  line={line}
                  lineIndex={lineIndex}
                  readonly={readonly}
                  isDragging={dragState.dragIndex === lineIndex}
                  onLineUpdate={handleLineUpdate}
                  onRemoveLine={handleRemoveLine}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  formatDateFrench={formatDateFrench}
                  formatVatRate={formatVatRate}
                  printMode={printMode}
                />

                {!printMode && (
                  <DropIndicator
                    show={shouldShowDropIndicator(lineIndex) === 'after'}
                    colSpan={readonly ? 9 : 11}
                  />
                )}
              </React.Fragment>
            ))}
            <SubtotalRow subTotal={section.subTotal} readonly={readonly} printMode={printMode} />
          </tbody>
        </table>
      </div>
    </div>
  );
};
