import React from 'react';
import type { Footer } from '../../../entities/QuoteData';
import { EditableField } from '../../EditableField/EditableField';

interface QuotePageFooterProps {
  footer: Footer;
  onFieldUpdate: (path: string, value: any) => void;
  onCompanyNameUpdate: (value: string) => void;
  onWebsiteUpdate: (value: string) => void;
  readonly?: boolean;
  printMode?: boolean;
}

export const QuotePageFooter: React.FC<QuotePageFooterProps> = ({
  footer,
  onFieldUpdate,
  onCompanyNameUpdate,
  onWebsiteUpdate,
  readonly = false,
  printMode = false
}) => {
  return (
    <div className="tw-mt-8 tw-pt-4 tw-border-t tw-border-gray-300 print:tw-mt-4 print:tw-pt-2" data-section="footer">
      <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-text-xs tw-text-gray-600 print:tw-text-[10px]">
        <div>
          <EditableField
            value={footer.companyName || ''}
            onChange={onCompanyNameUpdate}
            placeholder="Nom de l'entreprise"
            className="tw-font-semibold tw-text-xs print:tw-text-[10px]"
            readonly={readonly}
          />
          <EditableField
            value={footer.address || ''}
            onChange={(value) => onFieldUpdate('footer.address', value)}
            placeholder="Adresse"
            className="tw-text-xs print:tw-text-[10px]"
            readonly={readonly}
          />
        </div>
        <div className="tw-text-center">
          <EditableField
            value={footer.phone || ''}
            onChange={(value) => onFieldUpdate('footer.phone', value)}
            placeholder="Téléphone"
            className="tw-text-xs print:tw-text-[10px]"
            readonly={readonly}
          />
          <EditableField
            value={footer.email || ''}
            onChange={(value) => onFieldUpdate('footer.email', value)}
            placeholder="Email"
            className="tw-text-xs print:tw-text-[10px]"
            readonly={readonly}
          />
        </div>
        <div className="tw-text-right">
          <EditableField
            value={footer.website || ''}
            onChange={onWebsiteUpdate}
            placeholder="Site web"
            className="tw-text-xs print:tw-text-[10px]"
            readonly={readonly}
          />
          <EditableField
            value={footer.siret || ''}
            onChange={(value) => onFieldUpdate('footer.siret', value)}
            placeholder="SIRET"
            className="tw-text-xs print:tw-text-[10px]"
            readonly={readonly}
          />
        </div>
      </div>
    </div>
  );
};
