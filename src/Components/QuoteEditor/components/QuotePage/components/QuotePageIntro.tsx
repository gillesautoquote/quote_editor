import React from 'react';
import { EditableField } from '../../EditableField/EditableField';
import { EditableMarkdownField } from '../../EditableField/EditableMarkdownField';
import type { Quote, Recipient, ClientSignature } from '../../../entities/QuoteData';
import { formatDateInFrench, formatDateWithComma, formatTitle, formatTagline, markdownToHtml } from '../utils/dateFormatters';

interface QuotePageIntroProps {
  quote: Quote;
  recipient: Recipient;
  clientSignature: ClientSignature;
  onFieldUpdate: (path: string, value: string) => void;
  readonly?: boolean;
}

export const QuotePageIntro: React.FC<QuotePageIntroProps> = ({
  quote,
  recipient,
  clientSignature,
  onFieldUpdate,
  readonly = false
}) => {
  return (
    <div className="tw-mb-4 tw-mt-8 tw-text-[0.9rem] tw-leading-[1.4] tw-text-text">
      {/* Ligne ville et date - afficher seulement si au moins un existe */}
      {((quote.executionCity && quote.executionCity.trim()) || (quote.issueDate && quote.issueDate.trim())) && (
        <div className="tw-mb-[0.3rem]">
          {quote.executionCity && quote.executionCity.trim() && (
            <EditableField
              value={quote.executionCity}
              onSave={(value) => onFieldUpdate('quote.executionCity', value)}
              disabled={readonly}
              placeholder="Ville"
            />
          )}
          {quote.executionCity && quote.executionCity.trim() && quote.issueDate && quote.issueDate.trim() && ', '}
          {quote.issueDate && quote.issueDate.trim() && (
            <span>{formatDateWithComma(quote.issueDate)}</span>
          )}
        </div>
      )}

      {/* Civilité du client - afficher seulement si elle existe */}
      {recipient.title && recipient.title.trim() && (
        <div className="tw-mb-[0.3rem] tw-font-semibold">
          <EditableField
            value={formatTitle(recipient.title)}
            onSave={(value) => onFieldUpdate('recipient.title', value.replace(',', ''))}
            disabled={readonly}
            placeholder="Civilité"
          />
        </div>
      )}

      {/* Tagline d'introduction - afficher seulement si elle existe */}
      {quote.tagline && quote.tagline.trim() && (
        <div className="tw-mb-2">
          <EditableMarkdownField
            value={quote.tagline}
            onSave={(value) => onFieldUpdate('quote.tagline', value)}
            disabled={readonly}
            placeholder="Texte d'introduction"
            markdownToHtml={markdownToHtml}
          />
        </div>
      )}

      {/* Texte de remerciements - afficher seulement si il existe */}
      {clientSignature?.tagline && clientSignature.tagline.trim() && (
        <div className="tw-mt-6 tw-mb-2">
          <EditableField
            value={clientSignature.tagline}
            onSave={(value) => onFieldUpdate('clientSignature.tagline', value)}
            disabled={readonly}
            as="div"
            fullWidth={true}
            placeholder="Texte de remerciements"
          />
        </div>
      )}

      {/* Signature */}
      <div>
        {clientSignature?.title && clientSignature.title.trim() && (
          <div>
            <EditableField
              value={clientSignature.title}
              onSave={(value) => onFieldUpdate('clientSignature.title', value)}
              disabled={readonly}
              placeholder="Titre"
            />
          </div>
        )}
        {clientSignature?.fullName && clientSignature.fullName.trim() && (
          <div>
            <EditableField
              value={clientSignature.fullName}
              onSave={(value) => onFieldUpdate('clientSignature.fullName', value)}
              disabled={readonly}
              placeholder="Nom complet"
            />
          </div>
        )}
      </div>
    </div>
  );
};