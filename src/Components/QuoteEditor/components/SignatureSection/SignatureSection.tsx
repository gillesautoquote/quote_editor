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
      {/* Section signature supprimée */}
    </div>
  );
};