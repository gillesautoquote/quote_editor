import React from 'react';

interface VATBreakdown {
  rate: number;
  amount: number;
}

interface QuotePageTotalsProps {
  totals: {
    ht: number;
    tva: number;
    ttc: number;
    vatBreakdown?: VATBreakdown[];
  };
  printMode?: boolean;
}

export const QuotePageTotals: React.FC<QuotePageTotalsProps> = ({ totals, printMode = false }) => {
  return (
    <div
      className="tw-mb-4 tw-flex tw-justify-end page-break-inside-avoid print-keep-together"
      data-component="totals-table"
    >
      <table className="tw-border-collapse tw-text-[0.85rem] tw-min-w-[280px] tw-text-text print-color-adjust print:tw-text-xs">
        <tbody>
          <tr className="tw-bg-white">
            <td className="tw-p-2 tw-border tw-border-border print:tw-p-1.5">
              <strong>Total HT</strong>
            </td>
            <td className="tw-p-2 tw-border tw-border-border tw-text-right print:tw-p-1.5">
              <strong>{totals.ht.toFixed(2)} €</strong>
            </td>
          </tr>
          {totals.vatBreakdown && totals.vatBreakdown.length > 0 && (
            <>
              {totals.vatBreakdown.map((vat, index) => (
                <tr key={index} className="tw-bg-white">
                  <td className="tw-p-2 tw-border tw-border-border tw-pl-8 print:tw-p-1.5 print:tw-pl-6">
                    dont TVA à {vat.rate} %
                  </td>
                  <td className="tw-p-2 tw-border tw-border-border tw-text-right print:tw-p-1.5">
                    {vat.amount.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </>
          )}
          <tr className="tw-bg-white">
            <td className="tw-p-2 tw-border tw-border-border print:tw-p-1.5">
              <strong>Total TVA</strong>
            </td>
            <td className="tw-p-2 tw-border tw-border-border tw-text-right print:tw-p-1.5">
              <strong>{totals.tva.toFixed(2)} €</strong>
            </td>
          </tr>
          <tr className="tw-bg-primary tw-text-white print-color-adjust">
            <td className="tw-p-2 tw-border tw-border-primary print:tw-p-1.5">
              <strong>Total TTC</strong>
            </td>
            <td className="tw-p-2 tw-border tw-border-primary tw-text-right print:tw-p-1.5">
              <strong>{totals.ttc.toFixed(2)} €</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};