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
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, readonly = false }) => {
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
    <thead>
      <tr>
        {!readonly && <th></th>}
        <th style={getHeaderStyle(columns.date)}>{columns.date.title}</th>
        <th style={getHeaderStyle(columns.description)}>{columns.description.title}</th>
        <th style={getHeaderStyle(columns.durationHours)}>{columns.durationHours.title}</th>
        <th style={getHeaderStyle(columns.pax)}>{columns.pax.title}</th>
        <th style={getHeaderStyle(columns.unitPrice)}>{columns.unitPrice.title}</th>
        <th style={getHeaderStyle(columns.quantity)}>{columns.quantity.title}</th>
        <th style={getHeaderStyle(columns.priceHT)}>{columns.priceHT.title}</th>
        <th style={getHeaderStyle(columns.vatRate)}>{columns.vatRate.title}</th>
        <th style={getHeaderStyle(columns.priceTTC)}>{columns.priceTTC.title}</th>
        {!readonly && <th></th>}
      </tr>
    </thead>
  );
};