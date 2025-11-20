import React from 'react';

interface TableHeaderProps {
  readonly?: boolean;
  printMode?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ readonly = false, printMode = false }) => {
  const thClassName = printMode
    ? 'tw-p-1.5 tw-text-left tw-font-semibold qe-bg-surface-gray-50 tw-border-b qe-border-border print:tw-text-xs print:tw-p-1'
    : 'tw-p-1.5 tw-text-left tw-font-semibold qe-bg-surface-gray-50 tw-border-b qe-border-border';

  return (
    <thead>
      <tr>
        {!readonly && !printMode && <th className="print:tw-hidden" style={{ width: '20px', minWidth: '20px', maxWidth: '20px' }}></th>}
        <th className={`${thClassName} tw-text-center`} style={{ width: '70px', minWidth: '70px', maxWidth: '70px' }}>Date</th>
        <th className={thClassName} style={{ width: 'auto' }}>Description</th>
        <th className={`${thClassName} tw-text-center`} style={{ width: '35px', minWidth: '35px', maxWidth: '35px' }}>Pax</th>
        <th className={`${thClassName} tw-text-right`} style={{ width: '55px', minWidth: '55px', maxWidth: '55px' }}>P. U.</th>
        <th className={`${thClassName} tw-text-center`} style={{ width: '35px', minWidth: '35px', maxWidth: '35px' }}>Qté</th>
        <th className={`${thClassName} tw-text-right`} style={{ width: '45px', minWidth: '45px', maxWidth: '45px' }}>HT</th>
        <th className={`${thClassName} tw-text-right`} style={{ width: '45px', minWidth: '45px', maxWidth: '45px' }}>TVA</th>
        <th className={`${thClassName} tw-text-right`} style={{ width: '45px', minWidth: '45px', maxWidth: '45px' }}>TTC</th>
        {!readonly && !printMode && <th className="print:tw-hidden" style={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}></th>}
      </tr>
    </thead>
  );
};