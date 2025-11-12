import React from 'react';
import { EditableField } from '../../EditableField/EditableField';
import type { Recipient, Company } from '../../../entities/QuoteData';

interface QuotePageRecipientProps {
  recipient: Recipient;
  onFieldUpdate: (path: string, value: string) => void;
  readonly?: boolean;
  printMode?: boolean;
  company?: Company;
}

export const QuotePageRecipient: React.FC<QuotePageRecipientProps> = ({
  recipient,
  onFieldUpdate,
  readonly = false,
  printMode = false,
  company
}) => {
  const mainColor = company?.mainColor || '#0066cc';

  return (
    <div className="tw-mb-4 tw-flex tw-justify-end max-md:tw-justify-start">
      <div className="qe-bg-surface-indigo-50 tw-border qe-border-border-light tw-rounded-2xl tw-p-3 tw-inline-block tw-min-w-[300px] tw-max-w-[400px]">
        <div
          className="tw-text-[0.65rem] tw-font-bold tw-mb-2 tw-tracking-wider tw-uppercase"
          style={{ color: mainColor }}
        >
          DESTINATAIRE
        </div>
        <div className="tw-text-[0.85rem] tw-leading-[1.3] qe-text-text">
          {/* Organisation - afficher seulement si elle existe */}
          {recipient.organization && recipient.organization.trim() && (
            <div className="tw-font-semibold tw-mb-[0.15rem] qe-text-text">
              <EditableField
                value={recipient.organization}
                onSave={(value) => onFieldUpdate('recipient.organization', value)}
                disabled={readonly}
                printMode={printMode}
                placeholder="Entreprise"
              />
            </div>
          )}

          {/* Nom complet - afficher seulement s'il existe */}
          {recipient.fullName && recipient.fullName.trim() && (
            <div className="tw-font-medium tw-mb-[0.15rem] qe-text-text">
              <EditableField
                value={recipient.fullName}
                onSave={(value) => onFieldUpdate('recipient.fullName', value)}
                disabled={readonly}
                printMode={printMode}
                placeholder="Nom complet"
              />
            </div>
          )}

          {/* Adresse - afficher seulement si elle existe */}
          {recipient.address && recipient.address.trim() && (
            <div className="tw-mb-[0.15rem] qe-text-text">
              <EditableField
                value={recipient.address}
                onSave={(value) => onFieldUpdate('recipient.address', value)}
                disabled={readonly}
                printMode={printMode}
                placeholder="Adresse"
              />
            </div>
          )}

          {/* Code postal + Ville - afficher seulement si au moins un existe */}
          {((recipient.postalCode && recipient.postalCode.trim()) || (recipient.city && recipient.city.trim())) && (
            <div className="tw-mb-[0.15rem] qe-text-text">
              {recipient.postalCode && recipient.postalCode.trim() && (
                <EditableField
                  value={recipient.postalCode}
                  onSave={(value) => onFieldUpdate('recipient.postalCode', value)}
                  disabled={readonly}
                  printMode={printMode}
                  placeholder="Code postal"
                />
              )}
              {recipient.postalCode && recipient.postalCode.trim() && recipient.city && recipient.city.trim() && ' '}
              {recipient.city && recipient.city.trim() && (
                <EditableField
                  value={recipient.city}
                  onSave={(value) => onFieldUpdate('recipient.city', value)}
                  disabled={readonly}
                  printMode={printMode}
                  placeholder="Ville"
                />
              )}
            </div>
          )}

          {/* Téléphone et Email - afficher seulement si au moins un existe */}
          {((recipient.phone && recipient.phone.trim()) || (recipient.email && recipient.email.trim())) && (
            <div className="tw-text-[0.8rem] qe-text-text-muted tw-mt-[0.3rem]">
              {recipient.phone && recipient.phone.trim() && (
                <span>
                  <EditableField
                    value={recipient.phone}
                    onSave={(value) => onFieldUpdate('recipient.phone', value)}
                    disabled={readonly}
                    printMode={printMode}
                    placeholder="Téléphone"
                  />
                </span>
              )}

              {recipient.phone && recipient.phone.trim() && recipient.email && recipient.email.trim() && (
                <span className="tw-mx-[0.3rem]"> | </span>
              )}

              {recipient.email && recipient.email.trim() && (
                <span>
                  <EditableField
                    value={recipient.email}
                    onSave={(value) => onFieldUpdate('recipient.email', value)}
                    disabled={readonly}
                    printMode={printMode}
                    placeholder="Email"
                  />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};