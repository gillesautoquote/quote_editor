import React from 'react';
import type { Recipient } from '../../../entities/QuoteData';
import { EditableField } from '../../EditableField/EditableField';

interface QuotePageRecipientProps {
  recipient: Recipient;
  onFieldUpdate: (path: string, value: any) => void;
  readonly?: boolean;
  printMode?: boolean;
}

export const QuotePageRecipient: React.FC<QuotePageRecipientProps> = ({
  recipient,
  onFieldUpdate,
  readonly = false,
  printMode = false
}) => {
  return (
    <div className="tw-mb-6 print:tw-mb-4" data-section="recipient">
      <div className="tw-space-y-1">
        <EditableField
          value={recipient.name}
          onChange={(value) => onFieldUpdate('recipient.name', value)}
          placeholder="Nom du destinataire"
          className="tw-font-semibold"
          readonly={readonly}
        />
        <EditableField
          value={recipient.address}
          onChange={(value) => onFieldUpdate('recipient.address', value)}
          placeholder="Adresse"
          className="tw-text-sm"
          readonly={readonly}
        />
        <div className="tw-flex tw-gap-2">
          <EditableField
            value={recipient.zipCode}
            onChange={(value) => onFieldUpdate('recipient.zipCode', value)}
            placeholder="Code postal"
            className="tw-text-sm tw-w-24"
            readonly={readonly}
          />
          <EditableField
            value={recipient.city}
            onChange={(value) => onFieldUpdate('recipient.city', value)}
            placeholder="Ville"
            className="tw-text-sm tw-flex-1"
            readonly={readonly}
          />
        </div>
      </div>
    </div>
  );
};
