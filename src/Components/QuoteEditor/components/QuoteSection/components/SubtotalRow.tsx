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
  const tdClassName = printMode
    ? 'tw-px-2 tw-py-1.5 tw-border tw-border-gray-300 tw-font-bold tw-text-gray-900'
    : 'tw-p-2';

  return (
    <tr className={printMode ? 'tw-bg-gray-100' : 'tw-bg-surface-gray-50 tw-font-semibold tw-border-t-2 tw-border-border'}>
      {!readonly && !printMode && <td className="tw-p-2"></td>}
      <td colSpan={5} className={`${tdClassName} tw-text-right`}>
        Sous-total
      </td>
      <td className={tdClassName}></td>
      <td className={`${tdClassName} tw-text-right`}>
        {subTotal.ht.toFixed(2)}
      </td>
      <td className={tdClassName}></td>
      <td className={`${tdClassName} tw-text-right`}>
        {subTotal.ttc.toFixed(2)}
      </td>
      {!readonly && !printMode && <td className="tw-p-2"></td>}
    </tr>
  );
};
