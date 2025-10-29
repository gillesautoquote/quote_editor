import React from 'react';
import type { ClientSignature } from '../../entities/QuoteData';
import { EditableField } from '../EditableField/EditableField';

interface SignatureSectionProps {
  clientSignature: ClientSignature;
  onUpdateClientSignature: (signature: ClientSignature) => void;
  readonly?: boolean;
  printMode?: boolean;
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({
  clientSignature,
  onUpdateClientSignature,
  readonly = false,
  printMode = false
}) => {
  return (
    <div className="tw-mt-8 page-break-inside-avoid print:tw-mt-4" data-component="signature-section">
      {clientSignature.tagline && clientSignature.tagline.trim() && (
        <div className="tw-leading-[1.4] tw-text-[0.9rem] tw-text-text tw-mb-4">
          <EditableField
            value={clientSignature.tagline}
            onSave={(value) => onUpdateClientSignature({ ...clientSignature, tagline: value })}
            disabled={readonly}
            printMode={printMode}
            as="div"
            fullWidth={true}
            placeholder="Phrase de conclusion"
          />
        </div>
      )}

      {((clientSignature.title && clientSignature.title.trim()) || (clientSignature.fullName && clientSignature.fullName.trim())) && (
        <div className="tw-text-right tw-flex tw-flex-col tw-gap-[0.2rem] tw-self-end tw-ml-auto max-md:tw-text-center max-md:tw-ml-0 max-md:tw-self-center">
          {clientSignature.title && clientSignature.title.trim() && (
            <div className="tw-text-[0.85rem] tw-font-normal tw-text-primary">
              <EditableField
                value={clientSignature.title.endsWith(',') ? clientSignature.title : `${clientSignature.title},`}
                onSave={(value) => onUpdateClientSignature({ ...clientSignature, title: value.replace(',', '') })}
                disabled={readonly}
                printMode={printMode}
                placeholder="Le Service Commercial"
                className="tw-p-[0.1rem_0.15rem] tw--m-[0.1rem] [&.editing]:tw-p-[0.1rem_0.15rem] [&.editing]:tw--m-[0.1rem] [&.editing]:tw-outline-[0.5px] [&_input]:tw-p-[0.1rem_0.15rem] [&_input]:tw-text-[inherit] [&_input]:tw-font-normal [&_input]:tw-text-right max-md:[&_input]:tw-text-center"
              />
            </div>
          )}
          {clientSignature.fullName && clientSignature.fullName.trim() && (
            <div className="tw-text-[0.85rem] tw-font-medium tw-text-text">
              <EditableField
                value={clientSignature.fullName}
                onSave={(value) => onUpdateClientSignature({ ...clientSignature, fullName: value })}
                disabled={readonly}
                printMode={printMode}
                placeholder="Nom"
                className="tw-p-[0.1rem_0.15rem] tw--m-[0.1rem] [&.editing]:tw-p-[0.1rem_0.15rem] [&.editing]:tw--m-[0.1rem] [&.editing]:tw-outline-[0.5px] [&_input]:tw-p-[0.1rem_0.15rem] [&_input]:tw-text-[inherit] [&_input]:tw-font-medium [&_input]:tw-text-right max-md:[&_input]:tw-text-center"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};