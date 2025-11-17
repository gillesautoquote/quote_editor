import React from 'react';

interface SubtotalRowProps {
  subTotal: {
    ht: number;
    tva: number;
    ttc: number;
  };
  readonly?: boolean;
  printMode?: boolean;
}

export const SubtotalRow: React.FC<SubtotalRowProps> = ({ subTotal, readonly = false, printMode = false }) => {
  return (
    <tr className="qe-bg-surface-gray-50 tw-font-semibold tw-border-t-2 qe-border-border">
      {!readonly && !printMode && <td className="tw-p-1.5 print:tw-p-1"></td>}
      <td colSpan={4} className="tw-p-1.5 tw-text-right qe-text-text print:tw-p-1">
        <strong>Sous-total</strong>
      </td>
      <td className="tw-p-1.5 print:tw-p-1"></td>
      <td className="tw-p-1.5 tw-text-right qe-text-text print:tw-p-1">
        <strong>{subTotal.ht.toFixed(2)}</strong>
      </td>
      <td className="tw-p-1.5 print:tw-p-1"></td>
      <td className="tw-p-1.5 tw-text-right qe-text-text print:tw-p-1">
        <strong>{subTotal.ttc.toFixed(2)}</strong>
      </td>
      {!readonly && !printMode && <td className="tw-p-1.5 print:tw-p-1"></td>}
    </tr>
  );
};
