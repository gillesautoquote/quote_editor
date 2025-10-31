import React from 'react';
import { EditableField } from '../../EditableField/EditableField';
import type { Footer } from '../../../entities/QuoteData';
import { extractCompanyName, formatCopyright, formatUrl, cleanUrl } from '../utils/textFormatters';

interface QuotePageFooterProps {
  footer: Footer;
  onFieldUpdate: (path: string, value: string) => void;
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
    <div
      className="tw-mt-auto tw-pt-4 tw-border-t tw-border-primary page-break-inside-avoid print:tw-pt-2"
      data-component="quote-footer"
    >
      <div className="tw-text-center tw-mb-2 tw-text-[0.7rem] tw-text-text-muted tw-italic print:tw-text-[0.6rem]">
        <EditableField
          value={footer.confidentialNotice || ''}
          onSave={(value) => onFieldUpdate('footer.confidentialNotice', value)}
          disabled={readonly}
          printMode={printMode}
        />
      </div>
      <div className="tw-flex tw-justify-between tw-gap-4 tw-text-[0.7rem] tw-leading-[1.3] tw-text-text max-md:tw-flex-col max-md:tw-gap-2 print:tw-text-[0.6rem] print:tw-gap-2">
        {/* Colonne gauche : Infos légales */}
        <div className="tw-flex-1 tw-min-w-0">
          {footer.rcs && footer.rcs.trim() && (
            <div className="tw-mb-[0.1rem]">
              RCS <EditableField
                value={footer.rcs}
                onSave={(value) => onFieldUpdate('footer.rcs', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
          )}
          {footer.siret && footer.siret.trim() && (
            <div className="tw-mb-[0.1rem]">
              SIRET <EditableField
                value={footer.siret}
                onSave={(value) => onFieldUpdate('footer.siret', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
          )}
          {footer.tva && footer.tva.trim() && (
            <div className="tw-mb-[0.1rem]">
              TVA <EditableField
                value={footer.tva}
                onSave={(value) => onFieldUpdate('footer.tva', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
          )}
        </div>
        
        {/* Colonne centre : Contact */}
        <div className="tw-flex-1 tw-min-w-0 tw-text-center">
          {/* Ligne copyright + téléphone + site web - afficher seulement si au moins un existe */}
          {((footer.copyright && footer.copyright.trim()) || (footer.phone && footer.phone.trim()) || (footer.website && footer.website.trim())) && (
            <div className="tw-mb-[0.1rem]">
              {footer.copyright && footer.copyright.trim() && (
                <>
                  <span className="tw-font-semibold">
                    <EditableField
                      value={extractCompanyName(footer.copyright)}
                      onSave={onCompanyNameUpdate}
                      disabled={readonly}
              printMode={printMode}
                    />
                  </span>
                  {((footer.phone && footer.phone.trim()) || (footer.website && footer.website.trim())) && <span className="tw-mx-[0.3rem] tw-text-text-muted">•</span>}
                </>
              )}
              {footer.phone && footer.phone.trim() && (
                <>
                  <EditableField
                    value={footer.phone}
                    onSave={(value) => onFieldUpdate('footer.phone', value)}
                    disabled={readonly}
              printMode={printMode}
                  />
                  {footer.website && footer.website.trim() && <span className="tw-mx-[0.3rem] tw-text-text-muted">•</span>}
                </>
              )}
              {footer.website && footer.website.trim() && (
                <EditableField
                  value={cleanUrl(footer.website)}
                  onSave={onWebsiteUpdate}
                  disabled={readonly}
              printMode={printMode}
                />
              )}
            </div>
          )}
          
          {/* IBAN - afficher seulement s'il existe */}
          {footer.iban && footer.iban.trim() && (
            <div className="tw-mb-[0.1rem]">
              IBAN: <EditableField
                value={footer.iban}
                onSave={(value) => onFieldUpdate('footer.iban', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
          )}
        </div>
        
        {/* Colonne droite : Adresse */}
        <div className="tw-flex-1 tw-min-w-0 tw-text-right max-md:tw-text-left">
          {footer.address && footer.address.trim() && (
            <div className="tw-mb-[0.1rem]">
              <EditableField
                value={footer.address}
                onSave={(value) => onFieldUpdate('footer.address', value)}
                disabled={readonly}
              printMode={printMode}
              />
            </div>
          )}
          {((footer.postalCode && footer.postalCode.trim()) || (footer.city && footer.city.trim())) && (
            <div className="tw-mb-[0.1rem]">
              {footer.postalCode && footer.postalCode.trim() && (
                <EditableField
                  value={footer.postalCode}
                  onSave={(value) => onFieldUpdate('footer.postalCode', value)}
                  disabled={readonly}
              printMode={printMode}
                />
              )}{footer.postalCode && footer.postalCode.trim() && footer.city && footer.city.trim() && ' '}
              {footer.city && footer.city.trim() && (
                <EditableField
                  value={footer.city}
                  onSave={(value) => onFieldUpdate('footer.city', value)}
                  disabled={readonly}
              printMode={printMode}
                />
              )}
            </div>
          )}
          {/* BIC - afficher seulement s'il existe */}
          {footer.bic && footer.bic.trim() && (
            <div className="tw-mb-[0.1rem]">
              BIC: <EditableField
                value={footer.bic}
                onSave={(value) => onFieldUpdate('footer.bic', value)}
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