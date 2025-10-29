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
    <tr className={printMode ? 'tw-bg-gray-100 tw-font-bold tw-border-t-2 tw-border-gray-400' : 'tw-bg-surface-gray-50 tw-font-semibold tw-border-t-2 tw-border-border'}>
      {!readonly && !printMode && <td className="tw-p-2"></td>}
      <td colSpan={5} className={printMode ? 'tw-p-1.5 tw-text-right tw-text-gray-800 tw-text-xs' : 'tw-p-2 tw-text-right tw-text-text'}>
        <strong>Sous-total</strong>
      </td>
      <td className={printMode ? 'tw-p-1.5' : 'tw-p-2'}></td>
      <td className={printMode ? 'tw-p-1.5 tw-text-right tw-text-gray-800 tw-text-xs' : 'tw-p-2 tw-text-right tw-text-text'}>
        <strong>{subTotal.ht.toFixed(2)}</strong>
      </td>
      <td className={printMode ? 'tw-p-1.5' : 'tw-p-2'}></td>
      <td className={printMode ? 'tw-p-1.5 tw-text-right tw-text-gray-800 tw-text-xs' : 'tw-p-2 tw-text-right tw-text-text'}>
        <strong>{subTotal.ttc.toFixed(2)}</strong>
      </td>
      {!readonly && !printMode && <td className="tw-p-2"></td>}
    </tr>
  );
};
