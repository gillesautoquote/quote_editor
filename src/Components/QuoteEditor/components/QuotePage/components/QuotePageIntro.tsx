import React from 'react';
import type { Quote, Recipient, ClientSignature } from '../../../entities/QuoteData';
import { EditableMarkdownField } from '../../EditableField/EditableMarkdownField';

interface QuotePageIntroProps {
  quote: Quote;
  recipient: Recipient;
  clientSignature: ClientSignature;
  onFieldUpdate: (path: string, value: any) => void;
  readonly?: boolean;
  printMode?: boolean;
}

export const QuotePageIntro: React.FC<QuotePageIntroProps> = ({
  quote,
  onFieldUpdate,
  readonly = false,
  printMode = false
}) => {
  return (
    <div className="tw-mb-6 print:tw-mb-4" data-section="intro">
      <EditableMarkdownField
        value={quote.intro || ''}
        onChange={(value) => onFieldUpdate('quote.intro', value)}
        placeholder="Introduction du devis..."
        className="tw-text-sm tw-text-gray-700"
        readonly={readonly}
      />
    </div>
  );
};
