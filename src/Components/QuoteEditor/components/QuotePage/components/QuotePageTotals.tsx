import React from 'react';
import type { Totals } from '../../../entities/QuoteData';

interface QuotePageTotalsProps {
  totals: Totals;
}

export const QuotePageTotals: React.FC<QuotePageTotalsProps> = ({ totals }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="tw-mt-6 tw-mb-6 print:tw-mt-4 print:tw-mb-4" data-section="totals">
      <div className="tw-bg-gray-50 tw-p-4 tw-rounded-lg print:tw-bg-transparent print:tw-border print:tw-border-gray-300">
        <div className="tw-space-y-2">
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span>Total HT</span>
            <span className="tw-font-semibold">{formatPrice(totals.ht)}</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span>TVA</span>
            <span className="tw-font-semibold">{formatPrice(totals.tva)}</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-lg tw-font-bold tw-pt-2 tw-border-t tw-border-gray-300">
            <span>Total TTC</span>
            <span>{formatPrice(totals.ttc)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
