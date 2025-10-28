import React from 'react';

interface DropIndicatorProps {
  show: boolean;
  colSpan: number;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({ show, colSpan }) => {
  if (!show) return null;

  return (
    <tr className="tw-h-8 tw-bg-primary/10 tw-transition-all tw-duration-200">
      <td colSpan={colSpan} className="tw-p-0">
        <div className="tw-h-full tw-flex tw-items-center tw-justify-center tw-border-t-2 tw-border-b-2 tw-border-primary tw-border-dashed">
          <span className="tw-text-xs tw-font-medium tw-text-primary tw-bg-white tw-px-3 tw-py-1 tw-rounded-full">
            Déplacer ici
          </span>
        </div>
      </td>
    </tr>
  );
};
