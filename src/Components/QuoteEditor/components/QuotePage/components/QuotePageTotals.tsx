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
      <div className={printMode ? 'tw-w-80' : 'tw-w-80 tw-shadow-sm'}>
        <table className={printMode ? 'tw-w-full tw-border-collapse tw-text-xs tw-border tw-border-gray-300' : 'tw-w-full tw-border-collapse tw-text-sm'}>
          <tbody>
            <tr className={printMode ? 'tw-border-b tw-border-gray-300' : 'tw-border-b tw-border-gray-200'}>
              <td className={printMode ? 'tw-px-3 tw-py-2 tw-font-semibold tw-text-gray-800' : 'tw-px-4 tw-py-2.5 tw-font-semibold tw-text-gray-700'}>
                Total HT
              </td>
              <td className={printMode ? 'tw-px-3 tw-py-2 tw-text-right tw-font-semibold tw-text-gray-900' : 'tw-px-4 tw-py-2.5 tw-text-right tw-font-semibold tw-text-gray-900'}>
                {totals.ht.toFixed(2)} €
              </td>
            </tr>

            {totals.vatBreakdown && totals.vatBreakdown.length > 0 && (
              <>
                {totals.vatBreakdown.map((vat, index) => (
                  <tr key={index} className={printMode ? 'tw-bg-gray-50 tw-border-b tw-border-gray-300' : 'tw-bg-gray-50 tw-border-b tw-border-gray-200'}>
                    <td className={printMode ? 'tw-px-3 tw-py-1.5 tw-pl-6 tw-text-gray-700 tw-text-xs' : 'tw-px-4 tw-py-2 tw-pl-8 tw-text-gray-600 tw-text-sm'}>
                      dont TVA à {vat.rate} %
                    </td>
                    <td className={printMode ? 'tw-px-3 tw-py-1.5 tw-text-right tw-text-gray-700' : 'tw-px-4 tw-py-2 tw-text-right tw-text-gray-600'}>
                      {vat.amount.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </>
            )}

            <tr className={printMode ? 'tw-border-b tw-border-gray-300' : 'tw-border-b tw-border-gray-200'}>
              <td className={printMode ? 'tw-px-3 tw-py-2 tw-font-semibold tw-text-gray-800' : 'tw-px-4 tw-py-2.5 tw-font-semibold tw-text-gray-700'}>
                Total TVA
              </td>
              <td className={printMode ? 'tw-px-3 tw-py-2 tw-text-right tw-font-semibold tw-text-gray-900' : 'tw-px-4 tw-py-2.5 tw-text-right tw-font-semibold tw-text-gray-900'}>
                {totals.tva.toFixed(2)} €
              </td>
            </tr>

            <tr className={printMode ? 'tw-bg-primary tw-text-white' : 'tw-bg-primary tw-text-white'}>
              <td className={printMode ? 'tw-px-3 tw-py-2.5 tw-font-bold tw-text-base' : 'tw-px-4 tw-py-3 tw-font-bold tw-text-base'}>
                Total TTC
              </td>
              <td className={printMode ? 'tw-px-3 tw-py-2.5 tw-text-right tw-font-bold tw-text-base' : 'tw-px-4 tw-py-3 tw-text-right tw-font-bold tw-text-lg'}>
                {totals.ttc.toFixed(2)} €
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};