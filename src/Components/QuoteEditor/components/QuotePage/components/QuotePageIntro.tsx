import React from 'react';
import { EditableField } from '../../EditableField/EditableField';
import { EditableMarkdownField } from '../../EditableField/EditableMarkdownField';
import type { Quote, Recipient, ClientSignature, QuoteData } from '../../../entities/QuoteData';
import { formatDateInFrench, formatDateWithComma, formatTitle, formatTagline, markdownToHtml } from '../utils/dateFormatters';
import { generatePDFSectionsList } from '../../../utils/pdfSectionsGenerator';

interface QuotePageIntroProps {
  quote: Quote;
  recipient: Recipient;
  clientSignature: ClientSignature;
  onFieldUpdate: (path: string, value: string) => void;
  readonly?: boolean;
  printMode?: boolean;
  data: QuoteData;
  visibleTabIds?: string[];
}

export const QuotePageIntro: React.FC<QuotePageIntroProps> = ({
  quote,
  recipient,
  clientSignature,
  onFieldUpdate,
  readonly = false,
  printMode = false,
  data,
  visibleTabIds
}) => {
  const sectionsList = generatePDFSectionsList(data, visibleTabIds);
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
              printMode={printMode}
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
              printMode={printMode}
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
            printMode={printMode}
            placeholder="Texte d'introduction"
            markdownToHtml={markdownToHtml}
          />
          {sectionsList && (
            <div className="tw-mt-2" dangerouslySetInnerHTML={{ __html: markdownToHtml(sectionsList) }} />
          )}
        </div>
      )}

      {/* Texte de remerciements - afficher seulement si il existe */}
      {clientSignature?.tagline && clientSignature.tagline.trim() && (
        <div className="tw-mt-6 tw-mb-2">
          <EditableField
            value={clientSignature.tagline}
            onSave={(value) => onFieldUpdate('clientSignature.tagline', value)}
            disabled={readonly}
              printMode={printMode}
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
              printMode={printMode}
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
              printMode={printMode}
              placeholder="Nom complet"
            />
          </div>
        )}
      </div>

      {/* Récapitulatif de la proposition (non modifiable) */}
      <div className="tw-mt-6 tw-border tw-border-gray-200 tw-rounded-lg tw-bg-gray-50 tw-p-4 print:tw-bg-white">
        <h3 className="tw-text-sm tw-font-semibold tw-mb-2" style={{ color: (data.company?.mainColor) || '#0a6' }}>
          Récapitulatif de la proposition
        </h3>
        {(() => {
          const fmtCurrency = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);
          const totals = (data as any)?.totals;
          const carbon = (data as any)?.carbonImpact;
          const issue = quote.issueDate ? new Date(quote.issueDate) : null;
          const valid = quote.validUntil ? new Date(quote.validUntil) : null;
          const toOrdinal = (d: number) => d === 1 ? '1ᵉʳ' : String(d);
          const formatFancy = (iso?: string) => {
            if (!iso) return '';
            try {
              const d = new Date(iso);
              const days = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
              const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
              return `${days[d.getDay()]} ${toOrdinal(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
            } catch { return iso; }
          };
          const validityText = valid ? `jusqu’au ${formatFancy(quote.validUntil)}` : ((data as any)?.validityNotice || '');
          const firstDay = Array.isArray((data as any)?.itinerary) && (data as any).itinerary.length > 0 ? (data as any).itinerary[0] : undefined;
          const tripName = firstDay?.tripName || 'Votre voyage';

          return (
            <div className="tw-space-y-1 tw-text-[0.9rem] print:tw-text-[0.85rem]">
              <div><strong>Voyage&nbsp;:</strong> {tripName}</div>
              <div><strong>Montant&nbsp;:</strong> {fmtCurrency(totals?.ht)} HT – {fmtCurrency(totals?.ttc)} TTC</div>
              {carbon && <div><strong>Impact carbone estimé&nbsp;:</strong> {carbon.co2Amount} {carbon.unit}</div>}
              <div><strong>Validité du devis&nbsp;:</strong> {validityText}</div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};