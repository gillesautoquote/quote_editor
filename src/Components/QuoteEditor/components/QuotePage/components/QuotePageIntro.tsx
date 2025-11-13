import React from 'react';
import { EditableField } from '../../EditableField/EditableField';
import { MarkdownEditor } from '../../EditableField/MarkdownEditor';
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
  // Fix interligne de la liste "ce que le document comprend" en mode print
  // sans modifier le fichier global src/styles/print.css
  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    const styleId = 'qe-intro-list-print-lineheight-fix';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @media print {
        .intro-list ul,
        .intro-list li {
          line-height: 0.8 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const sectionsList = generatePDFSectionsList(data, visibleTabIds);
  return (
    <div className="tw-mb-4 tw-mt-8 tw-text-[0.9rem] tw-leading-[1.4] qe-text-text">
      {/* Ligne ville et date - afficher seulement si au moins un existe */}
      {((quote.executionCity && quote.executionCity.trim()) || (quote.issueDate && quote.issueDate.trim())) && (
        <div className="tw-mb-4">
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
        <div className="tw-mb-[0.3rem]">
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
          <MarkdownEditor
            value={quote.tagline}
            onSave={(value) => onFieldUpdate('quote.tagline', value)}
            disabled={readonly}
            printMode={printMode}
            placeholder="Texte d'introduction"
          />
          {sectionsList && (
            <div className="tw-mt-2 intro-list" dangerouslySetInnerHTML={{ __html: markdownToHtml(sectionsList) }} />
          )}
        </div>
      )}

      {/* Texte de remerciements - afficher seulement si il existe */}
      {clientSignature?.tagline && clientSignature.tagline.trim() && (
        <div className="tw-mt-6 tw-mb-2">
          <MarkdownEditor
            value={clientSignature.tagline}
            onSave={(value) => onFieldUpdate('clientSignature.tagline', value)}
            disabled={readonly}
            printMode={printMode}
            placeholder="Texte de remerciements"
          />
        </div>
      )}

      {/* Signature */}
      <div className="tw-text-right">
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
      <div className="tw-mt-6 tw-border tw-border-gray-200 tw-rounded-xl tw-bg-gray-50 tw-p-5 print:tw-bg-white print:tw-p-4">
        <h3
          className="tw-text-base tw-font-semibold tw-mb-3 tw-tracking-normal qe-recap-title"
          style={{ '--recap-color': data.company?.mainColor || '#0066cc' } as React.CSSProperties}
        >
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
          const validityText = valid ? `jusqu'au ${formatFancy(quote.validUntil)}` : ((data as any)?.validityNotice || '');
          const firstDay = Array.isArray((data as any)?.itinerary) && (data as any).itinerary.length > 0 ? (data as any).itinerary[0] : undefined;
          const tripName = firstDay?.tripName || 'Votre voyage';

          return (
            <div className="tw-space-y-1.5 tw-text-[0.9rem] tw-leading-relaxed print:tw-text-[0.85rem]">
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