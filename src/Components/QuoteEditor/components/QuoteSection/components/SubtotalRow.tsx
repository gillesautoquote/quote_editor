import React from 'react';

interface SubtotalRowProps {
  subTotal: {
    ht: number;
    tva: number;
    ttc: number;
  };
  readonly?: boolean;
}

export const SubtotalRow: React.FC<SubtotalRowProps> = ({ subTotal, readonly = false }) => {
  return (
    <tr className="tw-bg-surface-gray-50 tw-font-semibold tw-border-t-2 tw-border-border">
      {!readonly && <td className="tw-p-2"></td>}
      <td colSpan={5} className="tw-p-2 tw-text-right tw-text-text">
        <strong>Sous-total</strong>
      </td>
      <td className="tw-p-2"></td>
      <td className="tw-p-2 tw-text-right tw-text-text">
        <strong>{subTotal.ht.toFixed(2)}</strong>
      </td>
      <td className="tw-p-2"></td>
      <td className="tw-p-2 tw-text-right tw-text-text">
        <strong>{subTotal.ttc.toFixed(2)}</strong>
      </td>
      {!readonly && <td className="tw-p-2"></td>}
    </tr>
  );
};
