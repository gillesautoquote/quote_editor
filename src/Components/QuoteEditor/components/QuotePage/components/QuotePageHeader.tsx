import React from 'react';
import type { Company, Quote } from '../../../entities/QuoteData';
import { EditableField } from '../../EditableField/EditableField';

interface QuotePageHeaderProps {
  company: Company;
  quote: Quote;
  onFieldUpdate: (path: string, value: any) => void;
  readonly?: boolean;
  printMode?: boolean;
}

export const QuotePageHeader: React.FC<QuotePageHeaderProps> = ({
  company,
  quote,
  onFieldUpdate,
  readonly = false,
  printMode = false
}) => {
  return (
    <div className="tw-mb-6 print:tw-mb-4" data-section="header">
      <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
        <div className="tw-flex-1">
          {company.logo && (
            <img
              src={company.logo}
              alt={company.name}
              className="tw-h-16 tw-w-auto tw-mb-2 print:tw-h-12"
            />
          )}
          <EditableField
            value={company.name}
            onChange={(value) => onFieldUpdate('company.name', value)}
            placeholder="Nom de l'entreprise"
            className="tw-font-bold tw-text-lg print:tw-text-base"
            readonly={readonly}
          />
        </div>
        <div className="tw-text-right">
          <div className="tw-text-2xl tw-font-bold print:tw-text-xl" style={{ color: company.mainColor }}>
            DEVIS
          </div>
          <EditableField
            value={quote.reference}
            onChange={(value) => onFieldUpdate('quote.reference', value)}
            placeholder="Référence"
            className="tw-text-sm tw-text-gray-600 print:tw-text-xs"
            readonly={readonly}
          />
        </div>
      </div>
    </div>
  );
};
