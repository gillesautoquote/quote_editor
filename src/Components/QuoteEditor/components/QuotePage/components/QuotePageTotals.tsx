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
}

export const QuotePageTotals: React.FC<QuotePageTotalsProps> = ({ totals }) => {
  return (
    <div className="tw-mb-4 tw-flex tw-justify-end">
      <table className="tw-border-collapse tw-text-[0.85rem] tw-min-w-[280px] tw-text-text">
        <tbody>
          <tr>
            <td className="tw-p-[0.4rem_0.6rem] tw-border tw-border-border tw-bg-white"><strong>Total HT</strong></td>
            <td className="tw-p-[0.4rem_0.6rem] tw-border tw-border-border tw-bg-white tw-text-right"><strong>{totals.ht.toFixed(2)} €</strong></td>
          </tr>
          {totals.vatBreakdown && totals.vatBreakdown.length > 0 && (
            <>
              {totals.vatBreakdown.map((vat, index) => (
                <tr key={index}>
                  <td className="tw-p-[0.4rem_0.6rem] tw-border tw-border-border tw-bg-gray-50 tw-pl-8">dont TVA à {vat.rate} %</td>
                  <td className="tw-p-[0.4rem_0.6rem] tw-border tw-border-border tw-bg-gray-50 tw-text-right">{vat.amount.toFixed(2)} €</td>
                </tr>
              ))}
            </>
          )}
          <tr>
            <td className="tw-p-[0.4rem_0.6rem] tw-border tw-border-border tw-bg-white"><strong>Total TVA</strong></td>
            <td className="tw-p-[0.4rem_0.6rem] tw-border tw-border-border tw-bg-white tw-text-right"><strong>{totals.tva.toFixed(2)} €</strong></td>
          </tr>
          <tr className="tw-bg-primary tw-text-white">
            <td className="tw-p-[0.5rem_0.6rem] tw-border tw-border-primary"><strong>Total TTC</strong></td>
            <td className="tw-p-[0.5rem_0.6rem] tw-border tw-border-primary tw-text-right"><strong>{totals.ttc.toFixed(2)} €</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};