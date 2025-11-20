import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { EditableField } from '../../EditableField/EditableField';
import type { QuoteLine } from '../../../entities/QuoteData';
import clsx from 'clsx';

interface TableRowProps {
  line: QuoteLine;
  lineIndex: number;
  readonly?: boolean;
  isDragging?: boolean;
  onLineUpdate: (lineIndex: number, field: keyof QuoteLine, value: string | number) => void;
  onRemoveLine: (lineIndex: number) => void;
  onDragStart: (e: React.DragEvent, lineIndex: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, lineIndex: number) => void;
  formatDateFrench: (dateString: string) => string;
  formatVatRate: (vatRate: number | string) => string;
  printMode?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  line,
  lineIndex,
  readonly = false,
  isDragging = false,
  onLineUpdate,
  onRemoveLine,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  formatDateFrench,
  formatVatRate,
  printMode = false
}) => {
  const baseCellClass = clsx('tw-p-1.5 tw-border-b qe-border-border', printMode && 'print:tw-p-1');

  return (
    <tr
      className={clsx(
        'quoteLine tw-bg-white tw-transition-all tw-duration-200 hover:qe-bg-surface-gray-50',
        isDragging && 'dragging tw-opacity-50',
        printMode && 'print:hover:tw-bg-white'
      )}
      data-line-index={lineIndex}
      draggable={!readonly}
      onDragStart={(e) => onDragStart(e, lineIndex)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, lineIndex)}
    >
      {!readonly && !printMode && (
        <td className="tw-border-b qe-border-border tw-text-center print:tw-hidden" style={{ width: '20px', minWidth: '20px', maxWidth: '20px', padding: '0.25rem' }}>
          <div className="tw-cursor-grab qe-text-text-muted hover:qe-text-primary active:tw-cursor-grabbing">
            <GripVertical size={11} />
          </div>
        </td>
      )}

      <td className={`${baseCellClass} tw-text-center`} style={{ width: '70px', minWidth: '70px', maxWidth: '70px' }}>
        <EditableField
          value={formatDateFrench(line.date)}
          onSave={(value) => onLineUpdate(lineIndex, 'date', value)}
          disabled={readonly || line.fromProps === true}
          placeholder="JJ/MM/AA"
          printMode={printMode}
        />
      </td>

      <td className={baseCellClass} style={{ width: 'auto' }}>
        <EditableField
          value={line.description}
          onSave={(value) => onLineUpdate(lineIndex, 'description', value)}
          disabled={readonly}
          multiline
          fullWidth={true}
          printMode={printMode}
        />
      </td>

      <td className={`${baseCellClass} tw-text-center`} style={{ width: '35px', minWidth: '35px', maxWidth: '35px' }}>
        <EditableField
          value={(line.pax ?? 0).toString()}
          onSave={(value) => onLineUpdate(lineIndex, 'pax', parseInt(value, 10) || 0)}
          disabled={readonly || line.fromProps === true}
          printMode={printMode}
        />
      </td>

      <td className={`${baseCellClass} tw-text-right`} style={{ width: '55px', minWidth: '55px', maxWidth: '55px' }}>
        <EditableField
          value={(line.unitPrice ?? 0).toFixed(2)}
          onSave={(value) => onLineUpdate(lineIndex, 'unitPrice', parseFloat(value) || 0)}
          disabled={readonly || line.fromProps === true}
          printMode={printMode}
        />
      </td>

      <td className={`${baseCellClass} tw-text-center`} style={{ width: '35px', minWidth: '35px', maxWidth: '35px' }}>
        <EditableField
          value={(line.quantity ?? 0).toString()}
          onSave={(value) => onLineUpdate(lineIndex, 'quantity', parseInt(value, 10) || 0)}
          disabled={readonly || line.fromProps === true}
          printMode={printMode}
        />
      </td>

      <td className={`${baseCellClass} qe-bg-surface-gray-50 tw-font-medium tw-text-right`} style={{ width: '45px', minWidth: '45px', maxWidth: '45px' }}>
        {(line.priceHT ?? 0).toFixed(2)}
      </td>

      <td className={`${baseCellClass} tw-text-right`} style={{ width: '45px', minWidth: '45px', maxWidth: '45px' }}>
        {line.fromProps === true ? (
          (line.vatAmount ?? 0).toFixed(2)
        ) : (
          <EditableField
            value={(line.vatAmount ?? 0).toFixed(2)}
            onSave={(value) => {
              // Quand on clique pour éditer, on affiche le taux
              // Le formattage se fait dans EditableField
              onLineUpdate(lineIndex, 'vatRate', parseFloat(value.replace('%', '').trim()) || 0);
            }}
            disabled={readonly}
            printMode={printMode}
            renderEditValue={() => formatVatRate(line.vatRate)}
          />
        )}
      </td>

      <td className={`${baseCellClass} qe-bg-surface-gray-50 tw-font-medium tw-text-right`} style={{ width: '45px', minWidth: '45px', maxWidth: '45px' }}>
        {(line.priceTTC ?? 0).toFixed(2)}
      </td>

      {!readonly && !printMode && (
        <td className="tw-border-b qe-border-border tw-text-center print:tw-hidden" style={{ width: '40px', minWidth: '40px', maxWidth: '40px', padding: '0.25rem' }}>
          {!line.fromProps && (
            <button
              type="button"
              onClick={() => onRemoveLine(lineIndex)}
              className="tw-inline-flex tw-items-center tw-justify-center qe-button-square-sm tw-p-0 qe-text-danger tw-transition-all tw-duration-200 hover:qe-text-danger-dark hover:tw-scale-110"
              title="Supprimer cette ligne"
            >
              <Trash2 size={11} />
            </button>
          )}
        </td>
      )}
    </tr>
  );
};
