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
    <tr className="tw-bg-surface-gray-50 tw-font-semibold tw-border-t-2 tw-border-border">
      {!readonly && !printMode && <td className="tw-p-2 print:tw-p-1.5"></td>}
      <td colSpan={5} className="tw-p-2 tw-text-right tw-text-text print:tw-p-1.5">
        <strong>Sous-total</strong>
      </td>
      <td className="tw-p-2 print:tw-p-1.5"></td>
      <td className="tw-p-2 tw-text-right tw-text-text print:tw-p-1.5">
        <strong>{subTotal.ht.toFixed(2)}</strong>
      </td>
      <td className="tw-p-2 print:tw-p-1.5"></td>
      <td className="tw-p-2 tw-text-right tw-text-text print:tw-p-1.5">
        <strong>{subTotal.ttc.toFixed(2)}</strong>
      </td>
      {!readonly && !printMode && <td className="tw-p-2 print:tw-p-1.5"></td>}
    </tr>
  );
};
