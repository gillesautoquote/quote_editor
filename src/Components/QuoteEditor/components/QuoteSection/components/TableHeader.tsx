import React from 'react';
import type { ColumnDefinition } from '../../../entities/QuoteData';

interface TableHeaderProps {
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
  printMode?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, readonly = false, printMode = false }) => {
  const getHeaderStyle = (columnDef: ColumnDefinition): React.CSSProperties => {
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
    <thead className={printMode ? 'tw-bg-gray-100' : ''}>
      <tr className={printMode ? 'tw-border-b-2 tw-border-gray-300' : ''}>
        {!readonly && !printMode && <th className="print:tw-hidden"></th>}
        <th className={printMode ? 'tw-p-2 tw-text-xs tw-font-semibold tw-text-gray-700' : 'tw-p-2 tw-text-left tw-font-semibold tw-bg-surface-gray-50 tw-border-b tw-border-border'} style={getHeaderStyle(columns.date)}>{columns.date.title}</th>
        <th className={printMode ? 'tw-p-2 tw-text-xs tw-font-semibold tw-text-gray-700' : 'tw-p-2 tw-text-left tw-font-semibold tw-bg-surface-gray-50 tw-border-b tw-border-border'} style={getHeaderStyle(columns.description)}>{columns.description.title}</th>
        <th className={printMode ? 'tw-p-2 tw-text-xs tw-font-semibold tw-text-gray-700' : 'tw-p-2 tw-text-left tw-font-semibold tw-bg-surface-gray-50 tw-border-b tw-border-border'} style={getHeaderStyle(columns.durationHours)}>{columns.durationHours.title}</th>
        <th className={printMode ? 'tw-p-2 tw-text-xs tw-font-semibold tw-text-gray-700' : 'tw-p-2 tw-text-left tw-font-semibold tw-bg-surface-gray-50 tw-border-b tw-border-border'} style={getHeaderStyle(columns.pax)}>{columns.pax.title}</th>
        <th className={printMode ? 'tw-p-2 tw-text-xs tw-font-semibold tw-text-gray-700' : 'tw-p-2 tw-text-left tw-font-semibold tw-bg-surface-gray-50 tw-border-b tw-border-border'} style={getHeaderStyle(columns.unitPrice)}>{columns.unitPrice.title}</th>
        <th className={printMode ? 'tw-p-2 tw-text-xs tw-font-semibold tw-text-gray-700' : 'tw-p-2 tw-text-left tw-font-semibold tw-bg-surface-gray-50 tw-border-b tw-border-border'} style={getHeaderStyle(columns.quantity)}>{columns.quantity.title}</th>
        <th className={printMode ? 'tw-p-2 tw-text-xs tw-font-semibold tw-text-gray-700' : 'tw-p-2 tw-text-left tw-font-semibold tw-bg-surface-gray-50 tw-border-b tw-border-border'} style={getHeaderStyle(columns.priceHT)}>{columns.priceHT.title}</th>
        <th className={printMode ? 'tw-p-2 tw-text-xs tw-font-semibold tw-text-gray-700' : 'tw-p-2 tw-text-left tw-font-semibold tw-bg-surface-gray-50 tw-border-b tw-border-border'} style={getHeaderStyle(columns.vatRate)}>{columns.vatRate.title}</th>
        <th className={printMode ? 'tw-p-2 tw-text-xs tw-font-semibold tw-text-gray-700' : 'tw-p-2 tw-text-left tw-font-semibold tw-bg-surface-gray-50 tw-border-b tw-border-border'} style={getHeaderStyle(columns.priceTTC)}>{columns.priceTTC.title}</th>
        {!readonly && !printMode && <th className="print:tw-hidden"></th>}
      </tr>
    </thead>
  );
};