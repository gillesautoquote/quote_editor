import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { EditableField } from '../../EditableField/EditableField';
import type { QuoteLine, ColumnDefinition } from '../../../entities/QuoteData';
import clsx from 'clsx';

interface TableRowProps {
  line: QuoteLine;
  lineIndex: number;
  columns: {
    date: ColumnDefinition;
    description: ColumnDefinition;
    durationHours: ColumnDefinition;
    pax: ColumnDefinition;
    unitPrice: ColumnDefinition;
    quantity: ColumnDefinition;
    priceHT: ColumnDefinition;
    vatRate: ColumnDefinition;
    priceTTC: ColumnDefinition;
  };
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
}

export const TableRow: React.FC<TableRowProps> = ({
  line,
  lineIndex,
  columns,
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
  formatVatRate
}) => {
  const getCellClassName = (columnDef: ColumnDefinition): string => {
    return clsx(
      'tw-p-2 tw-border-b tw-border-border',
      columnDef.align === 'center' && 'tw-text-center',
      columnDef.align === 'right' && 'tw-text-right',
      columnDef.style === 'calculated' && 'tw-bg-surface-gray-50 tw-font-medium',
      columnDef.style === 'primary' && 'tw-text-primary tw-font-medium',
      columnDef.style === 'danger' && 'tw-text-danger tw-font-medium'
    );
  };

  const getCellDataStyle = (columnDef: ColumnDefinition): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (columnDef.width) {
      style.width = typeof columnDef.width === 'number' ? `${columnDef.width}px` : columnDef.width;
      style.minWidth = style.width;
      style.maxWidth = style.width;
    }

    if (columnDef.align) {
      style.textAlign = columnDef.align;
    }

    return style;
  };

  return (
    <tr
      className={clsx(
        'quoteLine tw-bg-white tw-transition-all tw-duration-200 hover:tw-bg-surface-gray-50',
        isDragging && 'dragging tw-opacity-50'
      )}
      data-line-index={lineIndex}
      draggable={!readonly}
      onDragStart={(e) => onDragStart(e, lineIndex)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, lineIndex)}
    >
      {!readonly && (
        <td className="tw-w-8 tw-p-2 tw-border-b tw-border-border tw-text-center">
          <div className="tw-cursor-grab tw-text-text-muted hover:tw-text-primary active:tw-cursor-grabbing">
            <GripVertical size={12} />
          </div>
        </td>
      )}

      <td className={getCellClassName(columns.date)} style={getCellDataStyle(columns.date)}>
        <EditableField
          value={formatDateFrench(line.date)}
          onSave={(value) => onLineUpdate(lineIndex, 'date', value)}
          disabled={readonly || !columns.date.editable}
          placeholder="JJ/MM/AA"
        />
      </td>

      <td className={getCellClassName(columns.description)} style={getCellDataStyle(columns.description)}>
        <EditableField
          value={line.description}
          onSave={(value) => onLineUpdate(lineIndex, 'description', value)}
          disabled={readonly || !columns.description.editable}
          multiline
          fullWidth={true}
        />
      </td>

      <td className={getCellClassName(columns.durationHours)} style={getCellDataStyle(columns.durationHours)}>
        <EditableField
          value={line.durationHours.toString()}
          onSave={(value) => onLineUpdate(lineIndex, 'durationHours', parseFloat(value) || 0)}
          disabled={readonly || !columns.durationHours.editable}
        />
      </td>

      <td className={getCellClassName(columns.pax)} style={getCellDataStyle(columns.pax)}>
        <EditableField
          value={line.pax.toString()}
          onSave={(value) => onLineUpdate(lineIndex, 'pax', parseInt(value, 10) || 0)}
          disabled={readonly || !columns.pax.editable}
        />
      </td>

      <td className={getCellClassName(columns.unitPrice)} style={getCellDataStyle(columns.unitPrice)}>
        {line.unitPrice.toFixed(2)}
      </td>

      <td className={getCellClassName(columns.quantity)} style={getCellDataStyle(columns.quantity)}>
        {line.quantity.toString()}
      </td>

      <td className={getCellClassName(columns.priceHT)} style={getCellDataStyle(columns.priceHT)}>
        {line.priceHT.toFixed(2)}
      </td>

      <td className={getCellClassName(columns.vatRate)} style={getCellDataStyle(columns.vatRate)}>
        {typeof line.vatRate === 'number' ? line.vatRate.toString() : line.vatRate}
      </td>

      <td className={getCellClassName(columns.priceTTC)} style={getCellDataStyle(columns.priceTTC)}>
        {line.priceTTC.toFixed(2)}
      </td>

      {!readonly && (
        <td className="tw-w-8 tw-p-2 tw-border-b tw-border-border tw-text-center">
          <button
            type="button"
            onClick={() => onRemoveLine(lineIndex)}
            className="tw-inline-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-p-0 tw-text-danger tw-transition-all tw-duration-200 hover:tw-text-danger-dark hover:tw-scale-110"
            title="Supprimer cette ligne"
          >
            <Trash2 size={12} />
          </button>
        </td>
      )}
    </tr>
  );
};
