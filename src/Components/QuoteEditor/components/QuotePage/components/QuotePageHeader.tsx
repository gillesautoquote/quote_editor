import React from 'react';
import { EditableField } from '../../EditableField/EditableField';
import type { Company, Quote } from '../../../entities/QuoteData';
import { formatDateDDMMYYYY } from '../../../utils/dateFormatters';

interface QuotePageHeaderProps {
  company: Company;
  quote: Quote;
  onFieldUpdate: (path: string, value: string) => void;
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
    <div
      className="tw-flex tw-justify-between tw-items-center tw-mb-8 tw-pb-4 tw-border-b tw-border-primary max-md:tw-flex-col max-md:tw-gap-2 max-md:tw-mb-6 page-break-after-avoid print:tw-mb-4 print:tw-pb-2"
      data-component="quote-header"
      data-company-id={company.name}
      data-quote-number={quote.number}
    >
      <div className="tw-flex tw-flex-1 tw-mr-8 tw-gap-4">
        {company.logoUrl && (
          <img
            src={company.logoUrl}
            alt="Logo entreprise"
            className="tw-self-center tw-max-w-[120px] tw-object-contain tw-h-auto tw-w-auto tw-flex-shrink-0 print:tw-max-w-[100px] print:tw-max-h-[2cm]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="tw-flex-1">
          <div className="tw-text-[1.1rem] tw-font-bold !tw-text-primary tw-mb-[0.2rem] tw-leading-[1.1] [&_.tw-text-text]:!tw-text-[inherit]" style={{ color: company.mainColor || '#009955' }}>
            <EditableField
              value={company.name}
              onSave={(value) => onFieldUpdate('company.name', value)}
              disabled={readonly}
              printMode={printMode}
            />
          </div>
          <div className="tw-text-[0.8rem] tw-text-text tw-leading-[1.3] [&_.editableField]:tw-p-[0.1rem_0.15rem] [&_.editableField]:tw--m-[0.1rem] [&_.editableField.editing]:tw-p-[0.1rem_0.15rem] [&_.editableField.editing]:tw--m-[0.1rem] [&_.editInput]:tw-p-[0.1rem_0.15rem] [&_.editInput]:tw-text-[inherit]">
            <div>
              <EditableField
                value={company.address}
                onSave={(value) => onFieldUpdate('company.address', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
            <div>
              <EditableField
                value={company.postalCode}
                onSave={(value) => onFieldUpdate('company.postalCode', value)}
                disabled={readonly}
              printMode={printMode}
              /> {' '}
              <EditableField
                value={company.city}
                onSave={(value) => onFieldUpdate('company.city', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
            <div className="tw-mt-1">
              <EditableField
                value={company.phone}
                onSave={(value) => onFieldUpdate('company.phone', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
            <div>
              <EditableField
                value={company.email}
                onSave={(value) => onFieldUpdate('company.email', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="tw-text-right tw-min-w-[200px] max-md:tw-text-left">
        <div className="tw-text-base tw-font-bold tw-mb-[0.2rem] tw-leading-[1.1] tw-text-text">
          Devis N° <EditableField
            value={quote.number}
            onSave={(value) => onFieldUpdate('quote.number', value)}
            disabled={readonly}
              printMode={printMode}
          />
        </div>
        <div className="tw-text-[0.85rem] tw-text-text tw-mb-[0.4rem] tw-leading-[1.1]">
          Version: <EditableField
            value={quote.version}
            onSave={(value) => onFieldUpdate('quote.version', value)}
            disabled={readonly}
              printMode={printMode}
          />
        </div>
        <div className="tw-text-xs tw-leading-[1.2] tw-text-text">
          {/* Afficher seulement si la date existe */}
          {quote.issueDate && quote.issueDate.trim() && (
            <div className="tw-mb-[0.1rem] last:tw-mb-0">
              <strong className="tw-text-primary">Date:</strong> <EditableField
                value={formatDateDDMMYYYY(quote.issueDate)}
                onSave={(value) => onFieldUpdate('quote.issueDate', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
          )}

          {/* Afficher seulement si la date de validité existe */}
          {quote.validUntil && quote.validUntil.trim() && (
            <div className="tw-mb-[0.1rem] last:tw-mb-0">
              <strong className="tw-text-primary">Valable jusqu'au:</strong> <EditableField
                value={formatDateDDMMYYYY(quote.validUntil)}
                onSave={(value) => onFieldUpdate('quote.validUntil', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
          )}

          {/* Afficher seulement si la référence existe */}
          {quote.reference && quote.reference.trim() && (
            <div className="tw-mb-[0.1rem] last:tw-mb-0">
              <strong className="tw-text-primary">Référence:</strong> <EditableField
                value={quote.reference}
                onSave={(value) => onFieldUpdate('quote.reference', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};