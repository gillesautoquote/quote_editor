import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { EditableField } from '../../EditableField/EditableField';
import { OptionSelector } from '../OptionSelector';
import { StyleSelector } from '../StyleSelector';
import type { OptionRow as OptionRowType, SelectDefinition } from '../../../entities/QuoteData';
import clsx from 'clsx';

interface OptionRowProps {
  row: OptionRowType;
  rowIndex: number;
  selectDefinitions: Record<string, SelectDefinition>;
  onRowUpdate: (rowIndex: number, field: keyof OptionRowType, value: string) => void;
  onRemoveRow: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number, type: 'row' | 'note') => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number, type: 'row' | 'note') => void;
  readonly?: boolean;
  printMode?: boolean;
}

export const OptionRow: React.FC<OptionRowProps> = ({
  row,
  rowIndex,
  selectDefinitions,
  onRowUpdate,
  onRemoveRow,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  readonly = false,
  printMode = false,
}) => {
  const handleLabelSelect = (selectedLabel: string): void => {
    onRowUpdate(rowIndex, 'label', selectedLabel);
  };

  return (
    <li
      className="tw-flex tw-items-center tw-gap-2 tw-p-2 tw-border tw-border-border tw-rounded tw-bg-white tw-transition-all tw-duration-200 hover:tw-bg-surface-gray-50 page-break-inside-avoid print:tw-border-none print:tw-p-1 print:tw-py-0.5 print:tw-bg-transparent print:tw-rounded-none"
      draggable={!readonly && !printMode}
      onDragStart={!printMode ? (e) => onDragStart(e, rowIndex, 'row') : undefined}
      onDragEnd={!printMode ? onDragEnd : undefined}
      onDragOver={!printMode ? onDragOver : undefined}
      onDragLeave={!printMode ? onDragLeave : undefined}
      onDrop={!printMode ? (e) => onDrop(e, rowIndex, 'row') : undefined}
      onMouseDown={(e) => {
        if (printMode) return;
        const target = e.target as HTMLElement;
        if (target.closest('.editableField') || target.closest('input') || target.closest('textarea')) {
          e.stopPropagation();
        }
      }}
    >
      {!readonly && !printMode && (
        <div className="tw-cursor-grab tw-text-text-muted hover:tw-text-primary active:tw-cursor-grabbing print:tw-hidden">
          <GripVertical size={12} />
        </div>
      )}

      <div className="tw-flex tw-items-center tw-gap-2 tw-flex-1">
        <span className="tw-text-text-muted tw-font-bold">•</span>

        {!readonly && !printMode && row.type && selectDefinitions[row.type] && (
          <div className="print:tw-hidden">
            <OptionSelector
              options={selectDefinitions[row.type!].values}
              onSelect={handleLabelSelect}
              placeholder="Autre valeur"
            />
          </div>
        )}

        <div className="tw-flex-1">
          <EditableField
            value={row.label}
            onSave={(value) => onRowUpdate(rowIndex, 'label', value)}
            disabled={readonly}
            printMode={printMode}
            fullWidth={true}
            className={clsx(
              'tw-text-sm print:tw-text-xs',
              row.style === 'bold' && 'tw-font-bold',
              row.style === 'italic' && 'tw-italic',
              row.style === 'heading' && 'tw-text-base tw-font-semibold print:tw-text-sm',
              row.style === 'danger' && 'tw-text-danger tw-font-medium',
              row.style === 'success' && 'tw-text-success tw-font-medium',
              row.style === 'warning' && 'tw-text-warning tw-font-medium'
            )}
            onMouseDown={(e: React.MouseEvent) => {
              e.stopPropagation();
            }}
            onDragStart={(e: React.DragEvent) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }}
          />
        </div>
      </div>

      {!readonly && !printMode && (
        <div className="tw-flex tw-items-center tw-gap-1.5 print:tw-hidden">
          <StyleSelector
            value={row.style || 'normal'}
            onChange={(style) => onRowUpdate(rowIndex, 'style', style)}
          />
          <button
            type="button"
            onClick={() => onRemoveRow(rowIndex)}
            className="tw-inline-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-p-0 tw-text-danger tw-transition-all tw-duration-200 hover:tw-text-danger-dark hover:tw-scale-110"
            title="Supprimer cette ligne"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </li>
  );
};
