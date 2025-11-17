import React from 'react';
import type { ColumnDefinition } from '../../../entities/QuoteData';

interface SubtotalRowProps {
  subTotal: {
    ht: number;
    tva: number;
    ttc: number;
  };
  columns: {
    date: ColumnDefinition;
    description: ColumnDefinition;
    durationHours?: ColumnDefinition;
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

export const SubtotalRow: React.FC<SubtotalRowProps> = ({ subTotal, columns, readonly = false, printMode = false }) => {
  // Calculate the correct colspan: date + description + (durationHours?) + pax + unitPrice
  const labelColSpan = columns.durationHours ? 5 : 4;

  return (
    <tr className="qe-bg-surface-gray-50 tw-font-semibold tw-border-t-2 qe-border-border">
      {!readonly && !printMode && <td className="tw-p-2 print:tw-p-1.5"></td>}
      <td colSpan={labelColSpan} className="tw-p-2 tw-text-right qe-text-text print:tw-p-1.5">
        <strong>Sous-total</strong>
      </td>
      <td className="tw-p-2 print:tw-p-1.5"></td>
      <td className="tw-p-2 tw-text-right qe-text-text print:tw-p-1.5">
        <strong>{subTotal.ht.toFixed(2)}</strong>
      </td>
      <td className="tw-p-2 print:tw-p-1.5"></td>
      <td className="tw-p-2 tw-text-right qe-text-text print:tw-p-1.5">
        <strong>{subTotal.ttc.toFixed(2)}</strong>
      </td>
      {!readonly && !printMode && <td className="tw-p-2 print:tw-p-1.5"></td>}
    </tr>
  );
};
